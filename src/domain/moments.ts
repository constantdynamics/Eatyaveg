/**
 * Momenten in de tuin (§7.4). Vergelijkt wat het kind het laatst zag met de huidige voortgang
 * en levert de momenten in vaste volgorde: onthulling → ontdekking → druppel → groei →
 * fontein (walvis) → mentor (hoogstens één per bezoek).
 */
import { createRng } from '../lib/seeded-rng';
import type { VeggieProgress } from './growth';
import type { EatEvent, GardenSnapshot, Phase, SeenVeggie, VeggieId } from './types';

export type Moment =
  | { kind: 'onthulling'; veggieIds: VeggieId[] }
  | { kind: 'ontdekking'; veggieIds: VeggieId[] }
  | { kind: 'druppel'; items: { veggieId: VeggieId; from: number; to: number; needed: number }[] }
  | { kind: 'groei'; veggieId: VeggieId; from: Phase; to: Phase }
  | { kind: 'fontein'; veggieIds: VeggieId[] }
  | { kind: 'mentor'; mentorId: VeggieId; targetId: VeggieId; reason: 'klein' | 'oefenen' };

export type ProgressMap = Partial<Record<VeggieId, VeggieProgress>>;

const UNSEEN: SeenVeggie = { phase: 0, drops: 0, count: 0 };

export function seenOf(snapshot: GardenSnapshot | undefined, id: VeggieId): SeenVeggie {
  return snapshot?.veggies[id] ?? UNSEEN;
}

export function toSeen(p: VeggieProgress): SeenVeggie {
  return { phase: p.phase, drops: p.drops, count: p.count };
}

/**
 * Groenten waarvoor het onthulmoment past: er zijn nieuwe registraties sinds het laatste
 * bezoek, en niet alleen registraties uit de onboarding (bron "start").
 */
export function revealableVeggies(
  events: readonly EatEvent[],
  childId: string,
  snapshot: GardenSnapshot | undefined,
  current: ProgressMap,
): Set<VeggieId> {
  const result = new Set<VeggieId>();
  for (const [id, progress] of Object.entries(current) as [VeggieId, VeggieProgress][]) {
    const seenCount = seenOf(snapshot, id).count ?? 0;
    const fresh = progress.count - seenCount;
    if (fresh <= 0) continue;
    const mine = events
      .filter((e) => e.childId === childId && e.veggieId === id)
      .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
      .slice(-fresh);
    if (mine.some((e) => e.source !== 'start')) result.add(id);
  }
  return result;
}

export interface MomentsInput {
  snapshot: GardenSnapshot | undefined;
  current: ProgressMap;
  /** Vaste volgorde van de groenten (tuinvolgorde). */
  order: readonly VeggieId[];
  reveal: boolean;
  revealable: ReadonlySet<VeggieId>;
  /** Mentor meenemen (alleen de eerste keer per bezoek). */
  includeMentor: boolean;
  /** Seed voor een afwisselende maar voorspelbare mentor-keuze. */
  seed: string;
}

export function computeMoments(input: MomentsInput): Moment[] {
  const discoveries: VeggieId[] = [];
  const drops: Extract<Moment, { kind: 'druppel' }>['items'] = [];
  const growths: Extract<Moment, { kind: 'groei' }>[] = [];
  const fountains: VeggieId[] = [];
  const touched: VeggieId[] = [];

  for (const id of input.order) {
    const cur = input.current[id];
    if (!cur) continue;
    const prev = seenOf(input.snapshot, id);
    if (cur.phase > prev.phase) {
      if (prev.phase === 0) {
        discoveries.push(id);
        if (cur.phase > 1) growths.push({ kind: 'groei', veggieId: id, from: 1, to: cur.phase });
      } else {
        growths.push({ kind: 'groei', veggieId: id, from: prev.phase, to: cur.phase });
      }
      touched.push(id);
    } else if (cur.phase === prev.phase && cur.phase > 0 && cur.drops > prev.drops) {
      drops.push({ veggieId: id, from: prev.drops, to: cur.drops, needed: cur.dropsNeeded });
      touched.push(id);
    } else if (cur.maxed && prev.phase === cur.phase && cur.count > (prev.count ?? cur.count)) {
      fountains.push(id);
      touched.push(id);
    }
  }

  const moments: Moment[] = [];
  if (input.reveal) {
    const revealIds = touched.filter((id) => input.revealable.has(id));
    if (revealIds.length > 0) moments.push({ kind: 'onthulling', veggieIds: revealIds });
  }
  if (discoveries.length > 0) moments.push({ kind: 'ontdekking', veggieIds: discoveries });
  if (drops.length > 0) moments.push({ kind: 'druppel', items: drops });
  moments.push(...growths);
  if (fountains.length > 0) moments.push({ kind: 'fontein', veggieIds: fountains });

  if (input.includeMentor) {
    const mentor = pickMentor(input.current, input.order, input.seed);
    if (mentor) moments.push(mentor);
  }
  return moments;
}

/** De walvis moedigt aan: een groente op Weer oefenen, of anders een die nog klein is. */
export function pickMentor(
  current: ProgressMap,
  order: readonly VeggieId[],
  seed: string,
): Extract<Moment, { kind: 'mentor' }> | undefined {
  const entries = order
    .map((id) => [id, current[id]] as const)
    .filter((e): e is readonly [VeggieId, VeggieProgress] => e[1] !== undefined);
  const whales = entries.filter(([, p]) => p.maxed);
  if (whales.length === 0) return undefined;
  const rng = createRng(`mentor:${seed}`);
  const mentorId = whales[Math.floor(rng() * whales.length)]![0];

  const practicing = entries.filter(([id, p]) => id !== mentorId && p.practicing && p.regrowing);
  if (practicing.length > 0) {
    const targetId = practicing[Math.floor(rng() * practicing.length)]![0];
    return { kind: 'mentor', mentorId, targetId, reason: 'oefenen' };
  }
  const others = entries.filter(([id, p]) => id !== mentorId && !p.maxed);
  if (others.length === 0) return undefined;
  const smallest = Math.min(...others.map(([, p]) => p.phase));
  const small = others.filter(([, p]) => p.phase <= Math.max(smallest, 2));
  const targetId = small[Math.floor(rng() * small.length)]![0];
  return { kind: 'mentor', mentorId, targetId, reason: 'klein' };
}

/** Welke groenten een moment hebben (en dus nog op hun oude stand getoond moeten worden). */
export function veggiesInMoments(moments: readonly Moment[]): Set<VeggieId> {
  const ids = new Set<VeggieId>();
  for (const m of moments) {
    if (m.kind === 'ontdekking' || m.kind === 'fontein') m.veggieIds.forEach((id) => ids.add(id));
    if (m.kind === 'druppel') m.items.forEach((i) => ids.add(i.veggieId));
    if (m.kind === 'groei') ids.add(m.veggieId);
  }
  return ids;
}
