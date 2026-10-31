/**
 * Groeisysteem (§7). De voortgang is een pure functie van de registraties, de
 * Weer oefenen-gebeurtenissen, de instellingen en het tijdstip `now`.
 */
import { MAX_PHASE } from '../config/growth';
import type { EatEvent, Phase, PracticeEvent, Settings, VeggieId } from './types';

export type GrowthSettings = Pick<
  Settings,
  'perPhase' | 'regrowPerPhase' | 'shrinkDays' | 'maxShrink'
>;

export interface VeggieProgress {
  /** Alle registraties ("gegeten of geproefd"), ook na de walvis. */
  count: number;
  /** Huidige fase (0 = zaadje). */
  phase: Phase;
  /** Hoogste fase ooit bereikt. */
  record: Phase;
  /** Gevulde druppels richting de volgende fase. */
  drops: number;
  /** Druppels nodig voor de volgende fase (0 bij zaadje en walvis). */
  dropsNeeded: number;
  /** Weer oefenen staat aan. */
  practicing: boolean;
  /** Onder het record: terug groeien gaat sneller. */
  regrowing: boolean;
  /** Fase 9 bereikt. */
  maxed: boolean;
  lastAt?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const EMPTY_PROGRESS: VeggieProgress = {
  count: 0,
  phase: 0,
  record: 0,
  drops: 0,
  dropsNeeded: 0,
  practicing: false,
  regrowing: false,
  maxed: false,
};

/** Eenvoudige formule zonder krimp (§7.1); de simulatie hieronder levert hetzelfde op. */
export function phaseFromCount(count: number, perPhase: number): { phase: Phase; drops: number } {
  if (count <= 0) return { phase: 0, drops: 0 };
  const phase = Math.min(MAX_PHASE, 1 + Math.floor((count - 1) / perPhase)) as Phase;
  const drops = phase === MAX_PHASE ? 0 : (count - 1) % perPhase;
  return { phase, drops };
}

type TimelineItem =
  | { t: number; order: number; kind: 'eat'; at: string }
  | { t: number; order: number; kind: 'practice'; enabled: boolean };

/**
 * Voortgang van één groente voor één kind. Geef alleen de gebeurtenissen van dat kind en die
 * groente mee (zie computeChildProgress voor alle groenten tegelijk).
 */
export function computeProgress(
  eats: readonly Pick<EatEvent, 'at'>[],
  practice: readonly Pick<PracticeEvent, 'at' | 'enabled'>[],
  settings: GrowthSettings,
  now: Date,
): VeggieProgress {
  const timeline: TimelineItem[] = [];
  let order = 0;
  for (const e of eats)
    timeline.push({ t: Date.parse(e.at), order: order++, kind: 'eat', at: e.at });
  for (const p of practice) {
    timeline.push({ t: Date.parse(p.at), order: order++, kind: 'practice', enabled: p.enabled });
  }
  timeline.sort((a, b) => a.t - b.t || a.order - b.order);

  const period = Math.max(1, settings.shrinkDays) * DAY_MS;
  let phase = 0;
  let record = 0;
  let progress = 0;
  let count = 0;
  let practicing = false;
  let anchor = 0;
  let lastAt: string | undefined;

  const needed = () => (phase < record ? settings.regrowPerPhase : settings.perPhase);

  const shrinkUntil = (t: number) => {
    if (!practicing) return;
    while (anchor + period <= t) {
      anchor += period;
      const floor = Math.max(1, record - settings.maxShrink);
      if (phase > floor) {
        phase -= 1;
        progress = 0;
      } else {
        break; // grens bereikt: verder krimpen kan niet
      }
    }
  };

  for (const item of timeline) {
    shrinkUntil(item.t);
    if (item.kind === 'eat') {
      count += 1;
      lastAt = item.at;
      if (phase === 0) {
        phase = 1;
        progress = 0;
      } else if (phase < MAX_PHASE) {
        progress += 1;
        if (progress >= needed()) {
          phase += 1;
          progress = 0;
        }
      }
      record = Math.max(record, phase);
      anchor = item.t;
    } else if (item.enabled) {
      if (!practicing) {
        practicing = true;
        // Tel vanaf het aanzetten of de laatste registratie, wat het laatst was.
        anchor = Math.max(anchor, item.t);
      }
    } else if (practicing) {
      practicing = false;
      if (phase < record) {
        phase = record;
        progress = 0;
      }
    }
  }
  shrinkUntil(now.getTime());

  const maxed = phase === MAX_PHASE;
  return {
    count,
    phase: phase as Phase,
    record: record as Phase,
    drops: maxed || phase === 0 ? 0 : progress,
    dropsNeeded: maxed || phase === 0 ? 0 : needed(),
    practicing,
    regrowing: phase < record,
    maxed,
    ...(lastAt ? { lastAt } : {}),
  };
}

/** Voortgang van alle groenten voor één kind. */
export function computeChildProgress(
  childId: string,
  eatEvents: readonly EatEvent[],
  practiceEvents: readonly PracticeEvent[],
  veggieIds: readonly VeggieId[],
  settings: GrowthSettings,
  now: Date,
): Record<VeggieId, VeggieProgress> {
  const eatsBy = new Map<VeggieId, EatEvent[]>();
  const practiceBy = new Map<VeggieId, PracticeEvent[]>();
  for (const e of eatEvents) {
    if (e.childId !== childId) continue;
    const list = eatsBy.get(e.veggieId);
    if (list) list.push(e);
    else eatsBy.set(e.veggieId, [e]);
  }
  for (const p of practiceEvents) {
    if (p.childId !== childId) continue;
    const list = practiceBy.get(p.veggieId);
    if (list) list.push(p);
    else practiceBy.set(p.veggieId, [p]);
  }
  const result = {} as Record<VeggieId, VeggieProgress>;
  for (const id of veggieIds) {
    result[id] = computeProgress(eatsBy.get(id) ?? [], practiceBy.get(id) ?? [], settings, now);
  }
  return result;
}

/** Is Weer oefenen op dit moment aan voor dit kind en deze groente? */
export function isPracticing(
  practiceEvents: readonly PracticeEvent[],
  childId: string,
  veggieId: VeggieId,
): boolean {
  let state = false;
  const relevant = practiceEvents
    .filter((p) => p.childId === childId && p.veggieId === veggieId)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  for (const p of relevant) state = p.enabled;
  return state;
}
