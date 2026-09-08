import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { sendTelegramMessage } from '@/shared/lib/telegram';

// Telegram calls this on every update once the webhook is registered (see
// the setup instructions). The only thing we handle is `/start <token>` —
// the deep link the owner opens from their editor (see
// getMyProjectTelegramLink) — which links their chat to that project.
export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await request.json().catch(() => null);
  const message = update?.message;
  const text: string | undefined = message?.text;
  const chatId: string | undefined = message?.chat?.id?.toString();

  // TODO(debug): remove the `debug` field once the link flow is confirmed
  // working end-to-end — it's here to see exactly where this bails out
  // without needing Vercel log access.
  if (!text || !chatId) return NextResponse.json({ ok: true, debug: 'no-text-or-chatid' });

  const match = text.match(/^\/start\s+([0-9a-f-]{36})$/i);
  if (!match) return NextResponse.json({ ok: true, debug: 'no-token-match', text });

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({
      ok: true,
      debug: 'no-admin-client',
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      serviceKeyLen: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
    });
  }

  const { data: project, error } = await admin
    .from('projects')
    .update({ telegram_chat_id: chatId })
    .eq('telegram_link_token', match[1])
    .select('name')
    .single();

  if (project) {
    await sendTelegramMessage(
      chatId,
      `Готово! Теперь сюда будут приходить ответы по «${project.name}» 💌`,
    );
  }

  return NextResponse.json({ ok: true, debug: project ? 'linked' : 'no-project', error: error?.message });
}
