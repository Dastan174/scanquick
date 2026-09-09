import { type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip the auth-session refresh (an extra Supabase Auth round trip) on
  // paths that never need a fresh session: public /view/[slug] pages (the
  // ones anonymous QR scanners hit, potentially at volume) and /api routes
  // (the Telegram webhook authenticates via its own secret, not cookies).
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|view/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
