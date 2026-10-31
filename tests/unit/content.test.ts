import { readFileSync } from 'node:fs';
import { RECIPES } from '../../src/content/recipes';
import { validateContent, validateRecipes } from '../../src/content/validate';
import { VEGGIES } from '../../src/content/veggies';
import { PHASES, powerText, progressStatus } from '../../src/content/phases';
import { computeProgress } from '../../src/domain/growth';
import { VEGGIE_IDS, type Recipe } from '../../src/domain/types';
import { eatsOnDays, SETTINGS } from './helpers';

const base = RECIPES.find((r) => r.id === 'wortel-tomatensaus')!;
const variant = (patch: Partial<Recipe>): Recipe => ({ ...base, id: 'test-recept', ...patch });
const errorsOf = (r: Recipe) =>
  validateRecipes([r]).errors.filter((e) => e.startsWith('test-recept'));

describe('content', () => {
  it('validate:content slaagt', () => {
    const { errors } = validateContent();
    expect(errors).toEqual([]);
  });

  it('heeft minstens 50 recepten, 10 smoothies en ongeveer 4 weekendrecepten', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(50);
    expect(RECIPES.filter((r) => r.category === 'smoothie')).toHaveLength(10);
    expect(RECIPES.filter((r) => r.weekend).length).toBeGreaterThanOrEqual(4);
  });

  it('heeft per groente twee verstopte recepten en een Volgende stap', () => {
    for (const id of VEGGIE_IDS) {
      const mine = RECIPES.filter((r) => r.mainVeggie === id && r.category !== 'smoothie');
      expect(mine.filter((r) => r.visibility <= 2).length, id).toBeGreaterThanOrEqual(2);
      expect(
        mine.some((r) => r.nextStep),
        id,
      ).toBe(true);
    }
  });

  it('elke groentekleur bestaat als CSS-variabele', () => {
    const css = readFileSync('src/styles/veggies.css', 'utf8');
    for (const v of VEGGIES) {
      for (const value of Object.values(v.palette)) {
        const name = value.replace(/^var\((--[a-z-]+)\)$/, '$1');
        expect(css, name).toContain(`${name}:`);
      }
    }
  });

  it('krachten worden persoonlijk met ouder-namen en blijven anders neutraal', () => {
    expect(powerText(7)).toBe('de grote koffer dragen');
    expect(powerText(8)).toBe('een grote mens optillen');
    expect(powerText(7, ['mama', 'papa'])).toBe('de koffer van papa dragen');
    expect(powerText(8, ['mama', 'papa'])).toBe('mama optillen');
    expect(powerText(8, ['  '])).toBe('een grote mens optillen');
    expect(PHASES.map((p) => p.animal)).toEqual([
      'mier',
      'lieveheersbeestje',
      'egel',
      'konijn',
      'poes',
      'jaguar',
      'beer',
      'dinosaurus',
      'walvis',
    ]);
  });

  it('status voor de ouder', () => {
    expect(progressStatus(computeProgress([], [], SETTINGS, new Date()))).toBe('Nog een zaadje');
    const p = computeProgress(eatsOnDays('wortel', 11), [], SETTINGS, new Date('2027-01-01'));
    expect(progressStatus(p)).toBe('Zo groot als een konijn · nog 2× tot poes');
  });
});

describe('contentvalidatie vangt fouten', () => {
  it('pittig', () => {
    expect(
      errorsOf(
        variant({
          ingredients: [
            ...base.ingredients,
            { name: 'sambal oelek', qty: 1, unit: 'tl', section: 'houdbaar' },
          ],
        }),
      ),
    ).toContainEqual(expect.stringContaining('pittig'));
  });

  it('allergeen zonder label', () => {
    expect(errorsOf(variant({ allergens: [] }))).toContainEqual(
      expect.stringContaining('allergeen gluten'),
    );
  });

  it('hele noten', () => {
    const r = variant({
      allergens: ['gluten', 'noten'],
      ingredients: [
        ...base.ingredients,
        { name: 'walnoten', qty: 30, unit: 'g', section: 'houdbaar' },
      ],
    });
    expect(errorsOf(r)).toContainEqual(expect.stringContaining('hele noten'));
  });

  it('honing zonder veiligheidstip', () => {
    const r = variant({
      ingredients: [
        ...base.ingredients,
        { name: 'honing', qty: 1, unit: 'tl', section: 'houdbaar' },
      ],
    });
    expect(errorsOf(r)).toContainEqual(expect.stringContaining('honing'));
  });

  it('te lang zonder weekend, te veel stappen, ontbrekende hoeveelheid', () => {
    expect(errorsOf(variant({ timeMinutes: 45 }))).toContainEqual(
      expect.stringContaining('weekend'),
    );
    const six = variant({
      steps: ['Stap een.', 'Stap twee.', 'Stap drie.', 'Stap vier.', 'Stap vijf.', 'Stap zes.'],
      hasVariants: false,
    });
    expect(errorsOf(six)).toContainEqual(expect.stringContaining('6 stappen'));
    const noQty = variant({
      ingredients: [{ name: 'wortel', unit: 'g', section: 'groente-fruit' }],
    });
    expect(errorsOf(noQty).length).toBeGreaterThan(0);
  });

  it('groente in de ingrediënten maar niet in veggies[]', () => {
    expect(errorsOf(variant({ veggies: ['wortel'] }))).toContainEqual(
      expect.stringContaining('tomaat'),
    );
  });

  it('spinazie met vis', () => {
    const r = variant({
      veggies: ['wortel', 'tomaat', 'spinazie'],
      allergens: ['gluten', 'vis'],
      ingredients: [
        ...base.ingredients,
        { name: 'verse spinazie', qty: 50, unit: 'g', section: 'groente-fruit' },
        { name: 'zalm', qty: 200, unit: 'g', section: 'vlees-vis' },
      ],
    });
    expect(errorsOf(r)).toContainEqual(expect.stringContaining('vis'));
  });

  it('dubbele id', () => {
    const { errors } = validateRecipes([variant({}), variant({})]);
    expect(errors).toContainEqual(expect.stringContaining('dubbele id'));
  });
});
