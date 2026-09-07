'use client';

import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, type Locale } from '@/shared/lib/i18n/shared';
import scss from './languageSwitcher.module.scss';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

function setLocaleCookie(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    setLocaleCookie(next);
    router.refresh();
  };

  return (
    <div className={scss.switcher} role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          className={`${scss.option} ${locale === l.code ? scss.active : ''}`}
          onClick={() => switchTo(l.code)}
          aria-pressed={locale === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
