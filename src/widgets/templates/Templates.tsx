import scss from './templates.module.scss';
import Button from '@/shared/ui/button/Button';

const templates = [
  {
    name: 'Starlit Romance',
    mood: 'Dark & Magical',
    gradient: 'linear-gradient(135deg, #1a0a2e, #4a1060, #8b2080)',
  },
  {
    name: 'Garden of Love',
    mood: 'Soft & Floral',
    gradient: 'linear-gradient(135deg, #f5ede8, #fad8e4, #e8b8c8)',
  },
  {
    name: 'Parisian Dream',
    mood: 'Classic & Rich',
    gradient: 'linear-gradient(135deg, #2c2420, #6b4a3c, #c4866a)',
  },
  {
    name: 'Golden Hour',
    mood: 'Warm & Golden',
    gradient: 'linear-gradient(135deg, #fdf0f3, #fce4b0, #f0a060)',
  },
  {
    name: 'Northern Lights',
    mood: 'Aurora Magic',
    gradient: 'linear-gradient(135deg, #0a1a2e, #0a4a3c, #20a080)',
  },
  {
    name: 'Cherry Blossom',
    mood: 'Delicate & Pure',
    gradient: 'linear-gradient(135deg, #fef0f8, #fad0e8, #e8a0c0)',
  },
];

export default function Templates() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>Templates</span>
          <h1>Start with a mood</h1>
          <p>Six curated templates, each a different love story</p>
          <div className={scss.list}>
            {templates.map((tpl) => (
              <div key={tpl.name} className={scss.card}>
                <div className={scss.frame}>
                  <div className={scss.screen} style={{ background: tpl.gradient }}>
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
          <Button variant="ghost" className={scss.browseBtn}>
            Browse All Templates →
          </Button>
        </div>
      </div>
    </section>
  );
}
