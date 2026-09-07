'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Badge from '@/shared/ui/badge/Badge';
import PhoneFrame from '@/shared/ui/phoneFrame/PhoneFrame';
import type { Project } from '@/shared/lib/mockData';
import { demoLoveStoryContent, type LoveStoryContent } from '@/shared/lib/loveStoryContent';
import { SECTION_KINDS, sectionKindOf, sectionMeta, newPhotoSectionId } from '@/shared/lib/sectionLibrary';
import { updateProjectContent } from '@/app/(admin)/projects/actions';
import TextListEditor from './TextListEditor';
import ChatLinesEditor from './ChatLinesEditor';
import PhotoSlot from './PhotoSlot';
import scss from './projectEditor.module.scss';

interface ProjectEditorProps {
  project: Project;
  initialContent: Record<string, unknown> | null;
}

export default function ProjectEditor({ project, initialContent }: ProjectEditorProps) {
  const [content, setContent] = useState<LoveStoryContent>({
    ...demoLoveStoryContent,
    ...(initialContent ?? {}),
  });
  const [selected, setSelected] = useState(content.sectionOrder[0] ?? 'typewriter');
  const [previewContent, setPreviewContent] = useState(content);
  const [saveState, setSaveState] = useState<'saved' | 'dirty' | 'saving'>('saved');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Debounce the live preview so we don't flood the iframe with a postMessage
  // on every keystroke — it only reflects `content` again once typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => setPreviewContent(content), 500);
    return () => clearTimeout(timer);
  }, [content]);

  // The iframe's `src` is set once (below) and never changes afterwards —
  // otherwise every edit would reload the whole preview and reset its
  // scroll position. Later edits are pushed into the already-loaded iframe
  // via postMessage instead.
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'loveqr-preview-update', content: previewContent },
      window.location.origin,
    );
  }, [previewContent]);

  const [previewSrc] = useState(
    () => `/view/${project.slug ?? project.id}?preview=${encodeURIComponent(JSON.stringify(content))}`,
  );

  const patch = (fields: Partial<LoveStoryContent>) => {
    setContent((c) => ({ ...c, ...fields }));
    setSaveState('dirty');
  };

  const updateStoryLabel = (index: number, label: string) => {
    setContent((c) => ({
      ...c,
      stories: c.stories.map((s, i) => (i === index ? { ...s, label } : s)),
    }));
    setSaveState('dirty');
  };

  const handleSave = async () => {
    setSaveState('saving');
    const result = await updateProjectContent(project.id, content);
    setSaveState('error' in result ? 'dirty' : 'saved');
  };

  const addSection = (kind: string) => {
    const id = kind === 'photo' ? newPhotoSectionId() : kind;
    patch({ sectionOrder: [...content.sectionOrder, id] });
    setSelected(id);
    setAddMenuOpen(false);
  };

  const removeSection = (id: string) => {
    patch({ sectionOrder: content.sectionOrder.filter((s) => s !== id) });
    if (selected === id) setSelected(content.sectionOrder.find((s) => s !== id) ?? '');
  };

  // Drag handles start the reorder; while dragging we swap `id` into
  // whichever row the pointer is currently over.
  const onHandlePointerDown = (id: string) => (e: React.PointerEvent) => {
    setDragId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onListPointerMove = (e: React.PointerEvent) => {
    if (!dragId || !listRef.current) return;
    const rows = Array.from(listRef.current.querySelectorAll<HTMLElement>('[data-section-id]'));
    const overRow = rows.find((row) => {
      const rect = row.getBoundingClientRect();
      return e.clientY >= rect.top && e.clientY <= rect.bottom;
    });
    const overId = overRow?.dataset.sectionId;
    if (!overId || overId === dragId) return;

    setContent((c) => {
      const order = [...c.sectionOrder];
      const from = order.indexOf(dragId);
      const to = order.indexOf(overId);
      if (from === -1 || to === -1) return c;
      order.splice(from, 1);
      order.splice(to, 0, dragId);
      return { ...c, sectionOrder: order };
    });
    setSaveState('dirty');
  };

  const stopDragging = () => setDragId(null);

  const availableKinds = SECTION_KINDS.filter(
    (k) => k.repeatable || !content.sectionOrder.includes(k.kind),
  );

  const selectedMeta = selected ? sectionMeta(selected) : null;

  return (
    <div className={scss.editor}>
      <aside className={scss.left}>
        <span className={scss.groupLabel}>Cover</span>
        <button
          className={`${scss.sectionItem} ${selected === 'cover' ? scss.sectionActive : ''}`}
          onClick={() => setSelected('cover')}
        >
          <span className={scss.sectionIcon}>✦</span>
          <span className={scss.sectionText}>
            <strong>Cover</strong>
            <span>Always shown first</span>
          </span>
        </button>

        <div className={scss.sectionsHeader}>
          <span className={scss.groupLabel}>Sections ({content.sectionOrder.length})</span>
          <div className={scss.addWrap}>
            <button className={scss.addBtn} onClick={() => setAddMenuOpen((v) => !v)}>
              + Add
            </button>
            {addMenuOpen && (
              <div className={scss.addMenu}>
                {availableKinds.map((k) => (
                  <button key={k.kind} onClick={() => addSection(k.kind)}>
                    <span>{k.icon}</span>
                    {k.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={scss.sectionList}
          ref={listRef}
          onPointerMove={onListPointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
        >
          {content.sectionOrder.map((id) => {
            const meta = sectionMeta(id);
            return (
              <div
                key={id}
                data-section-id={id}
                className={`${scss.sectionItem} ${selected === id ? scss.sectionActive : ''} ${dragId === id ? scss.dragging : ''}`}
                onClick={() => setSelected(id)}
              >
                <span className={scss.sectionIcon}>{meta.icon}</span>
                <span className={scss.sectionText}>
                  <strong>{meta.label}</strong>
                  <span>{meta.descr}</span>
                </span>
                <button
                  type="button"
                  className={scss.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(id);
                  }}
                  aria-label="Remove section"
                >
                  ✕
                </button>
                <span
                  className={scss.dragHandle}
                  onPointerDown={onHandlePointerDown(id)}
                  aria-label="Drag to reorder"
                >
                  ⠿
                </span>
              </div>
            );
          })}
          {content.sectionOrder.length === 0 && (
            <p className={scss.emptyList}>No sections yet — add one above.</p>
          )}
        </div>
      </aside>

      <div className={scss.center}>
        <div className={scss.centerHeader}>
          <Link href="/projects" className={scss.crumb}>
            ‹ Projects
          </Link>
          <div className={scss.titleRow}>
            <h1>{project.name}</h1>
            <Badge>{project.status}</Badge>
          </div>
          <div className={scss.headerActions}>
            <Link href={`/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer">
              ▷ Preview
            </Link>
            <Link href={`/projects/${project.id}/settings`}>Settings</Link>
            <Link href={`/projects/${project.id}/qr`} className={scss.qrBtn}>
              ⊞ Get QR Code
            </Link>
            <button
              className={scss.saveBtn}
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
            >
              {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>
        <div className={scss.stage}>
          <PhoneFrame>
            <iframe
              key={project.id}
              ref={iframeRef}
              src={previewSrc}
              className={scss.previewFrame}
              title="Live preview"
            />
          </PhoneFrame>
        </div>
      </div>

      <aside className={scss.right}>
        <div className={scss.rightHeader}>
          <span className={scss.rightIcon}>{selected === 'cover' ? '✦' : (selectedMeta?.icon ?? '✦')}</span>
          <div>
            <strong>{selected === 'cover' ? 'Cover' : (selectedMeta?.label ?? 'Select a section')}</strong>
            <span>Properties & Settings</span>
          </div>
        </div>

        {selected === 'cover' && (
          <>
            <PhotoSlot
              projectId={project.id}
              aspectRatio="9 / 16"
              transform={
                content.coverPhotoUrl
                  ? {
                      url: content.coverPhotoUrl,
                      x: content.coverPhotoX,
                      y: content.coverPhotoY,
                      scale: content.coverPhotoScale,
                    }
                  : undefined
              }
              onChange={(t) =>
                patch({ coverPhotoUrl: t.url, coverPhotoX: t.x, coverPhotoY: t.y, coverPhotoScale: t.scale })
              }
            />
            <label className={scss.field}>
              Prompt text
              <input
                value={content.coverPromptText}
                onChange={(e) => patch({ coverPromptText: e.target.value })}
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'typewriter' && (
          <label className={scss.field}>
            Intro line
            <textarea
              rows={4}
              value={content.typewriterText}
              onChange={(e) => patch({ typewriterText: e.target.value })}
            />
          </label>
        )}

        {sectionKindOf(selected) === 'holdHeart' && (
          <>
            <label className={scss.field}>
              Prompt (before hold)
              <input
                value={content.holdHeartPrompt}
                onChange={(e) => patch({ holdHeartPrompt: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Reveal text (after hold)
              <input
                value={content.holdHeartRevealText}
                onChange={(e) => patch({ holdHeartRevealText: e.target.value })}
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'stories' && (
          <>
            {content.stories.map((story, i) => (
              <label key={i} className={scss.field}>
                Story {i + 1} label
                <input value={story.label} onChange={(e) => updateStoryLabel(i, e.target.value)} />
              </label>
            ))}
          </>
        )}

        {sectionKindOf(selected) === 'instagram' && (
          <>
            <label className={scss.field}>
              Username
              <input
                value={content.instagramPost.username}
                onChange={(e) =>
                  patch({ instagramPost: { ...content.instagramPost, username: e.target.value } })
                }
              />
            </label>
            <label className={scss.field}>
              Likes
              <input
                type="number"
                value={content.instagramPost.likes}
                onChange={(e) =>
                  patch({
                    instagramPost: { ...content.instagramPost, likes: Number(e.target.value) },
                  })
                }
              />
            </label>
            <label className={scss.field}>
              Caption
              <input
                value={content.instagramPost.caption}
                onChange={(e) =>
                  patch({ instagramPost: { ...content.instagramPost, caption: e.target.value } })
                }
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'photoReveal' && (
          <label className={scss.field}>
            Hint text
            <textarea
              rows={3}
              value={content.photoRevealHint}
              onChange={(e) => patch({ photoRevealHint: e.target.value })}
            />
          </label>
        )}

        {sectionKindOf(selected) === 'chat' && (
          <ChatLinesEditor
            lines={content.chatLines}
            nameA={project.partnerA}
            nameB={project.partnerB}
            onChange={(chatLines) => patch({ chatLines })}
          />
        )}

        {sectionKindOf(selected) === 'quotes' && (
          <TextListEditor
            items={content.quotes}
            onChange={(quotes) => patch({ quotes })}
            addLabel="Add quote"
          />
        )}

        {sectionKindOf(selected) === 'balloons' && (
          <TextListEditor
            items={content.balloonMessages}
            onChange={(balloonMessages) => patch({ balloonMessages })}
            addLabel="Add balloon"
          />
        )}

        {sectionKindOf(selected) === 'video' && (
          <p className={scss.empty}>Video upload is coming soon.</p>
        )}

        {sectionKindOf(selected) === 'photo' && (
          <PhotoSlot
            projectId={project.id}
            aspectRatio="16 / 10"
            transform={content.photos[selected]}
            onChange={(t) => patch({ photos: { ...content.photos, [selected]: t } })}
          />
        )}

        {!selected && <p className={scss.empty}>Select a section to edit its properties.</p>}
      </aside>
    </div>
  );
}
