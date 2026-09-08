'use client';

import { useState } from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import scss from './floatingHearts.module.scss';

const COLORS = ['#e8749a', '#f2879c', '#ec9dc4', '#e5e7eb', '#b98cd6', '#8ecbe8', '#f2d478'];

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

function generateHearts(): Heart[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
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
            color: h.color,
          }}
        >
          <HeartIcon size={20} fill="currentColor" />
        </span>
      ))}
    </div>
  );
}
