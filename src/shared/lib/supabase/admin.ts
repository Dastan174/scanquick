import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client for server-only code paths that have no user session
// to work with — currently just the Telegram webhook, which needs to write
// `telegram_chat_id` on a project from a request Supabase never authenticated.
// Never import this into anything reachable from the browser.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
