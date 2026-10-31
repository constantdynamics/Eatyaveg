/** Korte, zuinige confetti (±1,5 s) in schermcoördinaten. Niet bij prefers-reduced-motion. */
import { memo, type CSSProperties } from 'react';
import { createRng } from '../../lib/seeded-rng';

const COLORS = ['#f0b45a', '#8fb6d9', '#e3a0a8', '#a9c79a', '#c3aed8', '#f2c14e', '#5b9bd5'];

function pieces(burst: number) {
  const rng = createRng(`confetti-${burst}`);
  return Array.from({ length: 26 }, (_, i) => ({
    dx: `${(rng() - 0.5) * 520}px`,
    dy: `${-120 - rng() * 260 + (i % 3) * 120}px`,
    rot: `${(rng() - 0.5) * 720}deg`,
    color: COLORS[i % COLORS.length]!,
    delay: `${rng() * 0.15}s`,
  }));
}

export const Confetti = memo(function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <div key={burst} className="fv-confetti" aria-hidden="true">
      {pieces(burst).map((p, i) => (
        <i
          key={i}
          style={
            {
              background: p.color,
              animationDelay: p.delay,
              '--dx': p.dx,
              '--dy': p.dy,
              '--rot': p.rot,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
});
