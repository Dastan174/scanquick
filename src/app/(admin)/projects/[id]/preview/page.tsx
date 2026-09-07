import { notFound, redirect } from 'next/navigation';
import { getMyProjectById } from '@/shared/lib/supabase/projects';

// "Preview" should show exactly what a recipient sees — the real,
// unwrapped /view/[slug] page — not an admin-chrome page with a phone
// frame around it. Draft projects still need `?draft=1` so the owner can
// see them before publishing, since real visitors only ever get published
// ones.
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMyProjectById(id);
  if (!project) notFound();

  const target = `/view/${project.slug ?? project.id}`;
  redirect(project.status === 'published' ? target : `${target}?draft=1`);
}
