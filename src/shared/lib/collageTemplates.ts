// Registry of Canva-designed collage backgrounds with marked photo slots.
// Adding a new design is just a new entry here (background image + slot
// rectangles) — no new component or editor code needed.

export interface CollageSlot {
  id: string;
  x: number; // % from left of the canvas
  y: number; // % from top of the canvas
  width: number; // % of canvas width
  height: number; // % of canvas height
  rotate?: number; // degrees, matches the tilt of the frame in the design
}

export interface CollageTemplate {
  id: string;
  label: string;
  background: string; // path under /public
  canvasWidth: number; // px, from the exported design — used to derive slot aspect ratios
  canvasHeight: number;
  slots: CollageSlot[];
}

export const COLLAGE_TEMPLATES: CollageTemplate[] = [
  {
    id: 'polaroid-duo',
    label: 'Два полароида',
    background: '/templates/template.webp',
    canvasWidth: 1080,
    canvasHeight: 1080,
    // Measured pixel-precise from a marker pass over the design (photo
    // areas filled solid black, detected via connected-component + min-area
    // rotated-rectangle analysis), then padded 3px on every side so the
    // photo fully covers the original shape's anti-aliased edge instead of
    // leaving a hairline of the marker color visible around it.
    slots: [
      { id: 'photo-1', x: 14.06, y: 16.64, width: 34.85, height: 32.49, rotate: -5.38 },
      { id: 'photo-2', x: 53.28, y: 46.45, width: 34.99, height: 32.47, rotate: 6.54 },
    ],
  },
  {
    id: 'bold-love',
    label: 'Смелая любовь',
    background: '/templates/template-love.png',
    canvasWidth: 1080,
    canvasHeight: 1350,
    // Same measurement approach, but segmented by each shape's own fill
    // color (not just foreground/background) since the two red blocks and
    // the coral block all touch each other in this design. Also padded 3px
    // per side to cover the anti-aliased edges.
    slots: [
      { id: 'photo-1', x: 9.72, y: 7.78, width: 59.72, height: 35.63 },
      { id: 'photo-2', x: 46.3, y: 32.22, width: 43.89, height: 42.3 },
      { id: 'photo-3', x: 17.87, y: 56.52, width: 37.22, height: 35.56 },
    ],
  },
];

export function getCollageTemplate(id: string | undefined): CollageTemplate {
  return COLLAGE_TEMPLATES.find((t) => t.id === id) ?? COLLAGE_TEMPLATES[0];
}

export function slotAspectRatio(slot: CollageSlot, template: CollageTemplate): string {
  const widthPx = (slot.width / 100) * template.canvasWidth;
  const heightPx = (slot.height / 100) * template.canvasHeight;
  return `${widthPx} / ${heightPx}`;
}
