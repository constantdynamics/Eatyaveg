import { useSearchParams } from 'react-router';
import type { Recipe, VariantKey } from '../../domain/types';

/** Porties en variant staan in de URL, zodat de kookmodus ze overneemt. */
export function useRecipeOptions(recipe: Recipe | undefined) {
  const [params, setParams] = useSearchParams();
  const servings = Math.min(
    12,
    Math.max(1, Number(params.get('porties')) || recipe?.servings || 4),
  );
  const variant: VariantKey = params.get('variant') === 'zichtbaar' ? 'zichtbaar' : 'verstopt';
  const update = (patch: { porties?: number; variant?: VariantKey }) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (patch.porties !== undefined) next.set('porties', String(patch.porties));
        if (patch.variant !== undefined) next.set('variant', patch.variant);
        return next;
      },
      { replace: true },
    );
  return { servings, variant, update, query: `porties=${servings}&variant=${variant}` };
}
