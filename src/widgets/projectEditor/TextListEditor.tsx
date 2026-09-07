'use client';

import scss from './listEditor.module.scss';

interface TextListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
}

export default function TextListEditor({ items, onChange, addLabel }: TextListEditorProps) {
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
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={scss.addBtn} onClick={() => onChange([...items, ''])}>
        + {addLabel}
      </button>
    </div>
  );
}
