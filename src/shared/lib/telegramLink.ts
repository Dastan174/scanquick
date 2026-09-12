'use server';

// The Telegram webhook's actual DB write + notification — kept separate
// from the thin Route Handler in src/app/api/telegram/webhook/route.ts.
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { sendTelegramMessage } from '@/shared/lib/telegram';
import { getSiteUrl } from '@/shared/lib/siteUrl';

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
    .select('id, name')
    .single();

  if (project) {
    // The owner is left sitting in Telegram after tapping Start — hand them
    // a one-tap way back instead of relying on them to switch tabs
    // themselves (the editor/wizard also polls on window focus, but only
    // once they're actually back).
    await sendTelegramMessage(
      chatId,
      `Готово! Теперь сюда будут приходить ответы по «${project.name}» 💌`,
      [{ text: '← Вернуться на сайт', url: `${getSiteUrl()}/projects/${project.id}/edit` }],
    );
  }
}
