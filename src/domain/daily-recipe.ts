/**
 * Recept van vandaag (§6.1). Deterministisch per datum (seed); de gekozen id wordt bovendien
 * per dag opgeslagen, zodat het recept niet verspringt als de voortgang later op de dag verandert.
 */
import { createRng } from '../lib/seeded-rng';
import { hasAllergen } from './recipes';
import type { Allergen, Recipe, VeggieId } from './types';

export interface DailyInput {
  date: string; // yyyy-MM-dd
  recipes: readonly Recipe[];
  allergies: readonly Allergen[];
  enabledVeggies: readonly VeggieId[];
  /** Nog niet ontdekt of op Weer oefenen: krijgen voorrang. */
  preferred: ReadonlySet<VeggieId>;
  /** Groenten die al groot zijn: Volgende stap-recepten passen dan goed. */
  readyForNextStep: ReadonlySet<VeggieId>;
  /** Hoofdgroenten van de vorige dagen, voor afwisseling. */
  recentMains: readonly VeggieId[];
  /** Vandaag al overgeslagen via "Ander recept". */
  skipped: readonly string[];
  isWeekend: boolean;
}

export function dailyCandidates(input: DailyInput): Recipe[] {
  return input.recipes.filter(
    (r) =>
      r.category !== 'smoothie' &&
      (input.isWeekend || !r.weekend) &&
      !hasAllergen(r, input.allergies) &&
      r.veggies.every((v) => input.enabledVeggies.includes(v)),
  );
}

export function recipeWeight(recipe: Recipe, input: DailyInput): number {
  let w = 1;
  if (input.preferred.has(recipe.mainVeggie) && !recipe.nextStep) w *= 3;
  if (recipe.nextStep) w *= input.readyForNextStep.has(recipe.mainVeggie) ? 1.5 : 0.3;
  if (input.recentMains.includes(recipe.mainVeggie)) w *= 0.25;
  return w;
}

/** Alle kandidaten in de volgorde van de dag (gewogen, deterministisch). */
export function dailyOrder(input: DailyInput): Recipe[] {
  const rng = createRng(`recept-van-vandaag:${input.date}`);
  return dailyCandidates(input)
    .map((recipe) => ({ recipe, key: rng() ** (1 / recipeWeight(recipe, input)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.recipe);
}

export function pickDailyRecipe(input: DailyInput): Recipe | undefined {
  const order = dailyOrder(input);
  const next = order.find((r) => !input.skipped.includes(r.id));
  // Alles al overgeslagen: begin opnieuw, maar niet met het laatst getoonde recept.
  if (!next) return order.find((r) => r.id !== input.skipped[input.skipped.length - 1]) ?? order[0];
  return next;
}
