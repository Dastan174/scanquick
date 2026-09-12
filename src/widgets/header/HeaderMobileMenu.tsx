'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Button from '@/shared/ui/button/Button';
import LanguageSwitcher from '@/widgets/languageSwitcher/LanguageSwitcher';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import scss from './header.module.scss';

interface HeaderMobileMenuProps {
  t: Dictionary['header'];
  locale: Locale;
  isLoggedIn: boolean;
}

export default function HeaderMobileMenu({ t, locale, isLoggedIn }: HeaderMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={scss.menuToggle}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`${scss.mobileMenu} ${open ? scss.mobileMenuOpen : ''}`}>
        <Link href="#features" onClick={close}>
          {t.features}
        </Link>
        <Link href="#pricing" onClick={close}>
          {t.pricing}
        </Link>
        <Link href="#faq" onClick={close}>
          {t.faq}
        </Link>
        <div className={scss.mobileActions}>
          <LanguageSwitcher locale={locale} />
          {isLoggedIn ? (
            <Button size="sm" href="/profile">
              {t.profile}
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/login">
                {t.signIn}
              </Button>
              <Button size="sm" href="/signup">
                {t.startFree}
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
