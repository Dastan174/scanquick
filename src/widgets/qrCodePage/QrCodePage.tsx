import Link from 'next/link';
import StatCard from '@/shared/ui/statCard/StatCard';
import type { Project } from '@/shared/lib/mockData';
import { getT, getLocale } from '@/shared/lib/i18n/locale';
import { qrSubtitle } from '@/shared/lib/i18n/format';
import scss from './qrCodePage.module.scss';

function QrGrid() {
  const cells = Array.from({ length: 121 }, (_, i) => {
    const row = Math.floor(i / 11);
    const col = i % 11;
    const isCenter = row >= 4 && row <= 6 && col >= 4 && col <= 6;
    const on = isCenter ? false : (row * 7 + col * 13) % 5 !== 0;
    return { on, tone: (row + col) % 3 === 0 };
  });

  return (
    <div className={scss.qrGrid}>
      {cells.map((c, i) => (
        <span key={i} className={c.on ? (c.tone ? scss.cellPink : scss.cellDark) : ''} />
      ))}
      <span className={scss.qrHeart}>♥</span>
    </div>
  );
}

export default async function QrCodePage({ project }: { project: Project }) {
  const [fullT, locale] = await Promise.all([getT(), getLocale()]);
  const t = fullT.qrCodePage;

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <Link href={`/projects/${project.id}/edit`} className={scss.back}>
            {t.backToEditor}
          </Link>
          <h1>{t.title}</h1>
          <p>{qrSubtitle(locale, project.name)}</p>
        </div>
        <div className={scss.headerActions}>
          <Link href={`/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer">
            {t.previewSite}
          </Link>
          <Link href={`/projects/${project.id}/settings`}>{t.settings}</Link>
        </div>
      </div>

      <div className={scss.grid}>
        <div className={scss.qrCard}>
          <span className={scss.liveTag}>{t.liveTag}</span>
          <QrGrid />
          <p>{t.livesAt}</p>
          <strong>loveqr.co/{project.slug ?? 'draft'}</strong>
          <div className={scss.downloads}>
            <button>{t.downloadPng}</button>
            <button>{t.downloadSvg}</button>
          </div>
          <div className={scss.downloads}>
            <button>{t.copyLink}</button>
            <button>{t.share}</button>
          </div>
          <div className={scss.tips}>
            <strong>{t.printTips}</strong>
            <p>{t.printTipsBody}</p>
          </div>
        </div>

        <div className={scss.side}>
          <div className={scss.analyticsCard}>
            <h2>{t.scanAnalytics}</h2>
            <div className={scss.statsGrid}>
              <StatCard label={t.statTotalScans} icon="⊞" value={String(project.scans)} delta="" />
              <StatCard label={t.statThisWeek} icon="↑" value="42" delta="" />
              <StatCard label={t.statCountries} icon="◎" value="8" delta="" />
              <StatCard label={t.statAvgTime} icon="◷" value="4:32" delta="" />
            </div>
          </div>

          <div className={scss.scansCard}>
            <h2>{t.recentScans}</h2>
            {t.scanRows.map((s) => (
              <div key={s.place} className={scss.scanRow}>
                <div>
                  <strong>{s.place}</strong>
                  <span>{s.device}</span>
                </div>
                <span className={scss.when}>{s.when}</span>
              </div>
            ))}
          </div>

          <div className={scss.frameUpsell}>
            <span>🖼</span>
            <strong>{t.getFramed}</strong>
            <p>{t.frameDescr}</p>
            <Link href="/upgrade">{t.orderFrame}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
