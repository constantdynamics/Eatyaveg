/** Recept (§6.4): varianten, porties, ingrediënten, stappen, tips en acties. */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChefHat, Clock, Heart, ShoppingBasket, Sprout, Users, Utensils } from 'lucide-react';
import { ChildPickerDialog } from '../../app/ChildPickerDialog';
import { NotFound } from '../../app/NotFound';
import { useOpenGarden } from '../../app/useOpenGarden';
import { Button, LinkButton } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { PageHeader } from '../../components/PageHeader';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Stepper } from '../../components/Stepper';
import { VeggieIcon } from '../../components/VeggieIcon';
import { joinNames } from '../../content/lines';
import { getRecipe } from '../../content/recipes';
import { VEGGIE_BY_ID } from '../../content/veggies';
import {
  ALLERGEN_LABEL,
  CATEGORY_LABEL,
  ingredientsFor,
  stepsFor,
  visibilityFor,
  VISIBILITY_LABEL,
} from '../../domain/recipes';
import { formatAmount, scaleIngredient } from '../../domain/scaling';
import type { Recipe } from '../../domain/types';
import { useAppStore } from '../../store/app-store';
import { useUiStore } from '../../store/ui-store';
import { useRecipeOptions } from './useRecipeOptions';

const TIP_LABELS: [keyof Recipe['tips'], string][] = [
  ['verstoppen', 'Zo verstop je het'],
  ['weerstand', 'Bij weerstand'],
  ['bewaren', 'Bewaren'],
  ['veiligheid', 'Veilig eten'],
];

export function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = getRecipe(id);
  const { servings, variant, update, query } = useRecipeOptions(recipe);
  const favorites = useAppStore((s) => s.settings.favoriteRecipeIds);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addToShopping = useAppStore((s) => s.addRecipeToShopping);
  const children = useAppStore((s) => s.children);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const openGarden = useOpenGarden();
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);

  if (!recipe) return <NotFound />;
  const favorite = favorites.includes(recipe.id);
  const ingredients = ingredientsFor(recipe, variant).map((i) =>
    scaleIngredient(i, recipe.servings, servings),
  );
  const steps = stepsFor(recipe, variant);
  const veggieNames = recipe.veggies.map((v) => VEGGIE_BY_ID[v].name.toLowerCase());
  const zicht = visibilityFor(recipe, variant);

  return (
    <>
      <PageHeader
        title={recipe.name}
        back="/recepten"
        actions={
          <IconButton
            label={favorite ? 'Verwijder uit favorieten' : 'Bewaar als favoriet'}
            aria-pressed={favorite}
            icon={
              <Heart
                size={24}
                aria-hidden="true"
                className={favorite ? 'fill-accent text-accent' : ''}
              />
            }
            onClick={() => toggleFavorite(recipe.id)}
          />
        }
      />
      <div className="fv-tile mb-5 flex h-44 items-center justify-center sm:h-56">
        <VeggieIcon id={recipe.mainVeggie} size={150} />
      </div>
      <p className="text-lg">{recipe.description}</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
        <li className="flex items-center gap-1.5">
          <Clock size={18} aria-hidden="true" />
          {recipe.timeMinutes} min{recipe.weekend ? ' · weekend' : ''}
        </li>
        <li className="flex items-center gap-1.5">
          <ChefHat size={18} aria-hidden="true" />
          {recipe.difficulty}
        </li>
        <li className="flex items-center gap-1.5">
          <Utensils size={18} aria-hidden="true" />
          {CATEGORY_LABEL[recipe.category]}
        </li>
      </ul>
      <p className="mt-2">
        <span className="font-bold">Groenten:</span> {joinNames(veggieNames)}
        {' · '}
        <span className="font-bold">
          {recipe.nextStep ? 'Volgende stap' : VISIBILITY_LABEL[zicht]}
        </span>
      </p>
      <p className="mt-1 text-ink-soft">
        {recipe.allergens.length > 0
          ? `Bevat: ${joinNames(recipe.allergens.map((a) => ALLERGEN_LABEL[a].toLowerCase()))}.`
          : 'Zonder de bekende allergenen.'}
      </p>

      {recipe.hasVariants && (
        <div className="mt-6">
          <SegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => update({ variant: v })}
            options={[
              { value: 'verstopt', label: 'Extra verstopt' },
              { value: 'zichtbaar', label: 'Licht zichtbaar' },
            ]}
          />
          <p className="mt-2 text-sm text-ink-soft">
            {variant === 'verstopt'
              ? 'Voor kritische eters: alles glad gepureerd.'
              : 'Voor avontuurlijkere eters: fijn geraspt of gehakt.'}
          </p>
        </div>
      )}

      <section className="mt-6" aria-labelledby="ingredients-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="ingredients-title" className="text-xl">
            Ingrediënten
          </h2>
          <div className="flex items-center gap-2">
            <Users size={20} aria-hidden="true" className="text-ink-soft" />
            <Stepper
              label="Porties"
              value={servings}
              min={1}
              max={12}
              onChange={(v) => update({ porties: v })}
              format={(v) => `${v} pers.`}
            />
          </div>
        </div>
        <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {ingredients.map((i) => (
            <li key={`${i.name}-${i.variant ?? ''}`} className="border-b border-line py-2">
              {formatAmount(i, i.qty, i.unit)}
              {i.optional && <span className="text-ink-soft"> (optioneel)</span>}
            </li>
          ))}
        </ul>
        {servings === 4 && recipe.servings === 4 && (
          <p className="mt-2 text-sm text-ink-soft">4 porties = 2 volwassenen en 2 kinderen.</p>
        )}
      </section>

      <section className="mt-6" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-xl">
          Zo maak je het
        </h2>
        <ol className="mt-3 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-heading font-bold text-accent-strong">
                {i + 1}
              </span>
              <p className="pt-0.5 text-lg">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6" aria-labelledby="tips-title">
        <h2 id="tips-title" className="text-xl">
          Tips
        </h2>
        <dl className="mt-2 space-y-3">
          {TIP_LABELS.filter(([key]) => recipe.tips[key]).map(([key, label]) => (
            <div key={key}>
              <dt className="font-bold">{label}</dt>
              <dd className="text-ink-soft">{recipe.tips[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        <LinkButton
          to={`/recepten/${recipe.id}/koken?${query}`}
          variant="primary"
          size="lg"
          block
          icon={<ChefHat size={20} aria-hidden="true" />}
        >
          Start koken
        </LinkButton>
        <Button
          size="lg"
          block
          icon={<ShoppingBasket size={20} aria-hidden="true" />}
          onClick={() => {
            addToShopping(recipe.id, servings, variant);
            showSnackbar({
              text: `${recipe.name} staat op je boodschappenlijst.`,
              actions: [{ label: 'Bekijk lijst', onClick: () => void navigate('/boodschappen') }],
            });
          }}
        >
          Op boodschappenlijst
        </Button>
        <LinkButton
          to={`/gegeten?recept=${recipe.id}&zicht=${zicht}`}
          size="lg"
          block
          icon={<Utensils size={20} aria-hidden="true" />}
        >
          We hebben dit gegeten
        </LinkButton>
        <Button
          size="lg"
          block
          icon={<Sprout size={20} aria-hidden="true" />}
          onClick={() => {
            if (children.length === 1 && children[0]) openGarden(children[0].id, recipe.mainVeggie);
            else setPicking(true);
          }}
        >
          Kijk wie er op je wacht
        </Button>
      </div>
      <ChildPickerDialog
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(childId) => {
          setPicking(false);
          openGarden(childId, recipe.mainVeggie);
        }}
      />
    </>
  );
}
