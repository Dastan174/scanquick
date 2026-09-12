// Bakes the same frame/heart-badge/watermark look shown on the QR page
// (see QrCodePage.tsx's CSS-decorated <QrArt>) directly into the file the
// owner downloads, so the watermark survives outside the app too.
import sharp from 'sharp';

const CANVAS_W = 640;
const CANVAS_H = 680;
const FRAME_SIZE = 640;
const FRAME_RADIUS = 56;
const PANEL_INSET = 32;
const PANEL_SIZE = FRAME_SIZE - PANEL_INSET * 2;
const PANEL_RADIUS = 40;
const QR_INSET = 48;
const QR_SIZE = PANEL_SIZE - QR_INSET * 2;
const QR_POS = PANEL_INSET + QR_INSET;
const HEART_CX = FRAME_SIZE / 2;
const HEART_CY = FRAME_SIZE / 2;
const HEART_R = 46;
const HEART_GLYPH = 24;
const PILL_W = 220;
const PILL_H = 56;
const PILL_X = FRAME_SIZE - 16 - PILL_W;
const PILL_Y = FRAME_SIZE - 30;
const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

// Lucide's "sparkle" icon (24x24 viewBox) — matches the ✦ shown next to the
// watermark on the QR page's own CSS-rendered preview.
const SPARKLE_GLYPH = 24;
const SPARKLE_PATH =
  'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z';

