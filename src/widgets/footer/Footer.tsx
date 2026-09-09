import Link from 'next/link';
import Image from 'next/image';
import scss from './footer.module.scss';
import { getT } from '@/shared/lib/i18n/locale';

export default async function Footer() {
  const t = await getT();

  return (
    <footer className={scss.container}>
      <div className="container">
        <div className={scss.grid}>
          <div className={scss.brand}>
            <div className={scss.logo}>
              <span className={scss.logoIcon}>
                <Image src="/logo.png" alt="" width={36} height={36} />
              </span>
              scanquick.kg
            </div>
            <p>{t.footer.tagline}</p>
          </div>
          {t.footer.columns.map((col) => (
            <div key={col.title}>
              <span className={scss.colTitle}>{col.title}</span>
              <div className={scss.colLinks}>
                {col.links.map((link) => (
                  <Link key={link} href="/">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={scss.bottom}>
          <span>{t.footer.copyright}</span>
          <span>{t.footer.storiesCreated}</span>
        </div>
      </div>
    </footer>
  );
}
