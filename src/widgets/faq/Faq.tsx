'use client';

import { useState } from 'react';
import scss from './faq.module.scss';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';

export default function Faq({ t }: { t: Dictionary['faq'] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <div className={scss.list}>
            {t.items.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className={`${scss.item} ${isOpen ? scss.open : ''}`}>
                  <button className={scss.question} onClick={() => setOpenIdx(isOpen ? null : idx)}>
                    {item.q}
                    <span className={scss.icon}>+</span>
                  </button>
                  {isOpen && <div className={scss.answer}>{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
