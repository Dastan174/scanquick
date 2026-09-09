'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/shared/ui/badge/Badge';
import type { Project } from '@/shared/lib/mockData';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import { projectsCount } from '@/shared/lib/i18n/format';
import scss from './projectsList.module.scss';

const filterKeys = ['all', 'published', 'draft'] as const;

interface ProjectsListProps {
  projects: Project[];
  locale: Locale;
  t: Dictionary;
}

export default function ProjectsList({ projects, locale, t }: ProjectsListProps) {
  const p = t.projectsList;
  const [filter, setFilter] = useState<(typeof filterKeys)[number]>('all');
  const [query, setQuery] = useState('');

  const filterLabels: Record<(typeof filterKeys)[number], string> = {
    all: p.filterAll,
    published: p.filterPublished,
    draft: p.filterDraft,
  };

  const filtered = useMemo(
    () =>
      projects.filter((proj) => {
        const matchesFilter = filter === 'all' || proj.status === filter;
        const matchesQuery = proj.name.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    [filter, query, projects],
  );

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <h1>{p.title}</h1>
          <p>
            {projectsCount(
              locale,
              projects.length,
              projects.filter((x) => x.status === 'published').length,
            )}
          </p>
        </div>
        <Link href="/projects/new" className={scss.newBtn}>
          {p.newProject}
        </Link>
      </div>

      <div className={scss.toolbar}>
        <input
          className={scss.search}
          placeholder={p.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={scss.filters}>
          {filterKeys.map((f) => (
            <button
              key={f}
              className={`${scss.filterBtn} ${filter === f ? scss.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className={scss.emptyState}>
          <Image
            src="/empty-box.webp"
            alt=""
            width={120}
            height={120}
            className={scss.emptyImage}
          />
          <strong>{p.emptyTitle}</strong>
          <p>{p.emptyDescr}</p>
          <Link href="/projects/new" className={scss.newBtn}>
            {p.newProject}
          </Link>
        </div>
      ) : (
        <div className={scss.grid}>
          {filtered.map((proj) => (
            <div key={proj.id} className={scss.card}>
              <div className={scss.thumb} style={{ background: proj.gradient }}>
                <Badge
                  tone={proj.status === 'draft' ? 'gray' : undefined}
                  label={proj.status === 'published' ? t.common.published : t.common.draft}
                >
                  {proj.status}
                </Badge>
                <span className={scss.scans}>
                  {proj.scans} {p.scans}
                </span>
              </div>
              <div className={scss.body}>
                <strong>{proj.name}</strong>
                <span>
                  {proj.partnerA} & {proj.partnerB}
                </span>
                <div className={scss.meta}>
                  <span>{proj.template}</span>
                  {proj.slug && <span className={scss.slug}>/{proj.slug}</span>}
                </div>
                <div className={scss.actions}>
                  <Link href={`/projects/${proj.id}/edit`}>{p.edit}</Link>
                  <Link
                    href={`/projects/${proj.id}/preview`}
                    className={scss.previewBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.preview}
                  </Link>
                  <Link href={`/projects/${proj.id}/qr`} className={scss.qrBtn}>
                    ⊞
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <Link href="/projects/new" className={scss.createCard}>
            <span>+</span>
            <strong>{p.createTitle}</strong>
            <p>{p.createDescr}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
