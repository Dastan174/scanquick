'use client';

import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import scss from './holdHeart.module.scss';

const HOLD_MS = 1400;
const PARTICLE_COUNT = 16;

interface HoldHeartProps {
  prompt: string;
  revealText: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 220,
    y: (Math.random() - 0.5) * 220,
    rotate: Math.random() * 360,
  }));
}

export default function HoldHeart({ prompt, revealText }: HoldHeartProps) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const frame = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  const burstTimer = useRef<number | null>(null);

  const tick = (t: number) => {
    if (start.current === null) start.current = t;
    const elapsed = t - start.current;
    const pct = Math.min(1, elapsed / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      setDone(true);
      setHolding(false);
      setBurst(true);
      setParticles(makeParticles());
      if ('vibrate' in navigator) navigator.vibrate(100);
      burstTimer.current = window.setTimeout(() => setBurst(false), 1200);
      return;
    }
    frame.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (done) return;
    setHolding(true);
    start.current = null;
    frame.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    setHolding(false);
    if (frame.current) cancelAnimationFrame(frame.current);
    if (!done) setProgress(0);
  };

  return (
    <div className={scss.wrap}>
      <button
        className={`${scss.heartBtn} ${!holding && !done ? scss.idle : ''}`}
        onPointerDown={begin}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        aria-label="Hold the heart"
      >
        {burst && (
          <span className={scss.particles}>
            {particles.map((p) => (
              <span
                key={p.id}
                className={scss.particle}
                style={
                  {
                    '--px': `${p.x}px`,
                    '--py': `${p.y}px`,
                    '--pr': `${p.rotate}deg`,
                  } as React.CSSProperties
                }
              >
                <Heart size={16} fill="currentColor" />
              </span>
            ))}
          </span>
        )}
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
      <p className={scss.text}>{done ? revealText : prompt}</p>
    </div>
  );
}
