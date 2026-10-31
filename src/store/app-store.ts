/**
 * De centrale store. Alle gegevens blijven op het apparaat (IndexedDB via de repositories).
 * Componenten lezen via selectors; schrijven gaat alleen via de acties hieronder.
 */
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCHEMA_VERSION } from '../config/app';
import { canRegister } from '../domain/limits';
import type {
  ChildColor,
  Child,
  DailyPick,
  EatEvent,
  EatSource,
  GardenSnapshot,
  ManualShoppingItem,
  Section,
  SeenVeggie,
  Settings,
  ShoppingItemState,
  VariantKey,
  VeggieId,
  Visibility,
} from '../domain/types';
import { clock } from '../lib/clock';
import { dayKey } from '../lib/dates';
import { newId } from '../lib/id';
import { migrate } from './migrations';
import { createRepoStorage, type RepoStorageHandle } from './persist-storage';
import { createIdbRepos, createMemoryRepos, type Repos } from './repos';
import { sanitizeState } from './sanitize';
import { emptyShopping, initialPersistedState, type PersistedState } from './state';

export interface NewChildInput {
  name: string;
  color: ChildColor;
  spokenName?: string;
  known?: VeggieId[];
}

export interface RegisterInput {
  childIds: string[];
  veggieIds: VeggieId[];
  source: EatSource;
  recipeId?: string;
  visibility?: Visibility;
}

export interface RegisterResult {
  added: EatEvent[];
  capped: { childId: string; veggieId: VeggieId }[];
}

export interface AppActions {
  completeOnboarding(children: NewChildInput[]): void;
  addChild(input: NewChildInput): Child;
  updateChild(id: string, patch: Partial<Pick<Child, 'name' | 'spokenName' | 'color'>>): void;
  removeChild(id: string): void;
  selectChild(id: string): void;
  registerEats(input: RegisterInput): RegisterResult;
  removeEvents(ids: string[]): void;
  setPractice(childId: string, veggieId: VeggieId, enabled: boolean): void;
  updateSettings(patch: Partial<Settings>): void;
  toggleFavorite(recipeId: string): void;
  addRecipeToShopping(recipeId: string, servings: number, variant: VariantKey): void;
  removeRecipeFromShopping(recipeId: string): void;
  setShoppingItemState(key: string, patch: ShoppingItemState): void;
  addManualItem(name: string, section?: Section): void;
  removeManualItem(id: string): void;
  removeBoughtItems(boughtKeys: string[]): void;
  clearShopping(): void;
  markSeen(childId: string, veggieId: VeggieId, seen: SeenVeggie): void;
  setSnapshot(childId: string, snapshot: GardenSnapshot | undefined): void;
  setDailyPick(pick: DailyPick, mainVeggie: VeggieId): void;
  markCooked(recipeId: string, variant: VariantKey, servings: number): void;
  markCookedLogged(): void;
  setPersistRequested(): void;
  replaceAll(state: PersistedState): void;
  wipeAll(): void;
}

export type AppState = PersistedState & AppActions;
export type AppStore = UseBoundStore<StoreApi<AppState>> & {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: (state: AppState) => void) => () => void;
    rehydrate: () => Promise<void> | void;
    clearStorage: () => void;
  };
};

const nowIso = () => clock.now().toISOString();

function pickPersisted(s: AppState): PersistedState {
  return {
    meta: s.meta,
    children: s.children,
    eatEvents: s.eatEvents,
    practiceEvents: s.practiceEvents,
    settings: s.settings,
    shopping: s.shopping,
    snapshots: s.snapshots,
  };
}

export interface StoreBundle {
  useAppStore: AppStore;
  storage: RepoStorageHandle;
  repos: Repos;
}

