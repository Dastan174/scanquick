import scss from './howItWork.module.scss';

const steps = [
  {
    title: 'Tell Your Story',
    descr: 'Add your names, anniversary date, and choose a stunning template as your canvas.',
  },
  {
    title: 'Build the Experience',
    descr: 'Layer in photos, a love letter, music, a countdown — your story in every section.',
  },
  {
    title: 'Share the Moment',
    descr: 'Download your QR code, frame it, and watch your loved one scan into a world of love.',
  },
];

export default function HowItWork() {
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>How It Works</span>
          <h1>Three steps to forever</h1>
          <div className={scss.list}>
            {steps.map((item, idx) => (
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
