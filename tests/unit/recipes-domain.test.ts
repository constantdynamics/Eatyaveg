import { ingredientsFor, matchesFilters, stepsFor, visibilityFor } from '../../src/domain/recipes';
import { recipe } from './helpers';

const r = recipe({
  id: 'saus',
  name: 'Wortel-tomatensaus',
  mainVeggie: 'wortel',
  veggies: ['wortel', 'tomaat'],
  hasVariants: true,
  timeMinutes: 25,
  allergens: ['gluten'],
  ingredients: [
    { name: 'wortel', qty: 300, unit: 'g', section: 'groente-fruit' },
    { name: 'water', qty: 100, unit: 'ml', section: 'overig', variant: 'verstopt' },
  ],
  steps: [
    'Snipper de ui.',
    { verstopt: 'Pureer de wortel.', zichtbaar: 'Rasp de wortel.' },
    'Klaar.',
  ],
});

describe('recepten', () => {
  it('past ingrediënten en stappen aan op de variant', () => {
    expect(ingredientsFor(r, 'zichtbaar').map((i) => i.name)).toEqual(['wortel']);
    expect(ingredientsFor(r, 'verstopt').map((i) => i.name)).toEqual(['wortel', 'water']);
    expect(stepsFor(r, 'zichtbaar')[1]).toBe('Rasp de wortel.');
    expect(visibilityFor(r, 'verstopt')).toBe(1);
    expect(visibilityFor(r, 'zichtbaar')).toBe(2);
  });

  it('filtert op groente, tijd, zichtbaarheid, allergie, favoriet en zoekterm', () => {
    expect(matchesFilters(r, { veggie: 'tomaat' })).toBe(true);
    expect(matchesFilters(r, { veggie: 'prei' })).toBe(false);
    expect(matchesFilters(r, { time: 'le15' })).toBe(false);
    expect(matchesFilters(r, { time: 'le30' })).toBe(true);
    expect(matchesFilters(r, { visibility: 'onzichtbaar' })).toBe(true);
    expect(matchesFilters(r, { visibility: 'licht' })).toBe(true);
    expect(matchesFilters(r, { visibility: 'volgende-stap' })).toBe(false);
    expect(matchesFilters(r, { allergies: ['gluten'] })).toBe(false);
    expect(matchesFilters(r, { favoritesOnly: true, favorites: ['saus'] })).toBe(true);
    expect(matchesFilters(r, { favoritesOnly: true, favorites: [] })).toBe(false);
    expect(matchesFilters(r, { query: 'WORTEL saus' })).toBe(true);
    expect(matchesFilters(r, { query: 'courgette' })).toBe(false);
  });
});
