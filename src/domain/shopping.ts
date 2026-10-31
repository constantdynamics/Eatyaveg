/** Boodschappenlijst (§10.1): optellen, groeperen per afdeling, afvinken en delen. */
import { ingredientsFor } from './recipes';
import { roundForUnit, formatAmount, scaleQty } from './scaling';
import type {
  ManualShoppingItem,
  Recipe,
  Section,
  ShoppingItem,
  ShoppingItemState,
  ShoppingRecipeEntry,
  Unit,
} from './types';
import { SECTIONS } from './types';
import { fromBase, toBase, unitFamily } from './units';

export const SECTION_LABEL: Record<Section, string> = {
  'groente-fruit': 'Groente & fruit',
  'vlees-vis': 'Vlees & vis',
  'zuivel-eieren': 'Zuivel & eieren',
  'brood-granen': 'Brood & granen',
  houdbaar: 'Houdbaar',
  diepvries: 'Diepvries',
  kruiden: 'Kruiden',
  overig: 'Overig',
};

interface Acc {
  key: string;
  name: string;
  plural?: string;
  family: string;
  base?: number;
  section: Section;
  basic: boolean;
  recipeIds: Set<string>;
}

export function itemKey(name: string, unit?: Unit): string {
  return `${name.trim().toLowerCase()}|${unit ? unitFamily(unit) : 'geen'}`;
}

/** Hoeveelheid voor in de winkel: verpakkingen en stuks naar boven afronden. */
function shopQty(qty: number, unit: Unit): number {
  if (unit === 'stuks' || unit === 'blik' || unit === 'pak' || unit === 'teentje') {
    return Math.max(1, Math.ceil(qty - 1e-9));
  }
  return roundForUnit(qty, unit);
}

export function buildShoppingItems(
  entries: readonly ShoppingRecipeEntry[],
  recipesById: ReadonlyMap<string, Recipe>,
  manual: readonly ManualShoppingItem[],
  states: Readonly<Record<string, ShoppingItemState>>,
): ShoppingItem[] {
  const acc = new Map<string, Acc>();
  for (const entry of entries) {
    const recipe = recipesById.get(entry.recipeId);
    if (!recipe) continue;
    for (const ing of ingredientsFor(recipe, entry.variant)) {
      if (ing.optional) continue;
      const key = itemKey(ing.name, ing.unit);
      let item = acc.get(key);
      if (!item) {
        item = {
          key,
          name: ing.name,
          ...(ing.plural ? { plural: ing.plural } : {}),
          family: ing.unit ? unitFamily(ing.unit) : 'geen',
          section: ing.section,
          basic: Boolean(ing.basic),
          recipeIds: new Set(),
        };
        acc.set(key, item);
      }
      item.recipeIds.add(recipe.id);
      item.basic = item.basic && Boolean(ing.basic);
      if (ing.qty !== undefined && ing.unit) {
        const scaled = scaleQty(ing.qty, recipe.servings, entry.servings, ing.unit);
        item.base = (item.base ?? 0) + toBase(scaled, ing.unit);
      }
    }
  }

  const items: ShoppingItem[] = [];
  for (const a of acc.values()) {
    const state = states[a.key] ?? {};
    if (state.hidden) continue;
    let qty: number | undefined;
    let unit: Unit | undefined;
    if (a.base !== undefined && a.family !== 'geen') {
      const converted = fromBase(a.base, a.family as Parameters<typeof fromBase>[1]);
      unit = converted.unit;
      qty = shopQty(converted.qty, unit);
    }
    items.push({
      id: a.key,
      name: qty !== undefined && qty > 1 && unit === 'stuks' && a.plural ? a.plural : a.name,
      ...(qty !== undefined ? { qty } : {}),
      ...(unit ? { unit } : {}),
      section: a.section,
      basic: a.basic,
      bought: Boolean(state.bought),
      atHome: Boolean(state.atHome),
      recipeIds: [...a.recipeIds],
    });
  }
  for (const m of manual) {
    const key = `manual:${m.id}`;
    const state = states[key] ?? {};
    items.push({
      id: key,
      name: m.name,
      section: m.section,
      basic: false,
      bought: Boolean(state.bought),
      atHome: Boolean(state.atHome),
      recipeIds: [],
      manual: true,
    });
  }
  const order = (s: Section) => SECTIONS.indexOf(s);
  return items.sort(
    (a, b) => order(a.section) - order(b.section) || a.name.localeCompare(b.name, 'nl'),
  );
}

export function itemLabel(item: ShoppingItem): string {
  if (item.qty === undefined || !item.unit) return item.name;
  return formatAmount({ name: item.name }, item.qty, item.unit);
}

export interface ShoppingGroup {
  section: Section;
  label: string;
  items: ShoppingItem[];
}

export function groupBySection(items: readonly ShoppingItem[]): {
  groups: ShoppingGroup[];
  basics: ShoppingItem[];
} {
  const groups: ShoppingGroup[] = [];
  const basics: ShoppingItem[] = [];
  for (const section of SECTIONS) {
    const inSection = items.filter((i) => i.section === section && !i.basic);
    if (inSection.length > 0)
      groups.push({ section, label: SECTION_LABEL[section], items: inSection });
  }
  for (const i of items) if (i.basic) basics.push(i);
  return { groups, basics };
}

/** Platte tekst om te delen: alleen wat nog gekocht moet worden. */
export function shoppingListText(items: readonly ShoppingItem[]): string {
  const todo = items.filter((i) => !i.bought && !i.atHome);
  const { groups, basics } = groupBySection(todo);
  const lines = ['Boodschappen'];
  for (const g of groups) {
    lines.push('', g.label);
    for (const i of g.items) lines.push(`- ${itemLabel(i)}`);
  }
  if (basics.length > 0) {
    lines.push('', 'Als je het niet in huis hebt');
    for (const i of basics) lines.push(`- ${itemLabel(i)}`);
  }
  return lines.join('\n');
}
