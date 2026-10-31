/** Groente-detail (§6.3): voortgang per kind, geschiedenis, Weer oefenen, tips en recepten. */
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useOpenGarden } from '../../app/useOpenGarden';
import { NotFound } from '../../app/NotFound';
import { Button } from '../../components/Button';
import { ChildSwitcher } from '../../components/ChildSwitcher';
import { Drops } from '../../components/Drops';
import { IconButton } from '../../components/IconButton';
import { PageHeader } from '../../components/PageHeader';
import { RecipeRow } from '../../components/RecipeRow';
import { Toggle } from '../../components/Toggle';
import { VeggieIcon } from '../../components/VeggieIcon';
import { phaseDef, powerText, progressStatus } from '../../content/phases';
import { RECIPES, getRecipe } from '../../content/recipes';
import { VEGGIE_BY_ID } from '../../content/veggies';
import { VISIBILITY_LABEL } from '../../domain/recipes';
import type { Child, EatEvent, Phase, Veggie, VeggieId, Visibility } from '../../domain/types';
import { VEGGIE_IDS } from '../../domain/types';
import { nl } from '../../i18n/nl';
import { formatDateTime } from '../../lib/dates';
import { useAppStore } from '../../store/app-store';
import { useChildProgress, useSelectedChild } from '../../store/selectors';
import { useUiStore } from '../../store/ui-store';
import { useQuickRegister } from '../logging/useQuickRegister';

const SOURCE_LABEL: Record<EatEvent['source'], string> = {
  plus: 'Met de plusknop',
  raster: 'Via Gegeten',
  recept: 'Uit een recept',
  start: 'Al bekend bij de start',
};

function ProgressCard({ child, veggie }: { child: Child; veggie: Veggie }) {
  const all = useChildProgress(child.id);
  const parentNames = useAppStore((s) => s.settings.parentNames);
  const quickRegister = useQuickRegister();
  const openGarden = useOpenGarden();
  const p = all?.[veggie.id];
  if (!p) return null;
  const def = p.phase > 0 ? phaseDef(p.phase as Exclude<Phase, 0>) : undefined;

  return (
    <section className="fv-card p-5" aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-xl">
        {veggie.buddyName} bij {child.name}
      </h2>
      <p className="mt-1 text-ink-soft">{progressStatus(p)}</p>
      {def && (
        <p className="mt-3">
          {veggie.buddyName} kan {powerText(def.phase, parentNames)}.
        </p>
      )}
      {p.dropsNeeded > 0 && (
        <p className="mt-3 flex items-center gap-2">
          <Drops filled={p.drops} total={p.dropsNeeded} />
          <span className="text-sm text-ink-soft">
            {p.drops} van {p.dropsNeeded} druppels
          </span>
        </p>
      )}
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-card bg-sand p-3">
          <dt className="text-sm text-ink-soft">Gegeten of geproefd</dt>
          <dd className="font-heading text-2xl font-extrabold">{p.count}×</dd>
        </div>
        <div className="rounded-card bg-sand p-3">
          <dt className="text-sm text-ink-soft">Record</dt>
          <dd className="font-heading text-2xl font-extrabold">
            {p.record > 0 ? phaseDef(p.record as Exclude<Phase, 0>).animal : 'zaadje'}
          </dd>
        </div>
      </dl>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          variant="primary"
          icon={<Plus size={20} aria-hidden="true" />}
          onClick={() => quickRegister(child, veggie.id)}
        >
          Gegeten of geproefd
        </Button>
        <Button onClick={() => openGarden(child.id, veggie.id)}>
          {nl.micro.whoIsWaiting.replace('!', '')}
        </Button>
      </div>
    </section>
  );
}

function PracticeToggle({ child, veggie }: { child: Child; veggie: Veggie }) {
  const all = useChildProgress(child.id);
  const setPractice = useAppStore((s) => s.setPractice);
  const settings = useAppStore((s) => s.settings);
  const p = all?.[veggie.id];
  if (!p) return null;
  return (
    <section className="mt-4 fv-card p-5" aria-label="Weer oefenen">
      <Toggle
        label="Weer oefenen"
        checked={p.practicing}
        onChange={(on) => setPractice(child.id, veggie.id, on)}
        description={`Proeft ${child.name} ${veggie.spoken} ${settings.shrinkDays} dagen niet, dan wordt ${veggie.buddyName} een stapje kleiner (nooit meer dan ${settings.maxShrink}). Terug groeien gaat sneller. In de tuin is ${veggie.buddyName} nooit verdrietig. Staat het uit, dan krimpt er nooit iets.`}
      />
    </section>
  );
}

