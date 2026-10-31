import { Link } from 'react-router';
import { Clock, RefreshCw } from 'lucide-react';
import { useOpenGarden } from '../../app/useOpenGarden';
import { LinkButton, Button } from '../../components/Button';
import { VeggieIcon } from '../../components/VeggieIcon';
import { VEGGIE_BY_ID } from '../../content/veggies';
import type { Child } from '../../domain/types';
import { nl } from '../../i18n/nl';
import { useDailyRecipe } from './useDailyRecipe';

export function DailyRecipeCard({ child }: { child: Child | undefined }) {
  const { recipe, next } = useDailyRecipe();
  const openGarden = useOpenGarden();

  if (!recipe) {
    return (
      <section className="fv-card p-5">
        <h2 className="text-xl">Recept van vandaag</h2>
        <p className="mt-1 text-ink-soft">
          Er past vandaag geen recept bij je instellingen. Kijk bij de allergieën of groenten in de
          instellingen.
        </p>
      </section>
    );
  }
  const veggie = VEGGIE_BY_ID[recipe.mainVeggie];

  return (
    <section aria-labelledby="daily-title" className="fv-card overflow-hidden">
      <Link to={`/recepten/${recipe.id}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="fv-tile flex h-40 items-center justify-center rounded-b-none sm:h-48">
          <VeggieIcon id={recipe.mainVeggie} size={128} />
        </div>
      </Link>
      <div className="p-5">
        <p className="text-sm font-bold text-ink-soft">Recept van vandaag</p>
        <h2 id="daily-title" className="mt-1 text-2xl">
          {recipe.name}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
          <Clock size={16} aria-hidden="true" />
          {recipe.timeMinutes} min · met {veggie.name.toLowerCase()}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <LinkButton to={`/recepten/${recipe.id}`} variant="primary" size="lg" block>
            Bekijk recept
          </LinkButton>
          {child && (
            <Button size="lg" block onClick={() => openGarden(child.id, recipe.mainVeggie)}>
              {nl.micro.whoIsWaiting.replace('!', '')}
            </Button>
          )}
        </div>
        <div className="mt-2 flex justify-center">
          <Button variant="ghost" onClick={next} icon={<RefreshCw size={18} aria-hidden="true" />}>
            Ander recept
          </Button>
        </div>
      </div>
    </section>
  );
}
