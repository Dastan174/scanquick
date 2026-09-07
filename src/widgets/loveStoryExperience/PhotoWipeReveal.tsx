'use client';

import { useRef, useState } from 'react';
import type { PhotoTransform } from '@/shared/lib/loveStoryContent';
import scss from './photoWipeReveal.module.scss';

interface PhotoWipeRevealProps {
  gradient: string;
  hint: string;
  photo?: PhotoTransform;
}

export default function PhotoWipeReveal({ gradient, hint, photo }: PhotoWipeRevealProps) {
  const [pct, setPct] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const value = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, value)));
  };

  const photoStyle = photo?.url
    ? {
        objectPosition: `${photo.x}% ${photo.y}%`,
        transform: `scale(${photo.scale})`,
        transformOrigin: `${photo.x}% ${photo.y}%`,
      }
    : undefined;

  return (
    <div className={scss.wrap}>
      <div
        ref={wrapRef}
        className={scss.photoWrapper}
        onPointerDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        {photo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt="" className={scss.blurred} style={photoStyle} />
        ) : (
          <div className={scss.blurred} style={{ background: gradient }} />
        )}
        <div className={scss.clear} style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          {photo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="" className={scss.clearImg} style={photoStyle} />
          ) : (
            <div className={scss.clearFill} style={{ background: gradient }} />
          )}
        </div>
        <div className={scss.cursor} style={{ left: `${pct}%` }}>
          ➡️
        </div>
        <div className={scss.progressBar}>
          <div className={scss.progressFill} style={{ width: `${pct}%` }} />
          <span>{Math.round(pct)}% открыто</span>
        </div>
      </div>
      <p className={scss.hint}>{hint}</p>
    </div>
  );
}
