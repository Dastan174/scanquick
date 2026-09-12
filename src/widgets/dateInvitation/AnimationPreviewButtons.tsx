'use client';

import { useState } from 'react';
import { BURST_PARTICLES, type InvitationContent } from '@/shared/lib/invitationContent';
import inviteScss from './dateInvitationExperience.module.scss';

// Small standalone demos, reusing the real invitation's own CSS classes, so
// picking an animation from a select shows exactly what it looks like right
// there — shared between the editor and the wizard's question step.
export function YesAnimationPreview({ mode }: { mode: InvitationContent['yesAnimation'] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      className={`${inviteScss.yesBtn} ${playing ? inviteScss.yesShake : ''}`}
      style={{ fontSize: 13, padding: '8px 22px' }}
      onClick={() => {
        if (mode !== 'shake') return;
        setPlaying(true);
        window.setTimeout(() => setPlaying(false), 650);
      }}
    >
      Да
      {playing && (
        <span className={inviteScss.burstWrap}>
          {BURST_PARTICLES.map((particle, i) => (
            <span
              key={i}
              className={inviteScss.burst}
              style={
                { '--tx': `${particle.tx}px`, '--ty': `${particle.ty}px` } as React.CSSProperties
              }
            >
              {particle.emoji}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

export function NoAnimationPreview({ mode }: { mode: InvitationContent['noAnimation'] }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [kissVisible, setKissVisible] = useState(false);

  const play = () => {
    if (mode === 'dodge') {
      setOffset({ x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 30 });
    } else if (mode === 'kiss') {
      setKissVisible(true);
      window.setTimeout(() => setKissVisible(false), 700);
    } else if (mode === 'shrink') {
      setScale((s) => (s <= 0.55 ? 1 : s - 0.15));
    }
  };

  return (
    <div className={inviteScss.noWrap} style={{ display: 'inline-block' }}>
      <button
        type="button"
        className={inviteScss.noBtn}
        style={{
          fontSize: 13,
          padding: '8px 18px',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
        onPointerEnter={mode === 'dodge' ? play : undefined}
        onClick={play}
      >
        Нет
      </button>
      {kissVisible && <span className={inviteScss.kiss}>💋</span>}
    </div>
  );
}
