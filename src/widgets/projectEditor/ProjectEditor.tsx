'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Badge from '@/shared/ui/badge/Badge';
import PhoneFrame from '@/shared/ui/phoneFrame/PhoneFrame';
import type { Project } from '@/shared/lib/mockData';
import { demoLoveStoryContent, type LoveStoryContent } from '@/shared/lib/loveStoryContent';
import {
  SECTION_KINDS,
  sectionKindOf,
  sectionMeta,
  newPhotoSectionId,
  newDividerSectionId,
} from '@/shared/lib/sectionLibrary';
import { updateProjectContent } from '@/app/(admin)/projects/actions';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { storyLabel } from '@/shared/lib/i18n/format';
import TextListEditor from './TextListEditor';
import ChatLinesEditor from './ChatLinesEditor';
import PhotoSlot from './PhotoSlot';
import scss from './projectEditor.module.scss';

interface ProjectEditorProps {
  project: Project;
  initialContent: Record<string, unknown> | null;
  locale: Locale;
  t: Dictionary;
}

export default function ProjectEditor({ project, initialContent, locale, t }: ProjectEditorProps) {
  const e = t.projectEditor;
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

  const localizedMeta = (id: string) => {
    const kind = sectionKindOf(id);
    const icon = sectionMeta(id).icon;
    const text = e.sectionKinds[kind as keyof typeof e.sectionKinds] ?? e.sectionKinds.photo;
    return { icon, label: text.label, descr: text.descr };
  };

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

  const updateStoryPhoto = (index: number, photo: LoveStoryContent['stories'][number]['photo']) => {
    setContent((c) => ({
      ...c,
      stories: c.stories.map((s, i) => (i === index ? { ...s, photo } : s)),
    }));
    setSaveState('dirty');
  };

  const handleSave = async () => {
    setSaveState('saving');
    const result = await updateProjectContent(project.id, content);
    setSaveState('error' in result ? 'dirty' : 'saved');
  };

  const addSection = (kind: string) => {
    const id =
      kind === 'photo' ? newPhotoSectionId() : kind === 'divider' ? newDividerSectionId() : kind;
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
  const onHandlePointerDown = (id: string) => (ev: React.PointerEvent) => {
    setDragId(id);
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
  };

  const onListPointerMove = (ev: React.PointerEvent) => {
    if (!dragId || !listRef.current) return;
    const rows = Array.from(listRef.current.querySelectorAll<HTMLElement>('[data-section-id]'));
    const overRow = rows.find((row) => {
      const rect = row.getBoundingClientRect();
      return ev.clientY >= rect.top && ev.clientY <= rect.bottom;
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

  const selectedMeta = selected ? localizedMeta(selected) : null;

  return (
    <div className={scss.editor}>
      <aside className={scss.left}>
        <span className={scss.groupLabel}>{e.cover}</span>
        <button
          className={`${scss.sectionItem} ${selected === 'cover' ? scss.sectionActive : ''}`}
          onClick={() => setSelected('cover')}
        >
          <span className={scss.sectionIcon}>✦</span>
          <span className={scss.sectionText}>
            <strong>{e.cover}</strong>
            <span>{e.coverAlwaysFirst}</span>
          </span>
        </button>

        <div className={scss.sectionsHeader}>
          <span className={scss.groupLabel}>
            {e.sections} ({content.sectionOrder.length})
          </span>
          <div className={scss.addWrap}>
            <button className={scss.addBtn} onClick={() => setAddMenuOpen((v) => !v)}>
              {e.addBtn}
            </button>
            {addMenuOpen && (
              <div className={scss.addMenu}>
                {availableKinds.map((k) => (
                  <button key={k.kind} onClick={() => addSection(k.kind)}>
                    <span>{k.icon}</span>
                    {e.sectionKinds[k.kind as keyof typeof e.sectionKinds]?.label ?? k.label}
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
            const meta = localizedMeta(id);
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
                  onClick={(ev) => {
                    ev.stopPropagation();
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
          {content.sectionOrder.length === 0 && <p className={scss.emptyList}>{e.noSections}</p>}
        </div>
      </aside>

      <div className={scss.center}>
        <div className={scss.centerHeader}>
          <Link href="/projects" className={scss.crumb}>
            ‹ {t.projectsList.title}
          </Link>
          <div className={scss.titleRow}>
            <h1>{project.name}</h1>
            <Badge label={project.status === 'published' ? t.common.published : t.common.draft}>
              {project.status}
            </Badge>
          </div>
          <div className={scss.headerActions}>
            <Link href={`/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer">
              ▷ {t.common.preview}
            </Link>
            <Link href={`/projects/${project.id}/settings`}>{t.common.settings}</Link>
            <Link href={`/projects/${project.id}/qr`} className={scss.qrBtn}>
              ⊞ {t.qrCodePage.title}
            </Link>
            <button
              className={scss.saveBtn}
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
            >
              {saveState === 'saving' ? t.common.saving : saveState === 'saved' ? t.common.saved : t.common.save}
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
            <strong>{selected === 'cover' ? e.cover : (selectedMeta?.label ?? '')}</strong>
            <span>{e.propertiesSettings}</span>
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
              t={t.photoSlot}
              onChange={(tr) =>
                patch({
                  coverPhotoUrl: tr.url,
                  coverPhotoX: tr.x,
                  coverPhotoY: tr.y,
                  coverPhotoScale: tr.scale,
                })
              }
            />
            <label className={scss.field}>
              {e.promptText}
              <input
                value={content.coverPromptText}
                onChange={(ev) => patch({ coverPromptText: ev.target.value })}
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'typewriter' && (
          <label className={scss.field}>
            {e.introLine}
            <textarea
              rows={4}
              value={content.typewriterText}
              onChange={(ev) => patch({ typewriterText: ev.target.value })}
            />
          </label>
        )}

        {sectionKindOf(selected) === 'holdHeart' && (
          <>
            <label className={scss.field}>
              {e.holdPrompt}
              <input
                value={content.holdHeartPrompt}
                onChange={(ev) => patch({ holdHeartPrompt: ev.target.value })}
              />
            </label>
            <label className={scss.field}>
              {e.revealText}
              <input
                value={content.holdHeartRevealText}
                onChange={(ev) => patch({ holdHeartRevealText: ev.target.value })}
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'stories' && (
          <>
            {content.stories.map((story, i) => (
              <div key={i} className={scss.storyGroup}>
                <PhotoSlot
                  projectId={project.id}
                  aspectRatio="9 / 16"
                  transform={story.photo}
                  t={t.photoSlot}
                  onChange={(tr) => updateStoryPhoto(i, tr)}
                />
                <label className={scss.field}>
                  {storyLabel(locale, i + 1)}
                  <input value={story.label} onChange={(ev) => updateStoryLabel(i, ev.target.value)} />
                </label>
              </div>
            ))}
          </>
        )}

        {sectionKindOf(selected) === 'instagram' && (
          <>
            <PhotoSlot
              projectId={project.id}
              aspectRatio="4 / 3"
              transform={content.instagramPhoto}
              t={t.photoSlot}
              onChange={(tr) => patch({ instagramPhoto: tr })}
            />
            <label className={scss.field}>
              {e.username}
              <input
                value={content.instagramPost.username}
                onChange={(ev) =>
                  patch({ instagramPost: { ...content.instagramPost, username: ev.target.value } })
                }
              />
            </label>
            <label className={scss.field}>
              {e.likes}
              <input
                type="number"
                value={content.instagramPost.likes}
                onChange={(ev) =>
                  patch({
                    instagramPost: { ...content.instagramPost, likes: Number(ev.target.value) },
                  })
                }
              />
            </label>
            <label className={scss.field}>
              {e.caption}
              <input
                value={content.instagramPost.caption}
                onChange={(ev) =>
                  patch({ instagramPost: { ...content.instagramPost, caption: ev.target.value } })
                }
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'photoReveal' && (
          <>
            <PhotoSlot
              projectId={project.id}
              aspectRatio="9 / 10"
              transform={content.photoRevealPhoto}
              t={t.photoSlot}
              onChange={(tr) => patch({ photoRevealPhoto: tr })}
            />
            <label className={scss.field}>
              {e.hintText}
              <textarea
                rows={3}
                value={content.photoRevealHint}
                onChange={(ev) => patch({ photoRevealHint: ev.target.value })}
              />
            </label>
          </>
        )}

        {sectionKindOf(selected) === 'chat' && (
          <ChatLinesEditor
            lines={content.chatLines}
            nameA={project.partnerA}
            nameB={project.partnerB}
            t={t.listEditor}
            onChange={(chatLines) => patch({ chatLines })}
          />
        )}

        {sectionKindOf(selected) === 'quotes' && (
          <TextListEditor
            items={content.quotes}
            onChange={(quotes) => patch({ quotes })}
            addLabel={t.listEditor.addQuote}
            removeLabel={t.listEditor.remove}
          />
        )}

        {sectionKindOf(selected) === 'balloons' && (
          <TextListEditor
            items={content.balloonMessages}
            onChange={(balloonMessages) => patch({ balloonMessages })}
            addLabel={t.listEditor.addBalloon}
            removeLabel={t.listEditor.remove}
          />
        )}

        {sectionKindOf(selected) === 'video' && <p className={scss.empty}>{e.videoComingSoon}</p>}

        {sectionKindOf(selected) === 'photo' && (
          <PhotoSlot
            projectId={project.id}
            aspectRatio="16 / 10"
            transform={content.photos[selected]}
            t={t.photoSlot}
            onChange={(tr) => patch({ photos: { ...content.photos, [selected]: tr } })}
          />
        )}

        {sectionKindOf(selected) === 'divider' && (
          <>
            <PhotoSlot
              projectId={project.id}
              aspectRatio="4 / 5"
              transform={content.photos[selected]}
              t={t.photoSlot}
              onChange={(tr) => patch({ photos: { ...content.photos, [selected]: tr } })}
            />
            <p className={scss.hint}>{e.dividerHint}</p>
          </>
        )}

        {!selected && <p className={scss.empty}>{e.selectSection}</p>}
      </aside>
    </div>
  );
}
