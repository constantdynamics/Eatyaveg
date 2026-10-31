/** Hulpacties voor het dev-paneel en de e2e-tests. Alleen bereikbaar in dev of met ?dev=1. */
import { VEGGIE_IDS, type EatEvent, type Phase, type VeggieId } from '../../domain/types';
import { clock } from '../../lib/clock';
import { DAY_MS } from '../../lib/dates';
import { newId } from '../../lib/id';
import { useAppStore } from '../../store/app-store';

/** Zet `count` registraties op opeenvolgende dagen in het verleden (telt niet mee voor de daglimiet). */
function pastEvents(
  childId: string,
  veggieId: VeggieId,
  count: number,
  startDaysAgo = 1,
): EatEvent[] {
  const now = clock.now().getTime();
  return Array.from({ length: count }, (_, i) => ({
    id: newId(),
    childId,
    veggieId,
    at: new Date(now - (startDaysAgo + count - 1 - i) * DAY_MS).toISOString(),
    source: 'raster' as const,
  }));
}

export function devAddEvents(childId: string, veggieId: VeggieId, count: number): void {
  useAppStore.setState((s) => ({
    eatEvents: [...s.eatEvents, ...pastEvents(childId, veggieId, count, 1)],
  }));
}

export function devSetPhase(childId: string, veggieId: VeggieId, phase: Phase): void {
  const perPhase = useAppStore.getState().settings.perPhase;
  const count = phase === 0 ? 0 : 1 + (phase - 1) * perPhase;
  useAppStore.setState((s) => ({
    eatEvents: [
      ...s.eatEvents.filter((e) => !(e.childId === childId && e.veggieId === veggieId)),
      ...pastEvents(childId, veggieId, count, 1),
    ],
    practiceEvents: s.practiceEvents.filter(
      (e) => !(e.childId === childId && e.veggieId === veggieId),
    ),
  }));
}

/** Zet alle groenten op een gevarieerde stand (voor screenshots). */
export function devGardenShowcase(childId: string): void {
  const phases: Phase[] = [9, 4, 6, 2, 7, 1, 3, 0, 5, 8, 2, 0, 1, 4];
  VEGGIE_IDS.forEach((id, i) => devSetPhase(childId, id, phases[i % phases.length]!));
}

export function devReplayMoments(childId: string): void {
  useAppStore.getState().setSnapshot(childId, undefined);
}

declare global {
  interface Window {
    __fvDev?: {
      addEvents: typeof devAddEvents;
      setPhase: typeof devSetPhase;
      showcase: typeof devGardenShowcase;
      replay: typeof devReplayMoments;
    };
  }
}

export function exposeDevActions(): void {
  window.__fvDev = {
    addEvents: devAddEvents,
    setPhase: devSetPhase,
    showcase: devGardenShowcase,
    replay: devReplayMoments,
  };
}
