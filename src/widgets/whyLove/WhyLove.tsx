import scss from './whyLove.module.scss';
import { getT } from '@/shared/lib/i18n/locale';

const tints = [scss.tintPink, scss.tintBeige, scss.tintBlush];

export default async function WhyLove() {
  const t = await getT();

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>{t.whyLove.eyebrow}</span>
          <h1>{t.whyLove.title}</h1>
          <p>{t.whyLove.subtitle}</p>
          <div className={scss.list}>
            {t.whyLove.cards.map((item, i) => (
              <div key={item.title} className={`${scss.card} ${tints[i]}`}>
                <span className={scss.icon}>{item.icon}</span>
                <h2>{item.title}</h2>
                <p>{item.descr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
