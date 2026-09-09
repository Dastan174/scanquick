import Link from 'next/link';
import QRCode from 'qrcode';
import {
  ChevronLeft,
  Clock,
  Download,
  Frame,
  Globe,
  Heart,
  Link2,
  Share2,
  Sparkle,
  TrendingUp,
} from 'lucide-react';
import StatCard from '@/shared/ui/statCard/StatCard';
import type { Project } from '@/shared/lib/mockData';
import { getT, getLocale } from '@/shared/lib/i18n/locale';
import { qrSubtitle } from '@/shared/lib/i18n/format';
import { getSiteUrl } from '@/shared/lib/siteUrl';
import { buildQrCompositeSvg, qrCompositeToPngBuffer } from '@/shared/lib/qrComposite';
import scss from './qrCodePage.module.scss';

// Dark modules on a transparent background, so the white qrGrid panel shows
// through — real QR readers need this much contrast to scan reliably, even
// with the heart badge sitting on top (errorCorrectionLevel 'H' tolerates it).
const QR_COLOR = { dark: '#221512', light: '#00000000' };

function QrArt({ pngDataUrl }: { pngDataUrl: string }) {
  return (
    <div className={scss.qrStage}>
      <span className={scss.qrGlow} />
      <span className={`${scss.sparkle} ${scss.sparkleTopLeft}`}>
        <Sparkle size={18} />
      </span>
      <span className={`${scss.sparkle} ${scss.sparkleTopRight}`}>
        <Heart size={14} />
      </span>
      <span className={`${scss.sparkle} ${scss.sparkleBottomLeft}`}>
        <Sparkle size={14} />
      </span>
      <div className={scss.qrFrame}>
        <div className={scss.qrGrid}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pngDataUrl} alt="QR code" className={scss.qrImg} />
          <span className={scss.qrHeart}>
            <Heart size={18} fill="currentColor" />
          </span>
        </div>
        <span className={scss.watermark}>
          <Sparkle size={13} />
          scanquick.kg
        </span>
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
        QRCode.toDataURL(targetUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 512,
          color: QR_COLOR,
        }),
        QRCode.toString(targetUrl, {
          type: 'svg',
          errorCorrectionLevel: 'H',
          margin: 1,
          color: QR_COLOR,
        }),
      ])
    : [null, null];

  // The downloaded files carry the same frame/heart/watermark as the page's
  // decorated preview (which does it with CSS) baked into the pixels/markup,
  // so the branding survives once the QR leaves the app.
  const compositeSvg = svgMarkup ? buildQrCompositeSvg(svgMarkup) : null;
  const compositeSvgDataUrl = compositeSvg
    ? `data:image/svg+xml;utf8,${encodeURIComponent(compositeSvg)}`
    : null;
  const compositePngDataUrl = compositeSvg
    ? `data:image/png;base64,${(await qrCompositeToPngBuffer(compositeSvg)).toString('base64')}`
    : null;

  return (
    <div className={scss.page}>
      <div className={scss.header}>
        <div>
          <Link href={`/projects/${project.id}/edit`} className={scss.back}>
            <ChevronLeft size={14} />
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
          {pngDataUrl ? (
            <QrArt pngDataUrl={pngDataUrl} />
          ) : (
            <p className={scss.noSlug}>{t.noSlug}</p>
          )}
          <p>{t.livesAt}</p>
          <strong>{targetUrl ? targetUrl.replace(/^https?:\/\//, '') : '—'}</strong>
          <div className={scss.downloads}>
            {compositePngDataUrl ? (
              <a href={compositePngDataUrl} download={`${project.slug}-qr.png`}>
                <Download size={14} />
                {t.downloadPng}
              </a>
            ) : (
              <button disabled>
                <Download size={14} />
                {t.downloadPng}
              </button>
            )}
            {compositeSvgDataUrl ? (
              <a href={compositeSvgDataUrl} download={`${project.slug}-qr.svg`}>
                <Download size={14} />
                {t.downloadSvg}
              </a>
            ) : (
              <button disabled>
                <Download size={14} />
                {t.downloadSvg}
              </button>
            )}
          </div>
          <div className={scss.downloads}>
            <button>
              <Link2 size={14} />
              {t.copyLink}
            </button>
            <button>
              <Share2 size={14} />
              {t.share}
            </button>
          </div>
          <div className={scss.tips}>
            <strong>
              <Sparkle size={14} />
              {t.printTips}
            </strong>
            <p>{t.printTipsBody}</p>
          </div>
        </div>

        <div className={scss.side}>
          <div className={scss.analyticsCard}>
            <h2>{t.scanAnalytics}</h2>
            <div className={scss.statsGrid}>
              <StatCard
                label={t.statTotalScans}
                icon={Link2}
                value={String(project.scans)}
                delta=""
              />
              <StatCard label={t.statThisWeek} icon={TrendingUp} value="42" delta="" />
              <StatCard label={t.statCountries} icon={Globe} value="8" delta="" />
              <StatCard label={t.statAvgTime} icon={Clock} value="4:32" delta="" />
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
            <span>
              <Frame size={28} />
            </span>
            <strong>{t.getFramed}</strong>
            <p>{t.frameDescr}</p>
            <Link href="/upgrade">{t.orderFrame}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
