import scss from './howItWork.module.scss';
import { getT } from '@/shared/lib/i18n/locale';

export default async function HowItWork() {
  const t = await getT();

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>{t.howItWork.eyebrow}</span>
          <h1>{t.howItWork.title}</h1>
          <div className={scss.list}>
            {t.howItWork.steps.map((item, idx) => (
              <div key={item.title} className={scss.card}>
                <span className={scss.number}>0{idx + 1}</span>
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
