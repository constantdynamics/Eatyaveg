/**
 * Koppelt de Zustand-persist-middleware aan de repositories. Elk deel van de staat gaat naar
 * zijn eigen repository en wordt alleen geschreven als het veranderd is.
 */
import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { Repos } from './repos';
import type { PersistedState } from './state';

export type StorageStatus = 'ok' | 'memory';

export interface RepoStorageHandle {
  storage: PersistStorage<PersistedState>;
  status(): StorageStatus;
  /** Wacht tot alle lopende schrijfacties klaar zijn (handig voor export en tests). */
  flush(): Promise<void>;
}

export function createRepoStorage(repos: Repos, fallback: () => Repos): RepoStorageHandle {
  let active = repos;
  let status: StorageStatus = 'ok';
  let last: Partial<PersistedState> = {};
  // Schrijfacties starten meteen (IndexedDB verwerkt ze op volgorde van aanmaken); zo is een tik
  // vlak voor herladen of afsluiten al onderweg. `pending` is er alleen voor flush().
  const pending = new Set<Promise<unknown>>();
  const track = (job: Promise<unknown>) => {
    pending.add(job);
    void job.finally(() => pending.delete(job));
    return job;
  };

  const switchToMemory = (error: unknown) => {
    if (status === 'memory') return;
    console.warn(
      'Opslag op dit apparaat lukt niet; de app werkt nu tijdelijk in het geheugen.',
      error,
    );
    status = 'memory';
    active = fallback();
  };

  const storage: PersistStorage<PersistedState> = {
    async getItem() {
      try {
        const [meta, children, events, settings, shopping, snapshots] = await Promise.all([
          active.meta.load(),
          active.children.load(),
          active.events.load(),
          active.settings.load(),
          active.shopping.load(),
          active.snapshots.load(),
        ]);
        if (!meta) return null;
        const state = {
          meta,
          children: children ?? [],
          eatEvents: events?.eat ?? [],
          practiceEvents: events?.practice ?? [],
          settings,
          shopping,
          snapshots: snapshots ?? {},
        } as PersistedState;
        last = state;
        return { state, version: meta.schemaVersion };
      } catch (error) {
        switchToMemory(error);
        return null;
      }
    },

    async setItem(_name, value: StorageValue<PersistedState>) {
      const s = value.state;
      const prev = last;
      last = s;
      const writes: (() => Promise<void>)[] = [];
      const r = active;
      const version = value.version ?? 1;
      if (s.meta !== prev.meta)
        writes.push(() => r.meta.save({ ...s.meta, schemaVersion: version }));
      if (s.children !== prev.children) writes.push(() => r.children.save(s.children));
      if (s.eatEvents !== prev.eatEvents || s.practiceEvents !== prev.practiceEvents) {
        writes.push(() => r.events.save({ eat: s.eatEvents, practice: s.practiceEvents }));
      }
      if (s.settings !== prev.settings) writes.push(() => r.settings.save(s.settings));
      if (s.shopping !== prev.shopping) writes.push(() => r.shopping.save(s.shopping));
      if (s.snapshots !== prev.snapshots) writes.push(() => r.snapshots.save(s.snapshots));
      if (writes.length === 0) return;
      await track(Promise.all(writes.map((w) => w())).catch(switchToMemory));
    },

    async removeItem() {
      last = {};
      const r = active;
      await track(
        Promise.all([
          r.meta.clear(),
          r.children.clear(),
          r.events.clear(),
          r.settings.clear(),
          r.shopping.clear(),
          r.snapshots.clear(),
        ]).catch(switchToMemory),
      );
    },
  };

  return {
    storage,
    status: () => status,
    flush: async () => {
      await Promise.all([...pending]);
    },
  };
}
