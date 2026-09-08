import {
  Keyboard,
  Heart,
  Images,
  Grid3x3,
  MoveHorizontal,
  MessageCircle,
  Quote,
  PartyPopper,
  Video,
  Image,
  SeparatorHorizontal,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

// Registry of section types that can appear on the public love-story page
// (everything except Cover, which is always automatic — see ProjectEditor).
// Singleton kinds can be added at most once; 'photo' is repeatable, so its
// instances get an id like `photo-<random>` instead of using the kind name.

export interface SectionKind {
  kind: string;
  icon: LucideIcon;
  label: string;
  descr: string;
  repeatable: boolean;
}

export const SECTION_KINDS: SectionKind[] = [
  { kind: 'typewriter', icon: Keyboard, label: 'Typewriter', descr: 'Animated intro line', repeatable: false },
  { kind: 'holdHeart', icon: Heart, label: 'Hold the Heart', descr: 'Press-and-hold interaction', repeatable: false },
  { kind: 'stories', icon: Images, label: 'Stories', descr: 'Instagram-style story bubbles', repeatable: false },
  { kind: 'instagram', icon: Grid3x3, label: 'Instagram Post', descr: 'A recreated feed post', repeatable: false },
  {
    kind: 'photoReveal',
    icon: MoveHorizontal,
    label: 'Photo Reveal',
    descr: 'Swipe to reveal a photo',
    repeatable: false,
  },
  { kind: 'chat', icon: MessageCircle, label: 'Chat Replay', descr: 'Scripted two-person chat', repeatable: false },
  { kind: 'quotes', icon: Quote, label: 'Quotes', descr: 'Auto-scrolling quote cards', repeatable: false },
  {
    kind: 'balloons',
    icon: PartyPopper,
    label: 'Balloon Game',
    descr: 'Pop a balloon, reveal a message',
    repeatable: false,
  },
  { kind: 'video', icon: Video, label: 'Video Memory', descr: 'An embedded video', repeatable: false },
  {
    kind: 'photo',
    icon: Image,
    label: 'Photo',
    descr: 'A full-width photo, add as many as you like',
    repeatable: true,
  },
  {
    kind: 'divider',
    icon: SeparatorHorizontal,
    label: 'Photo Divider',
    descr: 'A tall full-bleed photo break between sections',
    repeatable: true,
  },
  {
    kind: 'collage',
    icon: LayoutGrid,
    label: 'Photo Collage',
    descr: 'A designed layout with photo cutouts to fill in',
    repeatable: true,
  },
];

export function sectionKindOf(id: string): string {
  if (id.startsWith('photo-')) return 'photo';
  if (id.startsWith('divider-')) return 'divider';
  if (id.startsWith('collage-')) return 'collage';
  return id;
}

export function sectionMeta(id: string): SectionKind {
  const kind = sectionKindOf(id);
  return SECTION_KINDS.find((s) => s.kind === kind) ?? SECTION_KINDS[0];
}

export function newPhotoSectionId(): string {
  return `photo-${Math.random().toString(36).slice(2, 9)}`;
}

export function newDividerSectionId(): string {
  return `divider-${Math.random().toString(36).slice(2, 9)}`;
}

export function newCollageSectionId(): string {
  return `collage-${Math.random().toString(36).slice(2, 9)}`;
}
