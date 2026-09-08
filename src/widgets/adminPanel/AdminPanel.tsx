'use client';

import { useState } from 'react';
import { Clock, Folder, Percent, QrCode, TrendingDown, TrendingUp, Users } from 'lucide-react';
import StatCard from '@/shared/ui/statCard/StatCard';
import Badge from '@/shared/ui/badge/Badge';
import { recentUsers, recentPayments, projects, templates } from '@/shared/lib/mockData';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import scss from './adminPanel.module.scss';

const newUsersByDay = [40, 55, 35, 65, 60, 50, 90];
const planDistribution = [
  { key: 'Premium', pct: 65, count: '8 420 users', tone: 'pink' as const },
  { key: 'Free', pct: 28, count: '3 600 users', tone: 'gray' as const },
  { key: 'Gift', pct: 7, count: '827 users', tone: 'gold' as const },
];

export default function AdminPanel({ t }: { t: Dictionary['adminPanel'] }) {
  const [tab, setTab] = useState(0);
  const maxDay = Math.max(...newUsersByDay);

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <span className={scss.eyebrow}>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className={scss.headerRight}>
          <button className={scss.exportBtn}>{t.exportCsv}</button>
          <span className={scss.avatar}>A</span>
        </div>
      </div>

      <div className={scss.tabs}>
        {t.tabs.map((label, i) => (
          <button key={label} className={tab === i ? scss.tabActive : ''} onClick={() => setTab(i)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
          <div className={scss.stats}>
            <StatCard label={t.statTotalUsers} icon={Users} value="12,847" delta="+284 this week" />
            <StatCard label={t.statActiveProjects} icon={Folder} value="31,294" delta="+1,203 this week" />
            <StatCard label={t.statMonthlyRevenue} icon={TrendingUp} value="$48,320" delta="+12% vs last month" />
            <StatCard label={t.statTotalScans} icon={QrCode} value="2.4M" delta="+186K this week" />
          </div>

          <div className={scss.grid}>
            <div className={scss.chartCard}>
              <div className={scss.chartHeader}>
                <h2>{t.newUsersThisWeek}</h2>
                <span className={scss.chartDelta}>↑ 18%</span>
              </div>
              <div className={scss.bars}>
                {newUsersByDay.map((v, i) => (
                  <div key={i} className={scss.barCol}>
                    <div className={scss.bar} style={{ height: `${(v / maxDay) * 100}%` }} />
                    <span>{t.days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={scss.distCard}>
              <h2>{t.planDistribution}</h2>
              {planDistribution.map((d) => (
                <div key={d.key} className={scss.distRow}>
                  <div className={scss.distTop}>
                    <span>{d.key}</span>
                    <strong>{d.pct}%</strong>
                  </div>
                  <div className={scss.distBar}>
                    <div
                      className={`${scss.distFill} ${scss[d.tone]}`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className={scss.distCount}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={scss.grid}>
            <div className={scss.listCard}>
              <h2>
                {t.recentUsers} <span>{t.last7Days}</span>
              </h2>
              {recentUsers.map((u) => (
                <div key={u.name} className={scss.listRow}>
                  <span>{u.name}</span>
                  <span className={scss.muted}>
                    {u.projects} {t.projectsSuffix}
                  </span>
                  <Badge tone={u.plan === 'PREMIUM' ? 'pink' : u.plan === 'GIFT' ? 'gold' : 'gray'}>
                    {u.plan}
                  </Badge>
                  <span className={scss.muted}>{u.when}</span>
                </div>
              ))}
            </div>

            <div className={scss.listCard}>
              <h2>
                {t.recentPayments} <span>$48K {t.thisMonth}</span>
              </h2>
              {recentPayments.map((p, i) => (
                <div key={i} className={scss.listRow}>
                  <span className={scss.avatarSm}>{p.name[0]}</span>
                  <div className={scss.payInfo}>
                    <strong>{p.name}</strong>
                    <span>{p.plan}</span>
                  </div>
                  <span>${p.amount}</span>
                  <Badge tone={p.status === 'SUCCESS' ? 'green' : 'red'}>{p.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 1 && (
        <div className={scss.listCard}>
          <h2>{t.allUsers}</h2>
          {recentUsers.map((u) => (
            <div key={u.name} className={scss.listRow}>
              <span>{u.name}</span>
              <span className={scss.muted}>
                {u.projects} {t.projectsSuffix}
              </span>
              <Badge tone={u.plan === 'PREMIUM' ? 'pink' : u.plan === 'GIFT' ? 'gold' : 'gray'}>
                {u.plan}
              </Badge>
              <span className={scss.muted}>{u.when}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className={scss.listCard}>
          <h2>{t.allProjects}</h2>
          {projects.map((p) => (
            <div key={p.id} className={scss.listRow}>
              <span className={scss.thumb} style={{ background: p.gradient }} />
              <span>{p.name}</span>
              <span className={scss.muted}>
                {p.partnerA} & {p.partnerB}
              </span>
              <Badge>{p.status}</Badge>
              <span className={scss.muted}>{p.scans} scans</span>
            </div>
          ))}
        </div>
      )}

      {tab === 3 && (
        <div className={scss.listCard}>
          <h2>{t.allPayments}</h2>
          {recentPayments.map((p, i) => (
            <div key={i} className={scss.listRow}>
              <span className={scss.avatarSm}>{p.name[0]}</span>
              <div className={scss.payInfo}>
                <strong>{p.name}</strong>
                <span>{p.plan}</span>
              </div>
              <span>${p.amount}</span>
              <Badge tone={p.status === 'SUCCESS' ? 'green' : 'red'}>{p.status}</Badge>
            </div>
          ))}
        </div>
      )}

      {tab === 4 && (
        <div className={scss.templateGrid}>
          {templates.map((t2) => (
            <div key={t2.name} className={scss.templateCard}>
              <span style={{ background: t2.gradient }} />
              <strong>{t2.name}</strong>
              <p>{t2.mood}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 5 && (
        <div className={scss.stats}>
          <StatCard label={t.statAvgSession} icon={Clock} value="3:42" delta="+8% vs last month" />
          <StatCard label={t.statConversionRate} icon={Percent} value="4.8%" delta="+0.6% vs last month" />
          <StatCard label={t.statChurnRate} icon={TrendingDown} value="1.2%" delta="-0.3% vs last month" />
          <StatCard label={t.statQrScanRate} icon={QrCode} value="68%" delta="+5% vs last month" />
        </div>
      )}
    </div>
  );
}
