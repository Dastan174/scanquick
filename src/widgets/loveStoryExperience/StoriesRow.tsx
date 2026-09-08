'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, X } from 'lucide-react';
import type { PhotoTransform } from '@/shared/lib/loveStoryContent';
import { useLockBodyScroll } from '@/shared/lib/useLockBodyScroll';
import scss from './storiesRow.module.scss';

interface Story {
  label: string;
  gradient: string;
  photo?: PhotoTransform;
}

const STORY_MS = 3500;
const SWIPE_THRESHOLD = 50;
const SWIPE_CLOSE_THRESHOLD = 80;

function storyStyle(story: Story): React.CSSProperties {
  if (!story.photo?.url) return { background: story.gradient };
  return {
    backgroundImage: `url(${story.photo.url})`,
    backgroundSize: `${story.photo.scale * 100}%`,
    backgroundPosition: `${story.photo.x}% ${story.photo.y}%`,
  };
}

export default function StoriesRow({ stories }: { stories: Story[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevActiveIdx, setPrevActiveIdx] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useLockBodyScroll(activeIdx !== null);

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

  const goNext = () => {
    setActiveIdx((idx) => (idx !== null && idx < stories.length - 1 ? idx + 1 : null));
  };

  const goPrev = () => {
    setActiveIdx((idx) => (idx !== null && idx > 0 ? idx - 1 : idx));
  };

  const closeModal = () => setActiveIdx(null);

  const handleTapNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX > rect.width / 2) goNext();
    else goPrev();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = touchStart.current.x - t.clientX;
    const dy = touchStart.current.y - t.clientY;
    touchStart.current = null;

    if (dy > SWIPE_CLOSE_THRESHOLD) {
      closeModal();
      return;
    }
    if (dx > SWIPE_THRESHOLD) {
      goNext();
      return;
    }
    if (dx < -SWIPE_THRESHOLD) {
      goPrev();
    }
  };

  return (
    <div className={scss.row}>
      {stories.map((story, idx) => (
        <button key={story.label} className={scss.bubble} onClick={() => setActiveIdx(idx)}>
          <span className={scss.ring} style={storyStyle(story)} />
          <span className={scss.label}>{story.label}</span>
        </button>
      ))}

      {activeIdx !== null && (
        <div className={scss.modal} onClick={closeModal}>
          <div
            className={scss.content}
            onClick={handleTapNavigate}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
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
            <div className={scss.image} style={storyStyle(stories[activeIdx])} />
            <button
              className={`${scss.like} ${liked ? scss.likeActive : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setLiked((l) => !l);
              }}
            >
              <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              className={scss.close}
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
