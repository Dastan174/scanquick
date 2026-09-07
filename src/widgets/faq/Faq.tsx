'use client';

import { useState } from 'react';
import scss from './faq.module.scss';

const items = [
  {
    q: 'How does LoveQR work?',
    a: 'You create a beautiful interactive website with your photos, messages, and memories. We generate a QR code that opens directly to your site when scanned.',
  },
  {
    q: 'Can I update my project after publishing?',
    a: 'Yes! Your site lives at a permanent URL and you can update content anytime. Changes appear instantly for anyone who visits.',
  },
  {
    q: 'What happens when someone scans the QR code?',
    a: 'They are taken directly to your romantic website — no app download needed. It works on any smartphone camera.',
  },
  {
    q: 'Can I password-protect my site?',
    a: 'Premium users can add a password so only your special person can access the site.',
  },
  {
    q: 'Do you offer printed QR frames?',
    a: 'Yes! Our Gift plan includes a professionally printed frame and gift packaging to make the reveal extra special.',
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <span>FAQ</span>
          <h1>Questions with heart</h1>
          <div className={scss.list}>
            {items.map((item, idx) => {
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
