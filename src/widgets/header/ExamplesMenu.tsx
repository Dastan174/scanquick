'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { EXAMPLE_LINKS } from '@/shared/lib/exampleLinks';
import scss from './examplesMenu.module.scss';

export default function ExamplesMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className={scss.root} ref={rootRef}>
      <button
        type="button"
        className={scss.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={14} className={open ? scss.chevronOpen : ''} />
      </button>
      {open && (
        <div className={scss.panel}>
          {EXAMPLE_LINKS.map((example) => (
            <a
              key={example.url}
              href={example.url}
              target="_blank"
              rel="noopener noreferrer"
              className={scss.item}
              onClick={() => setOpen(false)}
            >
              <span className={scss.itemText}>
                <strong>{example.label}</strong>
                <span>{example.description}</span>
              </span>
              <ExternalLink size={14} className={scss.itemIcon} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
