import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { recipeMeta } from '../domain/recipes';
import type { Recipe } from '../domain/types';
import { VeggieIcon } from './VeggieIcon';

interface RecipeRowProps {
  recipe: Recipe;
  favorite?: boolean;
}

/** Rustige receptregel: illustratie van de hoofdgroente op een zandtegel, naam en kerninfo. */
export function RecipeRow({ recipe, favorite }: RecipeRowProps) {
  return (
    <li>
      <Link
        to={`/recepten/${recipe.id}`}
        className="flex items-center gap-4 rounded-card py-3 pr-2 hover:bg-sand/60"
      >
        <span className="fv-tile flex h-16 w-16 shrink-0 items-center justify-center">
          <VeggieIcon id={recipe.mainVeggie} size={48} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-heading text-lg font-bold leading-snug">
            {recipe.name}
            {favorite && (
              <Heart size={16} className="shrink-0 fill-accent text-accent" aria-label="Favoriet" />
            )}
          </span>
          <span className="block text-sm text-ink-soft">{recipeMeta(recipe)}</span>
        </span>
      </Link>
    </li>
  );
}
