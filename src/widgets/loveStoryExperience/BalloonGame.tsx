'use client';

import { useState } from 'react';
import scss from './balloonGame.module.scss';

const COLORS = ['#e8829a', '#c4866a', '#9b6b8a', '#d4607a', '#e8a0b4'];

export default function BalloonGame({ messages }: { messages: string[] }) {
  const [popped, setPopped] = useState<boolean[]>(() => messages.map(() => false));

  return (
    <div className={scss.sky}>
      <p className={scss.hint}>Лопни шарики, чтобы найти в них слова любви</p>
      <div className={scss.balloons}>
        {messages.map((message, i) => (
          <button
            key={i}
            className={`${scss.balloon} ${popped[i] ? scss.popped : ''}`}
            style={{ background: COLORS[i % COLORS.length], animationDelay: `${i * 0.6}s` }}
            onClick={() => setPopped((p) => p.map((v, idx) => (idx === i ? true : v)))}
          >
            {popped[i] ? (
              <span className={scss.offerText}>{message}</span>
            ) : (
              <span className={scss.string} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
