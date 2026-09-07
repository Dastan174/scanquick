'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Badge from '@/shared/ui/badge/Badge';
import type { Project } from '@/shared/lib/mockData';
import scss from './projectsList.module.scss';

const filters = ['All', 'Published', 'Draft'] as const;

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesFilter =
          filter === 'All' ||
          (filter === 'Published' && p.status === 'published') ||
          (filter === 'Draft' && p.status === 'draft');
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    [filter, query, projects],
  );

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <h1>Your Love Stories</h1>
          <p>
            {projects.length} projects · {projects.filter((p) => p.status === 'published').length}{' '}
            published
          </p>
        </div>
        <Link href="/projects/new" className={scss.newBtn}>
          + New Project
        </Link>
      </div>

      <div className={scss.toolbar}>
        <input
          className={scss.search}
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={scss.filters}>
          {filters.map((f) => (
            <button
              key={f}
              className={`${scss.filterBtn} ${filter === f ? scss.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className={scss.emptyState}>
          <span>♡</span>
          <strong>No love stories yet</strong>
          <p>Create your first project — it only takes a minute.</p>
          <Link href="/projects/new" className={scss.newBtn}>
            + New Project
          </Link>
        </div>
      ) : (
        <div className={scss.grid}>
          {filtered.map((p) => (
            <div key={p.id} className={scss.card}>
              <div className={scss.thumb} style={{ background: p.gradient }}>
                <Badge tone={p.status === 'draft' ? 'gray' : undefined}>{p.status}</Badge>
                <span className={scss.scans}>{p.scans} scans</span>
              </div>
              <div className={scss.body}>
                <strong>{p.name}</strong>
                <span>
                  {p.partnerA} & {p.partnerB}
                </span>
                <div className={scss.meta}>
                  <span>{p.template}</span>
                  {p.slug && <span className={scss.slug}>/{p.slug}</span>}
                </div>
                <div className={scss.actions}>
                  <Link href={`/projects/${p.id}/edit`}>Edit</Link>
                  <Link
                    href={`/projects/${p.id}/preview`}
                    className={scss.previewBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                  <Link href={`/projects/${p.id}/qr`} className={scss.qrBtn}>
                    ⊞
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <Link href="/projects/new" className={scss.createCard}>
            <span>+</span>
            <strong>New Love Story</strong>
            <p>Create a new interactive site</p>
          </Link>
        </div>
      )}
    </div>
  );
}
