/**
 * De tuinwereld (§8.2): één horizontale wereld van vijf zones. Alle maten in wereld-eenheden
 * (1 eenheid = 1 px bij camerazoom 1). Plaatsing is vast per groente en volledig deterministisch.
 */
import { VEGGIE_IDS, type Phase, type VeggieId } from '../../domain/types';

export const WORLD = {
  width: 4200,
  /** Inhoud loopt van ongeveer y = 260 (lucht met grote vriendjes) tot de grond vooraan. */
  height: 1000,
  horizon: 560,
  groundBack: 690,
  groundFront: 935,
  /** Zichtbare band die de camera in beeld wil houden. */
  bandTop: 260,
  bandBottom: 1020,
} as const;

export type ZoneId = 'moestuin' | 'speeltuin' | 'vijver' | 'bloementuin' | 'weide';

export interface Zone {
  id: ZoneId;
  x0: number;
  x1: number;
}

export const ZONES: Zone[] = [
  { id: 'moestuin', x0: 0, x1: 840 },
  { id: 'speeltuin', x0: 840, x1: 1680 },
  { id: 'vijver', x0: 1680, x1: 2520 },
  { id: 'bloementuin', x0: 2520, x1: 3360 },
  { id: 'weide', x0: 3360, x1: 4200 },
];

export function zoneIndexAt(x: number): number {
  const i = ZONES.findIndex((z) => x >= z.x0 && x < z.x1);
  return i < 0 ? (x < 0 ? 0 : ZONES.length - 1) : i;
}

const HOME_ZONES: ZoneId[] = ['speeltuin', 'vijver', 'bloementuin', 'weide'];

/** Vaste x-plekken per zone, buiten de schommel, de vijver en het bankje. */
const HOME_SLOTS: Record<Exclude<ZoneId, 'moestuin'>, number[]> = {
  speeltuin: [930, 1110, 1420, 1610],
  vijver: [1755, 1840, 2370, 2455],
  bloementuin: [2620, 2830, 3060, 3270],
  weide: [3470, 3720, 3990, 4130],
};

/** Het moestuinbed met de zaadjes (§14.2: netjes op een rij in één bed). */
export const BED = { x0: 70, x1: 780, top: 872, slotStart: 104, slotGap: 48 } as const;

const PHASE_BASE = 44;
const PHASE_GROWTH = 1.33;

/** Elke fase zichtbaar groter, niet-lineair: van ongeveer 44 tot 431 eenheden hoog. */
export function sizeForPhase(phase: number): number {
  if (phase <= 0) return 0;
  return Math.round(PHASE_BASE * PHASE_GROWTH ** (Math.min(9, phase) - 1));
}

export const MAX_SIZE = sizeForPhase(9);

function veggieIndex(id: VeggieId): number {
  return VEGGIE_IDS.indexOf(id);
}

export function homeZone(id: VeggieId): ZoneId {
  return HOME_ZONES[veggieIndex(id) % HOME_ZONES.length]!;
}

/** Kleine vaste verschuiving per groente, zodat de rij niet strak oogt. */
function jitter(id: VeggieId, amount: number): number {
  const i = veggieIndex(id);
  return (((i * 37) % 9) / 8) * amount * 2 - amount;
}

export function bedSlotX(id: VeggieId): number {
  return BED.slotStart + veggieIndex(id) * BED.slotGap;
}

export type Spot = 'bed' | 'moestuin' | 'thuis';

/** Waar een vriendje staat: zaadje in het bed, pas ontdekt bij het bed, daarna in zijn eigen zone. */
export function spotForPhase(phase: Phase | number): Spot {
  if (phase <= 0) return 'bed';
  if (phase === 1) return 'moestuin';
  return 'thuis';
}

export interface Placement {
  x: number;
  /** Voeten (onderkant) in wereld-eenheden. */
  y: number;
  size: number;
  zone: ZoneId;
}

export function placeBuddy(
  id: VeggieId,
  phase: number,
  spot: Spot = spotForPhase(phase),
): Placement {
  const size = sizeForPhase(Math.max(1, phase));
  if (spot === 'bed') return { x: bedSlotX(id), y: BED.top + 6, size: 0, zone: 'moestuin' };
  if (spot === 'moestuin') return { x: bedSlotX(id), y: BED.top - 8, size, zone: 'moestuin' };
  const zone = homeZone(id);
  const slot = Math.floor(veggieIndex(id) / HOME_ZONES.length);
  const x = HOME_SLOTS[zone as Exclude<ZoneId, 'moestuin'>][slot]! + jitter(id, 14);
  // Groot achteraan en hoger in beeld, klein vooraan (§8.2).
  const t = (size - PHASE_BASE) / (MAX_SIZE - PHASE_BASE);
  const y = WORLD.groundFront - t * (WORLD.groundFront - WORLD.groundBack) + jitter(id, 10);
  return { x, y, size, zone };
}
