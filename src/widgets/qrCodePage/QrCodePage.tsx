import Link from 'next/link';
import QRCode from 'qrcode';
import StatCard from '@/shared/ui/statCard/StatCard';
import type { Project } from '@/shared/lib/mockData';
import { getT, getLocale } from '@/shared/lib/i18n/locale';
import { qrSubtitle } from '@/shared/lib/i18n/format';
import { getSiteUrl } from '@/shared/lib/siteUrl';
import scss from './qrCodePage.module.scss';

// Dark modules on a transparent background, so the white qrGrid panel shows
// through — real QR readers need this much contrast to scan reliably, even
// with the heart badge sitting on top (errorCorrectionLevel 'H' tolerates it).
const QR_COLOR = { dark: '#221512', light: '#00000000' };

function QrArt({ pngDataUrl }: { pngDataUrl: string }) {
  return (
    <div className={scss.qrStage}>
      <span className={scss.qrGlow} />
      <span className={`${scss.sparkle} ${scss.sparkleTopLeft}`}>✦</span>
      <span className={`${scss.sparkle} ${scss.sparkleTopRight}`}>💗</span>
      <span className={`${scss.sparkle} ${scss.sparkleBottomLeft}`}>✧</span>
      <div className={scss.qrFrame}>
        <div className={scss.qrGrid}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pngDataUrl} alt="QR code" className={scss.qrImg} />
          <span className={scss.qrHeart}>♥</span>
        </div>
        <span className={scss.watermark}>✦ scanquick.kg</span>
      </div>
    </div>
  );
}

export default async function QrCodePage({ project }: { project: Project }) {
  const [fullT, locale] = await Promise.all([getT(), getLocale()]);
  const t = fullT.qrCodePage;

  // Only a saved project has a slug to point the QR at — createProject
  // always sets one immediately, so this is really just a defensive fallback.
  const targetUrl = project.slug ? `${getSiteUrl()}/view/${project.slug}` : null;
  const [pngDataUrl, svgMarkup] = targetUrl
    ? await Promise.all([
        QRCode.toDataURL(targetUrl, { errorCorrectionLevel: 'H', margin: 1, width: 512, color: QR_COLOR }),
        QRCode.toString(targetUrl, { type: 'svg', errorCorrectionLevel: 'H', margin: 1, color: QR_COLOR }),
      ])
    : [null, null];
  const svgDataUrl = svgMarkup ? `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}` : null;

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
          {pngDataUrl ? <QrArt pngDataUrl={pngDataUrl} /> : <p className={scss.noSlug}>{t.noSlug}</p>}
          <p>{t.livesAt}</p>
          <strong>{targetUrl ? targetUrl.replace(/^https?:\/\//, '') : '—'}</strong>
          <div className={scss.downloads}>
            {pngDataUrl ? (
              <a href={pngDataUrl} download={`${project.slug}-qr.png`}>
                {t.downloadPng}
              </a>
            ) : (
              <button disabled>{t.downloadPng}</button>
            )}
            {svgDataUrl ? (
              <a href={svgDataUrl} download={`${project.slug}-qr.svg`}>
                {t.downloadSvg}
              </a>
            ) : (
              <button disabled>{t.downloadSvg}</button>
            )}
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
