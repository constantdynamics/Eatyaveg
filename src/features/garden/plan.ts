/**
 * Plan voor één tuinbezoek: wat het kind eerst ziet (de oude stand), welke momenten er
 * afgespeeld worden en hoe alles er daarna uitziet. Puur en getest.
 */
import type { VeggieProgress } from '../../domain/growth';
import {
  computeMoments,
  revealableVeggies,
  seenOf,
  toSeen,
  veggiesInMoments,
  type Moment,
} from '../../domain/moments';
import type { EatEvent, GardenSnapshot, SeenVeggie, Settings, VeggieId } from '../../domain/types';
import type { BuddyDisplay } from './types';
import { placeBuddy, spotForPhase, zoneIndexAt } from './world';

export interface VisitPlan {
  moments: Moment[];
  initial: Partial<Record<VeggieId, BuddyDisplay>>;
  final: Partial<Record<VeggieId, BuddyDisplay>>;
  /** Verschillen zonder moment (krimp, verwijderde registratie): meteen als gezien markeren. */
  silent: [VeggieId, SeenVeggie][];
  startZone: number;
}

export interface PlanInput {
  childId: string;
  veggieIds: readonly VeggieId[];
  progress: Partial<Record<VeggieId, VeggieProgress>>;
  snapshot: GardenSnapshot | undefined;
  events: readonly EatEvent[];
  settings: Pick<Settings, 'reveal' | 'perPhase' | 'regrowPerPhase'>;
  includeMentor: boolean;
  /** Bij "Kijk wie er op je wacht" spelen we geen momenten af. */
  playMoments: boolean;
  seed: string;
}

function baseDisplay(
  p: Pick<BuddyDisplay, 'phase' | 'drops' | 'dropsNeeded' | 'practicing' | 'regrowing'>,
): BuddyDisplay {
  return {
    ...p,
    spot: spotForPhase(p.phase),
    mood: 'blij',
    pose: 'staan',
    fxKey: 0,
    showAnimal: false,
    travel: { dx: 0, dy: 0 },
    idleOffset: 0,
    fountainKey: 0,
  };
}

export function displayFromProgress(p: VeggieProgress): BuddyDisplay {
  return baseDisplay({
    phase: p.phase,
    drops: p.drops,
    dropsNeeded: p.dropsNeeded,
    practicing: p.practicing,
    regrowing: p.regrowing,
  });
}

function displayFromSeen(
  seen: SeenVeggie,
  current: VeggieProgress,
  s: PlanInput['settings'],
): BuddyDisplay {
  // Zonder Weer oefenen krimpt er niets, dus dan was het vriendje toen niet aan het terug groeien.
  const regrowing = current.practicing && seen.phase < current.record;
  const needed =
    seen.phase === 0 || seen.phase === 9 ? 0 : regrowing ? s.regrowPerPhase : s.perPhase;
  return baseDisplay({
    phase: seen.phase,
    drops: Math.min(seen.drops, Math.max(0, needed - 1)),
    dropsNeeded: needed,
    practicing: current.practicing,
    regrowing,
  });
}

function sameSeen(a: SeenVeggie, b: SeenVeggie): boolean {
  return a.phase === b.phase && a.drops === b.drops && (a.count ?? b.count) === b.count;
}

export function buildVisitPlan(input: PlanInput): VisitPlan {
  const current: Partial<Record<VeggieId, VeggieProgress>> = {};
  for (const id of input.veggieIds) {
    const p = input.progress[id];
    if (p) current[id] = p;
  }

  const moments = input.playMoments
    ? computeMoments({
        snapshot: input.snapshot,
        current,
        order: input.veggieIds,
        reveal: input.settings.reveal,
        revealable: revealableVeggies(input.events, input.childId, input.snapshot, current),
        includeMentor: input.includeMentor,
        seed: input.seed,
      })
    : [];
  const involved = veggiesInMoments(moments);

  const initial: VisitPlan['initial'] = {};
  const final: VisitPlan['final'] = {};
  const silent: VisitPlan['silent'] = [];
  for (const id of input.veggieIds) {
    const p = current[id];
    if (!p) continue;
    final[id] = displayFromProgress(p);
    if (involved.has(id)) {
      initial[id] = displayFromSeen(seenOf(input.snapshot, id), p, input.settings);
    } else {
      initial[id] = displayFromProgress(p);
      const seen = seenOf(input.snapshot, id);
      if (input.playMoments && !sameSeen(seen, toSeen(p))) silent.push([id, toSeen(p)]);
    }
  }

  const firstId = [...involved][0];
  const startZone = firstId ? zoneIndexAt(placeBuddy(firstId, final[firstId]!.phase).x) : 0;
  return { moments, initial, final, silent, startZone };
}
