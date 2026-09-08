'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  Eye,
  GripVertical,
  Music,
  Plus,
  QrCode,
  Settings as SettingsIcon,
  Sparkles,
  X,
} from 'lucide-react';
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
  newCollageSectionId,
} from '@/shared/lib/sectionLibrary';
import { COLLAGE_TEMPLATES, getCollageTemplate, slotAspectRatio } from '@/shared/lib/collageTemplates';
import { updateProjectContent } from '@/app/(admin)/projects/actions';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { storyLabel } from '@/shared/lib/i18n/format';
import { useLockBodyScroll } from '@/shared/lib/useLockBodyScroll';
import TextListEditor from './TextListEditor';
import ChatLinesEditor from './ChatLinesEditor';
import PhotoSlot from './PhotoSlot';
import MusicUpload from './MusicUpload';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rightHeaderRef = useRef<HTMLDivElement>(null);
  const didSelectOnce = useRef(false);

  // On the stacked mobile layout the phone preview opens as a floating
  // overlay (see the JSX below) instead of sitting inline, so it stops
  // competing with the page for scroll gestures — lock the page behind it.
  useLockBodyScroll(previewOpen);

  const localizedMeta = (id: string) => {
    const kind = sectionKindOf(id);
    const icon = sectionMeta(id).icon;
    const text = e.sectionKinds[kind as keyof typeof e.sectionKinds] ?? e.sectionKinds.photo;
    // Several different Canva designs can all be "collage" sections, so show
    // which one this particular instance uses instead of a generic label.
    if (kind === 'collage') {
      const templateLabel = getCollageTemplate(content.collages[id]?.templateId).label;
      return { icon, label: `${text.label}: ${templateLabel}`, descr: text.descr };
    }
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

  // Picking a section in the sidebar scrolls the live preview to it and
  // briefly highlights it, so it's obvious which part of the phone you're
  // editing — same postMessage channel as the content updates above.
  useEffect(() => {
    if (!selected) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'loveqr-scroll-to-section', sectionId: selected },
      window.location.origin,
    );

    // On the stacked mobile layout the properties panel sits below the phone
    // preview and the section list, so it's off-screen right after tapping a
    // section — scroll it into view. Skipped on the first selection (page
    // load) and on desktop, where the panel is already visible beside the list.
    if (didSelectOnce.current && window.matchMedia('(max-width: 1200px)').matches) {
      rightHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    didSelectOnce.current = true;
  }, [selected]);

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

  const updateCollage = (sectionId: string, next: LoveStoryContent['collages'][string]) => {
    patch({ collages: { ...content.collages, [sectionId]: next } });
  };

  // Autosave plumbing: `persist` always saves the latest content (via the
  // ref, so it's never stale) and never runs two saves at once — if content
  // changes again while a save is in flight, it queues one more round
  // instead of overlapping requests that could land out of order.
  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  const persist = async () => {
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }
    savingRef.current = true;
    setSaveState('saving');
    const result = await updateProjectContent(project.id, contentRef.current);
    savingRef.current = false;
    if (pendingRef.current) {
      pendingRef.current = false;
      persist();
      return;
    }
    setSaveState('error' in result ? 'dirty' : 'saved');
  };

  // Saves automatically ~1.5s after the last edit — the Save button below
  // stays as a manual "save now" fallback for when you don't want to wait.
  useEffect(() => {
    if (saveState !== 'dirty') return;
    const timer = window.setTimeout(persist, 1500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, saveState]);

  const handleSave = () => {
    persist();
  };

  const addSection = (kind: string, collageTemplateId?: string) => {
    const id =
      kind === 'photo'
        ? newPhotoSectionId()
        : kind === 'divider'
          ? newDividerSectionId()
          : kind === 'collage'
            ? newCollageSectionId()
            : kind;
    patch({
      sectionOrder: [...content.sectionOrder, id],
      ...(kind === 'collage'
        ? {
            collages: {
              ...content.collages,
              [id]: { templateId: collageTemplateId ?? COLLAGE_TEMPLATES[0].id, photos: {} },
            },
          }
        : {}),
    });
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

  const selectedMeta = selected && selected !== 'cover' && selected !== 'music' ? localizedMeta(selected) : null;

  return (
    <div className={scss.editor}>
      <aside className={scss.left}>
        <span className={scss.groupLabel}>{e.cover}</span>
        <button
          className={`${scss.sectionItem} ${selected === 'cover' ? scss.sectionActive : ''}`}
          onClick={() => setSelected('cover')}
        >
          <span className={scss.sectionIcon}>
            <Sparkles size={16} />
          </span>
          <span className={scss.sectionText}>
            <strong>{e.cover}</strong>
            <span>{e.coverAlwaysFirst}</span>
          </span>
        </button>
        <button
          className={`${scss.sectionItem} ${selected === 'music' ? scss.sectionActive : ''}`}
          onClick={() => setSelected('music')}
        >
          <span className={scss.sectionIcon}>
            <Music size={16} />
          </span>
          <span className={scss.sectionText}>
            <strong>{e.music}</strong>
            <span>{e.musicAlwaysAvailable}</span>
          </span>
        </button>

        <div className={scss.sectionsHeader}>
          <span className={scss.groupLabel}>
            {e.sections} ({content.sectionOrder.length})
          </span>
          <div className={scss.addWrap}>
            <button className={scss.addBtn} onClick={() => setAddMenuOpen((v) => !v)}>
              <Plus size={14} />
              {e.addBtn}
            </button>
            {addMenuOpen && (
              <div className={scss.addMenu}>
                {availableKinds.map((k) =>
                  k.kind === 'collage' ? (
                    COLLAGE_TEMPLATES.map((tpl) => (
                      <button key={tpl.id} onClick={() => addSection('collage', tpl.id)}>
                        <k.icon size={16} />
                        {tpl.label}
                      </button>
                    ))
                  ) : (
                    <button key={k.kind} onClick={() => addSection(k.kind)}>
                      <k.icon size={16} />
                      {e.sectionKinds[k.kind as keyof typeof e.sectionKinds]?.label ?? k.label}
                    </button>
                  ),
                )}
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
                <span className={scss.sectionIcon}>
                  <meta.icon size={16} />
                </span>
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
                  <X size={12} />
                </button>
                <span
                  className={scss.dragHandle}
                  onPointerDown={onHandlePointerDown(id)}
                  aria-label="Drag to reorder"
                >
                  <GripVertical size={16} />
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
            <ChevronLeft size={14} />
            {t.projectsList.title}
          </Link>
          <div className={scss.titleRow}>
            <h1>{project.name}</h1>
            <Badge label={project.status === 'published' ? t.common.published : t.common.draft}>
              {project.status}
            </Badge>
          </div>
          <div className={scss.headerActions}>
            <Link href={`/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer">
              <Eye size={14} />
              {t.common.preview}
            </Link>
            <Link href={`/projects/${project.id}/settings`}>
              <SettingsIcon size={14} />
              {t.common.settings}
            </Link>
            <Link href={`/projects/${project.id}/qr`} className={scss.qrBtn}>
              <QrCode size={14} />
              {t.qrCodePage.title}
            </Link>
            <button
              className={scss.saveBtn}
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
            >
              {saveState === 'saved' && <Check size={14} />}
              {saveState === 'saving' ? t.common.saving : saveState === 'saved' ? t.common.saved : t.common.save}
            </button>
          </div>
        </div>
        {/* Mobile only (see CSS) — the inline stage below turns into a
            floating overlay there, so this trigger opens it without the
            preview competing with the page for scroll gestures. */}
        <button type="button" className={scss.previewFab} onClick={() => setPreviewOpen(true)}>
          {t.common.preview}
        </button>

        {previewOpen && <div className={scss.previewBackdrop} onClick={() => setPreviewOpen(false)} />}

        <div className={`${scss.stage} ${previewOpen ? scss.stageOpen : ''}`}>
          <button
            type="button"
            className={scss.previewCloseBtn}
            onClick={() => setPreviewOpen(false)}
            aria-label={t.common.cancel}
          >
            <X size={18} />
          </button>
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
        <div className={scss.rightHeader} ref={rightHeaderRef}>
          <span className={scss.rightIcon}>
            {selected === 'cover' ? (
              <Sparkles size={18} />
            ) : selected === 'music' ? (
              <Music size={18} />
            ) : selectedMeta ? (
              <selectedMeta.icon size={18} />
            ) : (
              <Sparkles size={18} />
            )}
          </span>
          <div>
            <strong>{selected === 'cover' ? e.cover : selected === 'music' ? e.music : (selectedMeta?.label ?? '')}</strong>
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

        {selected === 'music' && (
          <MusicUpload
            projectId={project.id}
            musicUrl={content.musicUrl}
            t={t.musicUpload}
            onChange={(url) => patch({ musicUrl: url })}
          />
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

        {sectionKindOf(selected) === 'collage' &&
          (() => {
            const instance = content.collages[selected] ?? {
              templateId: COLLAGE_TEMPLATES[0].id,
              photos: {},
            };
            const template = getCollageTemplate(instance.templateId);
            return (
              <>
                {COLLAGE_TEMPLATES.length > 1 && (
                  <label className={scss.field}>
                    {e.collageDesign}
                    <select
                      value={instance.templateId}
                      onChange={(ev) => updateCollage(selected, { ...instance, templateId: ev.target.value })}
                    >
                      {COLLAGE_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {template.slots.map((slot) => (
                  <div key={slot.id} className={scss.storyGroup}>
                    <PhotoSlot
                      projectId={project.id}
                      aspectRatio={slotAspectRatio(slot, template)}
                      transform={instance.photos[slot.id]}
                      t={t.photoSlot}
                      onChange={(tr) =>
                        updateCollage(selected, {
                          ...instance,
                          photos: { ...instance.photos, [slot.id]: tr },
                        })
                      }
                    />
                  </div>
                ))}
              </>
            );
          })()}

        {!selected && <p className={scss.empty}>{e.selectSection}</p>}
      </aside>
    </div>
  );
}
