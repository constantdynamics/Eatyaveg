import { GROWTH_DEFAULTS } from '../config/growth';
import { SCHEMA_VERSION } from '../config/app';
import {
  VEGGIE_IDS,
  type AppMeta,
  type Child,
  type EatEvent,
  type GardenSnapshot,
  type PracticeEvent,
  type Settings,
  type ShoppingState,
} from '../domain/types';

/** Alles wat bewaard wordt. Acties en tijdelijke UI-staat horen hier niet in. */
export interface PersistedState {
  meta: AppMeta;
  children: Child[];
  eatEvents: EatEvent[];
  practiceEvents: PracticeEvent[];
  settings: Settings;
  shopping: ShoppingState;
  snapshots: Record<string, GardenSnapshot>;
}

export function defaultSettings(): Settings {
  return {
    ...GROWTH_DEFAULTS,
    sound: true,
    speech: true,
    reveal: true,
    enabledVeggies: [...VEGGIE_IDS],
    allergies: [],
    favoriteRecipeIds: [],
  };
}

export function emptyShopping(): ShoppingState {
  return { recipes: [], manual: [], items: {} };
}

export function initialPersistedState(nowIso: string): PersistedState {
  return {
    meta: { schemaVersion: SCHEMA_VERSION, onboarded: false, createdAt: nowIso },
    children: [],
    eatEvents: [],
    practiceEvents: [],
    settings: defaultSettings(),
    shopping: emptyShopping(),
    snapshots: {},
  };
}
