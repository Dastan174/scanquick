// Demo content for the public /view/[slug] experience. This mirrors the
// shape the future Supabase `projects.content` JSONB column will hold —
// swapping to real data later is just replacing this lookup with a query.

export interface PhotoTransform {
  url: string;
  x: number; // background-position X, 0-100
  y: number; // background-position Y, 0-100
  scale: number; // 1 = fitted, >1 = zoomed in
}

export interface CollageInstance {
  templateId: string; // key into COLLAGE_TEMPLATES, see collageTemplates.ts
  photos: Record<string, PhotoTransform>; // keyed by slot id
}

export interface LoveStoryContent {
  coverPromptText: string;
  coverPhotoUrl?: string;
  coverPhotoX: number;
  coverPhotoY: number;
  coverPhotoScale: number;
  // Plays once the recipient taps the cover open. Falls back to the demo
  // track (see LoveStoryExperience) until the owner uploads their own.
  musicUrl?: string;
  typewriterText: string;
  holdHeartPrompt: string;
  holdHeartRevealText: string;
  stories: { label: string; gradient: string; photo?: PhotoTransform }[];
  instagramPost: {
    username: string;
    likes: number;
    caption: string;
  };
  instagramPhoto?: PhotoTransform;
  wipeRevealGradient: string;
  photoRevealHint: string;
  photoRevealPhoto?: PhotoTransform;
  chatLines: { from: 'a' | 'b'; text: string }[];
  quotes: string[];
  balloonMessages: string[];
  coverGradient: string;
  sectionGradients: string[];
  // Which non-cover sections appear on the page, and in what order. Ids are
  // either a fixed singleton kind ('typewriter', 'stories', ...) or
  // `photo-<random>` / `divider-<random>` / `collage-<random>` for
  // repeatable blocks — see sectionLibrary.ts.
  sectionOrder: string[];
  // Repeatable Photo/Divider block images, keyed by their id in sectionOrder.
  photos: Record<string, PhotoTransform>;
  // Repeatable Collage block instances, keyed by their id in sectionOrder.
  collages: Record<string, CollageInstance>;
}

// A new project starts with just this small set — everything else (chat,
// instagram post, photo reveal, balloons, video...) stays available to add
// from the editor's "+" menu instead of showing up pre-filled.
export const DEFAULT_COLLAGE_SECTION_ID = 'collage-default';

export const DEFAULT_SECTION_ORDER = [
  'typewriter',
  DEFAULT_COLLAGE_SECTION_ID,
  'quotes',
  'holdHeart',
];

export const demoLoveStoryContent: LoveStoryContent = {
  coverPromptText: 'Нажми, чтобы открыть',
  coverPhotoX: 50,
  coverPhotoY: 50,
  coverPhotoScale: 1,
  typewriterText: 'Рядом с тобой так спокойно… даже тишина становится тёплой. С тобой хочется',
  holdHeartPrompt: 'Зажми и удерживай сердце',
  holdHeartRevealText: 'Ты чувствуешь? Это моё сердце ♡',
  stories: [
    { label: 'forever', gradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)' },
    { label: 'my', gradient: 'linear-gradient(135deg, #f5ede8, #fad8e4, #e8b8c8)' },
    { label: 'love', gradient: 'linear-gradient(135deg, #2c2420, #6b4a3c, #c4866a)' },
  ],
  instagramPost: {
    username: 'ourlovestory',
    likes: 2221,
    caption: 'Вечная любовь',
  },
  wipeRevealGradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  photoRevealHint:
    'Проведите пальцем по фото слева направо, чтобы увидеть, что настоящая красота не меняется со временем.',
  chatLines: [
    { from: 'a', text: 'Иногда я думаю, что ты — самое лучшее, что случилось со мной.' },
    { from: 'b', text: 'А я каждый день благодарю судьбу, что мы встретились.' },
    { from: 'a', text: 'Хочу пройти с тобой через всё — и хорошее, и трудное.' },
    { from: 'b', text: 'С тобой мне ничего не страшно ♡' },
  ],
  quotes: [
    'С тобой даже обычный вечер становится особенным.',
    'Мне нравится, как просто быть рядом с тобой — и это уже счастье.',
    'Ты заставляешь мои будни светиться маленькими радостями.',
    'Просто держать тебя за руку — это моё любимое ощущение.',
    'С тобой я понимаю, что счастье состоит из простых вещей.',
    'Когда ты смеёшься, я забываю обо всём остальном.',
    'Ты для меня — моя тихая радость в этом большом мире.',
    'Твои слова согревают больше, чем любое солнце.',
  ],
  balloonMessages: [
    'Твои объятия — моё самое любимое место на свете.',
    'Когда ты рядом, на душе становится тепло и спокойно.',
    'Я люблю то, какой ты становишься, когда смеёшься.',
    'Ты — моя самая любимая привычка.',
    'С тобой каждый день кажется важным и настоящим.',
  ],
  coverGradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
  sectionGradients: [
    'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
    'linear-gradient(135deg, #0a1a2e, #0a4a3c, #20a080)',
    'linear-gradient(135deg, #fef0f8, #fad0e8, #e8a0c0)',
  ],
  sectionOrder: DEFAULT_SECTION_ORDER,
  photos: {},
  collages: {
    // 'polaroid-duo' is COLLAGE_TEMPLATES[0] in collageTemplates.ts — Два полароида.
    [DEFAULT_COLLAGE_SECTION_ID]: { templateId: 'polaroid-duo', photos: {} },
  },
};
