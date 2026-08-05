import scss from './howItWork.module.scss';

export default function HowItWork() {
  const steps = [
    {
      title: 'Tell Your Story',
      descr: 'Add your names, anniversary date, and choose a stunning template as your canvas.',
    },
    {
      title: 'Tell Your Story',
      descr: 'Add your names, anniversary date, and choose a stunning template as your canvas.',
    },
    {
      title: 'Tell Your Story',
      descr: 'Add your names, anniversary date, and choose a stunning template as your canvas.',
    },
  ];
  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>How It Works</span>
          <h1>Three steps to forever</h1>
          <div className={scss.list}>
            {steps.map((item, idx) => (
              <div key={idx} className={scss.card}>
                <span>0{idx + 1}</span>
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
