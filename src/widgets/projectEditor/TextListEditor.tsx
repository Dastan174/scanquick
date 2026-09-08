'use client';

import { X } from 'lucide-react';
import scss from './listEditor.module.scss';

interface TextListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  removeLabel: string;
}

export default function TextListEditor({ items, onChange, addLabel, removeLabel }: TextListEditorProps) {
  return (
    <div className={scss.list}>
      {items.map((item, i) => (
        <div key={i} className={scss.row}>
          <textarea
            rows={2}
            value={item}
            onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
          />
          <button
            type="button"
            className={scss.removeBtn}
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label={removeLabel}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" className={scss.addBtn} onClick={() => onChange([...items, ''])}>
        {addLabel}
      </button>
    </div>
  );
}
