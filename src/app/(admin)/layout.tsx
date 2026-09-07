import { redirect } from 'next/navigation';
import AdminSidebar from '@/widgets/adminSidebar/AdminSidebar';
import { createClient } from '@/shared/lib/supabase/server';
import { listMyProjects } from '@/shared/lib/supabase/projects';
import scss from './admin-shell.module.scss';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const projects = await listMyProjects();

  return (
    <div className={scss.shell}>
      <AdminSidebar userEmail={user.email ?? ''} latestProjectId={projects[0]?.id ?? null} />
      <main className={scss.content}>{children}</main>
    </div>
  );
}
