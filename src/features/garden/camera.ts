/** Cameraberekeningen (§8.3): overzicht, zone en close-up. Puur en getest. */
import { WORLD, ZONES } from './world';

export interface Camera {
  /** Wereldpunt in het midden van het scherm. */
  x: number;
  y: number;
  scale: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface Region {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export type CameraMode =
  | { kind: 'overzicht' }
  | { kind: 'zone'; zone: number }
  | { kind: 'closeup'; zone: number; x: number; y: number; size: number }
  | { kind: 'regio'; zone: number; region: Region };

const BAND_CENTER = (WORLD.bandTop + WORLD.bandBottom) / 2;
const BAND_HEIGHT = WORLD.bandBottom - WORLD.bandTop;
const ZONE_MARGIN = 120;

export const MAX_ZOOM = 4.2;

export function zoneScale(vp: Viewport): number {
  const zoneWidth = ZONES[0]!.x1 - ZONES[0]!.x0 + ZONE_MARGIN;
  return Math.min(vp.width / zoneWidth, vp.height / BAND_HEIGHT);
}

/** Een rechthoek in de wereld zo groot mogelijk in beeld. */
export function regionCamera(vp: Viewport, r: Region, maxScale = MAX_ZOOM): Camera {
  const scale = Math.min(maxScale, vp.width / (r.x1 - r.x0), vp.height / (r.y1 - r.y0));
  return { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2, scale };
}

export function overviewCamera(vp: Viewport): Camera {
  const scale = Math.min(vp.width / (WORLD.width + 80), vp.height / BAND_HEIGHT);
  return { x: WORLD.width / 2, y: BAND_CENTER, scale };
}

/**
 * Zone: de hele zone in beeld, verticaal ingekaderd op de inhoud. Zonder grote vriendjes is er
 * minder lucht nodig en komt alles dichterbij.
 */
export function zoneCamera(vp: Viewport, zone: number, contentTop: number = WORLD.horizon): Camera {
  const z = ZONES[Math.max(0, Math.min(ZONES.length - 1, zone))]!;
  const top = Math.min(contentTop, WORLD.horizon) - 40;
  return regionCamera(vp, {
    x0: z.x0 - ZONE_MARGIN / 2,
    x1: z.x1 + ZONE_MARGIN / 2,
    y0: top,
    y1: WORLD.bandBottom - 20,
  });
}

/** Close-up: het vriendje vult ongeveer 55% van de schermhoogte, met het dier links ernaast. */
export function closeupCamera(vp: Viewport, x: number, feetY: number, size: number): Camera {
  const s = Math.max(size, 60);
  const scale = Math.max(zoneScale(vp), Math.min(MAX_ZOOM, (vp.height * 0.55) / s));
  return { x: x - s * 0.32, y: feetY - s * 0.55, scale };
}

export function cameraFor(
  vp: Viewport,
  mode: CameraMode,
  contentTop: (zone: number) => number = () => WORLD.horizon,
): Camera {
  switch (mode.kind) {
    case 'overzicht':
      return overviewCamera(vp);
    case 'zone':
      return zoneCamera(vp, mode.zone, contentTop(mode.zone));
    case 'closeup':
      return closeupCamera(vp, mode.x, mode.y, mode.size);
    case 'regio':
      return regionCamera(vp, mode.region);
  }
}

/** CSS-transform voor de wereldlaag (transform-origin 0 0). */
export function worldTransform(cam: Camera, vp: Viewport): string {
  const tx = vp.width / 2 - cam.x * cam.scale;
  const ty = vp.height / 2 - cam.y * cam.scale;
  return `translate3d(${tx}px, ${ty}px, 0) scale(${cam.scale})`;
}

/** Schermpunt naar wereldpunt. */
export function screenToWorld(
  cam: Camera,
  vp: Viewport,
  sx: number,
  sy: number,
): { x: number; y: number } {
  return {
    x: cam.x + (sx - vp.width / 2) / cam.scale,
    y: cam.y + (sy - vp.height / 2) / cam.scale,
  };
}
