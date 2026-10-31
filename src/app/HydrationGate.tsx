import { useSyncExternalStore, type ReactNode } from 'react';
import { useAppStore } from '../store/app-store';

function subscribe(cb: () => void) {
  return useAppStore.persist.onFinishHydration(() => cb());
}
const getSnapshot = () => useAppStore.persist.hasHydrated();

/**
 * Rendert pas als de opgeslagen gegevens zijn ingeladen (IndexedDB is asynchroon), zodat de
 * onboarding niet voorbij flitst bij een bestaande gebruiker.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <p className="font-heading text-lg font-bold text-ink-soft">Even laden…</p>
      </div>
    );
  }
  return <>{children}</>;
}
