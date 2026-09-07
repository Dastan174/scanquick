'use client';

import { useState } from 'react';
import StatCard from '@/shared/ui/statCard/StatCard';
import Badge from '@/shared/ui/badge/Badge';
import { recentUsers, recentPayments, projects, templates } from '@/shared/lib/mockData';
import scss from './adminPanel.module.scss';

const tabs = ['Overview', 'Users', 'Projects', 'Payments', 'Templates', 'Analytics'] as const;
const newUsersByDay = [40, 55, 35, 65, 60, 50, 90];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const planDistribution = [
  { label: 'Premium', pct: 65, count: '8 420 users', tone: 'pink' as const },
  { label: 'Free', pct: 28, count: '3 600 users', tone: 'gray' as const },
  { label: 'Gift', pct: 7, count: '827 users', tone: 'gold' as const },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const maxDay = Math.max(...newUsersByDay);

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <span className={scss.eyebrow}>Admin Panel</span>
          <h1>LoveQR Dashboard</h1>
          <p>Platform overview · Last updated just now</p>
        </div>
        <div className={scss.headerRight}>
          <button className={scss.exportBtn}>Export CSV</button>
          <span className={scss.avatar}>A</span>
        </div>
      </div>

      <div className={scss.tabs}>
        {tabs.map((t) => (
          <button key={t} className={tab === t ? scss.tabActive : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <>
          <div className={scss.stats}>
            <StatCard label="Total Users" icon="◎" value="12,847" delta="+284 this week" />
            <StatCard label="Active Projects" icon="◈" value="31,294" delta="+1,203 this week" />
            <StatCard label="Monthly Revenue" icon="✦" value="$48,320" delta="+12% vs last month" />
            <StatCard label="Total Scans" icon="⊞" value="2.4M" delta="+186K this week" />
          </div>

          <div className={scss.grid}>
            <div className={scss.chartCard}>
              <div className={scss.chartHeader}>
                <h2>New Users This Week</h2>
                <span className={scss.chartDelta}>↑ 18%</span>
              </div>
              <div className={scss.bars}>
                {newUsersByDay.map((v, i) => (
                  <div key={i} className={scss.barCol}>
                    <div className={scss.bar} style={{ height: `${(v / maxDay) * 100}%` }} />
                    <span>{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={scss.distCard}>
              <h2>Plan Distribution</h2>
              {planDistribution.map((d) => (
                <div key={d.label} className={scss.distRow}>
                  <div className={scss.distTop}>
                    <span>{d.label}</span>
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
                Recent Users <span>Last 7 days</span>
              </h2>
              {recentUsers.map((u) => (
                <div key={u.name} className={scss.listRow}>
                  <span>{u.name}</span>
                  <span className={scss.muted}>{u.projects} projects</span>
                  <Badge tone={u.plan === 'PREMIUM' ? 'pink' : u.plan === 'GIFT' ? 'gold' : 'gray'}>
                    {u.plan}
                  </Badge>
                  <span className={scss.muted}>{u.when}</span>
                </div>
              ))}
            </div>

            <div className={scss.listCard}>
              <h2>
                Recent Payments <span>$48K this month</span>
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

      {tab === 'Users' && (
        <div className={scss.listCard}>
          <h2>All Users</h2>
          {recentUsers.map((u) => (
            <div key={u.name} className={scss.listRow}>
              <span>{u.name}</span>
              <span className={scss.muted}>{u.projects} projects</span>
              <Badge tone={u.plan === 'PREMIUM' ? 'pink' : u.plan === 'GIFT' ? 'gold' : 'gray'}>
                {u.plan}
              </Badge>
              <span className={scss.muted}>{u.when}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Projects' && (
        <div className={scss.listCard}>
          <h2>All Projects</h2>
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

      {tab === 'Payments' && (
        <div className={scss.listCard}>
          <h2>All Payments</h2>
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

      {tab === 'Templates' && (
        <div className={scss.templateGrid}>
          {templates.map((t) => (
            <div key={t.name} className={scss.templateCard}>
              <span style={{ background: t.gradient }} />
              <strong>{t.name}</strong>
              <p>{t.mood}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Analytics' && (
        <div className={scss.stats}>
          <StatCard label="Avg. Session" icon="◷" value="3:42" delta="+8% vs last month" />
          <StatCard label="Conversion Rate" icon="✦" value="4.8%" delta="+0.6% vs last month" />
          <StatCard label="Churn Rate" icon="◈" value="1.2%" delta="-0.3% vs last month" />
          <StatCard label="QR Scan Rate" icon="⊞" value="68%" delta="+5% vs last month" />
        </div>
      )}
    </div>
  );
}
