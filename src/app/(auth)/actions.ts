'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/shared/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '');
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmations are disabled in the Supabase project, signUp
  // already returns an active session — no need to make people check
  // their inbox for a link that was never sent.
  if (data.session) {
    redirect('/dashboard');
  }

  redirect(
    `/login?message=${encodeURIComponent('Проверьте почту и подтвердите регистрацию, затем войдите.')}`,
  );
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  // Same origin the user is actually on (localhost in dev, the real domain
  // in prod) — the client-side origin isn't available here since this runs
  // on the server.
  const headersList = await headers();
  const origin = headersList.get('origin') ?? `https://${headersList.get('host')}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect(
      `/login?error=${encodeURIComponent(error?.message ?? 'Не удалось войти через Google.')}`,
    );
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
