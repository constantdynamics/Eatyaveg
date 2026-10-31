/**
 * Rekwisieten per fase (§7.2). Getekend met het ankerpunt onderaan in het midden (0, 0),
 * omhoog naar y = -h. Bij "zij" zit het handvat bovenaan.
 */
import type { ReactNode } from 'react';
import type { PropId } from '../domain/types';
import type { HoldMode } from './types';

export interface PropSpec {
  w: number;
  h: number;
  hold: HoldMode;
  render: () => ReactNode;
}

const SKIN = ['#f1c7a4', '#d9a17a', '#a8704b', '#7a4b2e'];
const HAIR = ['#5b4636', '#2b2722', '#c9883e', '#8a5a3a'];

function Person({
  x,
  h,
  skin,
  hair,
  shirt,
  arms = 'down',
}: {
  x: number;
  h: number;
  skin: string;
  hair: string;
  shirt: string;
  arms?: 'down' | 'hug';
}) {
  // Eenvoudige, vriendelijke figuur met de voeten op y = 0.
  const head = h * 0.2;
  const bodyH = h * 0.42;
  const bodyW = h * 0.3;
  const top = -h;
  return (
    <g>
      <rect
        x={x - bodyW * 0.3}
        y={-h * 0.36}
        width={bodyW * 0.22}
        height={h * 0.36}
        rx={bodyW * 0.1}
        fill="#4d5b7c"
      />
      <rect
        x={x + bodyW * 0.08}
        y={-h * 0.36}
        width={bodyW * 0.22}
        height={h * 0.36}
        rx={bodyW * 0.1}
        fill="#4d5b7c"
      />
      <rect
        x={x - bodyW / 2}
        y={top + head * 2 - 2}
        width={bodyW}
        height={bodyH}
        rx={bodyW * 0.4}
        fill={shirt}
      />
      {arms === 'hug' && (
        <g stroke={skin} strokeWidth={h * 0.06} strokeLinecap="round">
          <path d={`M${x - bodyW / 2 + 2} ${top + head * 2 + 6} l${-h * 0.12} ${-h * 0.14}`} />
          <path d={`M${x + bodyW / 2 - 2} ${top + head * 2 + 6} l${h * 0.12} ${-h * 0.14}`} />
        </g>
      )}
      <circle cx={x} cy={top + head} r={head} fill={skin} />
      <path
        d={`M${x - head} ${top + head * 0.9} a${head} ${head} 0 0 1 ${head * 2} 0 q${-head} ${-head * 0.4} ${-head * 2} 0 z`}
        fill={hair}
      />
      <circle cx={x - head * 0.38} cy={top + head * 1.05} r={head * 0.12} fill="#2b2722" />
      <circle cx={x + head * 0.38} cy={top + head * 1.05} r={head * 0.12} fill="#2b2722" />
      <path
        d={`M${x - head * 0.35} ${top + head * 1.4} q${head * 0.35} ${head * 0.3} ${head * 0.7} 0`}
        fill="none"
        stroke="#2b2722"
        strokeWidth={Math.max(1.5, head * 0.1)}
        strokeLinecap="round"
      />
    </g>
  );
}