export function createAppStore(repos: Repos): StoreBundle {
  const storage = createRepoStorage(repos, createMemoryRepos);

  const useAppStore = create<AppState>()(
    persist(
      (set, get) => ({
        ...initialPersistedState(nowIso()),

        completeOnboarding(children) {
          const at = nowIso();
          const created: Child[] = [];
          const events: EatEvent[] = [];
          for (const input of children) {
            const child: Child = {
              id: newId(),
              name: input.name.trim(),
              color: input.color,
              createdAt: at,
              ...(input.spokenName ? { spokenName: input.spokenName.trim() } : {}),
            };
            created.push(child);
            for (const veggieId of input.known ?? []) {
              events.push({ id: newId(), childId: child.id, veggieId, at, source: 'start' });
            }
          }
          set((s) => ({
            children: [...s.children, ...created],
            eatEvents: [...s.eatEvents, ...events],
            meta: {
              ...s.meta,
              onboarded: true,
              selectedChildId: s.meta.selectedChildId ?? created[0]?.id,
            },
          }));
        },

        addChild(input) {
          const child: Child = {
            id: newId(),
            name: input.name.trim(),
            color: input.color,
            createdAt: nowIso(),
            ...(input.spokenName ? { spokenName: input.spokenName.trim() } : {}),
          };
          set((s) => ({
            children: [...s.children, child],
            meta: { ...s.meta, selectedChildId: s.meta.selectedChildId ?? child.id },
          }));
          return child;
        },

        updateChild(id, patch) {
          set((s) => ({
            children: s.children.map((c) => {
              if (c.id !== id) return c;
              const next: Child = { ...c, ...patch };
              if (patch.name !== undefined) next.name = patch.name.trim() || c.name;
              if (patch.spokenName !== undefined && !patch.spokenName.trim())
                delete next.spokenName;
              return next;
            }),
          }));
        },

        removeChild(id) {
          set((s) => {
            const children = s.children.filter((c) => c.id !== id);
            const snapshots = { ...s.snapshots };
            delete snapshots[id];
            return {
              children,
              eatEvents: s.eatEvents.filter((e) => e.childId !== id),
              practiceEvents: s.practiceEvents.filter((e) => e.childId !== id),
              snapshots,
              meta: {
                ...s.meta,
                selectedChildId:
                  s.meta.selectedChildId === id ? children[0]?.id : s.meta.selectedChildId,
              },
            };
          });
        },

        selectChild(id) {
          set((s) => ({ meta: { ...s.meta, selectedChildId: id } }));
        },

        registerEats({ childIds, veggieIds, source, recipeId, visibility }) {
          const now = clock.now();
          const at = now.toISOString();
          const { eatEvents, settings } = get();
          const added: EatEvent[] = [];
          const capped: RegisterResult['capped'] = [];
          let pool = eatEvents;
          for (const childId of childIds) {
            for (const veggieId of veggieIds) {
              if (!canRegister(pool, childId, veggieId, now, settings.dailyCap)) {
                capped.push({ childId, veggieId });
                continue;
              }
              const event: EatEvent = {
                id: newId(),
                childId,
                veggieId,
                at,
                source,
                ...(recipeId ? { recipeId } : {}),
                ...(visibility ? { visibility } : {}),
              };
              added.push(event);
              pool = [...pool, event];
            }
          }
          if (added.length > 0) set({ eatEvents: pool });
          return { added, capped };
        },

        removeEvents(ids) {
          const remove = new Set(ids);
          set((s) => ({ eatEvents: s.eatEvents.filter((e) => !remove.has(e.id)) }));
        },

        setPractice(childId, veggieId, enabled) {
          set((s) => ({
            practiceEvents: [
              ...s.practiceEvents,
              { id: newId(), childId, veggieId, at: nowIso(), enabled },
            ],
          }));
        },

        updateSettings(patch) {
          set((s) => ({ settings: { ...s.settings, ...patch } }));
        },

        toggleFavorite(recipeId) {
          set((s) => {
            const favs = s.settings.favoriteRecipeIds;
            const next = favs.includes(recipeId)
              ? favs.filter((id) => id !== recipeId)
              : [...favs, recipeId];
            return { settings: { ...s.settings, favoriteRecipeIds: next } };
          });
        },

        addRecipeToShopping(recipeId, servings, variant) {
          set((s) => {
            const others = s.shopping.recipes.filter((r) => r.recipeId !== recipeId);
            return {
              shopping: {
                ...s.shopping,
                recipes: [...others, { recipeId, servings, variant, addedAt: nowIso() }],
                // Een opnieuw toegevoegd recept laat verborgen items weer zien.
                items: Object.fromEntries(
                  Object.entries(s.shopping.items).map(([k, v]) => [k, { ...v, hidden: false }]),
                ),
              },
            };
          });
        },

        removeRecipeFromShopping(recipeId) {
          set((s) => ({
            shopping: {
              ...s.shopping,
              recipes: s.shopping.recipes.filter((r) => r.recipeId !== recipeId),
            },
          }));
        },

        setShoppingItemState(key, patch) {
          set((s) => ({
            shopping: {
              ...s.shopping,
              items: { ...s.shopping.items, [key]: { ...s.shopping.items[key], ...patch } },
            },
          }));
        },

        addManualItem(name, section = 'overig') {
          const trimmed = name.trim();
          if (!trimmed) return;
          const item: ManualShoppingItem = {
            id: newId(),
            name: trimmed,
            section,
            addedAt: nowIso(),
          };
          set((s) => ({ shopping: { ...s.shopping, manual: [...s.shopping.manual, item] } }));
        },

        removeManualItem(id) {
          set((s) => ({
            shopping: { ...s.shopping, manual: s.shopping.manual.filter((m) => m.id !== id) },
          }));
        },

        removeBoughtItems(boughtKeys) {
          const keys = new Set(boughtKeys);
          set((s) => {
            const items = { ...s.shopping.items };
            for (const key of keys) items[key] = { ...items[key], hidden: true, bought: false };
            return {
              shopping: {
                ...s.shopping,
                manual: s.shopping.manual.filter((m) => !keys.has(`manual:${m.id}`)),
                items,
              },
            };
          });
        },

        clearShopping() {
          set({ shopping: emptyShopping() });
        },

        markSeen(childId, veggieId, seen) {
          set((s) => {
            const prev = s.snapshots[childId] ?? { childId, seenAt: nowIso(), veggies: {} };
            return {
              snapshots: {
                ...s.snapshots,
                [childId]: {
                  ...prev,
                  seenAt: nowIso(),
                  veggies: { ...prev.veggies, [veggieId]: seen },
                },
              },
            };
          });
        },

        setSnapshot(childId, snapshot) {
          set((s) => {
            const snapshots = { ...s.snapshots };
            if (snapshot) snapshots[childId] = snapshot;
            else delete snapshots[childId];
            return { snapshots };
          });
        },

        setDailyPick(pick, mainVeggie) {
          set((s) => {
            const recent = (s.meta.recentDailyMains ?? []).filter((r) => r.date !== pick.date);
            return {
              meta: {
                ...s.meta,
                daily: pick,
                recentDailyMains: [...recent, { date: pick.date, veggieId: mainVeggie }].slice(-5),
              },
            };
          });
        },

        markCooked(recipeId, variant, servings) {
          set((s) => ({
            meta: { ...s.meta, cooked: { date: dayKey(clock.now()), recipeId, variant, servings } },
          }));
        },

        markCookedLogged() {
          set((s) =>
            s.meta.cooked
              ? { meta: { ...s.meta, cooked: { ...s.meta.cooked, logged: true } } }
              : {},
          );
        },

        setPersistRequested() {
          set((s) => ({ meta: { ...s.meta, persistRequested: true } }));
        },

        replaceAll(state) {
          set({ ...state, meta: { ...state.meta, schemaVersion: SCHEMA_VERSION } });
        },

        wipeAll() {
          set(initialPersistedState(nowIso()));
        },
      }),
      {
        name: 'fv',
        version: SCHEMA_VERSION,
        storage: storage.storage,
        partialize: pickPersisted,
        migrate: (persisted, version) => migrate(persisted, version) as unknown as PersistedState,
        merge: (persisted, current) => {
          if (!persisted) return current;
          const { state, rejected } = sanitizeState(persisted, nowIso());
          if (rejected.length > 0) {
            void repos.quarantine
              .load()
              .then((prev) => repos.quarantine.save([...(prev ?? []), ...rejected]))
              .catch(() => undefined);
          }
          return { ...current, ...state };
        },
      },
    ),
  ) as AppStore;

  return { useAppStore, storage, repos };
}

const bundle = createAppStore(createIdbRepos());
export const useAppStore = bundle.useAppStore;
export const appStorage = bundle.storage;
export const appRepos = bundle.repos;
