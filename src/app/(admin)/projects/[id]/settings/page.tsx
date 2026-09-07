import { notFound } from 'next/navigation';
import ProjectSettings from '@/widgets/projectSettings/ProjectSettings';
import { getMyProjectById } from '@/shared/lib/supabase/projects';
import { getT, getLocale } from '@/shared/lib/i18n/locale';

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, t, locale] = await Promise.all([getMyProjectById(id), getT(), getLocale()]);
  if (!project) notFound();

  return <ProjectSettings project={project} locale={locale} t={t.projectSettings} />;
}
