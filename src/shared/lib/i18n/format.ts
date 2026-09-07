// Dynamic/templated strings live here as plain functions instead of inside
// `dictionaries.ts` — a Dictionary object crosses from Server Components into
// Client Component props in several places, and React cannot serialize
// functions across that boundary. These are safe because they're imported
// directly by whichever component needs them (never passed as a prop).
import type { Locale } from './shared';

function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function subtitleStory(locale: Locale, count: number, published: number): string {
  if (locale === 'en') {
    return `You have ${count} love ${count === 1 ? 'story' : 'stories'} — ${published} shared with the world`;
  }
  return `У вас ${count} ${ruPlural(count, 'история любви', 'истории любви', 'историй любви')} — ${published} опубликовано и доступно всем`;
}

export function draftsCount(locale: Locale, n: number): string {
  if (locale === 'en') return `${n} draft${n === 1 ? '' : 's'}`;
  return `${n} ${ruPlural(n, 'черновик', 'черновика', 'черновиков')}`;
}

export function projectsCount(locale: Locale, n: number, published: number): string {
  if (locale === 'en') return `${n} projects · ${published} published`;
  return `${n} ${ruPlural(n, 'проект', 'проекта', 'проектов')} · ${published} опубликовано`;
}

export function deleteConfirm(locale: Locale, name: string): string {
  if (locale === 'en') return `Delete "${name}"? This cannot be undone.`;
  return `Удалить «${name}»? Это действие нельзя отменить.`;
}

export function stepLabel(locale: Locale, step: number): string {
  if (locale === 'en') return `Step ${step} of 3`;
  return `Шаг ${step} из 3`;
}

export function qrSubtitle(locale: Locale, name: string): string {
  if (locale === 'en') return `${name} · Share this code to reveal the surprise`;
  return `${name} · Поделитесь этим кодом, чтобы открыть сюрприз`;
}

export function memberSince(locale: Locale, date: string): string {
  if (locale === 'en') return `Member since ${date}`;
  return `С нами с ${date}`;
}

export function storyLabel(locale: Locale, n: number): string {
  if (locale === 'en') return `Story ${n} label`;
  return `Подпись истории ${n}`;
}
