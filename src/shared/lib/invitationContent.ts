// Content shape for the 'invitation' project type — a Yes/No + date/time
// RSVP flow, distinct from the love-story template (see loveStoryContent.ts).
// Stored in the same `projects.content` JSONB column.

// A top-level "where to go" choice. When it carries subOptions, picking it
// (in single-select mode) opens one more screen asking that follow-up
// question before moving on — e.g. "Покушать" → "Что будем есть?".
export interface ActivityOption {
  label: string;
  subQuestion?: string;
  subOptions?: string[];
}

export interface InvitationContent {
  questionImageUrl?: string;
  questionTitle: string;
  yesLabel: string;
  noLabel: string;
  // How the question screen first unlocks. 'direct' is today's plain behavior;
  // the rest gate it behind a small reveal moment before the question shows.
  openMode: 'direct' | 'code' | 'scratch' | 'envelope' | 'scheduled';
  openCode?: string;
  openAt?: string;
  openLockedTitle: string;
  // Reaction played when the recipient taps Yes/No — 'none'/'dodge' are today's
  // exact (lack of) behavior, kept as the defaults for old content.
  yesAnimation: 'shake' | 'none';
  noAnimation: 'dodge' | 'kiss' | 'shrink' | 'none';
  confirmTitle: string;
  confirmSubtitle: string;
  confirmButtonLabel: string;
  // The recipient picks one (or several) of these before moving on to date/time.
  activityQuestionTitle: string;
  activityOptions: ActivityOption[];
  activityMultiSelect: boolean;
  activityButtonLabel: string;
  // 'recipient' lets whoever opens the link pick the date/time themselves;
  // 'fixed' shows a date/time the creator already decided, just for them
  // to confirm.
  dateMode: 'recipient' | 'fixed';
  fixedDate?: string;
  fixedTime?: string;
  dateQuestionTitle: string;
  dateButtonLabel: string;
  // {date}, {time} and {activity} are replaced with the chosen (or fixed) values.
  finalTitle: string;
  finalDescription: string;
  coverGradient: string;
  // Applies to every screen — 'rounded'/'pink' are today's exact look.
  cardShape: 'rounded' | 'wavy';
  themeColor: 'pink' | 'red' | 'olive' | 'blue' | 'purple';
}

export const demoInvitationContent: InvitationContent = {
  questionTitle: 'Ты пойдёшь со мной на свидание?',
  yesLabel: 'Да',
  noLabel: 'Нет',
  openMode: 'direct',
  openLockedTitle: 'Ещё рано! Загляни попозже',
  yesAnimation: 'none',
  noAnimation: 'dodge',
  confirmTitle: 'Подожди, ты точно сказала да?',
  confirmSubtitle: 'Я был готов, что ты откажешь :)',
  confirmButtonLabel: 'Да, да, ДА',
  activityQuestionTitle: 'Куда сходим?',
  activityOptions: [
    {
      label: '🚶 Прогулка',
      subQuestion: 'Куда пойдём гулять?',
      subOptions: ['🌳 Парк', '🏛️ Музей', '🌊 Набережная', '🎡 Аттракционы'],
    },
    {
      label: '🍽️ Покушать',
      subQuestion: 'Что будем есть?',
      subOptions: ['🍕 Пицца', '🍣 Суши', '🍔 Бургер', '🍝 Паста'],
    },
    {
      label: '🎬 Кино',
      subQuestion: 'Какой фильм посмотрим?',
      subOptions: ['😂 Комедия', '😱 Ужасы', '💕 Мелодрама', '🎬 Боевик'],
    },
    {
      label: '☕ Кофе',
      subQuestion: 'Что будем пить?',
      subOptions: ['☕ Кофе', '🍵 Чай', '🧋 Смузи', '🍹 Коктейль'],
    },
  ],
  activityMultiSelect: false,
  activityButtonLabel: 'Дальше',
  dateMode: 'recipient',
  dateQuestionTitle: 'Когда тебе удобно?',
  dateButtonLabel: 'Готово',
  finalTitle: 'Ура!',
  finalDescription: 'Жду тебя {date} в {time} — {activity}, буду считать минуты.',
  coverGradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  cardShape: 'rounded',
  themeColor: 'pink',
};

// Invitations saved before ActivityOption existed have activityOptions as a
// plain string[] in their JSONB content — the merge in /view/[slug] and the
// editor's initial state can't tell that apart from the new shape at compile
// time, so normalize whatever comes back from the DB into ActivityOption[].
export function normalizeActivityOptions(raw: unknown): ActivityOption[] {
  if (!Array.isArray(raw)) return demoInvitationContent.activityOptions;
  return raw.map((item) => (typeof item === 'string' ? { label: item } : (item as ActivityOption)));
}

// Curated preset lists for the editor's "quick fill" category buttons — not a
// stored/runtime concept, just a convenience that overwrites activityOptions.
// `question` is applied together with `options` so the screen the recipient
// sees stays coherent (e.g. genre names alone read as gibberish under a
// leftover "Куда сходим?" heading).
export const ACTIVITY_CATEGORY_PRESETS: Record<
  string,
  { label: string; question: string; options: string[] }
> = {
  activities: {
    label: 'Активности',
    question: 'Куда сходим?',
    options: ['🚶 Прогулка', '🍽️ Покушать', '🎬 Кино', '☕ Кофе'],
  },
  food: {
    label: 'Блюда',
    question: 'Что закажем?',
    options: ['🍕 Пицца', '🍣 Суши', '🍔 Бургер', '🍝 Паста'],
  },
  movies: {
    label: 'Кино',
    question: 'Какой фильм посмотрим?',
    options: ['😂 Комедия', '😱 Ужасы', '💕 Мелодрама', '🎬 Боевик'],
  },
  drinks: {
    label: 'Напитки',
    question: 'Что будем пить?',
    options: ['☕ Кофе', '🍵 Чай', '🧋 Смузи', '🍹 Коктейль'],
  },
  places: {
    label: 'Места',
    question: 'Куда пойдём?',
    options: ['🌳 Парк', '🏛️ Музей', '🌊 Набережная', '🎡 Аттракционы'],
  },
};

// A small themeable palette — swaps out --invite-primary/--invite-primary-light
// on the invitation experience only (see DateInvitationExperience.tsx).
export const THEME_COLORS: Record<InvitationContent['themeColor'], [string, string]> = {
  pink: ['#d4607a', '#e78399'],
  red: ['#e0475a', '#f0707e'],
  olive: ['#6b8f3f', '#94b56a'],
  blue: ['#4a7fc7', '#7aa3dc'],
  purple: ['#8b5fbf', '#b28ad9'],
};

// A small fan of particles flying outward from the "Да" button for the
// 'shake' yesAnimation — shared between the real invitation experience and
// the editor's inline animation-preview button so they look identical.
export const BURST_PARTICLES: { emoji: string; tx: number; ty: number }[] = [
  { emoji: '💥', tx: -46, ty: -30 },
  { emoji: '💋', tx: -16, ty: -50 },
  { emoji: '💖', tx: 16, ty: -50 },
  { emoji: '✨', tx: 46, ty: -30 },
];