export const PROPS: Record<PropId, PropSpec> = {
  blokje: {
    w: 46,
    h: 46,
    hold: 'boven',
    render: () => (
      <g>
        <rect x={-23} y={-46} width={46} height={46} rx={8} fill="#f2c14e" />
        <rect x={-15} y={-38} width={30} height={30} rx={5} fill="#e8a93a" />
        <path
          d="M0 -33 L4 -26 L12 -25 L6 -20 L8 -12 L0 -16 L-8 -12 L-6 -20 L-12 -25 L-4 -26 Z"
          fill="#fff6dc"
        />
      </g>
    ),
  },
  boeken: {
    w: 76,
    h: 48,
    hold: 'boven',
    render: () => (
      <g>
        <rect x={-38} y={-16} width={76} height={16} rx={3} fill="#6fa8dc" />
        <rect x={-34} y={-13} width={68} height={4} fill="#fff8e7" opacity={0.9} />
        <rect x={-34} y={-32} width={68} height={16} rx={3} fill="#e06c5a" />
        <rect x={-30} y={-29} width={60} height={4} fill="#fff8e7" opacity={0.9} />
        <rect x={-36} y={-48} width={70} height={16} rx={3} fill="#8bc28c" />
        <rect x={-32} y={-45} width={62} height={4} fill="#fff8e7" opacity={0.9} />
      </g>
    ),
  },
  schooltas: {
    w: 56,
    h: 66,
    hold: 'zij',
    render: () => (
      <g>
        <path
          d="M-10 -66 C -10 -76 10 -76 10 -66"
          fill="none"
          stroke="#9c4a35"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <rect x={-28} y={-62} width={56} height={62} rx={14} fill="#e07a5f" />
        <rect x={-20} y={-30} width={40} height={24} rx={8} fill="#c9634b" />
        <rect x={-4} y={-34} width={8} height={10} rx={3} fill="#f2c14e" />
      </g>
    ),
  },
  boodschappentas: {
    w: 62,
    h: 78,
    hold: 'zij',
    render: () => (
      <g>
        <path
          d="M-18 -78 C -18 -92 18 -92 18 -78"
          fill="none"
          stroke="#a88a5c"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <rect
          x={-6}
          y={-96}
          width={12}
          height={40}
          rx={6}
          transform="rotate(-18 0 -76)"
          fill="#e3b26b"
        />
        <circle cx={14} cy={-62} r={11} fill="#e5533d" />
        <path d="M14 -73 q4 -6 10 -6 q-2 6 -10 6 z" fill="#5e9e5a" />
        <path d="M-24 -60 C -20 -76 -10 -80 -4 -70 C -8 -66 -16 -62 -24 -60 Z" fill="#5e9e5a" />
        <path d="M-31 -60 L31 -60 L27 0 L-27 0 Z" fill="#d9c29c" />
        <path d="M-31 -60 L31 -60 L30 -50 L-30 -50 Z" fill="#c8ad82" />
      </g>
    ),
  },
  tuinstoel: {
    w: 84,
    h: 84,
    hold: 'boven',
    render: () => (
      <g fill="#b5835a">
        <rect x={-34} y={-84} width={10} height={84} rx={4} />
        <rect x={24} y={-84} width={10} height={84} rx={4} />
        <rect x={-30} y={-80} width={60} height={9} rx={4} fill="#c99468" />
        <rect x={-30} y={-64} width={60} height={9} rx={4} fill="#c99468" />
        <rect x={-42} y={-40} width={84} height={12} rx={5} fill="#c99468" />
        <rect x={-38} y={-30} width={8} height={30} rx={3} />
        <rect x={30} y={-30} width={8} height={30} rx={3} />
      </g>
    ),
  },
  borden: {
    w: 80,
    h: 38,
    hold: 'voor',
    render: () => (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <ellipse cx={0} cy={-6 - i * 7} rx={40} ry={7} fill="#8fb6d9" />
            <ellipse cx={0} cy={-8 - i * 7} rx={38} ry={6} fill="#fffdf8" />
          </g>
        ))}
      </g>
    ),
  },
  koffer: {
    w: 84,
    h: 74,
    hold: 'zij',
    render: () => (
      <g>
        <path
          d="M-12 -72 C -12 -82 12 -82 12 -72"
          fill="none"
          stroke="#4f6f94"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <rect x={-42} y={-68} width={84} height={64} rx={10} fill="#7c9fc4" />
        <rect x={-26} y={-68} width={8} height={64} fill="#5f84ad" />
        <rect x={18} y={-68} width={8} height={64} fill="#5f84ad" />
        <circle cx={-30} cy={0} r={5} fill="#4a3b2f" />
        <circle cx={30} cy={0} r={5} fill="#4a3b2f" />
      </g>
    ),
  },
  volwassene: {
    w: 128,
    h: 50,
    hold: 'boven',
    render: () => (
      <g>
        {/* Een grote mens, voor de grap opgetild: liggend, lachend, armen omhoog. */}
        <rect x={14} y={-27} width={46} height={11} rx={5.5} fill="#4d5b7c" />
        <rect x={14} y={-15} width={46} height={11} rx={5.5} fill="#5b6a8c" />
        <ellipse cx={62} cy={-21} rx={7} ry={6} fill="#4a3b2f" />
        <ellipse cx={62} cy={-9} rx={7} ry={6} fill="#4a3b2f" />
        <rect x={-32} y={-31} width={52} height={29} rx={14} fill="#e08e6d" />
        <g stroke="#d9a17a" strokeWidth={7} strokeLinecap="round">
          <path d="M-22 -29 L-30 -46" />
          <path d="M-6 -29 L-2 -46" />
        </g>
        <circle cx={-30} cy={-48} r={5} fill="#d9a17a" />
        <circle cx={-2} cy={-48} r={5} fill="#d9a17a" />
        <circle cx={-46} cy={-16} r={17} fill="#d9a17a" />
        <path d="M-63 -17 a17 17 0 0 1 32 -8 q-16 -4 -32 8 z" fill="#5b4636" />
        <circle cx={-52} cy={-17} r={2.4} fill="#2b2722" />
        <circle cx={-40} cy={-17} r={2.4} fill="#2b2722" />
        <path d="M-53 -9 q7 8 14 0 z" fill="#2b2722" />
        <ellipse cx={-57} cy={-11} rx={3.5} ry={2.2} fill="#f4a3a0" />
        <ellipse cx={-35} cy={-11} rx={3.5} ry={2.2} fill="#f4a3a0" />
      </g>
    ),
  },
  familie: {
    w: 190,
    h: 118,
    hold: 'knuffel',
    render: () => (
      <g>
        <Person x={-68} h={118} skin={SKIN[1]!} hair={HAIR[0]!} shirt="#7cafd6" arms="hug" />
        <Person x={68} h={110} skin={SKIN[2]!} hair={HAIR[1]!} shirt="#e3a0a8" arms="hug" />
        <Person x={-22} h={78} skin={SKIN[0]!} hair={HAIR[2]!} shirt="#f0b45a" arms="hug" />
        <Person x={24} h={68} skin={SKIN[3]!} hair={HAIR[3]!} shirt="#a9c79a" arms="hug" />
      </g>
    ),
  },
};
