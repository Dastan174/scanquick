import { redirect } from 'next/navigation';
import AdminSidebar from '@/widgets/adminSidebar/AdminSidebar';
import { createClient } from '@/shared/lib/supabase/server';
import { listMyProjects } from '@/shared/lib/supabase/projects';
import { getLocale, getDictionary } from '@/shared/lib/i18n/locale';
import scss from './admin-shell.module.scss';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [projects, locale] = await Promise.all([listMyProjects(), getLocale()]);
  const t = getDictionary(locale);

  return (
    <div className={scss.shell}>
      <AdminSidebar
        userEmail={user.email ?? ''}
        latestProjectId={projects[0]?.id ?? null}
        locale={locale}
        t={t.adminSidebar}
      />
      <main className={scss.content}>{children}</main>
    </div>
  );
}
