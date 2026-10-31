import type { Recipe } from '../../domain/types';
import { bloemkoolRecipes } from './bloemkool';
import { broccoliRecipes } from './broccoli';
import { courgetteRecipes } from './courgette';
import { doperwtenRecipes } from './doperwten';
import { komkommerRecipes } from './komkommer';
import { paprikaRecipes } from './paprika';
import { pompoenRecipes } from './pompoen';
import { preiRecipes } from './prei';
import { rodeBietRecipes } from './rode-biet';
import { smoothieRecipes } from './smoothies';
import { spinazieRecipes } from './spinazie';
import { spruitjesRecipes } from './spruitjes';
import { sperziebonenRecipes } from './sperziebonen';
import { tomaatRecipes } from './tomaat';
import { weekendRecipes } from './weekend';
import { wortelRecipes } from './wortel';

export const RECIPES: Recipe[] = [
  ...wortelRecipes,
  ...courgetteRecipes,
  ...pompoenRecipes,
  ...komkommerRecipes,
  ...tomaatRecipes,
  ...doperwtenRecipes,
  ...bloemkoolRecipes,
  ...sperziebonenRecipes,
  ...preiRecipes,
  ...paprikaRecipes,
  ...broccoliRecipes,
  ...spinazieRecipes,
  ...rodeBietRecipes,
  ...spruitjesRecipes,
  ...weekendRecipes,
  ...smoothieRecipes,
];

export const RECIPE_BY_ID: ReadonlyMap<string, Recipe> = new Map(RECIPES.map((r) => [r.id, r]));

export function getRecipe(id: string | undefined): Recipe | undefined {
  return id ? RECIPE_BY_ID.get(id) : undefined;
}
