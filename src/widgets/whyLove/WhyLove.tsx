import scss from './whyLove.module.scss';

export default function WhyLove() {
  const cards = [
    {
      title: 'Beautiful Romantic Sites',
      descr:
        'Craft immersive love stories with galleries, letters, music, and timelines — all in one magical experience.',
    },
    {
      title: 'Beautiful Romantic Sites',
      descr:
        'Craft immersive love stories with galleries, letters, music, and timelines — all in one magical experience.',
    },
    {
      title: 'Beautiful Romantic Sites',
      descr:
        'Craft immersive love stories with galleries, letters, music, and timelines — all in one magical experience.',
    },
  ];
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>why scanquick.kg</span>
          <h1>Everything love deserves</h1>
          <p>More than a website. A living love letter that grows with your story.</p>
          <div className={scss.list}>
            {cards.map((item, idx) => (
              <div key={idx} className={scss.card}>
                <span></span>
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
