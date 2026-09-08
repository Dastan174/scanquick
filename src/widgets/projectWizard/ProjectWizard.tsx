'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cake, Camera, CalendarHeart, Check, ChevronLeft, Heart } from 'lucide-react';
import { templates } from '@/shared/lib/mockData';
import { createProject, updateProjectContent } from '@/app/(admin)/projects/actions';
import { uploadSectionPhoto } from '@/app/(admin)/projects/media-actions';
import { compressImage } from '@/shared/lib/compressImage';
import { demoLoveStoryContent } from '@/shared/lib/loveStoryContent';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { stepLabel } from '@/shared/lib/i18n/format';
import scss from './projectWizard.module.scss';

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
  const [date, setDate] = useState('');
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const namesLabel = yourName && partnerName ? `${yourName} & ${partnerName}` : t.namesPlaceholder;
  const activeTemplate = templates.find((tp) => tp.id === templateId) ?? templates[0];
  const canContinueNames = projectName.trim() && yourName.trim() && partnerName.trim();
  const isInvitation = siteType === INVITATION_INDEX;
  const totalSteps = isInvitation ? 2 : 4;

  const finishInvitation = async () => {
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
    if (result.error || !result.id) {
      setSubmitting(false);
      setError(result.error ?? t.errorFallback);
      return;
    }
    router.push(`/projects/${result.id}/edit`);
  };

  const finish = async () => {
    setSubmitting(true);
    setError('');
    const result = await createProject({
      name: projectName,
      partnerA: yourName,
      partnerB: partnerName,
      anniversaryDate: date,
      templateId,
    });
    if (result.error || !result.id) {
      setSubmitting(false);
      setError(result.error ?? t.errorFallback);
      return;
    }

    if (coverFile) {
      // A failed cover upload shouldn't block moving on — the project is
      // already created, and the photo can be added again from the editor.
      const compressed = await compressImage(coverFile);
      const upload = await uploadSectionPhoto(result.id, compressed);
      if (upload.url) {
        await updateProjectContent(result.id, { ...demoLoveStoryContent, coverPhotoUrl: upload.url });
      }
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
          {isInvitation && step === 2 ? (
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

        <div className={scss.phone} style={{ background: activeTemplate.gradient }}>
          <span>{namesLabel}</span>
        </div>
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
                onClick={finishInvitation}
              >
                {submitting ? t.creating : t.openEditor}
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

            <label className={scss.field}>
              {t.anniversaryDate} <span>{t.optional}</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

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

        {step === 4 && (
          <div className={scss.step}>
            <h2>{t.coverStepTitle}</h2>
            <p>{t.coverStepDescr}</p>

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
