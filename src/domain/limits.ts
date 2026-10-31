/** Daglimiet (§4.4.7): per groente per kind tellen maximaal `cap` registraties per kalenderdag. */
import { dayKey } from '../lib/dates';
import type { EatEvent, VeggieId } from './types';

export function countOnDay(
  events: readonly EatEvent[],
  childId: string,
  veggieId: VeggieId,
  day: Date,
): number {
  const key = dayKey(day);
  let n = 0;
  for (const e of events) {
    if (e.childId === childId && e.veggieId === veggieId && dayKey(new Date(e.at)) === key) n++;
  }
  return n;
}

export function canRegister(
  events: readonly EatEvent[],
  childId: string,
  veggieId: VeggieId,
  now: Date,
  cap: number,
): boolean {
  return countOnDay(events, childId, veggieId, now) < cap;
}
