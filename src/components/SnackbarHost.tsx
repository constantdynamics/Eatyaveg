import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useUiStore } from '../store/ui-store';

/** Rustige melding onderin met maximaal twee acties (ongedaan maken, toon aan). */
export function SnackbarHost() {
  const snackbar = useUiStore((s) => s.snackbar);
  const hide = useUiStore((s) => s.hideSnackbar);

  const { pathname } = useLocation();

  // Een melding hoort bij het scherm waar hij ontstond.
  useEffect(() => {
    hide();
  }, [pathname, hide]);

  useEffect(() => {
    if (!snackbar) return;
    const t = setTimeout(() => hide(snackbar.id), snackbar.duration ?? 7000);
    return () => clearTimeout(t);
  }, [snackbar, hide]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4"
      style={{ bottom: 'calc(var(--nav-height) + var(--safe-bottom) + 12px)' }}
    >
      <div role="status" aria-live="polite" className="w-full max-w-xl">
        {snackbar && (
          <div className="pointer-events-auto rounded-card bg-ink px-4 pb-2 pt-3 text-white shadow-card sm:flex sm:items-center sm:gap-3 sm:py-2">
            <p className="min-w-0 py-1 sm:flex-1">{snackbar.text}</p>
            <div className="-mx-2 flex flex-wrap justify-end gap-1">
              {snackbar.actions?.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => {
                    hide(snackbar.id);
                    a.onClick();
                  }}
                  className="min-h-12 rounded-card px-3 font-heading font-bold text-accent-on-dark hover:bg-white/10"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
