'use client';

import { X } from 'lucide-react';
import type { ActivityOption } from '@/shared/lib/invitationContent';
import TextListEditor from './TextListEditor';
import scss from './listEditor.module.scss';

interface ActivityOptionsEditorProps {
  options: ActivityOption[];
  onChange: (options: ActivityOption[]) => void;
}

// Each top-level "where to go" option can optionally open one more screen
// with its own question + options — e.g. picking "Покушать" then asks "Что
// будем есть?". The checkbox just toggles whether subQuestion/subOptions
// exist on that option at all.
export default function ActivityOptionsEditor({ options, onChange }: ActivityOptionsEditorProps) {
  const update = (i: number, patch: Partial<ActivityOption>) => {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  };

  return (
    <div className={scss.list}>
      {options.map((option, i) => (
        <div key={i} className={scss.chatRow}>
          <div className={scss.chatRowHeader}>
            <input
              value={option.label}
              onChange={(e) => update(i, { label: e.target.value })}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                fontSize: 14,
              }}
            />
            <button
              type="button"
              className={scss.removeBtn}
              onClick={() => onChange(options.filter((_, idx) => idx !== i))}
              aria-label="Удалить вариант"
            >
              <X size={14} />
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={Boolean(option.subOptions)}
              onChange={(e) =>
                update(
                  i,
                  e.target.checked
                    ? {
                        subQuestion: option.subQuestion || 'Уточни, пожалуйста:',
                        subOptions: option.subOptions ?? [''],
                      }
                    : { subQuestion: undefined, subOptions: undefined },
                )
              }
            />
            Уточнить доп. вопросом после выбора
          </label>
          {option.subOptions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 4 }}>
              <input
                value={option.subQuestion ?? ''}
                onChange={(e) => update(i, { subQuestion: e.target.value })}
                placeholder="Например: Что будем есть?"
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  fontSize: 14,
                }}
              />
              <TextListEditor
                items={option.subOptions}
                onChange={(items) => update(i, { subOptions: items })}
                addLabel="Добавить вариант"
                removeLabel="Удалить вариант"
              />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className={scss.addBtn}
        onClick={() => onChange([...options, { label: '' }])}
      >
        Добавить вариант
      </button>
    </div>
  );
}
