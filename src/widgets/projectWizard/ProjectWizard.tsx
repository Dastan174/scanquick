'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Cake,
  Camera,
  CalendarHeart,
  Check,
  CheckCircle2,
  ChevronLeft,
  Heart,
  Send,
} from 'lucide-react';
import { templates } from '@/shared/lib/mockData';
import {
  createProject,
  updateProjectContent,
  updateInvitationContent,
  getMyProjectTelegramLink,
  getMyProjectTelegramStatus,
  setProjectStatus,
} from '@/app/(admin)/projects/actions';
import { uploadSectionPhoto } from '@/app/(admin)/projects/media-actions';
import { compressImage } from '@/shared/lib/compressImage';
import { demoLoveStoryContent } from '@/shared/lib/loveStoryContent';
import { COVER_TEMPLATES } from '@/shared/lib/coverTemplates';
import { demoInvitationContent, type InvitationContent } from '@/shared/lib/invitationContent';
import TextListEditor from '@/widgets/projectEditor/TextListEditor';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { stepLabel } from '@/shared/lib/i18n/format';
import scss from './projectWizard.module.scss';

// Steps 3-8 (the invitation content screens) aren't localized — same as
// InvitationEditor.tsx, this feature is Russian-only for now.
const INVITATION_STEP_HEADINGS: Record<number, { title: string; em: string }> = {
  3: { title: 'Первый', em: 'вопрос' },
  4: { title: 'Экран', em: 'подтверждения' },
  5: { title: 'Куда', em: 'сходим' },
  6: { title: 'Дата', em: 'и время' },
  7: { title: 'Финальный', em: 'экран' },
  8: { title: 'Уведомления', em: 'в Telegram' },
};

// Which visitor-facing screen each content step edits, so the (click-through
// proof) preview shows that screen instead of always starting at the
// question. Step 8 (Telegram) has no screen of its own — it stays on 'final'.
const PREVIEW_SCREEN_BY_STEP: Record<number, string> = {
  3: 'question',
  4: 'confirm',
  5: 'activity',
  6: 'date',
  7: 'final',
  8: 'final',
};

interface ProjectWizardProps {
  locale: Locale;
  t: Dictionary['projectWizard'];
}

// Birthday (index 1) isn't built yet — shown so people know it's coming,
// but isn't selectable. The love story card and date invitation both work.
const SITE_TYPE_ICONS = [Heart, Cake, CalendarHeart];
const SOON_INDEX = 1;
const INVITATION_INDEX = 2;