// "scanquick.kg" pre-rendered to path data (Arial Bold, 26px) instead of an
// SVG <text> element — sharp's bundled rsvg needs an actual font file to
// rasterize <text>, and serverless runtimes (Vercel) don't ship one, so the
// watermark silently vanished from downloaded files even though it rendered
// fine in local dev. A path has no font dependency at all, so it always
// renders identically everywhere. Baseline sits at y=0; left edge at x=0.
const WATERMARK_TEXT_WIDTH = 164.73;
const WATERMARK_TEXT_PATH =
  'M0.61-3.85L4.19-4.39Q4.42-3.35 5.12-2.81Q5.81-2.27 7.07-2.27Q8.46-2.27 9.15-2.78Q9.62-3.14 9.62-3.73Q9.62-4.14 9.37-4.41Q9.10-4.66 8.18-4.87Q3.86-5.83 2.70-6.61Q1.10-7.71 1.10-9.65Q1.10-11.40 2.49-12.59Q3.87-13.79 6.78-13.79Q9.55-13.79 10.89-12.89Q12.24-11.98 12.75-10.22L9.38-9.60Q9.17-10.38 8.56-10.80Q7.96-11.22 6.84-11.22Q5.43-11.22 4.82-10.83Q4.42-10.55 4.42-10.11Q4.42-9.72 4.77-9.46Q5.26-9.10 8.11-8.46Q10.96-7.81 12.09-6.87Q13.20-5.92 13.20-4.21Q13.20-2.36 11.65-1.03Q10.11 0.30 7.07 0.30Q4.32 0.30 2.71-0.81Q1.10-1.93 0.61-3.85M28.08-9.50L24.57-8.86Q24.39-9.92 23.76-10.45Q23.13-10.98 22.13-10.98Q20.79-10.98 20-10.06Q19.21-9.14 19.21-6.98Q19.21-4.58 20.01-3.59Q20.82-2.60 22.18-2.60Q23.19-2.60 23.84-3.18Q24.49-3.76 24.76-5.17L28.26-4.57Q27.71-2.16 26.17-0.93Q24.62 0.30 22.01 0.30Q19.06 0.30 17.30-1.56Q15.54-3.43 15.54-6.73Q15.54-10.07 17.30-11.93Q19.07-13.79 22.08-13.79Q24.54-13.79 25.99-12.73Q27.45-11.67 28.08-9.50M33.45-9.37L30.21-9.95Q30.76-11.91 32.09-12.85Q33.43-13.79 36.05-13.79Q38.44-13.79 39.61-13.22Q40.78-12.66 41.25-11.79Q41.73-10.92 41.73-8.59L41.69-4.43Q41.69-2.65 41.86-1.81Q42.03-0.96 42.50 0L38.97 0Q38.83-0.36 38.63-1.05Q38.54-1.37 38.50-1.47Q37.59-0.58 36.55-0.14Q35.51 0.30 34.33 0.30Q32.25 0.30 31.05-0.83Q29.85-1.96 29.85-3.68Q29.85-4.82 30.39-5.72Q30.94-6.61 31.92-7.09Q32.91-7.57 34.76-7.92Q37.26-8.39 38.23-8.80L38.23-9.15Q38.23-10.18 37.72-10.62Q37.21-11.06 35.80-11.06Q34.85-11.06 34.32-10.68Q33.78-10.31 33.45-9.37M38.23-5.76L38.23-6.47Q37.54-6.25 36.05-5.93Q34.57-5.61 34.11-5.31Q33.41-4.81 33.41-4.05Q33.41-3.30 33.97-2.75Q34.53-2.21 35.39-2.21Q36.36-2.21 37.24-2.84Q37.88-3.33 38.09-4.02Q38.23-4.48 38.23-5.76M57.51-8.38L57.51 0L53.94 0L53.94-6.88Q53.94-9.06 53.71-9.71Q53.49-10.35 52.97-10.70Q52.46-11.06 51.73-11.06Q50.81-11.06 50.07-10.55Q49.33-10.04 49.06-9.20Q48.79-8.37 48.79-6.11L48.79 0L45.22 0L45.22-13.48L48.53-13.48L48.53-11.50Q50.30-13.79 52.98-13.79Q54.16-13.79 55.14-13.36Q56.11-12.94 56.61-12.28Q57.12-11.62 57.31-10.78Q57.51-9.94 57.51-8.38M73.51 5.13L69.94 5.13L69.94-1.65Q69.24-0.75 68.20-0.22Q67.16 0.30 65.95 0.30Q63.65 0.30 62.17-1.42Q60.42-3.44 60.42-6.89Q60.42-10.14 62.06-11.97Q63.71-13.79 66.14-13.79Q67.49-13.79 68.47-13.22Q69.46-12.64 70.22-11.49L70.22-13.48L73.51-13.48L73.51 5.13M70.05-6.91Q70.05-8.98 69.21-9.98Q68.36-10.99 67.09-10.99Q65.80-10.99 64.93-9.97Q64.06-8.94 64.06-6.70Q64.06-4.48 64.90-3.50Q65.74-2.51 66.97-2.51Q68.20-2.51 69.13-3.62Q70.05-4.72 70.05-6.91M89.20 0L85.88 0L85.88-2.02Q85.15-0.94 83.95-0.32Q82.75 0.30 81.42 0.30Q80.06 0.30 78.98-0.29Q77.90-0.89 77.42-1.97Q76.93-3.05 76.93-4.95L76.93-13.48L80.50-13.48L80.50-7.29Q80.50-4.44 80.70-3.80Q80.89-3.16 81.42-2.79Q81.94-2.41 82.74-2.41Q83.65-2.41 84.37-2.91Q85.10-3.42 85.36-4.16Q85.63-4.90 85.63-7.79L85.63-13.48L89.20-13.48L89.20 0M96.46-15.31L92.89-15.31L92.89-18.61L96.46-18.61L96.46-15.31M96.46 0L92.89 0L92.89-13.48L96.46-13.48L96.46 0M111.87-9.50L108.35-8.86Q108.18-9.92 107.55-10.45Q106.92-10.98 105.92-10.98Q104.58-10.98 103.79-10.06Q103-9.14 103-6.98Q103-4.58 103.80-3.59Q104.61-2.60 105.97-2.60Q106.98-2.60 107.63-3.18Q108.28-3.76 108.54-5.17L112.05-4.57Q111.50-2.16 109.95-0.93Q108.41 0.30 105.80 0.30Q102.84 0.30 101.09-1.56Q99.33-3.43 99.33-6.73Q99.33-10.07 101.09-11.93Q102.86-13.79 105.87-13.79Q108.33-13.79 109.78-12.73Q111.24-11.67 111.87-9.50M118.02 0L114.45 0L114.45-18.61L118.02-18.61L118.02-8.73L122.19-13.48L126.58-13.48L121.98-8.56L126.92 0L123.07 0L119.68-6.06L118.02-4.32L118.02 0M132.60 0L129.04 0L129.04-3.57L132.60-3.57L132.60 0M139.70 0L136.13 0L136.13-18.61L139.70-18.61L139.70-8.73L143.88-13.48L148.27-13.48L143.66-8.56L148.60 0L144.75 0L141.36-6.06L139.70-4.32L139.70 0M150.39 0.89L154.46 1.38Q154.57 2.09 154.93 2.36Q155.44 2.74 156.53 2.74Q157.93 2.74 158.63 2.32Q159.10 2.04 159.34 1.42Q159.50 0.98 159.50-0.22L159.50-2.18Q157.90 0 155.47 0Q152.75 0 151.16-2.30Q149.92-4.11 149.92-6.82Q149.92-10.21 151.55-12Q153.18-13.79 155.61-13.79Q158.11-13.79 159.73-11.59L159.73-13.48L163.07-13.48L163.07-1.38Q163.07 1 162.68 2.18Q162.28 3.36 161.57 4.04Q160.86 4.71 159.68 5.09Q158.49 5.47 156.67 5.47Q153.25 5.47 151.81 4.30Q150.38 3.12 150.38 1.32Q150.38 1.14 150.39 0.89M153.58-7.02Q153.58-4.87 154.41-3.88Q155.24-2.88 156.46-2.88Q157.76-2.88 158.67-3.90Q159.57-4.93 159.57-6.93Q159.57-9.03 158.70-10.04Q157.84-11.06 156.52-11.06Q155.24-11.06 154.41-10.06Q153.58-9.06 153.58-7.02';

