/**
 * Repository-interfaces achter de stores (§11.3). Fase 1 gebruikt IndexedDB op het apparaat;
 * fase 2 kan hier een sync-adapter (bijvoorbeeld Supabase) inpluggen zonder de app te herbouwen.
 */
import { createStore, del, get, set, type UseStore } from 'idb-keyval';
import { IDB_DATABASE, IDB_STORE, STORAGE_NAMESPACE } from '../config/app';
import type {
  AppMeta,
  Child,
  EatEvent,
  GardenSnapshot,
  PracticeEvent,
  Settings,
  ShoppingState,
} from '../domain/types';

export interface Repo<T> {
  load(): Promise<T | undefined>;
  save(value: T): Promise<void>;
  clear(): Promise<void>;
}

export type ChildRepo = Repo<Child[]>;
export type EventRepo = Repo<{ eat: EatEvent[]; practice: PracticeEvent[] }>;
export type SettingsRepo = Repo<Settings>;
export type ShoppingRepo = Repo<ShoppingState>;
export type SnapshotRepo = Repo<Record<string, GardenSnapshot>>;
export type MetaRepo = Repo<AppMeta>;

export interface Repos {
  meta: MetaRepo;
  children: ChildRepo;
  events: EventRepo;
  settings: SettingsRepo;
  shopping: ShoppingRepo;
  snapshots: SnapshotRepo;
  /** Gegevens die bij het inladen niet geldig bleken; bewaard, nooit weggegooid. */
  quarantine: Repo<unknown[]>;
}

const KEYS = {
  meta: 'meta',
  children: 'children',
  events: 'events',
  settings: 'settings',
  shopping: 'shopping',
  snapshots: 'snapshots',
  quarantine: 'quarantine',
} as const;

function idbRepo<T>(store: UseStore, key: string): Repo<T> {
  const fullKey = `${STORAGE_NAMESPACE}${key}`;
  return {
    load: () => get<T>(fullKey, store),
    save: (value) => set(fullKey, value, store),
    clear: () => del(fullKey, store),
  };
}

export function createIdbRepos(): Repos {
  const store = createStore(IDB_DATABASE, IDB_STORE);
  return {
    meta: idbRepo(store, KEYS.meta),
    children: idbRepo(store, KEYS.children),
    events: idbRepo(store, KEYS.events),
    settings: idbRepo(store, KEYS.settings),
    shopping: idbRepo(store, KEYS.shopping),
    snapshots: idbRepo(store, KEYS.snapshots),
    quarantine: idbRepo(store, KEYS.quarantine),
  };
}

function memoryRepo<T>(): Repo<T> {
  let value: T | undefined;
  return {
    load: async () => (value === undefined ? undefined : structuredClone(value)),
    save: async (v) => {
      value = structuredClone(v);
    },
    clear: async () => {
      value = undefined;
    },
  };
}

/** Voor tests en als noodoplossing als IndexedDB niet beschikbaar is. */
export function createMemoryRepos(): Repos {
  return {
    meta: memoryRepo(),
    children: memoryRepo(),
    events: memoryRepo(),
    settings: memoryRepo(),
    shopping: memoryRepo(),
    snapshots: memoryRepo(),
    quarantine: memoryRepo(),
  };
}
