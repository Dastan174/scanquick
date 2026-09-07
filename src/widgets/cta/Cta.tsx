import scss from './cta.module.scss';
import Button from '@/shared/ui/button/Button';
import { getT } from '@/shared/lib/i18n/locale';

export default async function Cta() {
  const t = await getT();

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h1>
            {t.cta.title1}
            <br />
            <em>{t.cta.titleEm}</em>
          </h1>
          <p>{t.cta.subtitle}</p>
          <Button href="/projects/new">{t.cta.button}</Button>
        </div>
      </div>
    </section>
  );
}
