/** Receptenoverzicht (§6.4): zoeken en filters, een rustige lijst. */
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SettingsLink } from '../../app/SettingsLink';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Dialog } from '../../components/Dialog';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { RecipeRow } from '../../components/RecipeRow';
import { RECIPES } from '../../content/recipes';
import { VEGGIES, VEGGIE_BY_ID } from '../../content/veggies';
import {
  ALLERGEN_LABEL,
  CATEGORY_LABEL,
  matchesFilters,
  type RecipeFilters,
  type TimeFilter,
  type VisibilityFilter,
} from '../../domain/recipes';
import { VEGGIE_IDS, type RecipeCategory, type VeggieId } from '../../domain/types';
import { joinNames } from '../../content/lines';
import { useAppStore } from '../../store/app-store';

const TIME_LABEL: Record<TimeFilter, string> = {
  le15: 'Tot 15 min',
  le30: 'Tot 30 min',
  weekend: 'Weekend',
};
const VIS_LABEL: Record<VisibilityFilter, string> = {
  onzichtbaar: 'Onzichtbaar',
  licht: 'Licht zichtbaar',
  'volgende-stap': 'Volgende stap',
};
const CATEGORIES = Object.keys(CATEGORY_LABEL) as RecipeCategory[];
const veggieNames = Object.fromEntries(VEGGIES.map((v) => [v.id, v.name])) as Record<
  VeggieId,
  string
>;
const sortedVeggies = [...VEGGIES].sort((a, b) => a.name.localeCompare(b.name, 'nl'));

function readFilters(params: URLSearchParams): RecipeFilters {
  const veggie = params.get('groente');
  const category = params.get('soort');
  const time = params.get('tijd');
  const visibility = params.get('zicht');
  return {
    query: params.get('q') ?? '',
    ...((VEGGIE_IDS as readonly string[]).includes(veggie ?? '')
      ? { veggie: veggie as VeggieId }
      : {}),
    ...(CATEGORIES.includes(category as RecipeCategory)
      ? { category: category as RecipeCategory }
      : {}),
    ...(time && time in TIME_LABEL ? { time: time as TimeFilter } : {}),
    ...(visibility && visibility in VIS_LABEL
      ? { visibility: visibility as VisibilityFilter }
      : {}),
    favoritesOnly: params.get('fav') === '1',
  };
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: RecipeFilters;
  set: (key: string, value: string | undefined) => void;
}

function FilterDialog({ open, onClose, filters, set }: FilterDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <Button variant="primary" onClick={onClose}>
          Toon recepten
        </Button>
      }
    >
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Groente</legend>
        <div className="flex flex-wrap gap-2">
          {sortedVeggies.map((v) => (
            <Chip
              key={v.id}
              selected={filters.veggie === v.id}
              onClick={() => set('groente', filters.veggie === v.id ? undefined : v.id)}
            >
              {v.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Soort</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              selected={filters.category === c}
              onClick={() => set('soort', filters.category === c ? undefined : c)}
            >
              {CATEGORY_LABEL[c]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Tijd</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TIME_LABEL) as TimeFilter[]).map((t) => (
            <Chip
              key={t}
              selected={filters.time === t}
              onClick={() => set('tijd', filters.time === t ? undefined : t)}
            >
              {TIME_LABEL[t]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Zichtbaarheid</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(VIS_LABEL) as VisibilityFilter[]).map((v) => (
            <Chip
              key={v}
              selected={filters.visibility === v}
              onClick={() => set('zicht', filters.visibility === v ? undefined : v)}
            >
              {VIS_LABEL[v]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-bold">Favorieten</legend>
        <Chip
          selected={Boolean(filters.favoritesOnly)}
          onClick={() => set('fav', filters.favoritesOnly ? undefined : '1')}
        >
          Alleen favorieten
        </Chip>
      </fieldset>
    </Dialog>
  );
}

export function RecipesPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const allergies = useAppStore((s) => s.settings.allergies);
  const favorites = useAppStore((s) => s.settings.favoriteRecipeIds);
  const filters = readFilters(params);

  const set = (key: string, value: string | undefined) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const results = useMemo(
    () =>
      RECIPES.filter((r) => matchesFilters(r, { ...filters, allergies, favorites }, veggieNames)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, allergies, favorites],
  );

  const active: { key: string; label: string }[] = [];
  if (filters.veggie) active.push({ key: 'groente', label: VEGGIE_BY_ID[filters.veggie].name });
  if (filters.category) active.push({ key: 'soort', label: CATEGORY_LABEL[filters.category] });
  if (filters.time) active.push({ key: 'tijd', label: TIME_LABEL[filters.time] });
  if (filters.visibility) active.push({ key: 'zicht', label: VIS_LABEL[filters.visibility] });
  if (filters.favoritesOnly) active.push({ key: 'fav', label: 'Favorieten' });

  return (
    <>
      <PageHeader title="Recepten" actions={<SettingsLink />} />
      <div className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Zoek een recept</span>
          <Search
            size={20}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            value={filters.query ?? ''}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Zoek op recept of groente"
            className="min-h-12 w-full rounded-card border border-line bg-paper pl-12 pr-4 text-base placeholder:text-ink-soft/80 focus-visible:border-accent"
          />
        </label>
        <Button
          onClick={() => setFiltersOpen(true)}
          icon={<SlidersHorizontal size={20} aria-hidden="true" />}
        >
          Filters{active.length > 0 ? ` (${active.length})` : ''}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {active.length === 0 ? (
          <>
            <Chip selected={false} onClick={() => set('zicht', 'volgende-stap')}>
              Volgende stap
            </Chip>
            <Chip selected={false} onClick={() => set('tijd', 'le15')}>
              Tot 15 min
            </Chip>
            <Chip selected={false} onClick={() => set('soort', 'smoothie')}>
              Smoothies
            </Chip>
          </>
        ) : (
          active.map((a) => (
            <Chip
              key={a.key}
              selected
              onClick={() => set(a.key, undefined)}
              label={`Filter ${a.label} weghalen`}
              icon={<X size={16} aria-hidden="true" />}
            >
              {a.label}
            </Chip>
          ))
        )}
      </div>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {results.length === 1 ? '1 recept' : `${results.length} recepten`}
        {allergies.length > 0 &&
          ` · zonder ${joinNames(allergies.map((a) => ALLERGEN_LABEL[a].toLowerCase()))} (instellingen)`}
      </p>
      {results.length === 0 ? (
        <EmptyState
          title="Geen recepten gevonden"
          text="Probeer een ander filter of een andere zoekterm."
        />
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {results.map((r) => (
            <RecipeRow key={r.id} recipe={r} favorite={favorites.includes(r.id)} />
          ))}
        </ul>
      )}
      <FilterDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        set={set}
      />
    </>
  );
}
