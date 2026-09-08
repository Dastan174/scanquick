import Link from 'next/link';
import { Heart } from 'lucide-react';
import scss from './header.module.scss';
import Button from '@/shared/ui/button/Button';
import LanguageSwitcher from '@/widgets/languageSwitcher/LanguageSwitcher';
import HeaderMobileMenu from './HeaderMobileMenu';
import { getLocale, getDictionary } from '@/shared/lib/i18n/locale';

export default async function Header() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <header className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <Link href="/" className={scss.logo}>
            <span className={scss.logoIcon}>
              <Heart size={16} fill="currentColor" />
            </span>
            LoveQR
          </Link>
          <nav className={scss.links}>
            <Link href="/">{t.header.features}</Link>
            <Link href="/">{t.header.templates}</Link>
            <Link href="/">{t.header.pricing}</Link>
            <Link href="/">{t.header.faq}</Link>
          </nav>
          <nav className={scss.actions}>
            <LanguageSwitcher locale={locale} />
            <Button variant="ghost" size="sm" href="/login">
              {t.header.signIn}
            </Button>
            <Button size="sm" href="/signup">
              {t.header.startFree}
            </Button>
          </nav>
          <HeaderMobileMenu t={t.header} locale={locale} />
        </div>
      </div>
    </header>
  );
}
