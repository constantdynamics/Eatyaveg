/**
 * Groente gegeten (§6.2): raster met groenten, kinderen als chips (standaard allemaal),
 * opslaan met per kind "Toon aan [naam]". Vanuit een recept staan de groenten al klaar.
 */
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useOpenGarden } from '../../app/useOpenGarden';
import { Button, LinkButton } from '../../components/Button';
import { ChildAvatar } from '../../components/ChildAvatar';
import { Chip } from '../../components/Chip';
import { Dialog } from '../../components/Dialog';
import { PageHeader } from '../../components/PageHeader';
import { VeggieGrid } from '../../components/VeggieGrid';
import { SettingsLink } from '../../app/SettingsLink';
import { joinNames } from '../../content/lines';
import { getRecipe } from '../../content/recipes';
import { VEGGIE_BY_ID } from '../../content/veggies';
import type { RegisterResult } from '../../store/app-store';
import type { Child, VeggieId, Visibility } from '../../domain/types';
import { nl } from '../../i18n/nl';
import { useAppStore } from '../../store/app-store';
import { useUiStore } from '../../store/ui-store';
import { useEnabledVeggies } from '../../store/selectors';

interface SavedState {
  result: RegisterResult;
  children: Child[];
}

function SavedDialog({ saved, onClose }: { saved: SavedState | undefined; onClose: () => void }) {
  const openGarden = useOpenGarden();
  const dailyCap = useAppStore((s) => s.settings.dailyCap);
  const removeEvents = useAppStore((s) => s.removeEvents);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  if (!saved)
    return (
      <Dialog open={false} onClose={onClose} title="">
        {null}
      </Dialog>
    );
  const { result, children } = saved;
  const cappedText = result.capped.map((c) => {
    const child = children.find((k) => k.id === c.childId);
    return `${VEGGIE_BY_ID[c.veggieId].name} (${child?.name ?? ''})`;
  });
  const childrenWithNews = children.filter((c) => result.added.some((e) => e.childId === c.id));

  return (
    <Dialog
      open
      onClose={onClose}
      title={result.added.length > 0 ? 'Opgeslagen. Elke hap telt!' : 'Niets nieuws opgeslagen'}
    >
      {result.added.length > 0 && (
        <p className="text-ink-soft">
          Geef het scherm aan {joinNames(childrenWithNews.map((c) => c.name))} en kijk wat er
          gebeurt in de tuin.
        </p>
      )}
      {cappedText.length > 0 && (
        <p className="mt-3 text-ink-soft">
          {joinNames(cappedText)} telde vandaag al {dailyCap} keer mee. Morgen weer een kans.
        </p>
      )}
      <div className="mt-5 grid gap-2">
        {childrenWithNews.map((c, i) => (
          <Button
            key={c.id}
            size="lg"
            variant={i === 0 ? 'primary' : 'secondary'}
            block
            icon={<ChildAvatar child={c} size="sm" />}
            onClick={() => {
              onClose();
              openGarden(c.id);
            }}
          >
            {nl.common.showTo(c.name)}
          </Button>
        ))}
        <LinkButton to="/" variant="ghost" block onClick={onClose}>
          Terug naar Vandaag
        </LinkButton>
        {result.added.length > 0 && (
          <Button
            variant="ghost"
            block
            onClick={() => {
              removeEvents(result.added.map((e) => e.id));
              onClose();
              showSnackbar({ text: 'Niet opgeslagen. Er is niets veranderd.' });
            }}
          >
            {nl.common.undo}
          </Button>
        )}
      </div>
    </Dialog>
  );
}

export function LoggingPage() {
  const [params] = useSearchParams();
  const recipe = getRecipe(params.get('recept') ?? undefined);
  const zicht = Number(params.get('zicht'));
  const visibility = ([1, 2, 3, 4] as const).includes(zicht as Visibility)
    ? (zicht as Visibility)
    : recipe?.visibility;

  const children = useAppStore((s) => s.children);
  const register = useAppStore((s) => s.registerEats);
  const markCookedLogged = useAppStore((s) => s.markCookedLogged);
  const cooked = useAppStore((s) => s.meta.cooked);
  const veggies = useEnabledVeggies();

  const initialVeggies = useMemo(
    () =>
      new Set<VeggieId>(
        recipe ? recipe.veggies.filter((v) => veggies.some((x) => x.id === v)) : [],
      ),
    [recipe, veggies],
  );
  const [selected, setSelected] = useState<Set<VeggieId>>(initialVeggies);
  const [childIds, setChildIds] = useState<Set<string>>(() => new Set(children.map((c) => c.id)));
  const [saved, setSaved] = useState<SavedState>();

  const toggleVeggie = (id: VeggieId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleChild = (id: string) =>
    setChildIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canSave = selected.size > 0 && childIds.size > 0;

  const save = () => {
    const chosenChildren = children.filter((c) => childIds.has(c.id));
    const result = register({
      childIds: chosenChildren.map((c) => c.id),
      veggieIds: [...selected],
      source: recipe ? 'recept' : 'raster',
      ...(recipe ? { recipeId: recipe.id } : {}),
      ...(recipe && visibility ? { visibility } : {}),
    });
    if (recipe && cooked?.recipeId === recipe.id) markCookedLogged();
    setSaved({ result, children: chosenChildren });
    setSelected(new Set());
  };

  return (
    <>
      <PageHeader
        title="Wat is er geproefd?"
        subtitle={nl.logged.label}
        actions={<SettingsLink />}
      />
      {recipe && (
        <p className="mb-4 rounded-card bg-sand px-4 py-3">
          Uit het recept{' '}
          <Link to={`/recepten/${recipe.id}`} className="font-bold underline underline-offset-2">
            {recipe.name}
          </Link>
          . De groenten staan al klaar.
        </p>
      )}
      {children.length > 1 && (
        <div role="group" aria-label="Wie heeft er geproefd?" className="mb-4 flex flex-wrap gap-2">
          {children.map((c) => (
            <Chip
              key={c.id}
              selected={childIds.has(c.id)}
              onClick={() => toggleChild(c.id)}
              icon={<ChildAvatar child={c} size="sm" />}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      )}
      <VeggieGrid
        veggies={veggies}
        selected={selected}
        onToggle={toggleVeggie}
        label="Kies de groenten"
      />
      <p className="mt-4 text-sm text-ink-soft">{nl.micro.everyBite} Proeven telt ook.</p>
      <div
        className="sticky z-20 mt-4 bg-cream pb-2 pt-3"
        style={{ bottom: 'calc(var(--nav-height) + var(--safe-bottom))' }}
      >
        <Button variant="primary" size="lg" block disabled={!canSave} onClick={save}>
          {selected.size > 1 ? `Opslaan (${selected.size} groenten)` : 'Opslaan'}
        </Button>
      </div>
      <SavedDialog saved={saved} onClose={() => setSaved(undefined)} />
    </>
  );
}
