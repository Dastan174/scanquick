import scss from './templates.module.scss';
import Button from '@/shared/ui/button/Button';
import { getT } from '@/shared/lib/i18n/locale';

const gradients = [
  'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
  'linear-gradient(135deg, #f5ede8, #fad8e4, #e8b8c8)',
  'linear-gradient(135deg, #2c2420, #6b4a3c, #c4866a)',
  'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  'linear-gradient(135deg, #0a1a2e, #0a4a3c, #20a080)',
  'linear-gradient(135deg, #fef0f8, #fad0e8, #e8a0c0)',
];

export default async function Templates() {
  const t = await getT();

  return (
    <section id="templates" className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>{t.templates.eyebrow}</span>
          <h1>{t.templates.title}</h1>
          <p>{t.templates.subtitle}</p>
          <div className={scss.list}>
            {t.templates.items.map((tpl, i) => (
              <div key={tpl.name} className={scss.card}>
                <div className={scss.frame}>
                  <div className={scss.screen} style={{ background: gradients[i] }}>
                    <div className={scss.barTop} />
                    <div className={scss.barSub} />
                    <div className={scss.blockBig} />
                    <div className={scss.blockSm} />
                    <div className={scss.blockSm} />
                  </div>
                </div>
                <h2>{tpl.name}</h2>
                <p>{tpl.mood}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" className={scss.browseBtn} href="/dashboard">
            {t.templates.browseAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
