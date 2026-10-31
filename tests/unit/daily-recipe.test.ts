import {
  dailyCandidates,
  dailyOrder,
  pickDailyRecipe,
  type DailyInput,
} from '../../src/domain/daily-recipe';
import type { VeggieId } from '../../src/domain/types';
import { VEGGIE_IDS } from '../../src/domain/types';
import { recipe } from './helpers';

const recipes = [
  recipe({ id: 'wortelsaus', mainVeggie: 'wortel' }),
  recipe({ id: 'broccoliballen', mainVeggie: 'broccoli', allergens: ['ei', 'gluten'] }),
  recipe({ id: 'preisoep', mainVeggie: 'prei', category: 'soep' }),
  recipe({ id: 'lasagne', mainVeggie: 'courgette', weekend: true, timeMinutes: 60 }),
  recipe({ id: 'smoothie', mainVeggie: 'spinazie', category: 'smoothie' }),
  recipe({ id: 'tomaat-stap', mainVeggie: 'tomaat', nextStep: true, visibility: 3 }),
  recipe({ id: 'pompoensoep', mainVeggie: 'pompoen', category: 'soep' }),
];

function input(partial: Partial<DailyInput> = {}): DailyInput {
  return {
    date: '2026-10-28', // woensdag
    recipes,
    allergies: [],
    enabledVeggies: [...VEGGIE_IDS],
    preferred: new Set<VeggieId>(),
    readyForNextStep: new Set<VeggieId>(),
    recentMains: [],
    skipped: [],
    isWeekend: false,
    ...partial,
  };
}

describe('recept van vandaag', () => {
  it('ligt vast per dag (seed = datum)', () => {
    expect(pickDailyRecipe(input())?.id).toBe(pickDailyRecipe(input())?.id);
    const ids = new Set(
      ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06'].map(
        (date) => pickDailyRecipe(input({ date }))?.id,
      ),
    );
    expect(ids.size).toBeGreaterThan(1);
  });

  it('geen smoothies, geen weekendrecepten doordeweeks, geen allergenen', () => {
    const ids = dailyCandidates(input({ allergies: ['ei'] })).map((r) => r.id);
    expect(ids).not.toContain('smoothie');
    expect(ids).not.toContain('lasagne');
    expect(ids).not.toContain('broccoliballen');
    expect(dailyCandidates(input({ isWeekend: true })).map((r) => r.id)).toContain('lasagne');
  });

  it('Ander recept kiest een volgende en loopt rond', () => {
    const order = dailyOrder(input()).map((r) => r.id);
    const first = pickDailyRecipe(input())!.id;
    expect(first).toBe(order[0]);
    const second = pickDailyRecipe(input({ skipped: [first] }))!.id;
    expect(second).toBe(order[1]);
    const all = pickDailyRecipe(input({ skipped: order }))!.id;
    expect(all).not.toBe(order[order.length - 1]);
  });

  it('geeft voorrang aan nieuwe groenten en wisselt af met vorige dagen', () => {
    let preferredHits = 0;
    let recentHits = 0;
    const days = 365;
    for (let d = 0; d < days; d++) {
      const date = new Date(2026, 0, 1 + d).toISOString().slice(0, 10);
      const pick = pickDailyRecipe(input({ date, preferred: new Set<VeggieId>(['prei']) }));
      if (pick?.mainVeggie === 'prei') preferredHits++;
      const pick2 = pickDailyRecipe(input({ date, recentMains: ['wortel', 'prei', 'pompoen'] }));
      if (pick2 && ['wortel', 'prei', 'pompoen'].includes(pick2.mainVeggie)) recentHits++;
    }
    // Zonder voorkeur kiest prei ~1/4,3 van de dagen; met voorkeur ruim vaker.
    expect(preferredHits / days).toBeGreaterThan(0.35);
    // Zonder afwisseling zouden de drie recente groenten ~70% van de dagen terugkomen.
    expect(recentHits / days).toBeLessThan(0.45);
  });

  it('niets te kiezen: undefined', () => {
    expect(pickDailyRecipe(input({ recipes: [] }))).toBeUndefined();
  });
});
