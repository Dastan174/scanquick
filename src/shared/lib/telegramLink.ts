'use server';

// The Telegram webhook's actual DB write + notification, deliberately kept
// outside `src/app/api/` — every 'use server' file colocated with a Route
// Handler under app/api/ came back with zero dashboard env vars at runtime,
// while files here (same tree as the rest of the app's working actions)
// don't have that problem. See src/app/api/telegram/webhook/route.ts.
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { sendTelegramMessage } from '@/shared/lib/telegram';

export async function verifyTelegramSecret(provided: string | null): Promise<boolean> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  return !secret || provided === secret;
}

export async function linkTelegramChat(startToken: string, chatId: string) {
  const admin = createAdminClient();
  if (!admin) {
    return {
      linked: false,
      debug: 'no-admin-client',
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    };
  }

  const { data: project, error } = await admin
    .from('projects')
    .update({ telegram_chat_id: chatId })
    .eq('telegram_link_token', startToken)
    .select('name')
    .single();

  if (project) {
    await sendTelegramMessage(chatId, `Готово! Теперь сюда будут приходить ответы по «${project.name}» 💌`);
  }

  return { linked: Boolean(project), error: error?.message };
}
