// Registry of polaroid-style cover designs — a background image with one
// photo slot (as opposed to collageTemplates.ts, which has several). Slot
// coordinates were measured pixel-precise the same way: the slot area is
// filled with a solid color in the source design, flood-filled from a
// sample point to get an exact bounding box, then expressed as a % of the
// canvas. `backdropColor` is the image's own edge tone, sampled the same
// way — used to letterbox the cover so it never crops the polaroid itself
// on phone aspect ratios much taller/narrower than the 1080x1350 canvas.

export interface CoverSlot {
  x: number; // % from left of the canvas
  y: number; // % from top of the canvas
  width: number; // % of canvas width
  height: number; // % of canvas height
}

export interface CoverTemplate {
  id: string;
  label: string;
  background: string; // path under /public
  backdropColor: string;
  canvasWidth: number;
  canvasHeight: number;
  slot: CoverSlot;
}

export const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: 'open-first',
    label: 'Полароид',
    background: '/templates/open-first.webp',
    backdropColor: '#f5f4ed',
    canvasWidth: 1080,
    canvasHeight: 1350,
    slot: { x: 27.04, y: 23.78, width: 45.09, height: 35.93 },
  },
  {
    id: 'open-second',
    label: 'Полароид на прищепке',
    background: '/templates/open-second.webp',
    backdropColor: '#ffcdd5',
    canvasWidth: 1080,
    canvasHeight: 1350,
    slot: { x: 24.63, y: 27.04, width: 50.74, height: 38.59 },
  },
];

export function getCoverTemplate(id: string | undefined): CoverTemplate | undefined {
  return COVER_TEMPLATES.find((t) => t.id === id);
}

export function coverSlotAspectRatio(template: CoverTemplate): string {
  const widthPx = (template.slot.width / 100) * template.canvasWidth;
  const heightPx = (template.slot.height / 100) * template.canvasHeight;
  return `${widthPx} / ${heightPx}`;
}
