import { NextResponse, type NextRequest } from 'next/server';
import { linkTelegramChat, verifyTelegramSecret } from '@/shared/lib/telegramLink';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Telegram calls this on every update once the webhook is registered (see
// the setup instructions). The only thing we handle is `/start <token>` —
// the deep link the owner opens from their editor (see
// getMyProjectTelegramLink) — which links their chat to that project.
export async function POST(request: NextRequest) {
  const ok = await verifyTelegramSecret(request.headers.get('x-telegram-bot-api-secret-token'));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  const update = await request.json().catch(() => null);
  const message = update?.message;
  const text: string | undefined = message?.text;
  const chatId: string | undefined = message?.chat?.id?.toString();

  if (!text || !chatId) return NextResponse.json({ ok: true });

  const match = text.match(/^\/start\s+([0-9a-f-]{36})$/i);
  if (!match) return NextResponse.json({ ok: true });

  await linkTelegramChat(match[1], chatId);
  return NextResponse.json({ ok: true });
}