export default function ProjectWizard({ locale, t }: ProjectWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [siteType, setSiteType] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [yourName, setYourName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverTemplateId, setCoverTemplateId] = useState(demoLoveStoryContent.coverTemplateId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [invitationId, setInvitationId] = useState('');
  const [invitationSlug, setInvitationSlug] = useState('');
  const [invitationContent, setInvitationContent] =
    useState<InvitationContent>(demoInvitationContent);
  const [invitationPreviewSrc, setInvitationPreviewSrc] = useState('');
  const [telegramStatus, setTelegramStatus] = useState('');
  const [telegramConnected, setTelegramConnected] = useState(false);
  // The focus listener below is only (re)attached when telegramConnected
  // itself changes, so a plain closure over invitationContent would still
  // see whatever it was back then — stale by the time steps 3-7 are edited.
  const invitationContentRef = useRef(invitationContent);

  const namesLabel = yourName && partnerName ? `${yourName} & ${partnerName}` : t.namesPlaceholder;
  const activeTemplate = templates.find((tp) => tp.id === templateId) ?? templates[0];
  const canContinueNames = projectName.trim() && yourName.trim() && partnerName.trim();
  const isInvitation = siteType === INVITATION_INDEX;
  const totalSteps = isInvitation ? 8 : 4;

  const patchInvitation = (fields: Partial<InvitationContent>) =>
    setInvitationContent((c) => ({ ...c, ...fields }));

  // Only "Укажу сам" needs a value here — when the recipient picks, there's
  // nothing to fill in on this step yet.
  const canContinueDate =
    invitationContent.dateMode !== 'fixed' ||
    Boolean(invitationContent.fixedDate?.trim() && invitationContent.fixedTime?.trim());

  // Once the recipient's name step is done we create the project right away
  // (draft, empty content) so the remaining steps can show a real live
  // preview via the same /view/[slug]?preview= iframe trick InvitationEditor
  // uses — 100vh inside the preview needs a real iframe to size correctly.
  const continueFromNames = async () => {
    if (invitationId) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    setError('');
    const result = await createProject({
      name: projectName,
      partnerA: yourName,
      partnerB: partnerName,
      anniversaryDate: '',
      templateId: templates[0].id,
      type: 'invitation',
    });
    setSubmitting(false);
    if (result.error || !result.id) {
      setError(result.error ?? t.errorFallback);
      return;
    }
    setInvitationId(result.id);
    setInvitationSlug(result.slug);
    setStep(3);
  };

  useEffect(() => {
    if (!invitationSlug) return;
    const previewScreen = PREVIEW_SCREEN_BY_STEP[step] ?? 'question';
    const timer = window.setTimeout(() => {
      setInvitationPreviewSrc(
        `/view/${invitationSlug}?preview=${encodeURIComponent(JSON.stringify(invitationContent))}&draft=1&screen=${previewScreen}`,
      );
    }, 400);
    return () => window.clearTimeout(timer);
  }, [invitationContent, invitationSlug, step]);

  useEffect(() => {
    invitationContentRef.current = invitationContent;
  }, [invitationContent]);

  // Telegram connected is the last thing required — from here the invitation
  // is done, so this saves, publishes (same as the editor's "Get QR" button),
  // and drops the owner straight on the QR page instead of back in the
  // editor. Any further tweaks happen from there, via "Edit project". Reads
  // the ref rather than the closed-over state — see invitationContentRef.
  const finishInvitationToQr = async () => {
    setSubmitting(true);
    setError('');
    const result = await updateInvitationContent(invitationId, invitationContentRef.current);
    if ('error' in result) {
      setSubmitting(false);
      setError(result.error ?? t.errorFallback);
      return;
    }
    await setProjectStatus(invitationId, 'published');
    router.push(`/projects/${invitationId}/qr`);
  };

  const connectTelegram = async () => {
    // Open the tab synchronously, in the same tick as the click, so browsers
    // don't treat it as an unsolicited popup — see InvitationEditor.tsx.
    const win = window.open('', '_blank');
    setTelegramStatus('Открываю Telegram…');
    const result = await getMyProjectTelegramLink(invitationId);
    if ('error' in result) {
      setTelegramStatus(result.error);
      win?.close();
      return;
    }
    if (win) {
      win.location.href = result.url;
    } else {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
    setTelegramStatus('Нажмите "Start" в Telegram, затем вернитесь сюда.');
  };

  // The actual linking happens inside Telegram, outside this tab, so the
  // only way to notice it finished is to re-check when the owner comes back
  // — window focus is a good proxy for "just switched back from Telegram".
  useEffect(() => {
    if (!isInvitation || !invitationId || telegramConnected) return;
    const handleFocus = async () => {
      const result = await getMyProjectTelegramStatus(invitationId);
      if (result.connected) {
        setTelegramConnected(true);
        setTelegramStatus('');
        finishInvitationToQr();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInvitation, invitationId, telegramConnected]);

  const finish = async () => {
    setSubmitting(true);
    setError('');
    const result = await createProject({
      name: projectName,
      partnerA: yourName,
      partnerB: partnerName,
      anniversaryDate: '',
      templateId,
    });
    if (result.error || !result.id) {
      setSubmitting(false);
      setError(result.error ?? t.errorFallback);
      return;
    }

    let coverPhotoUrl: string | undefined;
    if (coverFile) {
      // A failed cover upload shouldn't block moving on — the project is
      // already created, and the photo can be added again from the editor.
      const compressed = await compressImage(coverFile);
      const upload = await uploadSectionPhoto(result.id, compressed);
      coverPhotoUrl = upload.url;
    }

    if (coverPhotoUrl || coverTemplateId !== demoLoveStoryContent.coverTemplateId) {
      await updateProjectContent(result.id, {
        ...demoLoveStoryContent,
        coverTemplateId,
        ...(coverPhotoUrl ? { coverPhotoUrl } : {}),
      });
    }

    router.push(`/projects/${result.id}/edit`);
  };

  const handleCoverFile = (file: File | undefined) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <div className={scss.wizard}>
      <div className={scss.left}>
        <div className={scss.steps}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`${scss.stepDot} ${step > s ? scss.stepDone : ''} ${step === s ? scss.stepCurrent : ''}`}
            >
              {step > s ? <Check size={14} /> : s}
            </div>
          ))}
        </div>
        <span className={scss.stepLabel}>{stepLabel(locale, step, totalSteps)}</span>
        <h1>
          {isInvitation && step >= 3 ? (
            <>
              {INVITATION_STEP_HEADINGS[step].title}
              <br />
              <em>{INVITATION_STEP_HEADINGS[step].em}</em>
            </>
          ) : isInvitation && step === 2 ? (
            <>
              {t.stepTitles[2].title}
              <br />
              <em>{t.stepTitles[2].em}</em>
            </>
          ) : (
            <>
              {t.stepTitles[step - 1].title}
              <br />
              <em>{t.stepTitles[step - 1].em}</em>
            </>
          )}
        </h1>

        {isInvitation && step >= 3 && invitationPreviewSrc ? (
          <div className={scss.invitationFrame}>
            <iframe
              key={invitationSlug}
              src={invitationPreviewSrc}
              className={scss.invitationPreviewFrame}
              style={{ pointerEvents: 'none' }}
              title="Live preview"
            />
          </div>
        ) : (
          <div className={scss.phone} style={{ background: activeTemplate.gradient }}>
            <span>{namesLabel}</span>
          </div>
        )}
        <p className={scss.livePreview}>{t.livePreview}</p>
      </div>

      <div className={scss.right}>
        <Link href="/projects" className={scss.back}>
          <ChevronLeft size={14} />
          {t.backToProjects}
        </Link>

        {step === 1 && (
          <div className={scss.step}>
            <h2>{t.typeStepTitle}</h2>
            <p>{t.typeStepDescr}</p>

            <div className={scss.typeGrid}>
              {t.siteTypes.map((type, i) => {
                const Icon = SITE_TYPE_ICONS[i];
                const soon = i === SOON_INDEX;
                return (
                  <button
                    key={type.name}
                    type="button"
                    className={`${scss.typeCard} ${siteType === i ? scss.typeActive : ''} ${soon ? scss.typeSoon : ''}`}
                    onClick={() => !soon && setSiteType(i)}
                    disabled={soon}
                  >
                    {soon && <span className={scss.soonTag}>{t.comingSoon}</span>}
                    <Icon size={26} />
                    <strong>{type.name}</strong>
                    <span>{type.descr}</span>
                  </button>
                );
              })}
            </div>

            <div className={scss.stepActions}>
              <button className={scss.continueBtn} onClick={() => setStep(2)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 2 && isInvitation && (
          <div className={scss.step}>
            <h2>{t.namesStepTitle}</h2>
            <p>{t.namesStepDescr}</p>

            <label className={scss.field}>
              {t.projectName}
              <input
                placeholder={t.projectNamePlaceholder}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>

            <div className={scss.fieldRow}>
              <label className={scss.field}>
                {t.yourName}
                <input
                  placeholder="Sofia"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                />
              </label>
              <label className={scss.field}>
                {t.partnerName}
                <input
                  placeholder="James"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </label>
            </div>

            {error && <div className={scss.error}>{error}</div>}

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(1)} disabled={submitting}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button
                className={scss.continueBtn}
                disabled={!canContinueNames || submitting}
                onClick={continueFromNames}
              >
                {submitting ? t.creating : t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 3 && isInvitation && (
          <div className={scss.step}>
            <h2>Экран «Да / Нет»</h2>
            <p>Первый вопрос, который увидит получатель</p>

            <label className={scss.field}>
              Заголовок
              <input
                value={invitationContent.questionTitle}
                onChange={(e) => patchInvitation({ questionTitle: e.target.value })}
              />
            </label>
            <div className={scss.fieldRow}>
              <label className={scss.field}>
                Кнопка «Да»
                <input
                  value={invitationContent.yesLabel}
                  onChange={(e) => patchInvitation({ yesLabel: e.target.value })}
                />
              </label>
              <label className={scss.field}>
                Кнопка «Нет»
                <input
                  value={invitationContent.noLabel}
                  onChange={(e) => patchInvitation({ noLabel: e.target.value })}
                />
              </label>
            </div>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(2)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(4)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 4 && isInvitation && (
          <div className={scss.step}>
            <h2>Экран подтверждения</h2>
            <p>Показывается сразу после «Да»</p>

            <label className={scss.field}>
              Заголовок
              <input
                value={invitationContent.confirmTitle}
                onChange={(e) => patchInvitation({ confirmTitle: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Подзаголовок
              <input
                value={invitationContent.confirmSubtitle}
                onChange={(e) => patchInvitation({ confirmSubtitle: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Текст кнопки
              <input
                value={invitationContent.confirmButtonLabel}
                onChange={(e) => patchInvitation({ confirmButtonLabel: e.target.value })}
              />
            </label>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(3)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(5)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 5 && isInvitation && (
          <div className={scss.step}>
            <h2>Куда сходим</h2>
            <p>Получатель выберет один из вариантов</p>

            <label className={scss.field}>
              Заголовок экрана
              <input
                value={invitationContent.activityQuestionTitle}
                onChange={(e) => patchInvitation({ activityQuestionTitle: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Варианты
              <TextListEditor
                items={invitationContent.activityOptions}
                onChange={(items) => patchInvitation({ activityOptions: items })}
                addLabel="Добавить вариант"
                removeLabel="Удалить вариант"
              />
            </label>
            <label className={scss.field}>
              Текст кнопки
              <input
                value={invitationContent.activityButtonLabel}
                onChange={(e) => patchInvitation({ activityButtonLabel: e.target.value })}
              />
            </label>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(4)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(6)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 6 && isInvitation && (
          <div className={scss.step}>
            <h2>Дата и время</h2>
            <p>Кто выбирает, когда встретиться</p>

            <label className={scss.field}>
              Кто выбирает дату и время
              <select
                value={invitationContent.dateMode}
                onChange={(e) =>
                  patchInvitation({ dateMode: e.target.value as InvitationContent['dateMode'] })
                }
              >
                <option value="recipient">Пусть выберет получатель</option>
                <option value="fixed">Укажу сам</option>
              </select>
            </label>
            {invitationContent.dateMode === 'fixed' && (
              <div className={scss.fieldRow}>
                <label className={scss.field}>
                  Дата
                  <input
                    type="date"
                    value={invitationContent.fixedDate ?? ''}
                    onChange={(e) => patchInvitation({ fixedDate: e.target.value })}
                  />
                </label>
                <label className={scss.field}>
                  Время
                  <input
                    type="time"
                    value={invitationContent.fixedTime ?? ''}
                    onChange={(e) => patchInvitation({ fixedTime: e.target.value })}
                  />
                </label>
              </div>
            )}
            <label className={scss.field}>
              Заголовок экрана
              <input
                value={invitationContent.dateQuestionTitle}
                onChange={(e) => patchInvitation({ dateQuestionTitle: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Текст кнопки
              <input
                value={invitationContent.dateButtonLabel}
                onChange={(e) => patchInvitation({ dateButtonLabel: e.target.value })}
              />
            </label>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(5)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button
                className={scss.continueBtn}
                disabled={!canContinueDate}
                onClick={() => setStep(7)}
              >
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 7 && isInvitation && (
          <div className={scss.step}>
            <h2>Финальный экран</h2>
            <p>Покажется после ответа получателя</p>

            <label className={scss.field}>
              Заголовок
              <input
                value={invitationContent.finalTitle}
                onChange={(e) => patchInvitation({ finalTitle: e.target.value })}
              />
            </label>
            <label className={scss.field}>
              Описание
              <textarea
                rows={2}
                value={invitationContent.finalDescription}
                onChange={(e) => patchInvitation({ finalDescription: e.target.value })}
              />
              <span>{'{date}, {time} и {activity} подставятся автоматически'}</span>
            </label>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(6)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(8)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 8 && isInvitation && (
          <div className={scss.step}>
            <h2>Уведомления в Telegram</h2>
            <p>Когда получатель ответит, вы получите сообщение от бота</p>

            {telegramConnected ? (
              <p className={scss.telegramConnected}>
                <CheckCircle2 size={16} />
                Telegram подключён — открываем QR-код…
              </p>
            ) : (
              <>
                <button type="button" className={scss.telegramBtn} onClick={connectTelegram}>
                  <Send size={14} />
                  Подключить Telegram
                </button>
                <p className={scss.hint}>
                  {telegramStatus ||
                    'Нужно подключить Telegram, чтобы получать ответы на приглашение.'}
                </p>
              </>
            )}

            {error && <div className={scss.error}>{error}</div>}

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(7)} disabled={submitting}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button
                className={scss.continueBtn}
                onClick={finishInvitationToQr}
                disabled={submitting || !telegramConnected}
              >
                {submitting ? t.creating : 'Получить QR-код →'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && !isInvitation && (
          <div className={scss.step}>
            <h2>{t.templateStepTitle}</h2>
            <p>{t.templateStepDescr}</p>

            <div className={scss.templateGrid}>
              {templates.map((tpl, i) => (
                <button
                  key={tpl.id}
                  className={`${scss.templateCard} ${templateId === tpl.id ? scss.templateActive : ''}`}
                  onClick={() => setTemplateId(tpl.id)}
                >
                  {i === 0 && <span className={scss.popularTag}>{t.popular}</span>}
                  <span className={scss.templateSwatch} style={{ background: tpl.gradient }} />
                  <strong>{tpl.name}</strong>
                  <span>{tpl.mood}</span>
                </button>
              ))}
            </div>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(1)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(3)}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 3 && !isInvitation && (
          <div className={scss.step}>
            <h2>{t.namesStepTitle}</h2>
            <p>{t.namesStepDescr}</p>

            <label className={scss.field}>
              {t.projectName}
              <input
                placeholder={t.projectNamePlaceholder}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>

            <div className={scss.fieldRow}>
              <label className={scss.field}>
                {t.yourName}
                <input
                  placeholder="Sofia"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                />
              </label>
              <label className={scss.field}>
                {t.partnerName}
                <input
                  placeholder="James"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </label>
            </div>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(2)}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button
                className={scss.continueBtn}
                disabled={!canContinueNames}
                onClick={() => setStep(4)}
              >
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {step === 4 && !isInvitation && (
          <div className={scss.step}>
            <h2>{t.coverStepTitle}</h2>
            <p>{t.coverStepDescr}</p>

            <label className={scss.field}>
              {t.coverStyle}
              <select
                value={coverTemplateId ?? ''}
                onChange={(ev) => setCoverTemplateId(ev.target.value || undefined)}
              >
                <option value="">{t.coverStylePlain}</option>
                {COVER_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className={scss.dropzone}
              style={
                coverPreview
                  ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover' }
                  : undefined
              }
              onClick={() => fileInputRef.current?.click()}
            >
              {!coverPreview && (
                <>
                  <span>
                    <Camera size={28} />
                  </span>
                  <strong>{t.uploadCover}</strong>
                  <span>{t.uploadHint}</span>
                  <span>{t.orClickToBrowse}</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              hidden
              onChange={(e) => handleCoverFile(e.target.files?.[0])}
            />

            <span className={scss.orUse}>{t.orUseSample}</span>
            <div className={scss.samples}>
              {templates.slice(0, 3).map((tpl) => (
                <span key={tpl.id} style={{ background: tpl.gradient }} />
              ))}
            </div>

            <div className={scss.note}>{t.skipNote}</div>

            {error && <div className={scss.error}>{error}</div>}

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(3)} disabled={submitting}>
                <ChevronLeft size={14} />
                {t.back}
              </button>
              <button className={scss.continueBtn} onClick={finish} disabled={submitting}>
                {submitting ? t.creating : t.openEditor}
              </button>
            </div>
            <button className={scss.skipBtn} onClick={finish} disabled={submitting}>
              {t.skipForNow}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
