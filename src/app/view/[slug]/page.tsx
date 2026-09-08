import { HeartCrack } from 'lucide-react';
import LoveStoryExperience from '@/widgets/loveStoryExperience/LoveStoryExperience';
import {
  getPublishedProjectBySlug,
  getProjectBySlugAnyStatus,
} from '@/shared/lib/supabase/projects';
import { demoLoveStoryContent, type LoveStoryContent } from '@/shared/lib/loveStoryContent';
import { getT } from '@/shared/lib/i18n/locale';

interface ViewProjectPageProps {
  params: Promise<{ slug: string }>;
  // `preview` lets the Editor's live preview iframe pass draft edits without
  // a database round-trip — see ProjectEditor.tsx. `draft` lets the owner's
  // "Preview" button open an unpublished project as the real, unwrapped
  // site. Real visitors never carry either param.
  searchParams: Promise<{ preview?: string; draft?: string }>;
}

export default async function ViewProjectPage({ params, searchParams }: ViewProjectPageProps) {
  const { slug } = await params;
  const { preview, draft } = await searchParams;

  const result = preview || draft
    ? await getProjectBySlugAnyStatus(slug)
    : await getPublishedProjectBySlug(slug);

  if (!result) {
    const t = await getT();
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
          padding: '32px',
          fontFamily: 'sans-serif',
          color: '#6b5b62',
        }}
      >
        <HeartCrack size={36} color="#d4607a" />
        <p>{t.view.notAvailable}</p>
      </div>
    );
  }

  const { project, content: savedContent } = result;

  // The saved content only overrides the fields it actually holds — a
  // freshly created project's content is `{}`, so it renders using the
  // demo defaults until the owner edits and saves each section.
  let content: LoveStoryContent = { ...demoLoveStoryContent, ...savedContent };
  if (preview) {
    try {
      content = { ...content, ...JSON.parse(preview) };
    } catch {
      // Malformed draft — fall back to the saved/demo content instead of crashing.
    }
  }

  return <LoveStoryExperience project={project} content={content} skipCover={Boolean(preview)} />;
}
