// Registry of section types that can appear on the public love-story page
// (everything except Cover, which is always automatic — see ProjectEditor).
// Singleton kinds can be added at most once; 'photo' is repeatable, so its
// instances get an id like `photo-<random>` instead of using the kind name.

export interface SectionKind {
  kind: string;
  icon: string;
  label: string;
  descr: string;
  repeatable: boolean;
}

export const SECTION_KINDS: SectionKind[] = [
  { kind: 'typewriter', icon: '⌨', label: 'Typewriter', descr: 'Animated intro line', repeatable: false },
  { kind: 'holdHeart', icon: '♡', label: 'Hold the Heart', descr: 'Press-and-hold interaction', repeatable: false },
  { kind: 'stories', icon: '◎', label: 'Stories', descr: 'Instagram-style story bubbles', repeatable: false },
  { kind: 'instagram', icon: '▦', label: 'Instagram Post', descr: 'A recreated feed post', repeatable: false },
  { kind: 'photoReveal', icon: '↔', label: 'Photo Reveal', descr: 'Swipe to reveal a photo', repeatable: false },
  { kind: 'chat', icon: '✉', label: 'Chat Replay', descr: 'Scripted two-person chat', repeatable: false },
  { kind: 'quotes', icon: '❝', label: 'Quotes', descr: 'Auto-scrolling quote cards', repeatable: false },
  { kind: 'balloons', icon: '●', label: 'Balloon Game', descr: 'Pop a balloon, reveal a message', repeatable: false },
  { kind: 'video', icon: '▶', label: 'Video Memory', descr: 'An embedded video', repeatable: false },
  { kind: 'photo', icon: '🖼', label: 'Photo', descr: 'A full-width photo, add as many as you like', repeatable: true },
  {
    kind: 'divider',
    icon: '▬',
    label: 'Photo Divider',
    descr: 'A tall full-bleed photo break between sections',
    repeatable: true,
  },
];

export function sectionKindOf(id: string): string {
  if (id.startsWith('photo-')) return 'photo';
  if (id.startsWith('divider-')) return 'divider';
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
