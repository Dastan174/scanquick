'use client';

import { useEffect, useState } from 'react';
import scss from './clickHearts.module.scss';

interface Heart {
  id: number;
  x: number;
  y: number;
}

const LIFETIME_MS = 1200;

export default function ClickHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const heart = { id: Date.now() + Math.random(), x: e.pageX, y: e.pageY };
      setHearts((prev) => [...prev, heart]);
      window.setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== heart.id));
      }, LIFETIME_MS);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className={scss.layer} aria-hidden>
      {hearts.map((h) => (
        <span key={h.id} className={scss.heart} style={{ left: h.x, top: h.y }}>
          💕
        </span>
      ))}
    </div>
  );
}
