/**
 * Kookmodus (§10.2): zonder timer. Eerst variant en porties kiezen, dan één stap per scherm met
 * grote letters, vorige/volgende en vegen. Het scherm blijft aan (Wake Lock).
 */
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Stepper } from '../../components/Stepper';
import { VeggieCharacter } from '../../characters/VeggieCharacter';
import { getRecipe } from '../../content/recipes';
import { ingredientsForStep } from '../../domain/cook';
import { ingredientsFor, stepsFor } from '../../domain/recipes';
import { formatAmount, scaleIngredient } from '../../domain/scaling';
import type { Ingredient } from '../../domain/types';
import { useWakeLock } from '../../lib/wake-lock';
import { useAppStore } from '../../store/app-store';
import { useRecipeOptions } from '../recipes/useRecipeOptions';

function IngredientList({ items }: { items: Ingredient[] }) {
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={`${i.name}-${i.variant ?? ''}`} className="text-lg">
          {formatAmount(i, i.qty, i.unit)}
          {i.optional && <span className="text-ink-soft"> (optioneel)</span>}
        </li>
      ))}
    </ul>
  );
}

export default function CookPage() {
  const { id } = useParams();
  const recipe = getRecipe(id);
  const navigate = useNavigate();
  const { servings, variant, update } = useRecipeOptions(recipe);
  const markCooked = useAppStore((s) => s.markCooked);
  const [step, setStep] = useState(-1); // -1 = voorbereiden
  const touch = useRef<{ x: number; y: number } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useWakeLock(Boolean(recipe));

  const steps = recipe ? stepsFor(recipe, variant) : [];
  const done = step >= steps.length;

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (recipe && done) markCooked(recipe.id, variant, servings);
  }, [done, recipe, variant, servings, markCooked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setStep((s) => Math.min(steps.length, s + 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(-1, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  if (!recipe) return <Navigate to="/recepten" replace />;

  const ingredients = ingredientsFor(recipe, variant).map((i) =>
    scaleIngredient(i, recipe.servings, servings),
  );
  const close = () =>
    void navigate(`/recepten/${recipe.id}?porties=${servings}&variant=${variant}`, {
      replace: true,
    });
  const current = step >= 0 && !done ? steps[step]! : '';
  const forStep = current ? ingredientsForStep(current, ingredients) : [];

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pb-[calc(var(--safe-bottom)+16px)] pt-[calc(var(--safe-top)+8px)] md:px-8"
      onPointerDown={(e) => {
        touch.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const t = touch.current;
        touch.current = null;
        if (!t || step < 0) return;
        const dx = e.clientX - t.x;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(e.clientY - t.y) * 1.5) {
          setStep((s) => (dx < 0 ? Math.min(steps.length, s + 1) : Math.max(0, s - 1)));
        }
      }}
    >
      <header className="flex items-center gap-2 py-2">
        <IconButton
          label="Kookmodus sluiten"
          icon={<X size={24} aria-hidden="true" />}
          onClick={close}
        />
        <p className="min-w-0 flex-1 truncate font-heading font-bold text-ink-soft">
          {recipe.name}
        </p>
        {step >= 0 && !done && (
          <p className="font-bold text-ink-soft" aria-live="polite">
            Stap {step + 1} van {steps.length}
          </p>
        )}
      </header>

      {step < 0 && (
        <section className="flex flex-1 flex-col">
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-3xl">
            Klaar om te koken?
          </h1>
          <p className="mt-2 text-lg text-ink-soft">Kies hoe verstopt en voor hoeveel personen.</p>
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
            </div>
          )}
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-lg font-bold">Porties</span>
            <Stepper
              label="Porties"
              value={servings}
              min={1}
              max={12}
              onChange={(v) => update({ porties: v })}
              format={(v) => `${v} pers.`}
            />
          </div>
          <div className="mt-6 rounded-card bg-sand p-5">
            <h2 className="mb-2 text-xl">Wat heb je nodig?</h2>
            <IngredientList items={ingredients} />
          </div>
          <div className="mt-auto pt-8">
            <Button variant="primary" size="lg" block onClick={() => setStep(0)}>
              Start
            </Button>
          </div>
        </section>
      )}

      {step >= 0 && !done && (
        <section className="flex flex-1 flex-col">
          <h1 ref={headingRef} tabIndex={-1} className="sr-only">
            Stap {step + 1} van {steps.length}
          </h1>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`}
              />
            ))}
          </div>
          <p className="mt-8 font-heading text-[1.75rem] font-bold leading-snug md:text-[2rem]">
            {current}
          </p>
          {forStep.length > 0 && (
            <div className="mt-6 rounded-card bg-sand p-5">
              <h2 className="mb-1 text-base text-ink-soft">Bij deze stap</h2>
              <IngredientList items={forStep} />
            </div>
          )}
          <details className="mt-4">
            <summary className="flex min-h-12 cursor-pointer items-center font-bold text-accent">
              Alle ingrediënten
            </summary>
            <div className="pb-2">
              <IngredientList items={ingredients} />
            </div>
          </details>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-8">
            <Button
              size="lg"
              onClick={() => setStep((s) => Math.max(-1, s - 1))}
              icon={<ChevronLeft size={22} aria-hidden="true" />}
            >
              Vorige
            </Button>
            <Button variant="primary" size="lg" onClick={() => setStep((s) => s + 1)}>
              <span className="inline-flex items-center gap-2">
                Volgende <ChevronRight size={22} aria-hidden="true" />
              </span>
            </Button>
          </div>
        </section>
      )}

      {done && (
        <section className="flex flex-1 flex-col items-center text-center">
          <div className="mt-10">
            <VeggieCharacter veggie={recipe.mainVeggie} mood="juichend" pose="dansen" size={200} />
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="mt-6 text-4xl">
            Eet smakelijk!
          </h1>
          <p className="mt-3 max-w-md text-lg text-ink-soft">
            Na het eten tik je op Vandaag aan wat er geproefd is. Eén hapje telt.
          </p>
          <div className="mt-auto grid w-full gap-2 pt-8 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={() => setStep(steps.length - 1)}
              icon={<ChevronLeft size={22} aria-hidden="true" />}
            >
              Terug naar de stappen
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => void navigate('/', { replace: true })}
            >
              Naar Vandaag
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
