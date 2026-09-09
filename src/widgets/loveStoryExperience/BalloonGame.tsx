'use client';

import { useState } from 'react';
import scss from './balloonGame.module.scss';

const COLORS = [
  'radial-gradient(circle at 30% 28%, #f7c3d0, #e8829a 70%, #d4708c)',
  'radial-gradient(circle at 30% 28%, #e8bfa8, #c4866a 70%, #b17656)',
  'radial-gradient(circle at 30% 28%, #c9a8bf, #9b6b8a 70%, #86597a)',
  'radial-gradient(circle at 30% 28%, #f0a0b4, #d4607a 70%, #c0526c)',
  'radial-gradient(circle at 30% 28%, #f8d6e0, #e8a0b4 70%, #d78ca2)',
];

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