function extractSvgInner(svg: string): { viewBox: string; inner: string } {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return {
    viewBox: viewBoxMatch?.[1] ?? '0 0 100 100',
    inner: innerMatch?.[1] ?? '',
  };
}

export function buildQrCompositeSvg(qrSvgMarkup: string): string {
  const { viewBox, inner } = extractSvgInner(qrSvgMarkup);
  const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);
  // A <g scale> instead of nesting a second <svg viewBox="…"> — nested SVG
  // viewBox handling is inconsistent across the rsvg/resvg versions
  // different platforms bundle with sharp, one likely source of the
  // distorted QR pattern in downloaded files.
  const qrScale = vbW > 0 ? QR_SIZE / vbW : 1;
  const qrScaleY = vbH > 0 ? QR_SIZE / vbH : qrScale;

  const heartScale = (HEART_R * 1.1) / HEART_GLYPH;
  const heartOffset = (HEART_GLYPH * heartScale) / 2;

  const iconSize = 20;
  const gap = 8;
  const contentWidth = iconSize + gap + WATERMARK_TEXT_WIDTH;
  const contentStartX = PILL_X + (PILL_W - contentWidth) / 2;
  const iconScale = iconSize / SPARKLE_GLYPH;
  const iconY = PILL_Y + PILL_H / 2 - iconSize / 2;
  const textX = contentStartX + iconSize + gap;
  const textBaselineY = PILL_Y + PILL_H / 2 + 9;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <defs>
    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4607a" />
      <stop offset="100%" stop-color="#e78399" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${FRAME_SIZE}" height="${FRAME_SIZE}" rx="${FRAME_RADIUS}" fill="url(#frameGrad)" />
  <rect x="${PANEL_INSET}" y="${PANEL_INSET}" width="${PANEL_SIZE}" height="${PANEL_SIZE}" rx="${PANEL_RADIUS}" fill="#ffffff" />
  <g transform="translate(${QR_POS}, ${QR_POS}) scale(${qrScale}, ${qrScaleY})">${inner}</g>
  <circle cx="${HEART_CX}" cy="${HEART_CY}" r="${HEART_R}" fill="#fdf0f3" fill-opacity="0.95" />
  <g transform="translate(${HEART_CX - heartOffset}, ${HEART_CY - heartOffset}) scale(${heartScale})">
    <path d="${HEART_PATH}" fill="#d4607a" />
  </g>
  <rect x="${PILL_X}" y="${PILL_Y}" width="${PILL_W}" height="${PILL_H}" rx="${PILL_H / 2}" fill="url(#frameGrad)" />
  <g transform="translate(${contentStartX}, ${iconY}) scale(${iconScale})">
    <path d="${SPARKLE_PATH}" fill="#ffffff" />
  </g>
  <g transform="translate(${textX}, ${textBaselineY})">
    <path d="${WATERMARK_TEXT_PATH}" fill="#ffffff" />
  </g>
</svg>`;
}

export async function qrCompositeToPngBuffer(compositeSvg: string): Promise<Buffer> {
  return sharp(Buffer.from(compositeSvg)).png().toBuffer();
}
