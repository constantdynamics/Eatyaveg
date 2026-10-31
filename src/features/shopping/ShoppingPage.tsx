/**
 * Boodschappenlijst (§10.1): optellen, groeperen per afdeling, afvinken, "heb ik al", zelf
 * toevoegen, recepten weghalen en delen als platte tekst.
 */
import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Check, Home, Plus, Share2, X } from 'lucide-react';
import { SettingsLink } from '../../app/SettingsLink';
import { Button, LinkButton } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import { PageHeader } from '../../components/PageHeader';
import { RECIPE_BY_ID } from '../../content/recipes';
import {
  buildShoppingItems,
  groupBySection,
  itemLabel,
  shoppingListText,
} from '../../domain/shopping';
import type { ShoppingItem } from '../../domain/types';
import { shareText } from '../../lib/share';
import { useAppStore } from '../../store/app-store';
import { useUiStore } from '../../store/ui-store';

function ItemRow({ item }: { item: ShoppingItem }) {
  const setState = useAppStore((s) => s.setShoppingItemState);
  const removeManual = useAppStore((s) => s.removeManualItem);
  const label = itemLabel(item);
  const recipes = item.recipeIds.map((id) => RECIPE_BY_ID.get(id)?.name).filter(Boolean);
  return (
    <li className="flex items-center gap-2 py-1.5">
      <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={item.bought}
          onChange={(e) => setState(item.id, { bought: e.target.checked })}
        />
        <span
          aria-hidden="true"
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-accent ${
            item.bought ? 'border-accent bg-accent text-white' : 'border-line bg-paper'
          }`}
        >
          {item.bought && <Check size={18} strokeWidth={3} />}
        </span>
        <span className="min-w-0">
          <span
            className={`block ${item.bought || item.atHome ? 'text-ink-soft line-through' : ''}`}
          >
            {label}
          </span>
          {(item.atHome || recipes.length > 1) && (
            <span className="block text-sm text-ink-soft">
              {item.atHome ? 'Heb ik al in huis' : `Voor ${recipes.length} recepten`}
            </span>
          )}
        </span>
      </label>
      <IconButton
        label={item.atHome ? `${item.name}: toch nog kopen` : `${item.name}: heb ik al in huis`}
        aria-pressed={item.atHome}
        tone={item.atHome ? 'soft' : 'plain'}
        icon={<Home size={20} aria-hidden="true" />}
        onClick={() => setState(item.id, { atHome: !item.atHome })}
      />
      {item.manual && (
        <IconButton
          label={`${item.name} weghalen`}
          icon={<X size={20} aria-hidden="true" />}
          onClick={() => removeManual(item.id.replace(/^manual:/, ''))}
        />
      )}
    </li>
  );
}

export function ShoppingPage() {
  const shopping = useAppStore((s) => s.shopping);
  const addManual = useAppStore((s) => s.addManualItem);
  const removeRecipe = useAppStore((s) => s.removeRecipeFromShopping);
  const removeBought = useAppStore((s) => s.removeBoughtItems);
  const clear = useAppStore((s) => s.clearShopping);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const [draft, setDraft] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const items = useMemo(
    () => buildShoppingItems(shopping.recipes, RECIPE_BY_ID, shopping.manual, shopping.items),
    [shopping],
  );
  const { groups, basics } = groupBySection(items);
  const bought = items.filter((i) => i.bought);
  const empty = shopping.recipes.length === 0 && shopping.manual.length === 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addManual(draft);
    setDraft('');
  };

  const share = async () => {
    const result = await shareText('Boodschappen', shoppingListText(items));
    if (result === 'copied') showSnackbar({ text: 'De lijst staat op het klembord.' });
    if (result === 'failed') showSnackbar({ text: 'Delen lukte niet op dit apparaat.' });
  };

  return (
    <>
      <PageHeader title="Boodschappen" actions={<SettingsLink />} />
      <form onSubmit={submit} className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Zelf iets toevoegen</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={80}
            placeholder="Zelf iets toevoegen"
            className="min-h-12 w-full rounded-card border border-line bg-paper px-4 text-base placeholder:text-ink-soft/80 focus-visible:border-accent"
          />
        </label>
        <Button type="submit" disabled={!draft.trim()} icon={<Plus size={20} aria-hidden="true" />}>
          Toevoegen
        </Button>
      </form>

      {empty ? (
        <EmptyState
          title="Je lijst is nog leeg"
          text="Zet een recept op je lijst. Gelijke ingrediënten worden vanzelf opgeteld."
          action={
            <LinkButton to="/recepten" variant="primary">
              Naar de recepten
            </LinkButton>
          }
        />
      ) : (
        <>
          {shopping.recipes.length > 0 && (
            <section aria-labelledby="sl-recepten" className="mt-6">
              <h2 id="sl-recepten" className="text-lg">
                Recepten op je lijst
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {shopping.recipes.map((r) => {
                  const recipe = RECIPE_BY_ID.get(r.recipeId);
                  if (!recipe) return null;
                  return (
                    <li
                      key={r.recipeId}
                      className="inline-flex items-center gap-1 rounded-card border border-line bg-paper py-1 pl-4 pr-1"
                    >
                      <Link
                        to={`/recepten/${recipe.id}?porties=${r.servings}&variant=${r.variant}`}
                        className="font-bold"
                      >
                        {recipe.name}
                      </Link>
                      <span className="text-sm text-ink-soft">· {r.servings} pers.</span>
                      <IconButton
                        label={`${recipe.name} van de lijst halen`}
                        icon={<X size={18} aria-hidden="true" />}
                        onClick={() => removeRecipe(recipe.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {groups.map((g) => (
            <section key={g.section} aria-labelledby={`sl-${g.section}`} className="mt-6">
              <h2 id={`sl-${g.section}`} className="text-lg">
                {g.label}
              </h2>
              <ul className="mt-1 divide-y divide-line">
                {g.items.map((i) => (
                  <ItemRow key={i.id} item={i} />
                ))}
              </ul>
            </section>
          ))}

          {basics.length > 0 && (
            <details className="mt-6 rounded-card bg-sand px-4 py-2">
              <summary className="flex min-h-12 cursor-pointer items-center font-heading text-lg font-bold">
                Heb je dit in huis? ({basics.length})
              </summary>
              <ul className="divide-y divide-line pb-2">
                {basics.map((i) => (
                  <ItemRow key={i.id} item={i} />
                ))}
              </ul>
            </details>
          )}

          <div className="mt-8 grid gap-2 sm:grid-cols-3">
            <Button
              variant="primary"
              icon={<Share2 size={20} aria-hidden="true" />}
              onClick={() => void share()}
            >
              Delen
            </Button>
            <Button
              disabled={bought.length === 0}
              onClick={() => removeBought(bought.map((i) => i.id))}
            >
              Afgevinkte weghalen
            </Button>
            <Button variant="danger" onClick={() => setConfirmClear(true)}>
              Lijst leegmaken
            </Button>
          </div>
        </>
      )}

      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Lijst leegmaken?"
        footer={
          <>
            <Button onClick={() => setConfirmClear(false)}>Annuleren</Button>
            <Button
              variant="danger"
              onClick={() => {
                clear();
                setConfirmClear(false);
              }}
            >
              Leegmaken
            </Button>
          </>
        }
      >
        <p>Alle recepten en zelf toegevoegde dingen gaan van de lijst.</p>
      </Dialog>
    </>
  );
}
