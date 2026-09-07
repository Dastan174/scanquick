import ProfilePage from '@/widgets/profilePage/ProfilePage';
import { createClient } from '@/shared/lib/supabase/server';

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan, created_at')
    .eq('id', user.id)
    .single();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <ProfilePage
      name={profile?.full_name || user.email || 'You'}
      email={user.email ?? ''}
      plan={profile?.plan ?? 'free'}
      memberSince={memberSince}
    />
  );
}
