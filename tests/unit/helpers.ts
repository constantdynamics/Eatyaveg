import type { EatEvent, PracticeEvent, Recipe, VeggieId } from '../../src/domain/types';

export const DAY = 24 * 60 * 60 * 1000;
export const T0 = new Date('2026-01-05T17:30:00').getTime();

export function at(daysAfterT0: number, hours = 0): string {
  return new Date(T0 + daysAfterT0 * DAY + hours * 60 * 60 * 1000).toISOString();
}

let n = 0;
export function eat(
  veggieId: VeggieId,
  iso: string,
  childId = 'k1',
  extra: Partial<EatEvent> = {},
): EatEvent {
  n += 1;
  return { id: `e${n}`, childId, veggieId, at: iso, source: 'plus', ...extra };
}

export function practice(
  veggieId: VeggieId,
  iso: string,
  enabled: boolean,
  childId = 'k1',
): PracticeEvent {
  n += 1;
  return { id: `p${n}`, childId, veggieId, at: iso, enabled };
}

/** n registraties op opeenvolgende dagen vanaf `startDay`. */
export function eatsOnDays(veggieId: VeggieId, count: number, startDay = 0): EatEvent[] {
  return Array.from({ length: count }, (_, i) => eat(veggieId, at(startDay + i)));
}

export function recipe(partial: Partial<Recipe> & Pick<Recipe, 'id' | 'mainVeggie'>): Recipe {
  return {
    name: partial.id,
    description: 'Test',
    category: 'hoofdgerecht',
    veggies: [partial.mainVeggie],
    visibility: 1,
    hasVariants: false,
    nextStep: false,
    timeMinutes: 25,
    servings: 4,
    difficulty: 'makkelijk',
    ingredients: [],
    steps: ['Stap 1', 'Stap 2', 'Stap 3'],
    tips: {},
    allergens: [],
    ...partial,
  };
}

export const SETTINGS = { perPhase: 3 as const, regrowPerPhase: 2, shrinkDays: 7, maxShrink: 3 };
