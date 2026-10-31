import { LinkButton } from '../../components/Button';
import { getRecipe } from '../../content/recipes';
import { visibilityFor } from '../../domain/recipes';
import { useToday } from '../../lib/clock';
import { useAppStore } from '../../store/app-store';

/** Na het koken: "Hebben jullie [recept] gegeten? Tik aan wat er geproefd is." */
export function CookedCard() {
  const today = useToday();
  const cooked = useAppStore((s) => s.meta.cooked);
  if (!cooked || cooked.date !== today || cooked.logged) return null;
  const recipe = getRecipe(cooked.recipeId);
  if (!recipe) return null;
  const zicht = visibilityFor(recipe, cooked.variant);
  return (
    <section className="fv-card mb-4 p-5" aria-labelledby="cooked-title">
      <h2 id="cooked-title" className="text-xl">
        Hebben jullie {recipe.name.toLowerCase()} gegeten?
      </h2>
      <p className="mt-1 text-ink-soft">Tik aan wat er geproefd is. Eén hapje telt.</p>
      <LinkButton
        to={`/gegeten?recept=${recipe.id}&zicht=${zicht}`}
        variant="primary"
        size="lg"
        className="mt-4"
      >
        Aantikken
      </LinkButton>
    </section>
  );
}
