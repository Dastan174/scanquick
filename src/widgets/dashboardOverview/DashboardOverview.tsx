import Link from 'next/link';
import { ChevronRight, Folder, Link2, Pencil, Play, Plus, QrCode, Sparkles } from 'lucide-react';
import StatCard from '@/shared/ui/statCard/StatCard';
import Badge from '@/shared/ui/badge/Badge';
import type { Project } from '@/shared/lib/mockData';
import { getT, getLocale } from '@/shared/lib/i18n/locale';
import { subtitleStory, draftsCount } from '@/shared/lib/i18n/format';
import scss from './dashboardOverview.module.scss';

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface DashboardOverviewProps {
  projects: Project[];
  userName: string;
  plan: string;
}

export default async function DashboardOverview({ projects, userName, plan }: DashboardOverviewProps) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const d = t.dashboard;
  const totalScans = projects.reduce((sum, p) => sum + p.scans, 0);
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.length - publishedCount;
  const latest = projects[0];

  const quickActions = latest
    ? [
        { icon: QrCode, label: d.actionViewQr, href: `/projects/${latest.id}/qr` },
        { icon: Play, label: d.actionPreview, href: `/projects/${latest.id}/preview`, newTab: true },
        { icon: Pencil, label: d.actionEdit, href: `/projects/${latest.id}/edit` },
        { icon: Sparkles, label: d.actionUpgrade, href: '/upgrade' },
      ]
    : [{ icon: Plus, label: d.actionCreateFirst, href: '/projects/new' }];

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <span className={scss.greeting}>{d.greeting}</span>
          <h1>
            {d.hello} <em>{userName.split(' ')[0]}</em>
          </h1>
          <p>{subtitleStory(locale, projects.length, publishedCount)}</p>
        </div>
        <Link href="/projects/new" className={scss.newBtn}>
          {d.newProject}
        </Link>
      </div>

      <div className={scss.stats}>
        <StatCard label={d.statTotalProjects} icon={Folder} value={String(projects.length)} />
        <StatCard label={d.statTotalScans} icon={QrCode} value={totalScans.toLocaleString('ru-RU')} />
        <StatCard
          label={d.statActiveLinks}
          icon={Link2}
          value={String(publishedCount)}
          delta={draftsCount(locale, draftCount)}
          deltaTone="neutral"
        />
        <StatCard
          label={d.statPlan}
          icon={Sparkles}
          value={plan === 'free' ? t.common.free : t.common.premium}
          delta={plan === 'free' ? d.upgradeAnytime : d.active}
          deltaTone="neutral"
        />
      </div>

      <div className={scss.grid}>
        <div className={scss.recent}>
          <div className={scss.recentHeader}>
            <h2>{d.recentProjects}</h2>
            {projects.length > 0 && <Link href="/projects">{d.viewAll}</Link>}
          </div>
          {projects.length === 0 ? (
            <div className={scss.empty}>
              <p>{d.emptyTitle}</p>
              <Link href="/projects/new">{d.emptyCta}</Link>
            </div>
          ) : (
            <div className={scss.list}>
              {projects.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/projects/${p.id}/edit`} className={scss.row}>
                  <span className={scss.thumb} style={{ background: p.gradient }} />
                  <div className={scss.rowInfo}>
                    <div className={scss.rowTitle}>
                      <strong>{p.name}</strong>
                      <Badge label={p.status === 'published' ? t.common.published : t.common.draft}>
                        {p.status}
                      </Badge>
                    </div>
                    <span>
                      {p.partnerA} & {p.partnerB} · {p.template}
                    </span>
                    <span className={scss.updated}>
                      {d.updated} {p.updatedAt}
                    </span>
                  </div>
                  <div className={scss.rowScans}>
                    <strong>{p.scans}</strong>
                    <span>{d.scans}</span>
                  </div>
                  <span className={scss.chevron}>
                    <ChevronRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={scss.side}>
          <div className={scss.chartCard}>
            <div className={scss.chartHeader}>
              <h2>{d.scansThisYear}</h2>
            </div>
            <div className={scss.bars}>
              {months.map((m) => (
                <div key={m} className={scss.barCol}>
                  <div className={scss.bar} style={{ height: '4%' }} />
                  <span>{m}</span>
                </div>
              ))}
            </div>
            {totalScans === 0 && <p className={scss.chartEmpty}>{d.noScansYet}</p>}
          </div>

          <div className={scss.actionsCard}>
            <h2>{d.quickActions}</h2>
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={scss.actionRow}
                {...('newTab' in a && a.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span>
                  <a.icon size={16} />
                </span>
                {a.label}
              </Link>
            ))}
          </div>

          {plan === 'free' && (
            <div className={scss.upsell}>
              <span className={scss.upsellIcon}>
                <Sparkles size={20} />
              </span>
              <strong>{d.premiumWaiting}</strong>
              <p>{d.premiumDescr}</p>
              <Link href="/upgrade">{d.upgradeNow}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
