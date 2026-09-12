import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

// Google (or any future OAuth provider) redirects here with a `code` after
// the user approves sign-in — exchange it for a real session, then send
// them on to wherever they were headed (the dashboard by default).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('Не удалось войти через Google.')}`,
  );
}
