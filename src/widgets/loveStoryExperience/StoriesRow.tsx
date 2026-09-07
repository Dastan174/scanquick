'use client';

import { useEffect, useState } from 'react';
import scss from './storiesRow.module.scss';

interface Story {
  label: string;
  gradient: string;
}

const STORY_MS = 3500;

export default function StoriesRow({ stories }: { stories: Story[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevActiveIdx, setPrevActiveIdx] = useState<number | null>(null);

  // Reset per-story UI whenever the open story changes, without doing it
  // inside an effect (see https://react.dev/learn/you-might-not-need-an-effect).
  if (activeIdx !== prevActiveIdx) {
    setPrevActiveIdx(activeIdx);
    setProgress(0);
    setLiked(false);
  }

  useEffect(() => {
    if (activeIdx === null) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - startedAt) / STORY_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(timer);
        setActiveIdx((idx) => (idx !== null && idx < stories.length - 1 ? idx + 1 : null));
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [activeIdx, stories.length]);

  return (
    <div className={scss.row}>
      {stories.map((story, idx) => (
        <button key={story.label} className={scss.bubble} onClick={() => setActiveIdx(idx)}>
          <span className={scss.ring} style={{ background: story.gradient }} />
          <span className={scss.label}>{story.label}</span>
        </button>
      ))}

      {activeIdx !== null && (
        <div className={scss.modal}>
          <div className={scss.content}>
            <div className={scss.progressTrack}>
              {stories.map((_, i) => (
                <div key={i} className={scss.progressSlot}>
                  <div
                    className={scss.progressFill}
                    style={{
                      width: i < activeIdx ? '100%' : i === activeIdx ? `${progress}%` : '0%',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className={scss.image} style={{ background: stories[activeIdx].gradient }} />
            <button
              className={`${scss.like} ${liked ? scss.likeActive : ''}`}
              onClick={() => setLiked((l) => !l)}
            >
              ♥
            </button>
            <button className={scss.close} onClick={() => setActiveIdx(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
