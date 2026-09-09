import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// A plain, cookie-free client for reads that don't depend on who's asking —
// published projects are publicly readable (see the RLS policy in
// 0001_init.sql), so this never needs a session. Unlike the cookie-aware
// client in server.ts, this one doesn't call cookies()/headers(), so it's
// safe to use inside unstable_cache (see projects.ts).
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
