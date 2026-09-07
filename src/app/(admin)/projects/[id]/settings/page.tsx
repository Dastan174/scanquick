import { notFound } from 'next/navigation';
import ProjectSettings from '@/widgets/projectSettings/ProjectSettings';
import { getMyProjectById } from '@/shared/lib/supabase/projects';

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMyProjectById(id);
  if (!project) notFound();

  return <ProjectSettings project={project} />;
}
