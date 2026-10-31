/** Gedeelde onderdelen: gezicht (ogen, wenkbrauwen, mond, wangen), armen en benen. */
import type { Mood, Point } from './types';

export const LIMB = '#4a3b2f';
const INK = 'var(--veg-ink)';
const CHEEK = 'var(--veg-cheek)';

interface FaceProps {
  x: number;
  y: number;
  scale: number;
  mood: Mood;
  blink: boolean;
}

function OpenEye({ cx, big }: { cx: number; big: boolean }) {
  const r = big ? 1.18 : 1;
  return (
    <g>
      <ellipse cx={cx} cy={-4} rx={9 * r} ry={11 * r} fill="var(--veg-eye-white)" />
      <circle cx={cx + 1} cy={-2} r={5.6 * r} fill={INK} />
      <circle cx={cx + 3} cy={-5} r={2 * r} fill="#fff" />
    </g>
  );
}

/** Gezicht rond (0,0); ogen op y = -4, mond op y = 10. */
export function Face({ x, y, scale, mood, blink }: FaceProps) {
  const happyEyes = mood === 'juichend';
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={-27} cy={10} rx={8} ry={5} fill={CHEEK} opacity={0.75} />
      <ellipse cx={27} cy={10} rx={8} ry={5} fill={CHEEK} opacity={0.75} />
      {happyEyes ? (
        <g fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round">
          <path d="M-24 -2 Q-17 -12 -10 -2" />
          <path d="M10 -2 Q17 -12 24 -2" />
        </g>
      ) : (
        <g className={blink ? 'fv-blink' : undefined}>
          <OpenEye cx={-17} big={mood === 'verrast'} />
          <OpenEye cx={17} big={mood === 'verrast'} />
        </g>
      )}
      {mood === 'verrast' && (
        <g fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round">
          <path d="M-25 -21 Q-18 -27 -10 -22" />
          <path d="M10 -22 Q18 -27 25 -21" />
        </g>
      )}
      {mood === 'trots' && (
        <g fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round">
          <path d="M-25 -18 Q-18 -21 -10 -18" />
          <path d="M10 -18 Q18 -21 25 -18" />
        </g>
      )}
      {mood === 'blij' && (
        <path
          d="M-9 9 Q0 18 9 9"
          fill="none"
          stroke={INK}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      )}
      {mood === 'trots' && (
        <path
          d="M-11 9 Q1 17 12 7"
          fill="none"
          stroke={INK}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      )}
      {mood === 'verrast' && <ellipse cx={0} cy={13} rx={5} ry={6.5} fill={INK} />}
      {mood === 'juichend' && (
        <g>
          <path d="M-12 6 Q0 26 12 6 Z" fill={INK} />
          <path d="M-6 15 Q0 20 6 15 Q0 12 -6 15 Z" fill="#e8838a" />
        </g>
      )}
    </g>
  );
}

interface ArmProps {
  from: Point;
  to: Point;
  /** Hoeveel de arm naar buiten buigt (positief = naar buiten). */
  bend?: number;
  className?: string;
}

/** Noodle-arm van schouder naar hand, met een rond handje. */
export function Arm({ from, to, bend = 10, className }: ArmProps) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Loodrecht op de arm, naar buiten (weg van het midden x = 100).
  let nx = -dy / len;
  let ny = dx / len;
  if ((mx - 100) * nx < 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  return (
    <g className={className} style={{ transformOrigin: `${x1}px ${y1}px` }}>
      <path
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={LIMB}
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      <circle cx={x2} cy={y2} r={7} fill={LIMB} />
    </g>
  );
}

interface LegProps {
  hip: Point;
  ground: number;
  side: 'links' | 'rechts';
  className?: string;
}

export function Leg({ hip, ground, side, className }: LegProps) {
  const [x, y] = hip;
  const foot = side === 'links' ? -6 : 6;
  return (
    <g className={className} style={{ transformOrigin: `${x}px ${y}px` }}>
      <path
        d={`M${x} ${y} L${x} ${ground - 5}`}
        stroke={LIMB}
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      <ellipse cx={x + foot} cy={ground - 3} rx={10} ry={6} fill={LIMB} />
    </g>
  );
}
