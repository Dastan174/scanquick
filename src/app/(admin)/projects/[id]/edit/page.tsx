import { notFound } from 'next/navigation';
import ProjectEditor from '@/widgets/projectEditor/ProjectEditor';
import { getMyProjectById, getMyProjectContent } from '@/shared/lib/supabase/projects';
import { getT, getLocale } from '@/shared/lib/i18n/locale';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMyProjectById(id);
  if (!project) notFound();

  const [content, t, locale] = await Promise.all([getMyProjectContent(id), getT(), getLocale()]);

  return <ProjectEditor project={project} initialContent={content} locale={locale} t={t} />;
}
