// Content shape for the 'invitation' project type — a Yes/No + date/time
// RSVP flow, distinct from the love-story template (see loveStoryContent.ts).
// Stored in the same `projects.content` JSONB column.

export interface InvitationContent {
  questionImageUrl?: string;
  questionTitle: string;
  yesLabel: string;
  noLabel: string;
  confirmTitle: string;
  confirmSubtitle: string;
  confirmButtonLabel: string;
  // 'recipient' lets whoever opens the link pick the date/time themselves;
  // 'fixed' shows a date/time the creator already decided, just for them
  // to confirm.
  dateMode: 'recipient' | 'fixed';
  fixedDate?: string;
  fixedTime?: string;
  dateQuestionTitle: string;
  dateButtonLabel: string;
  // {date} and {time} are replaced with the chosen (or fixed) values.
  finalTitle: string;
  finalDescription: string;
  coverGradient: string;
}

export const demoInvitationContent: InvitationContent = {
  questionTitle: 'Ты пойдёшь со мной на свидание?',
  yesLabel: 'Да',
  noLabel: 'Нет',
  confirmTitle: 'Подожди, ты точно сказала да?',
  confirmSubtitle: 'Я был готов, что ты откажешь :)',
  confirmButtonLabel: 'Да, да, ДА',
  dateMode: 'recipient',
  dateQuestionTitle: 'Когда тебе удобно?',
  dateButtonLabel: 'Готово',
  finalTitle: 'Ура!',
  finalDescription: 'Жду тебя {date} в {time} — буду считать минуты.',
  coverGradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
};
