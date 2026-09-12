import Image from 'next/image';
import LoveStoryExperience from '@/widgets/loveStoryExperience/LoveStoryExperience';
import DateInvitationExperience from '@/widgets/dateInvitation/DateInvitationExperience';
import {
  getPublishedProjectBySlug,
  getProjectBySlugAnyStatus,
} from '@/shared/lib/supabase/projects';
import { demoLoveStoryContent, type LoveStoryContent } from '@/shared/lib/loveStoryContent';
import {
  demoInvitationContent,
  normalizeActivityOptions,
  type InvitationContent,
} from '@/shared/lib/invitationContent';
import { getT } from '@/shared/lib/i18n/locale';

interface ViewProjectPageProps {
  params: Promise<{ slug: string }>;
  // `preview` lets the Editor's live preview iframe pass draft edits without
  // a database round-trip — see ProjectEditor.tsx. `draft` lets the owner's
  // "Preview" button open an unpublished project as the real, unwrapped
  // site. `screen` pins the invitation preview to whichever step the editor
  // or wizard is currently on, instead of always starting at the question
  // screen (the preview iframe can't be clicked through to get there — see
  // InvitationEditor.tsx). Real visitors never carry any of these params.
  searchParams: Promise<{ preview?: string; draft?: string; screen?: string }>;
}

export default async function ViewProjectPage({ params, searchParams }: ViewProjectPageProps) {
  const { slug } = await params;
  const { preview, draft, screen } = await searchParams;

  const result =
    preview || draft
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
        <Image src="/sad.webp" alt="" width={140} height={140} priority />
        <p>{t.view.notAvailable}</p>
      </div>
    );
  }

  const { project, content: savedContent } = result;

  if (project.type === 'invitation') {
    let invitationContent: InvitationContent = { ...demoInvitationContent, ...savedContent };
    if (preview) {
      try {
        invitationContent = { ...invitationContent, ...JSON.parse(preview) };
      } catch {
        // Malformed draft — fall back to the saved/demo content instead of crashing.
      }
    }
    invitationContent = {
      ...invitationContent,
      activityOptions: normalizeActivityOptions(invitationContent.activityOptions),
    };
    return (
      <DateInvitationExperience
        projectId={project.id}
        content={invitationContent}
        previewScreen={screen}
      />
    );
  }

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
