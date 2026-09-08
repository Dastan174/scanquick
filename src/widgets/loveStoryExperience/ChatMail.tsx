'use client';

import { useEffect, useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useLockBodyScroll } from '@/shared/lib/useLockBodyScroll';
import scss from './chatMail.module.scss';

interface ChatLine {
  from: 'a' | 'b';
  text: string;
}

export function MailIcon({ onClick }: { onClick: () => void }) {
  return (
    <button className={scss.mailIcon} onClick={onClick} aria-label="Open messages">
      <Mail size={20} />
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

const THINKING_MS = 500;
const CHAR_MS = 35;
const PAUSE_MS = 500;

export function ChatModal({ open, onClose, nameA, nameB, lines }: ChatModalProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [wasOpen, setWasOpen] = useState(false);

  useLockBodyScroll(open);

  // Reset the replay whenever the modal opens, without doing it inside an
  // effect (see https://react.dev/learn/you-might-not-need-an-effect).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setVisibleCount(0);
      setTyping(false);
      setTypedText('');
    }
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const playNext = async (idx: number) => {
      if (cancelled || idx >= lines.length) return;
      const text = lines[idx].text;

      setTyping(true);
      setTypedText('');
      await wait(THINKING_MS);
      if (cancelled) return;
      setTyping(false);

      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return;
        setTypedText(text.slice(0, i));
        await wait(CHAR_MS);
      }

      if (cancelled) return;
      setVisibleCount(idx + 1);
      setTypedText('');
      await wait(PAUSE_MS);
      playNext(idx + 1);
    };

    playNext(0);
    return () => {
      cancelled = true;
    };
  }, [open, lines]);

  if (!open) return null;

  const nextLine = lines[visibleCount];

  return (
    <div className={scss.overlay} onClick={onClose}>
      <button className={scss.close} onClick={onClose}>
        <X size={20} />
      </button>
      <div className={scss.container} onClick={(e) => e.stopPropagation()}>
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={`${scss.message} ${line.from === 'a' ? scss.right : scss.left}`}>
            <p className={scss.person}>{line.from === 'a' ? nameA : nameB}</p>
            <div className={scss.bubble}>{line.text}</div>
          </div>
        ))}
        {nextLine && (typing || typedText) && (
          <div className={`${scss.message} ${nextLine.from === 'a' ? scss.right : scss.left}`}>
            <p className={scss.person}>{nextLine.from === 'a' ? nameA : nameB}</p>
            <div className={`${scss.bubble} ${typing ? scss.typing : ''}`}>
              {typing ? '…' : typedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
