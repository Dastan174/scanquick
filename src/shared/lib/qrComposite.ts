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
  const heartScale = (HEART_R * 1.1) / HEART_GLYPH;
  const heartOffset = (HEART_GLYPH * heartScale) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <defs>
    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4607a" />
      <stop offset="100%" stop-color="#e78399" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${FRAME_SIZE}" height="${FRAME_SIZE}" rx="${FRAME_RADIUS}" fill="url(#frameGrad)" />
  <rect x="${PANEL_INSET}" y="${PANEL_INSET}" width="${PANEL_SIZE}" height="${PANEL_SIZE}" rx="${PANEL_RADIUS}" fill="#ffffff" />
  <svg x="${QR_POS}" y="${QR_POS}" width="${QR_SIZE}" height="${QR_SIZE}" viewBox="${viewBox}">${inner}</svg>
  <circle cx="${HEART_CX}" cy="${HEART_CY}" r="${HEART_R}" fill="#fdf0f3" fill-opacity="0.95" />
  <g transform="translate(${HEART_CX - heartOffset}, ${HEART_CY - heartOffset}) scale(${heartScale})">
    <path d="${HEART_PATH}" fill="#d4607a" />
  </g>
  <rect x="${PILL_X}" y="${PILL_Y}" width="${PILL_W}" height="${PILL_H}" rx="${PILL_H / 2}" fill="url(#frameGrad)" />
  <text x="${PILL_X + PILL_W / 2}" y="${PILL_Y + PILL_H / 2 + 9}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="26" fill="#ffffff">&#10022; scanquick.kg</text>
</svg>`;
}

export async function qrCompositeToPngBuffer(compositeSvg: string): Promise<Buffer> {
  return sharp(Buffer.from(compositeSvg)).png().toBuffer();
}
