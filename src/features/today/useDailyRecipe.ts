import { useCallback, useEffect, useMemo } from 'react';
import { RECIPES, getRecipe } from '../../content/recipes';
import { dailyCandidates, pickDailyRecipe, type DailyInput } from '../../domain/daily-recipe';
import { hasAllergen } from '../../domain/recipes';
import type { Recipe, VeggieId } from '../../domain/types';
import { isWeekendDay } from '../../lib/dates';
import { useToday } from '../../lib/clock';
import { useAppStore } from '../../store/app-store';
import { useFamilyProgress } from '../../store/selectors';

/**
 * Recept van vandaag: deterministisch per datum en opgeslagen, zodat het de hele dag
 * hetzelfde blijft. "Ander recept" kiest de volgende uit de volgorde van de dag.
 */
export function useDailyRecipe(): { recipe: Recipe | undefined; next: () => void } {
  const today = useToday();
  const daily = useAppStore((s) => s.meta.daily);
  const recent = useAppStore((s) => s.meta.recentDailyMains);
  const settings = useAppStore((s) => s.settings);
  const setDailyPick = useAppStore((s) => s.setDailyPick);
  const family = useFamilyProgress();

  const input = useMemo((): DailyInput => {
    const preferred = new Set<VeggieId>();
    const ready = new Set<VeggieId>();
    for (const progress of Object.values(family)) {
      for (const [id, p] of Object.entries(progress) as [VeggieId, (typeof progress)[VeggieId]][]) {
        if (p.phase === 0 || p.practicing) preferred.add(id);
        if (p.phase >= 4) ready.add(id);
      }
    }
    const [y, m, d] = today.split('-').map(Number) as [number, number, number];
    return {
      date: today,
      recipes: RECIPES,
      allergies: settings.allergies,
      enabledVeggies: settings.enabledVeggies,
      preferred,
      readyForNextStep: ready,
      recentMains: (recent ?? [])
        .filter((r) => r.date !== today)
        .slice(-3)
        .map((r) => r.veggieId),
      skipped: daily?.date === today ? daily.skipped : [],
      isWeekend: isWeekendDay(new Date(y, m - 1, d)),
    };
  }, [family, settings.allergies, settings.enabledVeggies, recent, daily, today]);

  const stored = daily?.date === today ? getRecipe(daily.recipeId) : undefined;
  const storedValid =
    stored &&
    !hasAllergen(stored, settings.allergies) &&
    stored.veggies.every((v) => settings.enabledVeggies.includes(v));
  const computed = useMemo(
    () => (storedValid ? undefined : pickDailyRecipe(input)),
    [storedValid, input],
  );
  const recipe = storedValid ? stored : computed;

  useEffect(() => {
    if (!storedValid && computed) {
      setDailyPick(
        { date: today, recipeId: computed.id, skipped: [...input.skipped] },
        computed.mainVeggie,
      );
    }
  }, [storedValid, computed, today, input.skipped, setDailyPick]);

  const next = useCallback(() => {
    if (!recipe) return;
    let skipped = [...input.skipped.filter((id) => id !== recipe.id), recipe.id];
    // Alles al gezien: opnieuw rondgaan, maar niet meteen hetzelfde recept.
    if (skipped.length >= dailyCandidates(input).length) skipped = [recipe.id];
    const pick = pickDailyRecipe({ ...input, skipped });
    if (pick) setDailyPick({ date: today, recipeId: pick.id, skipped }, pick.mainVeggie);
  }, [recipe, input, today, setDailyPick]);

  return { recipe, next };
}
