'use client';

import { useEffect, useState } from 'react';
import scss from './chatMail.module.scss';

interface ChatLine {
  from: 'a' | 'b';
  text: string;
}

export function MailIcon({ onClick }: { onClick: () => void }) {
  return (
    <button className={scss.mailIcon} onClick={onClick} aria-label="Open messages">
      💌
      <span className={scss.badge}>1</span>
    </button>
  );
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  nameA: string;
  nameB: string;
  lines: ChatLine[];
}

export function ChatModal({ open, onClose, nameA, nameB, lines }: ChatModalProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);

  // Reset the replay whenever the modal opens, without doing it inside an
  // effect (see https://react.dev/learn/you-might-not-need-an-effect).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setVisibleCount(0);
      setTyping(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const playNext = async (idx: number) => {
      if (cancelled || idx >= lines.length) return;
      setTyping(true);
      await new Promise((r) => setTimeout(r, 1100));
      if (cancelled) return;
      setTyping(false);
      setVisibleCount(idx + 1);
      await new Promise((r) => setTimeout(r, 600));
      playNext(idx + 1);
    };

    playNext(0);
    return () => {
      cancelled = true;
    };
  }, [open, lines]);

  if (!open) return null;

  return (
    <div className={scss.overlay}>
      <button className={scss.close} onClick={onClose}>
        ✖️
      </button>
      <div className={scss.container}>
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={`${scss.message} ${line.from === 'a' ? scss.right : scss.left}`}>
            <p className={scss.person}>{line.from === 'a' ? nameA : nameB}</p>
            <div className={scss.bubble}>{line.text}</div>
          </div>
        ))}
        {typing && lines[visibleCount] && (
          <div
            className={`${scss.message} ${lines[visibleCount].from === 'a' ? scss.right : scss.left}`}
          >
            <p className={scss.person}>{lines[visibleCount].from === 'a' ? nameA : nameB}</p>
            <div className={`${scss.bubble} ${scss.typing}`}>…</div>
          </div>
        )}
      </div>
    </div>
  );
}
