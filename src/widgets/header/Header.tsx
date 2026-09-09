import Link from 'next/link';
import Image from 'next/image';
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
              <Image src="/logo.png" alt="" width={36} height={36} />
            </span>
            scanquick.kg
          </Link>
          <nav className={scss.links}>
            <Link href="#features">{t.header.features}</Link>
            <Link href="#templates">{t.header.templates}</Link>
            <Link href="#pricing">{t.header.pricing}</Link>
            <Link href="#faq">{t.header.faq}</Link>
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
