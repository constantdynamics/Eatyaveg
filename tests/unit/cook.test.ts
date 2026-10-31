import { RECIPES } from '../../src/content/recipes';
import { ingredientsForStep } from '../../src/domain/cook';
import { ingredientsFor, stepsFor } from '../../src/domain/recipes';

describe('kookmodus: ingrediënten per stap', () => {
  const saus = RECIPES.find((r) => r.id === 'wortel-tomatensaus')!;
  const ings = ingredientsFor(saus, 'zichtbaar');
  const steps = stepsFor(saus, 'zichtbaar');

  it('vindt de genoemde ingrediënten, ook korte woorden als ui', () => {
    expect(ingredientsForStep(steps[1]!, ings).map((i) => i.name)).toEqual([
      'olijfolie',
      'ui',
      'knoflook',
    ]);
    expect(ingredientsForStep(steps[0]!, ings).map((i) => i.name)).toEqual(['wortel']);
    expect(ingredientsForStep(steps[3]!, ings).map((i) => i.name)).toEqual(
      expect.arrayContaining(['pasta', 'passata', 'gedroogde basilicum']),
    );
  });

  it('geen valse treffers op deelwoorden', () => {
    const fake = [{ name: 'ui' }, { name: 'ei', plural: 'eieren' }];
    expect(ingredientsForStep('Bak de ui in de olie.', fake).map((i) => i.name)).toEqual(['ui']);
    expect(ingredientsForStep('Klop de eieren los.', fake).map((i) => i.name)).toEqual(['ei']);
    expect(ingredientsForStep('Kook de rijst gaar.', fake)).toEqual([]);
  });

  it('samengestelde namen via aliassen', () => {
    const wraps = RECIPES.find((r) => r.id === 'kipwraps-komkommersaus')!;
    const all = ingredientsFor(wraps, 'verstopt');
    const step = stepsFor(wraps, 'verstopt')[2]!;
    expect(ingredientsForStep(step, all).map((i) => i.name)).toContain('tortillawrap');
  });

  it('elk niet-basis-ingrediënt komt in minstens één stap terug (op een paar na)', () => {
    let missing = 0;
    let total = 0;
    for (const r of RECIPES) {
      for (const variant of ['verstopt', 'zichtbaar'] as const) {
        const all = ingredientsFor(r, variant).filter((i) => !i.basic && !i.optional);
        const found = new Set(
          stepsFor(r, variant).flatMap((s) => ingredientsForStep(s, all).map((i) => i.name)),
        );
        total += all.length;
        missing += all.filter((i) => !found.has(i.name)).length;
      }
    }
    expect(missing / total).toBeLessThan(0.12);
  });
});
