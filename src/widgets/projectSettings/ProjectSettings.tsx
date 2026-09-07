'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project } from '@/shared/lib/mockData';
import { updateProjectSlug, setProjectStatus, deleteProject } from '@/app/(admin)/projects/actions';
import scss from './projectSettings.module.scss';

export default function ProjectSettings({ project }: { project: Project }) {
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
      setSlugError(result.error ?? 'Could not save the slug.');
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
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteProject(project.id);
  };

  return (
    <div className={scss.page}>
      <Link href={`/projects/${project.id}/edit`} className={scss.back}>
        ‹ Back to Editor
      </Link>
      <h1>Project Settings</h1>
      <p>{project.name}</p>

      <div className={scss.card}>
        <h2>Custom URL Slug</h2>
        <p>The unique path for your love story</p>
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
            {slugStatus === 'saved' ? '● Saved · ' : '● '}loveqr.co/{slug || 'your-slug'}
          </span>
        )}
        <button className={scss.saveBtn} onClick={saveSlug} disabled={slugStatus === 'saving'}>
          {slugStatus === 'saving' ? 'Saving…' : 'Save Slug'}
        </button>
      </div>

      <div className={scss.card}>
        <div className={scss.toggleRow}>
          <div>
            <h2>Password Protection</h2>
            <p>Only those with the password can view your site</p>
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
            <h2>Visibility</h2>
            <p>Your site is publicly accessible via QR or link</p>
            <span className={scss.publicTag}>{publicOn ? '● Published' : '○ Draft'}</span>
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
        <h2>Danger Zone</h2>
        <p>Permanently delete this project and all its content. This cannot be undone.</p>
        <button className={scss.deleteBtn} onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete Project'}
        </button>
      </div>
    </div>
  );
}
