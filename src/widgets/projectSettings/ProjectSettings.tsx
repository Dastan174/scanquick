'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project } from '@/shared/lib/mockData';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { deleteConfirm } from '@/shared/lib/i18n/format';
import { updateProjectSlug, setProjectStatus, deleteProject } from '@/app/(admin)/projects/actions';
import scss from './projectSettings.module.scss';

interface ProjectSettingsProps {
  project: Project;
  locale: Locale;
  t: Dictionary['projectSettings'];
}

export default function ProjectSettings({ project, locale, t }: ProjectSettingsProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(project.slug ?? '');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [slugError, setSlugError] = useState('');
  const [passwordOn, setPasswordOn] = useState(false);
  const [publicOn, setPublicOn] = useState(project.status === 'published');
  const [deleting, setDeleting] = useState(false);

  const saveSlug = async () => {
    setSlugStatus('saving');
    setSlugError('');
    const result = await updateProjectSlug(project.id, slug);
    if (result.error || !result.slug) {
      setSlugStatus('error');
      setSlugError(result.error ?? t.slugErrorFallback);
      return;
    }
    setSlug(result.slug);
    setSlugStatus('saved');
  };

  const toggleVisibility = async () => {
    const next = !publicOn;
    setPublicOn(next);
    await setProjectStatus(project.id, next ? 'published' : 'draft');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(deleteConfirm(locale, project.name))) return;
    setDeleting(true);
    await deleteProject(project.id);
  };

  return (
    <div className={scss.page}>
      <Link href={`/projects/${project.id}/edit`} className={scss.back}>
        {t.backToEditor}
      </Link>
      <h1>{t.title}</h1>
      <p>{project.name}</p>

      <div className={scss.card}>
        <h2>{t.slugTitle}</h2>
        <p>{t.slugDescr}</p>
        <div className={scss.slugRow}>
          <span>loveqr.co/</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugStatus('idle');
            }}
          />
        </div>
        {slugStatus === 'error' ? (
          <span className={scss.slugErrorText}>{slugError}</span>
        ) : (
          <span className={scss.available}>
            {slugStatus === 'saved' ? `${t.saved}` : '● '}loveqr.co/{slug || 'your-slug'}
          </span>
        )}
        <button className={scss.saveBtn} onClick={saveSlug} disabled={slugStatus === 'saving'}>
          {slugStatus === 'saving' ? t.saving : t.saveSlug}
        </button>
      </div>

      <div className={scss.card}>
        <div className={scss.toggleRow}>
          <div>
            <h2>{t.passwordTitle}</h2>
            <p>{t.passwordDescr}</p>
          </div>
          <button
            className={`${scss.switch} ${passwordOn ? scss.switchOn : ''}`}
            onClick={() => setPasswordOn((v) => !v)}
            aria-label="Toggle password protection"
          >
            <span />
          </button>
        </div>
      </div>

      <div className={scss.card}>
        <div className={scss.toggleRow}>
          <div>
            <h2>{t.visibilityTitle}</h2>
            <p>{t.visibilityDescr}</p>
            <span className={scss.publicTag}>{publicOn ? t.published : t.draft}</span>
          </div>
          <button
            className={`${scss.switch} ${publicOn ? scss.switchOn : ''}`}
            onClick={toggleVisibility}
            aria-label="Toggle visibility"
          >
            <span />
          </button>
        </div>
      </div>

      <div className={`${scss.card} ${scss.danger}`}>
        <h2>{t.dangerTitle}</h2>
        <p>{t.dangerDescr}</p>
        <button className={scss.deleteBtn} onClick={handleDelete} disabled={deleting}>
          {deleting ? t.deleting : t.deleteBtn}
        </button>
      </div>
    </div>
  );
}
