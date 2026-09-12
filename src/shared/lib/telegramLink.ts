'use server';

// The Telegram webhook's actual DB write + notification — kept separate
// from the thin Route Handler in src/app/api/telegram/webhook/route.ts.
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { sendTelegramMessage } from '@/shared/lib/telegram';

export async function verifyTelegramSecret(provided: string | null): Promise<boolean> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  return !secret || provided === secret;
}

export async function linkTelegramChat(startToken: string, chatId: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;

  const { data: project } = await admin
    .from('projects')
    .update({ telegram_chat_id: chatId })
    .eq('telegram_link_token', startToken)
    .select('name')
    .single();

  if (project) {
    // No link back to the site here on purpose — Telegram opens tapped
    // links in its own in-app browser, which is a separate, logged-out
    // context that breaks Google sign-in entirely. The editor/wizard
    // already detects the connection the moment the owner switches back to
    // their browser tab on its own, no tap needed.
    await sendTelegramMessage(
      chatId,
      `Готово! Теперь сюда будут приходить ответы по «${project.name}» 💌\n\nМожете вернуться на сайт — там уже всё готово.`,
    );
  }
}
