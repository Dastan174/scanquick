'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { templates } from '@/shared/lib/mockData';
import { createProject, updateProjectContent } from '@/app/(admin)/projects/actions';
import { uploadSectionPhoto } from '@/app/(admin)/projects/media-actions';
import { demoLoveStoryContent } from '@/shared/lib/loveStoryContent';
import scss from './projectWizard.module.scss';

const stepMeta = [
  { title: 'Name your', em: 'love story' },
  { title: 'Choose a', em: 'template' },
  { title: 'Add your', em: 'cover' },
];

export default function ProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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

  const namesLabel = yourName && partnerName ? `${yourName} & ${partnerName}` : 'Your Names Here';
  const activeTemplate = templates.find((t) => t.id === templateId) ?? templates[0];
  const canContinueStep1 = projectName.trim() && yourName.trim() && partnerName.trim();

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
      setError(result.error ?? 'Could not create the project.');
      return;
    }

    if (coverFile) {
      // A failed cover upload shouldn't block moving on — the project is
      // already created, and the photo can be added again from the editor.
      const upload = await uploadSectionPhoto(result.id, coverFile);
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
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${scss.stepDot} ${step > s ? scss.stepDone : ''} ${step === s ? scss.stepCurrent : ''}`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
        <span className={scss.stepLabel}>Step {step} of 3</span>
        <h1>
          {stepMeta[step - 1].title}
          <br />
          <em>{stepMeta[step - 1].em}</em>
        </h1>

        <div className={scss.phone} style={{ background: activeTemplate.gradient }}>
          <span>{namesLabel}</span>
        </div>
        <p className={scss.livePreview}>Live preview as you type</p>
      </div>

      <div className={scss.right}>
        <Link href="/projects" className={scss.back}>
          ‹ Back to Projects
        </Link>

        {step === 1 && (
          <div className={scss.step}>
            <h2>Your love story begins</h2>
            <p>Give your project a name and tell us who this is for.</p>

            <label className={scss.field}>
              Project name
              <input
                placeholder="e.g. Our Anniversary 2024"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>

            <div className={scss.fieldRow}>
              <label className={scss.field}>
                Your name
                <input
                  placeholder="Sofia"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                />
              </label>
              <label className={scss.field}>
                Partner&apos;s name
                <input
                  placeholder="James"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </label>
            </div>

            <label className={scss.field}>
              Anniversary date <span>(optional)</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <button
              className={scss.continueBtn}
              disabled={!canContinueStep1}
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={scss.step}>
            <h2>Choose your canvas</h2>
            <p>Pick a template that matches the mood of your love story.</p>

            <div className={scss.templateGrid}>
              {templates.map((t, i) => (
                <button
                  key={t.id}
                  className={`${scss.templateCard} ${templateId === t.id ? scss.templateActive : ''}`}
                  onClick={() => setTemplateId(t.id)}
                >
                  {i === 0 && <span className={scss.popularTag}>Popular</span>}
                  <span className={scss.templateSwatch} style={{ background: t.gradient }} />
                  <strong>{t.name}</strong>
                  <span>{t.mood}</span>
                </button>
              ))}
            </div>

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className={scss.continueBtn} onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={scss.step}>
            <h2>Add your cover photo</h2>
            <p>The first thing they will see. Choose a photo that captures your love.</p>

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
                  <span>📸</span>
                  <strong>Upload cover photo</strong>
                  <span>JPG, PNG, HEIC · Up to 20MB</span>
                  <span>or click to browse</span>
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

            <span className={scss.orUse}>or use sample</span>
            <div className={scss.samples}>
              {templates.slice(0, 3).map((t) => (
                <span key={t.id} style={{ background: t.gradient }} />
              ))}
            </div>

            <div className={scss.note}>
              ✓ You can skip this step and add your cover later in the editor. You won&apos;t lose
              any progress.
            </div>

            {error && <div className={scss.error}>{error}</div>}

            <div className={scss.stepActions}>
              <button className={scss.backBtn} onClick={() => setStep(2)} disabled={submitting}>
                ← Back
              </button>
              <button className={scss.continueBtn} onClick={finish} disabled={submitting}>
                {submitting ? 'Creating…' : 'Open Editor →'}
              </button>
            </div>
            <button className={scss.skipBtn} onClick={finish} disabled={submitting}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
