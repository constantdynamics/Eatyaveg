import {
  buildShoppingItems,
  groupBySection,
  itemKey,
  itemLabel,
  shoppingListText,
} from '../../src/domain/shopping';
import type { Ingredient, Recipe } from '../../src/domain/types';
import { recipe } from './helpers';

const ing = (i: Ingredient) => i;

const saus = recipe({
  id: 'saus',
  mainVeggie: 'wortel',
  ingredients: [
    ing({ name: 'ui', plural: 'uien', qty: 1, unit: 'stuks', section: 'groente-fruit' }),
    ing({ name: 'wortel', qty: 300, unit: 'g', section: 'groente-fruit' }),
    ing({ name: 'passata', qty: 500, unit: 'ml', section: 'houdbaar' }),
    ing({ name: 'zout', qty: 1, unit: 'snufje', section: 'kruiden', basic: true }),
    ing({ name: 'honing', qty: 1, unit: 'tl', section: 'houdbaar', optional: true }),
    ing({ name: 'water', qty: 100, unit: 'ml', section: 'overig', variant: 'verstopt' }),
  ],
});
const ballen = recipe({
  id: 'ballen',
  mainVeggie: 'wortel',
  servings: 4,
  ingredients: [
    ing({ name: 'ui', plural: 'uien', qty: 1, unit: 'stuks', section: 'groente-fruit' }),
    ing({ name: 'wortel', qty: 0.8, unit: 'kg', section: 'groente-fruit' }),
    ing({ name: 'passata', qty: 0.75, unit: 'l', section: 'houdbaar' }),
    ing({ name: 'gehakt', qty: 500, unit: 'g', section: 'vlees-vis' }),
  ],
});
const byId = new Map<string, Recipe>([
  ['saus', saus],
  ['ballen', ballen],
]);

describe('boodschappenlijst', () => {
  const entries = [
    { recipeId: 'saus', servings: 4, variant: 'zichtbaar' as const, addedAt: '' },
    { recipeId: 'ballen', servings: 2, variant: 'verstopt' as const, addedAt: '' },
  ];

  it('telt omrekenbare eenheden op (g/kg, ml/l, stuks)', () => {
    const items = buildShoppingItems(entries, byId, [], {});
    const find = (name: string) => items.find((i) => i.name.startsWith(name))!;
    expect(find('wortel')).toMatchObject({ qty: 700, unit: 'g' });
    expect(find('passata')).toMatchObject({ qty: 900, unit: 'ml' });
    expect(find('ui')).toMatchObject({ qty: 2, unit: 'stuks', name: 'uien' });
    expect(find('gehakt')).toMatchObject({ qty: 250, unit: 'g', recipeIds: ['ballen'] });
    expect(find('wortel').recipeIds.sort()).toEqual(['ballen', 'saus']);
  });

  it('slaat optionele en andere-variant-ingrediënten over', () => {
    const names = buildShoppingItems(entries, byId, [], {}).map((i) => i.name);
    expect(names).not.toContain('honing');
    expect(names).not.toContain('water');
  });

  it('gaat over naar kg en l boven de 1000', () => {
    const big = [{ recipeId: 'ballen', servings: 8, variant: 'verstopt' as const, addedAt: '' }];
    const items = buildShoppingItems(big, byId, [], {});
    expect(items.find((i) => i.name === 'wortel')).toMatchObject({ qty: 1.6, unit: 'kg' });
    expect(itemLabel(items.find((i) => i.name === 'passata')!)).toBe('1½ l passata');
  });

  it('groepeert per afdeling met de basisvoorraad apart', () => {
    const { groups, basics } = groupBySection(buildShoppingItems(entries, byId, [], {}));
    expect(groups.map((g) => g.label)).toEqual(['Groente & fruit', 'Vlees & vis', 'Houdbaar']);
    expect(basics.map((b) => b.name)).toEqual(['zout']);
  });

  it('afvinken, "heb ik al", verbergen en zelf toevoegen', () => {
    const states = {
      [itemKey('gehakt', 'g')]: { bought: true },
      [itemKey('ui', 'stuks')]: { atHome: true },
      [itemKey('passata', 'ml')]: { hidden: true },
    };
    const manual = [{ id: 'm1', name: 'koffie', section: 'overig' as const, addedAt: '' }];
    const items = buildShoppingItems(entries, byId, manual, states);
    expect(items.find((i) => i.name === 'gehakt')?.bought).toBe(true);
    expect(items.find((i) => i.name === 'uien')?.atHome).toBe(true);
    expect(items.find((i) => i.name === 'passata')).toBeUndefined();
    expect(items.find((i) => i.name === 'koffie')).toMatchObject({ manual: true, id: 'manual:m1' });
  });

  it('een recept van de lijst halen haalt zijn items weg', () => {
    const items = buildShoppingItems(entries.slice(0, 1), byId, [], {});
    expect(items.find((i) => i.name === 'gehakt')).toBeUndefined();
    expect(items.find((i) => i.name === 'wortel')).toMatchObject({ qty: 300 });
  });

  it('deelt als platte tekst zonder gekochte of aanwezige items', () => {
    const states = { [itemKey('gehakt', 'g')]: { bought: true } };
    const text = shoppingListText(buildShoppingItems(entries, byId, [], states));
    expect(text).toContain('Boodschappen');
    expect(text).toContain('Groente & fruit\n- 2 uien\n- 700 g wortel');
    expect(text).not.toContain('gehakt');
    expect(text).toContain('Als je het niet in huis hebt\n- 1 snufje zout');
  });
});
