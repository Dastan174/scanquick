// Content shape for the 'invitation' project type — a Yes/No + date/time
// RSVP flow, distinct from the love-story template (see loveStoryContent.ts).
// Stored in the same `projects.content` JSONB column.

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
  activityOptions: string[];
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
  activityOptions: ['🚶 Прогулка', '🍽️ Покушать', '🎬 Кино', '☕ Кофе'],
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
