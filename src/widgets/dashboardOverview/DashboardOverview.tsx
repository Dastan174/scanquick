import Link from 'next/link';
import StatCard from '@/shared/ui/statCard/StatCard';
import Badge from '@/shared/ui/badge/Badge';
import type { Project } from '@/shared/lib/mockData';
import scss from './dashboardOverview.module.scss';

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface DashboardOverviewProps {
  projects: Project[];
  userName: string;
  plan: string;
}

export default function DashboardOverview({ projects, userName, plan }: DashboardOverviewProps) {
  const totalScans = projects.reduce((sum, p) => sum + p.scans, 0);
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.length - publishedCount;
  const latest = projects[0];

  const quickActions = latest
    ? [
        { icon: '⊞', label: 'View my QR codes', href: `/projects/${latest.id}/qr` },
        { icon: '▷', label: 'Preview live site', href: `/projects/${latest.id}/preview`, newTab: true },
        { icon: '◈', label: 'Edit latest project', href: `/projects/${latest.id}/edit` },
        { icon: '✦', label: 'Upgrade to Premium', href: '/upgrade' },
      ]
    : [{ icon: '+', label: 'Create your first project', href: '/projects/new' }];

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <span className={scss.greeting}>Good to see you ✦</span>
          <h1>
            Hello, <em>{userName.split(' ')[0]}</em>
          </h1>
          <p>
            You have {projects.length} love {projects.length === 1 ? 'story' : 'stories'} —{' '}
            {publishedCount} shared with the world
          </p>
        </div>
        <Link href="/projects/new" className={scss.newBtn}>
          + New Project
        </Link>
      </div>

      <div className={scss.stats}>
        <StatCard label="Total Projects" icon="◈" value={String(projects.length)} />
        <StatCard label="Total Scans" icon="⊞" value={totalScans.toLocaleString('en-US')} />
        <StatCard
          label="Active Links"
          icon="◉"
          value={String(publishedCount)}
          delta={`${draftCount} draft${draftCount === 1 ? '' : 's'}`}
          deltaTone="neutral"
        />
        <StatCard
          label="Plan"
          icon="✦"
          value={plan.charAt(0).toUpperCase() + plan.slice(1)}
          delta={plan === 'free' ? 'Upgrade anytime' : 'Active'}
          deltaTone="neutral"
        />
      </div>

      <div className={scss.grid}>
        <div className={scss.recent}>
          <div className={scss.recentHeader}>
            <h2>Recent Projects</h2>
            {projects.length > 0 && <Link href="/projects">View all →</Link>}
          </div>
          {projects.length === 0 ? (
            <div className={scss.empty}>
              <p>You haven&apos;t created a love story yet.</p>
              <Link href="/projects/new">Create your first project →</Link>
            </div>
          ) : (
            <div className={scss.list}>
              {projects.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/projects/${p.id}/edit`} className={scss.row}>
                  <span className={scss.thumb} style={{ background: p.gradient }} />
                  <div className={scss.rowInfo}>
                    <div className={scss.rowTitle}>
                      <strong>{p.name}</strong>
                      <Badge>{p.status}</Badge>
                    </div>
                    <span>
                      {p.partnerA} & {p.partnerB} · {p.template}
                    </span>
                    <span className={scss.updated}>Updated {p.updatedAt}</span>
                  </div>
                  <div className={scss.rowScans}>
                    <strong>{p.scans}</strong>
                    <span>scans</span>
                  </div>
                  <span className={scss.chevron}>›</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={scss.side}>
          <div className={scss.chartCard}>
            <div className={scss.chartHeader}>
              <h2>Scans This Year</h2>
            </div>
            <div className={scss.bars}>
              {months.map((m) => (
                <div key={m} className={scss.barCol}>
                  <div className={scss.bar} style={{ height: '4%' }} />
                  <span>{m}</span>
                </div>
              ))}
            </div>
            {totalScans === 0 && (
              <p className={scss.chartEmpty}>No scans yet — share your QR to see activity.</p>
            )}
          </div>

          <div className={scss.actionsCard}>
            <h2>Quick Actions</h2>
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={scss.actionRow}
                {...('newTab' in a && a.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>

          {plan === 'free' && (
            <div className={scss.upsell}>
              <span className={scss.upsellIcon}>✦</span>
              <strong>Premium is waiting</strong>
              <p>Unlock unlimited projects, all templates, and no watermark.</p>
              <Link href="/upgrade">Upgrade Now →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
