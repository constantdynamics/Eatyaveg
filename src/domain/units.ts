import type { Unit } from './types';

export type UnitFamily = 'mass' | 'volume' | Exclude<Unit, 'g' | 'kg' | 'ml' | 'l'>;

export function unitFamily(unit: Unit): UnitFamily {
  if (unit === 'g' || unit === 'kg') return 'mass';
  if (unit === 'ml' || unit === 'l') return 'volume';
  return unit;
}

/** Naar de basiseenheid van de familie (g of ml); andere eenheden blijven gelijk. */
export function toBase(qty: number, unit: Unit): number {
  if (unit === 'kg' || unit === 'l') return qty * 1000;
  return qty;
}

export function fromBase(base: number, family: UnitFamily): { qty: number; unit: Unit } {
  if (family === 'mass')
    return base >= 1000 ? { qty: base / 1000, unit: 'kg' } : { qty: base, unit: 'g' };
  if (family === 'volume')
    return base >= 1000 ? { qty: base / 1000, unit: 'l' } : { qty: base, unit: 'ml' };
  return { qty: base, unit: family };
}

const UNIT_LABEL: Record<Unit, [string, string]> = {
  g: ['g', 'g'],
  kg: ['kg', 'kg'],
  ml: ['ml', 'ml'],
  l: ['l', 'l'],
  el: ['el', 'el'],
  tl: ['tl', 'tl'],
  stuks: ['', ''],
  teentje: ['teentje', 'teentjes'],
  blik: ['blik', 'blikken'],
  pak: ['pak', 'pakken'],
  snufje: ['snufje', 'snufjes'],
};

export function unitLabel(unit: Unit, qty: number): string {
  const [one, many] = UNIT_LABEL[unit];
  return qty > 1 ? many : one;
}

export const UNIT_NAMES: Record<Unit, string> = {
  g: 'gram',
  kg: 'kilo',
  ml: 'milliliter',
  l: 'liter',
  el: 'eetlepel',
  tl: 'theelepel',
  stuks: 'stuks',
  teentje: 'teentje',
  blik: 'blik',
  pak: 'pak',
  snufje: 'snufje',
};
