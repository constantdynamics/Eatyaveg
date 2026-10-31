/** Afgeleide gegevens als hooks. Berekeningen zijn puur en gememoïseerd. */
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { VEGGIES } from '../content/veggies';
import { computeChildProgress, type VeggieProgress } from '../domain/growth';
import type { Child, Veggie, VeggieId } from '../domain/types';
import { clock, useClockOffset, useToday } from '../lib/clock';
import { useAppStore } from './app-store';

export function useChildren(): Child[] {
  return useAppStore((s) => s.children);
}

/** Het geselecteerde kind, of anders het eerste. */
export function useSelectedChild(): Child | undefined {
  return useAppStore(
    (s) => s.children.find((c) => c.id === s.meta.selectedChildId) ?? s.children[0],
  );
}

export function useChild(id: string | undefined): Child | undefined {
  return useAppStore((s) => s.children.find((c) => c.id === id));
}

/** Ingeschakelde groenten, alfabetisch. */
export function useEnabledVeggies(): Veggie[] {
  const enabled = useAppStore(useShallow((s) => s.settings.enabledVeggies));
  return useMemo(
    () =>
      VEGGIES.filter((v) => enabled.includes(v.id)).sort((a, b) =>
        a.name.localeCompare(b.name, 'nl'),
      ),
    [enabled],
  );
}

/** Voortgang van alle groenten voor één kind (rekent opnieuw bij een nieuwe dag of dev-klok). */
export function useChildProgress(
  childId: string | undefined,
): Record<VeggieId, VeggieProgress> | undefined {
  const eatEvents = useAppStore((s) => s.eatEvents);
  const practiceEvents = useAppStore((s) => s.practiceEvents);
  const settings = useAppStore((s) => s.settings);
  const today = useToday();
  const offset = useClockOffset();
  return useMemo(() => {
    void today;
    void offset;
    if (!childId) return undefined;
    return computeChildProgress(
      childId,
      eatEvents,
      practiceEvents,
      VEGGIES.map((v) => v.id),
      settings,
      clock.now(),
    );
  }, [childId, eatEvents, practiceEvents, settings, today, offset]);
}

/** Voortgang voor alle kinderen tegelijk (voor het recept van vandaag). */
export function useFamilyProgress(): Record<string, Record<VeggieId, VeggieProgress>> {
  const children = useAppStore((s) => s.children);
  const eatEvents = useAppStore((s) => s.eatEvents);
  const practiceEvents = useAppStore((s) => s.practiceEvents);
  const settings = useAppStore((s) => s.settings);
  const today = useToday();
  return useMemo(() => {
    void today;
    const now = clock.now();
    return Object.fromEntries(
      children.map((c) => [
        c.id,
        computeChildProgress(
          c.id,
          eatEvents,
          practiceEvents,
          VEGGIES.map((v) => v.id),
          settings,
          now,
        ),
      ]),
    );
  }, [children, eatEvents, practiceEvents, settings, today]);
}
