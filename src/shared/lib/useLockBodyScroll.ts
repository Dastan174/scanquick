'use client';

import { useEffect } from 'react';

// Prevents the page behind a modal/drawer from scrolling while it's open,
// restoring whatever overflow value was there before.
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
