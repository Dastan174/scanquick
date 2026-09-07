import scss from './whyLove.module.scss';

const cards = [
  {
    icon: '♡',
    title: 'Beautiful Romantic Sites',
    descr:
      'Craft immersive love stories with galleries, letters, music, and timelines — all in one magical experience.',
    tint: scss.tintPink,
  },
  {
    icon: '⊞',
    title: 'Scan to Surprise',
    descr:
      'Generate an elegant QR code. Print it, frame it, gift it — one scan reveals your entire love story.',
    tint: scss.tintBeige,
  },
  {
    icon: '✦',
    title: 'Crafted with Emotion',
    descr:
      'Typewriter letters, countdown timers, collages, music players — every detail designed to move hearts.',
    tint: scss.tintBlush,
  },
];

export default function WhyLove() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>Why LoveQR</span>
          <h1>Everything love deserves</h1>
          <p>More than a website. A living love letter that grows with your story.</p>
          <div className={scss.list}>
            {cards.map((item) => (
              <div key={item.title} className={`${scss.card} ${item.tint}`}>
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
