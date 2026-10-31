import type { Settings } from '../domain/types';

export const MAX_PHASE = 9;
/** Hoeveel registraties per groente per kind per dag maximaal tellen. */
export const DEFAULT_DAILY_CAP = 2;

export const GROWTH_DEFAULTS: Pick<
  Settings,
  'perPhase' | 'dailyCap' | 'regrowPerPhase' | 'shrinkDays' | 'maxShrink'
> = {
  perPhase: 3,
  dailyCap: DEFAULT_DAILY_CAP,
  regrowPerPhase: 2,
  shrinkDays: 7,
  maxShrink: 3,
};
