import { cookies } from 'next/headers';
import type { Dictionary } from './dictionaries';
import { DEFAULT_LOCALE, LOCALE_COOKIE, getDictionary, type Locale } from './shared';

export type { Locale };
export { DEFAULT_LOCALE, LOCALE_COOKIE, getDictionary };

// Server Components read the visitor's chosen language from a cookie set by
// the LanguageSwitcher — real visitors and the site owner alike default to
// Russian until they explicitly switch.
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === 'en' ? 'en' : DEFAULT_LOCALE;
}

export async function getT(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}

// Supabase auth errors arrive as raw English strings — translate the common
// ones so a Russian-language visitor doesn't see English text on a form
// error. Falls back to the original message for anything not mapped.
export async function translateAuthError(message: string): Promise<string> {
  const t = await getT();
  return (t.auth.errors as Record<string, string>)[message] ?? message;
}