function History({ child, veggieId }: { child: Child; veggieId: VeggieId }) {
  const events = useAppStore((s) => s.eatEvents);
  const removeEvents = useAppStore((s) => s.removeEvents);
  const restoreEvents = useAppStore((s) => s.restoreEvents);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const mine = useMemo(
    () =>
      events
        .filter((e) => e.childId === child.id && e.veggieId === veggieId)
        .sort((a, b) => Date.parse(b.at) - Date.parse(a.at)),
    [events, child.id, veggieId],
  );

  return (
    <section className="mt-8" aria-labelledby="history-title">
      <h2 id="history-title" className="text-xl">
        Geschiedenis
      </h2>
      {mine.length === 0 ? (
        <p className="mt-2 text-ink-soft">Nog niets aangetikt. Het zaadje wacht rustig af.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {mine.slice(0, 50).map((e) => {
            const recipe = getRecipe(e.recipeId);
            return (
              <li key={e.id} className="flex items-center gap-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block">{formatDateTime(e.at)}</span>
                  <span className="block text-sm text-ink-soft">
                    {recipe ? `Uit ${recipe.name}` : SOURCE_LABEL[e.source]}
                    {e.visibility ? ` · ${VISIBILITY_LABEL[e.visibility].toLowerCase()}` : ''}
                  </span>
                </span>
                <IconButton
                  label={`Verwijder registratie van ${formatDateTime(e.at)}`}
                  icon={<Trash2 size={20} aria-hidden="true" />}
                  onClick={() => {
                    removeEvents([e.id]);
                    showSnackbar({
                      text: 'Registratie verwijderd.',
                      actions: [
                        {
                          label: nl.common.undo,
                          onClick: () => restoreEvents([e]),
                        },
                      ],
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Tips({ veggie }: { veggie: Veggie }) {
  const groups: [string, string[]][] = [
    ['Zo verstop je het', veggie.tips.verstoppen],
    ['Bij weerstand', veggie.tips.weerstand],
    ['Volgende stap', veggie.tips.volgendeStap],
  ];
  return (
    <section className="mt-8" aria-labelledby="tips-title">
      <h2 id="tips-title" className="text-xl">
        Tips
      </h2>
      <div className="mt-2 space-y-4">
        {groups.map(([title, tips]) => (
          <div key={title}>
            <h3 className="text-lg">{title}</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecipesByVisibility({ veggieId }: { veggieId: VeggieId }) {
  const favorites = useAppStore((s) => s.settings.favoriteRecipeIds);
  const groups = ([1, 2, 3, 4] as Visibility[])
    .map((v) => ({
      v,
      recipes: RECIPES.filter((r) => r.veggies.includes(veggieId) && r.visibility === v),
    }))
    .filter((g) => g.recipes.length > 0);
  return (
    <section className="mt-8" aria-labelledby="recipes-title">
      <h2 id="recipes-title" className="text-xl">
        Recepten
      </h2>
      <p className="mt-1 text-ink-soft">Van onzichtbaar naar de groente zelf.</p>
      {groups.map((g) => (
        <div key={g.v} className="mt-4">
          <h3 className="text-lg">
            {VISIBILITY_LABEL[g.v]}
            {g.v === 1 && (
              <span className="font-body text-base font-normal text-ink-soft">
                {' '}
                (vaak ook licht zichtbaar)
              </span>
            )}
          </h3>
          <ul className="divide-y divide-line">
            {g.recipes.map((r) => (
              <RecipeRow key={r.id} recipe={r} favorite={favorites.includes(r.id)} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function VeggieDetailPage() {
  const { id } = useParams();
  const child = useSelectedChild();
  const veggie = (VEGGIE_IDS as readonly string[]).includes(id ?? '')
    ? VEGGIE_BY_ID[id as VeggieId]
    : undefined;
  if (!veggie) return <NotFound />;

  return (
    <>
      <PageHeader title={veggie.name} back="/" />
      <div className="fv-tile mb-4 flex h-44 items-center justify-center">
        <VeggieIcon id={veggie.id} size={140} />
      </div>
      <ChildSwitcher />
      {child && (
        <>
          <ProgressCard child={child} veggie={veggie} />
          <PracticeToggle child={child} veggie={veggie} />
          <History child={child} veggieId={veggie.id} />
        </>
      )}
      <Tips veggie={veggie} />
      <RecipesByVisibility veggieId={veggie.id} />
    </>
  );
}
