import { useLocation } from 'react-router';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Rustige melding als er een nieuwe versie klaarstaat. Niet in de tuin (geen interface voor het
 * kind, §14.2) en niet tijdens het koken; daar verschijnt hij zodra je terug bent.
 */
export function UpdatePrompt() {
  const { pathname } = useLocation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.warn('Service worker niet geregistreerd', error);
    },
  });

  if (!needRefresh || pathname.startsWith('/tuin/') || pathname.endsWith('/koken')) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      style={{ paddingTop: 'calc(var(--safe-top) + 8px)' }}
    >
      <div className="fv-card flex w-full max-w-xl flex-wrap items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1">Er staat een nieuwe versie klaar.</p>
        <button
          type="button"
          className="min-h-12 rounded-card px-3 font-heading font-bold text-ink-soft hover:bg-sand"
          onClick={() => setNeedRefresh(false)}
        >
          Later
        </button>
        <button
          type="button"
          className="min-h-12 rounded-card bg-accent px-4 font-heading font-bold text-white hover:bg-accent-strong"
          onClick={() => void updateServiceWorker(true)}
        >
          Vernieuwen
        </button>
      </div>
    </div>
  );
}
