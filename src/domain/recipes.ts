/** Hulpfuncties voor recepten: varianten, labels en filters (§6.4). */
import type {
  Allergen,
  Ingredient,
  Recipe,
  RecipeCategory,
  VariantKey,
  VeggieId,
  Visibility,
} from './types';

export function ingredientsFor(recipe: Recipe, variant: VariantKey): Ingredient[] {
  return recipe.ingredients.filter((i) => !i.variant || i.variant === variant);
}

export function stepsFor(recipe: Recipe, variant: VariantKey): string[] {
  return recipe.steps.map((s) => (typeof s === 'string' ? s : s[variant]));
}

/** Het zichtbaarheidsniveau dat bij een gekozen variant hoort (voor de registratie). */
export function visibilityFor(recipe: Recipe, variant: VariantKey): Visibility {
  if (!recipe.hasVariants) return recipe.visibility;
  return variant === 'verstopt' ? 1 : 2;
}

export const VISIBILITY_LABEL: Record<Visibility, string> = {
  1: 'Onzichtbaar',
  2: 'Licht zichtbaar',
  3: 'Zichtbaar',
  4: 'Puur',
};

export const CATEGORY_LABEL: Record<RecipeCategory, string> = {
  hoofdgerecht: 'Hoofdgerecht',
  'saus-dip': 'Saus of dip',
  soep: 'Soep',
  smoothie: 'Smoothie',
  'ontbijt-bakken': 'Ontbijt en bakken',
  snack: 'Tussendoortje',
};

export const ALLERGEN_LABEL: Record<Allergen, string> = {
  gluten: 'Gluten',
  ei: 'Ei',
  melk: 'Melk',
  noten: 'Noten',
  pinda: 'Pinda',
  soja: 'Soja',
  sesam: 'Sesam',
  selderij: 'Selderij',
  mosterd: 'Mosterd',
  vis: 'Vis',
  schaaldieren: 'Schaaldieren',
  weekdieren: 'Weekdieren',
  lupine: 'Lupine',
  sulfiet: 'Sulfiet',
};

export type TimeFilter = 'le15' | 'le30' | 'weekend';
export type VisibilityFilter = 'onzichtbaar' | 'licht' | 'volgende-stap';

export interface RecipeFilters {
  query?: string;
  veggie?: VeggieId;
  category?: RecipeCategory;
  time?: TimeFilter;
  visibility?: VisibilityFilter;
  /** Allergieën uit de instellingen: recepten met deze allergenen vallen af. */
  allergies?: readonly Allergen[];
  favoritesOnly?: boolean;
  favorites?: readonly string[];
}

export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

export function hasAllergen(recipe: Recipe, allergies: readonly Allergen[]): boolean {
  return recipe.allergens.some((a) => allergies.includes(a));
}

export function matchesFilters(
  recipe: Recipe,
  filters: RecipeFilters,
  veggieNames: Partial<Record<VeggieId, string>> = {},
): boolean {
  if (filters.allergies && hasAllergen(recipe, filters.allergies)) return false;
  if (filters.veggie && !recipe.veggies.includes(filters.veggie)) return false;
  if (filters.category && recipe.category !== filters.category) return false;
  if (filters.time === 'le15' && recipe.timeMinutes > 15) return false;
  if (filters.time === 'le30' && recipe.timeMinutes > 30) return false;
  if (filters.time === 'weekend' && !recipe.weekend) return false;
  if (filters.visibility === 'onzichtbaar' && recipe.visibility !== 1) return false;
  if (filters.visibility === 'licht' && !(recipe.visibility === 2 || recipe.hasVariants))
    return false;
  if (filters.visibility === 'volgende-stap' && !recipe.nextStep) return false;
  if (filters.favoritesOnly && !(filters.favorites ?? []).includes(recipe.id)) return false;
  const q = filters.query ? normalize(filters.query) : '';
  if (q) {
    const haystack = normalize(
      [
        recipe.name,
        recipe.description,
        ...recipe.veggies.map((v) => veggieNames[v] ?? v),
        ...recipe.ingredients.map((i) => i.name),
      ].join(' '),
    );
    return q.split(/\s+/).every((word) => haystack.includes(word));
  }
  return true;
}
