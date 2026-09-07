'use client';

import { useRef, useState } from 'react';
import scss from './holdHeart.module.scss';

const HOLD_MS = 1400;

interface HoldHeartProps {
  prompt: string;
  revealText: string;
}

export default function HoldHeart({ prompt, revealText }: HoldHeartProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const frame = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  const tick = (t: number) => {
    if (start.current === null) start.current = t;
    const elapsed = t - start.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      setDone(true);
      return;
    }
    frame.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (done) return;
    start.current = null;
    frame.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (!done) setProgress(0);
  };

  return (
    <div className={scss.wrap}>
      <button
        className={scss.heartBtn}
        onPointerDown={begin}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        aria-label="Hold the heart"
      >
        <svg viewBox="0 0 24 24" className={scss.heartSvg}>
          <defs>
            <clipPath id="holdHeartClip">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </clipPath>
          </defs>
          <g clipPath="url(#holdHeartClip)">
            <rect
              x="0"
              width="24"
              height="24"
              className={scss.fill}
              style={{ transform: `translateY(${24 - progress * 24}px)` }}
            />
          </g>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            className={scss.outline}
          />
        </svg>
      </button>
      <p>{done ? revealText : prompt}</p>
    </div>
  );
}
