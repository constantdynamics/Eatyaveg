import {
  cameraFor,
  closeupCamera,
  overviewCamera,
  screenToWorld,
  zoneCamera,
  zoneScale,
} from '../../src/features/garden/camera';
import {
  BED,
  MAX_SIZE,
  placeBuddy,
  sizeForPhase,
  spotForPhase,
  WORLD,
  ZONES,
  zoneIndexAt,
} from '../../src/features/garden/world';
import { VEGGIE_IDS } from '../../src/domain/types';

const tablet = { width: 1180, height: 820 };
const portrait = { width: 820, height: 1180 };

describe('tuinwereld', () => {
  it('elke fase is zichtbaar groter', () => {
    const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(sizeForPhase);
    for (let i = 1; i < sizes.length; i++) expect(sizes[i]! / sizes[i - 1]!).toBeGreaterThan(1.25);
    expect(sizeForPhase(0)).toBe(0);
    expect(MAX_SIZE).toBe(sizes[8]);
  });

  it('zaadje in het bed, pas ontdekt bij het bed, daarna thuis', () => {
    expect(spotForPhase(0)).toBe('bed');
    expect(spotForPhase(1)).toBe('moestuin');
    expect(spotForPhase(4)).toBe('thuis');
  });

  it('plaatsing is vast per groente en verdeeld over de zones', () => {
    const zones = new Map<string, number>();
    for (const id of VEGGIE_IDS) {
      const a = placeBuddy(id, 5);
      expect(placeBuddy(id, 5)).toEqual(a);
      zones.set(a.zone, (zones.get(a.zone) ?? 0) + 1);
      const z = ZONES.find((zone) => zone.id === a.zone)!;
      expect(a.x).toBeGreaterThanOrEqual(z.x0);
      expect(a.x).toBeLessThan(z.x1);
    }
    expect([...zones.keys()].sort()).toEqual(['bloementuin', 'speeltuin', 'vijver', 'weide']);
    expect(Math.max(...zones.values())).toBeLessThanOrEqual(4);
  });

  it('groot staat achteraan (hoger in beeld), klein vooraan', () => {
    const small = placeBuddy('wortel', 2);
    const big = placeBuddy('wortel', 9);
    expect(big.y).toBeLessThan(small.y);
    expect(big.x).toBe(small.x);
    expect(big.y - big.size).toBeGreaterThan(0);
  });

  it('zaadjes liggen netjes op een rij in het bed', () => {
    const xs = VEGGIE_IDS.map((id) => placeBuddy(id, 0).x);
    expect(new Set(xs).size).toBe(VEGGIE_IDS.length);
    for (const x of xs) {
      expect(x).toBeGreaterThan(BED.x0);
      expect(x).toBeLessThan(BED.x1);
    }
  });

  it('zone-index bij een x-positie', () => {
    expect(zoneIndexAt(10)).toBe(0);
    expect(zoneIndexAt(900)).toBe(1);
    expect(zoneIndexAt(WORLD.width + 50)).toBe(ZONES.length - 1);
    expect(zoneIndexAt(-20)).toBe(0);
  });
});

describe('camera', () => {
  it('het overzicht toont de hele tuin in één beeld', () => {
    for (const vp of [tablet, portrait]) {
      const cam = overviewCamera(vp);
      expect(WORLD.width * cam.scale).toBeLessThanOrEqual(vp.width);
    }
  });

  it('een zone vult het scherm en laat de buren een beetje zien', () => {
    const cam = zoneCamera(tablet, 2);
    const visible = tablet.width / cam.scale;
    expect(visible).toBeGreaterThan(ZONES[2]!.x1 - ZONES[2]!.x0);
    expect(cam.x).toBe((ZONES[2]!.x0 + ZONES[2]!.x1) / 2);
  });

  it('close-up zoomt verder in dan de zone, maar begrensd', () => {
    const tiny = closeupCamera(tablet, 500, 860, 44);
    const huge = closeupCamera(tablet, 2000, 700, 431);
    expect(tiny.scale).toBeGreaterThan(zoneScale(tablet));
    expect(tiny.scale).toBeLessThanOrEqual(4.2);
    expect(huge.scale).toBeGreaterThanOrEqual(zoneScale(tablet));
  });

  it('een zone zonder grote vriendjes komt dichterbij dan een met een walvis', () => {
    const low = zoneCamera(tablet, 1, 800);
    const high = zoneCamera(tablet, 1, 260);
    expect(low.scale).toBeGreaterThanOrEqual(high.scale);
    expect(high.y).toBeLessThan(low.y);
  });

  it('een regio past precies in beeld', () => {
    const cam = cameraFor(tablet, {
      kind: 'regio',
      zone: 0,
      region: { x0: 0, x1: 400, y0: 700, y1: 900 },
    });
    expect(400 * cam.scale).toBeLessThanOrEqual(tablet.width + 0.01);
    expect(200 * cam.scale).toBeLessThanOrEqual(tablet.height + 0.01);
  });

  it('scherm naar wereld is de inverse van de camera', () => {
    const cam = cameraFor(tablet, { kind: 'zone', zone: 1 });
    const p = screenToWorld(cam, tablet, tablet.width / 2, tablet.height / 2);
    expect(p.x).toBeCloseTo(cam.x);
    expect(p.y).toBeCloseTo(cam.y);
  });
});
