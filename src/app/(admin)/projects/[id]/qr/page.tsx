import { notFound } from 'next/navigation';
import QrCodePage from '@/widgets/qrCodePage/QrCodePage';
import { getMyProjectById } from '@/shared/lib/supabase/projects';

export default async function QrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getMyProjectById(id);
  if (!project) notFound();

  return <QrCodePage project={project} />;
}
