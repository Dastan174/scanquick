'use client';

import { useEffect, useState } from 'react';
import { Feather } from 'lucide-react';
import scss from './typewriterText.module.scss';

export default function TypewriterText({ text }: { text: string }) {
  const [shown, setShown] = useState('');
  const [renderedText, setRenderedText] = useState(text);

  // Reset the typed-out text whenever a new `text` prop comes in, without
  // doing it inside an effect (see https://react.dev/learn/you-might-not-need-an-effect).
  if (text !== renderedText) {
    setRenderedText(text);
    setShown('');
  }

  useEffect(() => {
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(timer);
    }, 45);
    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <div className={scss.wrap}>
      <p className={scss.text}>
        {shown}
        <span className={scss.cursor} />
      </p>
      <span className={scss.feather}>
        <Feather size={20} />
      </span>
    </div>
  );
}
