/**
 * De Ouder-knop (§8.1, §4.4.8): klein en zichtbaar in een hoek, met een slotje. Pas na 1,5 seconde
 * vasthouden (met voortgangsring) terug naar de ouder-app; kort tikken geeft alleen een wiebel.
 */
import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { PARENT_HOLD_MS } from '../../config/app';

const R = 23;
const CIRC = 2 * Math.PI * R;

export function ParentButton({ onExit }: { onExit: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(0);
  const start = useRef<number | null>(null);
  const frame = useRef(0);
  const done = useRef(false);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const tick = (now: number) => {
    if (start.current === null) return;
    const p = Math.min(1, (now - start.current) / PARENT_HOLD_MS);
    setProgress(p);
    if (p >= 1 && !done.current) {
      done.current = true;
      onExit();
      return;
    }
    frame.current = requestAnimationFrame(tick);
  };

  // Tijden komen uit de events en requestAnimationFrame (zelfde tijdbasis), niet uit render.
  const begin = (t: number) => {
    if (start.current !== null) return;
    done.current = false;
    start.current = t;
    frame.current = requestAnimationFrame(tick);
  };

  const end = (t: number) => {
    if (start.current === null) return;
    const held = t - start.current;
    start.current = null;
    cancelAnimationFrame(frame.current);
    if (!done.current) {
      setProgress(0);
      if (held < 400) setHint((h) => h + 1);
    }
  };

  return (
    <button
      type="button"
      className={`fv-parent ${hint ? 'fv-parent--hint' : ''}`}
      key={hint}
      aria-label="Ouder: houd 1,5 seconde vast om terug te gaan"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        begin(e.timeStamp);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        end(e.timeStamp);
      }}
      onPointerCancel={(e) => end(e.timeStamp)}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault();
          begin(e.timeStamp);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') end(e.timeStamp);
      }}
      data-testid="ouder-knop"
    >
      <svg className="fv-parent-ring" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={R} fill="none" stroke="rgb(95 87 76 / 0.18)" strokeWidth="3" />
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="#2f6b4f"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
        />
      </svg>
      <Lock size={20} aria-hidden="true" />
    </button>
  );
}
