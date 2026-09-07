import scss from './quotesCarousel.module.scss';

export default function QuotesCarousel({ quotes }: { quotes: string[] }) {
  // Duplicate the list so the CSS scroll animation can loop seamlessly.
  const loop = [...quotes, ...quotes];

  return (
    <section className={scss.section}>
      <div className={scss.track}>
        {loop.map((q, i) => (
          <div key={i} className={scss.card}>
            <p>{q}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
