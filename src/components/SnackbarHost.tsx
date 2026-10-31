import { useEffect } from 'react';
import { useUiStore } from '../store/ui-store';

/** Rustige melding onderin met maximaal twee acties (ongedaan maken, toon aan). */
export function SnackbarHost() {
  const snackbar = useUiStore((s) => s.snackbar);
  const hide = useUiStore((s) => s.hideSnackbar);

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
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1 rounded-card bg-ink px-4 py-3 text-white shadow-card">
            <p className="min-w-0 flex-1 py-1">{snackbar.text}</p>
            <div className="flex flex-wrap gap-1">
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
