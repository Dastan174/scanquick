import Link from 'next/link';
import StatCard from '@/shared/ui/statCard/StatCard';
import type { Project } from '@/shared/lib/mockData';
import scss from './qrCodePage.module.scss';

const recentScans = [
  { place: 'Paris, France', device: 'iPhone 15', when: '2 hours ago' },
  { place: 'Milan, Italy', device: 'Samsung S24', when: 'Yesterday' },
  { place: 'New York, US', device: 'iPhone 14 Pro', when: '3 days ago' },
  { place: 'London, UK', device: 'Pixel 8', when: '5 days ago' },
];

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

export default function QrCodePage({ project }: { project: Project }) {
  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <Link href={`/projects/${project.id}/edit`} className={scss.back}>
            ‹ Back to Editor
          </Link>
          <h1>Your QR Code</h1>
          <p>{project.name} · Share this code to reveal the surprise</p>
        </div>
        <div className={scss.headerActions}>
          <Link href={`/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer">
            ▷ Preview Site
          </Link>
          <Link href={`/projects/${project.id}/settings`}>Settings</Link>
        </div>
      </div>

      <div className={scss.grid}>
        <div className={scss.qrCard}>
          <span className={scss.liveTag}>● Live — Scan to open</span>
          <QrGrid />
          <p>Your love story lives at</p>
          <strong>loveqr.co/{project.slug ?? 'draft'}</strong>
          <div className={scss.downloads}>
            <button>⬇ Download PNG</button>
            <button>⬇ Download SVG</button>
          </div>
          <div className={scss.downloads}>
            <button>⊞ Copy Link</button>
            <button>↗ Share</button>
          </div>
          <div className={scss.tips}>
            <strong>✦ Print Tips</strong>
            <p>
              For best results, print at minimum 2×2 cm (0.8 inches). Download the SVG for crisp
              printing at any size. White background required for scanning.
            </p>
          </div>
        </div>

        <div className={scss.side}>
          <div className={scss.analyticsCard}>
            <h2>Scan Analytics</h2>
            <div className={scss.statsGrid}>
              <StatCard label="Total Scans" icon="⊞" value={String(project.scans)} delta="" />
              <StatCard label="This Week" icon="↑" value="42" delta="" />
              <StatCard label="Countries" icon="◎" value="8" delta="" />
              <StatCard label="Avg. Time" icon="◷" value="4:32" delta="" />
            </div>
          </div>

          <div className={scss.scansCard}>
            <h2>Recent Scans</h2>
            {recentScans.map((s) => (
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
            <strong>Get it framed</strong>
            <p>Premium prints with your QR code in a beautiful gift frame. Arrives in 5–7 days.</p>
            <Link href="/upgrade">Order Frame — $29 →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
