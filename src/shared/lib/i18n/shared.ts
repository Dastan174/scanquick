// Client-safe i18n bits — no `next/headers`, so Client Components (like
// LanguageSwitcher) can import this without pulling server-only code into
// the browser bundle. Server Components should use `locale.ts` instead.
import { dictionaries, type Dictionary } from './dictionaries';

export type Locale = 'ru' | 'en';

export const DEFAULT_LOCALE: Locale = 'ru';
export const LOCALE_COOKIE = 'locale';

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
