'use client';

import { X } from 'lucide-react';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './listEditor.module.scss';

interface ChatLine {
  from: 'a' | 'b';
  text: string;
}

interface ChatLinesEditorProps {
  lines: ChatLine[];
  nameA: string;
  nameB: string;
  t: Dictionary['listEditor'];
  onChange: (lines: ChatLine[]) => void;
}

export default function ChatLinesEditor({ lines, nameA, nameB, t, onChange }: ChatLinesEditorProps) {
  return (
    <div className={scss.list}>
      {lines.map((line, i) => (
        <div key={i} className={scss.chatRow}>
          <div className={scss.chatRowHeader}>
            <select
              value={line.from}
              onChange={(e) =>
                onChange(
                  lines.map((v, idx) =>
                    idx === i ? { ...v, from: e.target.value as 'a' | 'b' } : v,
                  ),
                )
              }
            >
              <option value="a">{nameA}</option>
              <option value="b">{nameB}</option>
            </select>
            <button
              type="button"
              className={scss.removeBtn}
              onClick={() => onChange(lines.filter((_, idx) => idx !== i))}
              aria-label={t.remove}
            >
              <X size={14} />
            </button>
          </div>
          <textarea
            rows={2}
            value={line.text}
            onChange={(e) =>
              onChange(lines.map((v, idx) => (idx === i ? { ...v, text: e.target.value } : v)))
            }
          />
        </div>
      ))}
      <button
        type="button"
        className={scss.addBtn}
        onClick={() => onChange([...lines, { from: lines.length % 2 === 0 ? 'a' : 'b', text: '' }])}
      >
        {t.addMessage}
      </button>
    </div>
  );
}
