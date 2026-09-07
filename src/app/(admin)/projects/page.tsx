import ProjectsList from '@/widgets/projectsList/ProjectsList';
import { listMyProjects } from '@/shared/lib/supabase/projects';
import { getT, getLocale } from '@/shared/lib/i18n/locale';

export default async function ProjectsPage() {
  const [projects, t, locale] = await Promise.all([listMyProjects(), getT(), getLocale()]);
  return <ProjectsList projects={projects} locale={locale} t={t} />;
}
