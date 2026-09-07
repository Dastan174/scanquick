import DashboardOverview from '@/widgets/dashboardOverview/DashboardOverview';
import { listMyProjects } from '@/shared/lib/supabase/projects';
import { createClient } from '@/shared/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [projects, { data: profile }] = await Promise.all([
    listMyProjects(),
    supabase.from('profiles').select('full_name, plan').eq('id', user.id).single(),
  ]);

  return (
    <DashboardOverview
      projects={projects}
      userName={profile?.full_name || user.email || 'there'}
      plan={profile?.plan ?? 'free'}
    />
  );
}
