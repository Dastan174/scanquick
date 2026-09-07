import ProfilePage from '@/widgets/profilePage/ProfilePage';
import { createClient } from '@/shared/lib/supabase/server';
import { getT, getLocale } from '@/shared/lib/i18n/locale';

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, t, locale] = await Promise.all([
    supabase.from('profiles').select('full_name, plan, created_at').eq('id', user.id).single(),
    getT(),
    getLocale(),
  ]);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <ProfilePage
      name={profile?.full_name || user.email || 'You'}
      email={user.email ?? ''}
      plan={profile?.plan ?? 'free'}
      memberSince={memberSince}
      locale={locale}
      t={t}
    />
  );
}
