/** Porties omrekenen en hoeveelheden netjes in het Nederlands tonen. */
import type { Ingredient, Unit } from './types';
import { unitLabel } from './units';

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/** Afronden op een maat die in een keuken logisch is. */
export function roundForUnit(qty: number, unit: Unit | undefined): number {
  if (!unit) return roundTo(qty, 0.5);
  switch (unit) {
    case 'g':
      return qty < 20
        ? Math.max(1, Math.round(qty))
        : qty < 200
          ? roundTo(qty, 5)
          : roundTo(qty, 10);
    case 'ml':
      return qty < 50
        ? Math.max(5, roundTo(qty, 5))
        : qty < 500
          ? roundTo(qty, 10)
          : roundTo(qty, 25);
    case 'kg':
    case 'l':
      return Math.max(0.05, roundTo(qty, 0.05));
    case 'snufje':
      return 1;
    default:
      return Math.max(0.5, roundTo(qty, 0.5));
  }
}

export function scaleQty(
  qty: number,
  fromServings: number,
  toServings: number,
  unit?: Unit,
): number {
  if (fromServings <= 0 || toServings === fromServings) return qty;
  return roundForUnit((qty * toServings) / fromServings, unit);
}

const FRACTIONS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

/** 0.5 → '½', 1.5 → '1½', 1.2 → '1,2', 250 → '250'. */
export function formatQty(qty: number): string {
  const whole = Math.floor(qty + 1e-9);
  const frac = Math.round((qty - whole) * 100) / 100;
  if (frac === 0) return String(whole);
  const symbol = FRACTIONS[String(frac)];
  if (symbol) return whole === 0 ? symbol : `${whole}${symbol}`;
  return String(Math.round(qty * 100) / 100).replace('.', ',');
}

/** "2 uien", "300 g wortel", "1 el olijfolie", "2 teentjes knoflook", "½ blik tomatenblokjes". */
export function formatAmount(
  ingredient: Pick<Ingredient, 'name' | 'plural' | 'note'>,
  qty: number | undefined,
  unit: Unit | undefined,
): string {
  const note = ingredient.note ? ` (${ingredient.note})` : '';
  if (qty === undefined || !unit) return `${ingredient.name}${note}`;
  const amount = formatQty(qty);
  if (unit === 'stuks') {
    const name = qty > 1 && ingredient.plural ? ingredient.plural : ingredient.name;
    return `${amount} ${name}${note}`;
  }
  return `${amount} ${unitLabel(unit, qty)} ${ingredient.name}${note}`;
}

export function scaleIngredient(
  ingredient: Ingredient,
  fromServings: number,
  toServings: number,
): Ingredient {
  if (ingredient.qty === undefined) return ingredient;
  return {
    ...ingredient,
    qty: scaleQty(ingredient.qty, fromServings, toServings, ingredient.unit),
  };
}
