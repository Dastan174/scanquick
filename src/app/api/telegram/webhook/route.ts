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

  if (!text || !chatId) return NextResponse.json({ ok: true });

  const match = text.match(/^\/start\s+([0-9a-f-]{36})$/i);
  if (!match) return NextResponse.json({ ok: true });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: true });

  const { data: project } = await admin
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

  return NextResponse.json({ ok: true });
}
