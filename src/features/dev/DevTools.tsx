import { useState } from 'react';
import { VEGGIES } from '../../content/veggies';
import type { Phase, VeggieId } from '../../domain/types';
import { useAppStore } from '../../store/app-store';
import { devAddEvents, devGardenShowcase, devReplayMoments, devSetPhase } from './dev-actions';

const btn = 'rounded-card border border-line px-3 py-2';

export function DevTools() {
  const children = useAppStore((s) => s.children);
  const selected = useAppStore((s) => s.meta.selectedChildId ?? s.children[0]?.id);
  const [childId, setChildId] = useState(selected ?? '');
  const [veggieId, setVeggieId] = useState<VeggieId>('wortel');
  const [phase, setPhase] = useState<Phase>(3);
  const [fps, setFps] = useState(() => {
    try {
      return localStorage.getItem('fv:dev:fps') === '1';
    } catch {
      return false;
    }
  });
  const kid = childId || selected || '';

  return (
    <section className="mb-4 space-y-2">
      <h3 className="text-sm">Groei</h3>
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Kind"
          className={btn}
          value={kid}
          onChange={(e) => setChildId(e.target.value)}
        >
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Groente"
          className={btn}
          value={veggieId}
          onChange={(e) => setVeggieId(e.target.value as VeggieId)}
        >
          {VEGGIES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-1">
        <button type="button" className={btn} onClick={() => kid && devAddEvents(kid, veggieId, 1)}>
          +1 registratie
        </button>
        <button type="button" className={btn} onClick={() => kid && devAddEvents(kid, veggieId, 3)}>
          +3
        </button>
        <select
          aria-label="Fase"
          className={btn}
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value) as Phase)}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <option key={p} value={p}>
              Fase {p}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={btn}
          onClick={() => kid && devSetPhase(kid, veggieId, phase)}
        >
          Fase zetten
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        <button type="button" className={btn} onClick={() => kid && devReplayMoments(kid)}>
          Momenten opnieuw
        </button>
        <button type="button" className={btn} onClick={() => kid && devGardenShowcase(kid)}>
          Tuin vullen
        </button>
        <button
          type="button"
          className={btn}
          aria-pressed={fps}
          onClick={() => {
            const next = !fps;
            setFps(next);
            try {
              if (next) localStorage.setItem('fv:dev:fps', '1');
              else localStorage.removeItem('fv:dev:fps');
            } catch {
              // geen opslag
            }
          }}
        >
          Fps-meter {fps ? 'aan' : 'uit'}
        </button>
      </div>
    </section>
  );
}
