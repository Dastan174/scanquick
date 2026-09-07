'use client';

import { useState } from 'react';
import scss from './floatingHearts.module.scss';

const EMOJIS = ['💗', '💓', '🩷', '🤍', '💜', '🩵', '💛'];

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

function generateHearts(): Heart[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  }));
}

// Rendered only on the client (see the `next/dynamic(..., { ssr: false })`
// import in LoveStoryExperience), so it's safe to randomize positions in
// the initial render instead of an effect — there's no SSR markup to
// mismatch against.
export default function FloatingHearts() {
  const [hearts] = useState(generateHearts);

  return (
    <div className={scss.container} aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className={scss.heart}
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
