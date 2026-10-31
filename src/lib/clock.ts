/**
 * Klok-abstractie. Alle domeinlogica krijgt tijd via clock.now(), nooit direct via Date.now(),
 * zodat tests en het dev-paneel de tijd kunnen verschuiven.
 */
import { useSyncExternalStore } from 'react';

const OFFSET_KEY = 'fv:dev:clockOffsetMs';
type Listener = () => void;

function readOffset(): number {
  try {
    const raw = globalThis.localStorage?.getItem(OFFSET_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

let offsetMs = readOffset();
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export const clock = {
  now(): Date {
    return new Date(Date.now() + offsetMs);
  },
  offsetMs(): number {
    return offsetMs;
  },
  setOffset(ms: number) {
    offsetMs = ms;
    try {
      if (ms === 0) globalThis.localStorage?.removeItem(OFFSET_KEY);
      else globalThis.localStorage?.setItem(OFFSET_KEY, String(ms));
    } catch {
      // geen opslag beschikbaar: alleen in het geheugen
    }
    emit();
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

function dayKeyOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function subscribeToday(listener: Listener) {
  const unsub = clock.subscribe(listener);
  const timer = setInterval(listener, 60_000);
  const onVisible = () => {
    if (document.visibilityState === 'visible') listener();
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    unsub();
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

/** De huidige kalenderdag (lokale tijd) als 'yyyy-MM-dd'; rendert opnieuw bij een nieuwe dag. */
export function useToday(): string {
  return useSyncExternalStore(
    subscribeToday,
    () => dayKeyOf(clock.now()),
    () => dayKeyOf(clock.now()),
  );
}

/** Versienummer dat verandert als de dev-klok verschuift (voor herberekeningen). */
export function useClockOffset(): number {
  return useSyncExternalStore(clock.subscribe, clock.offsetMs, clock.offsetMs);
}
