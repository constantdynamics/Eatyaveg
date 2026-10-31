/**
 * Dev-paneel (§11.5): alleen in development of met ?dev=1. Tijd verschuiven, registraties
 * toevoegen, fase zetten, momenten opnieuw afspelen, zinnen testen en data resetten.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Wrench } from 'lucide-react';
import { clock, useClockOffset } from '../../lib/clock';
import { DAY_MS } from '../../lib/dates';
import { useAppStore } from '../../store/app-store';
import { DevTools } from './DevTools';
import { exposeDevActions } from './dev-actions';

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const offset = useClockOffset();
  const location = useLocation();
  const days = Math.round(offset / DAY_MS);

  useEffect(() => {
    exposeDevActions();
  }, []);

  if (location.pathname.startsWith('/tuin/')) return null;
  return (
    <div className="fixed left-2 top-2 z-[60] print:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Dev-paneel"
        className="inline-flex h-10 items-center gap-1 rounded-full bg-ink/80 px-3 text-sm font-bold text-white"
      >
        <Wrench size={16} aria-hidden="true" />
        {days !== 0 && <span>{days > 0 ? `+${days}` : days} d</span>}
      </button>
      {open && (
        <div className="fv-card mt-2 max-h-[80dvh] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto p-4 text-sm">
          <h2 className="mb-2 text-base">Dev-paneel</h2>
          <section className="mb-4">
            <h3 className="mb-1 text-sm">Tijd</h3>
            <p className="mb-2 text-ink-soft">Nu: {clock.now().toLocaleString('nl-NL')}</p>
            <div className="flex flex-wrap gap-1">
              {[1, 7, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="rounded-card border border-line px-3 py-2"
                  onClick={() => clock.setOffset(clock.offsetMs() + d * DAY_MS)}
                >
                  +{d} dag{d > 1 ? 'en' : ''}
                </button>
              ))}
              <button
                type="button"
                className="rounded-card border border-line px-3 py-2"
                onClick={() => clock.setOffset(0)}
              >
                Reset
              </button>
            </div>
          </section>
          <DevTools />
          <section>
            <h3 className="mb-1 text-sm">Data</h3>
            <button
              type="button"
              className="rounded-card border border-line px-3 py-2 text-danger"
              onClick={() => {
                if (window.confirm('Alle data wissen (dev)?')) useAppStore.getState().wipeAll();
              }}
            >
              Alles wissen
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
