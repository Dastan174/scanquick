import { notFound } from 'next/navigation';
import ProjectEditor from '@/widgets/projectEditor/ProjectEditor';
import { getMyProjectById, getMyProjectContent } from '@/shared/lib/supabase/projects';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMyProjectById(id);
  if (!project) notFound();

  const content = await getMyProjectContent(id);

  return <ProjectEditor project={project} initialContent={content} />;
}
