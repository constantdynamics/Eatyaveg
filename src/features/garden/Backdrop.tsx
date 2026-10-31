/**
 * Achtergrond in lagen (lucht, verre heuvels, bomenrij, gras, pad) met lichte parallax.
 * Zacht en wat gedempt, zodat de vriendjes de kleur dragen (§14.2).
 */
import { memo } from 'react';
import { WORLD } from './world';

const SKY = '#e3eff3';
const GRASS_BACK = '#cfe2b8';
const GRASS_FRONT = '#d6e8c3';

export const SkyLayer = memo(function SkyLayer() {
  return (
    <svg
      className="absolute"
      style={{ left: -3000, top: -6000 }}
      width={10200}
      height={6000 + WORLD.horizon + 40}
      aria-hidden="true"
    >
      <rect width="100%" height="100%" fill={SKY} />
      <g transform="translate(6300 6130)">
        <circle r={110} fill="#fff6d8" opacity={0.6} />
        <circle r={64} fill="#fff1c4" />
      </g>
      <g fill="#ffffff" opacity={0.85} transform={`translate(3000 6000)`}>
        <g transform="translate(260 150)">
          <ellipse cx={0} cy={0} rx={70} ry={26} />
          <ellipse cx={46} cy={-14} rx={46} ry={30} />
          <ellipse cx={-40} cy={-6} rx={34} ry={22} />
        </g>
        <g transform="translate(1500 110)">
          <ellipse cx={0} cy={0} rx={90} ry={28} />
          <ellipse cx={50} cy={-18} rx={50} ry={32} />
          <ellipse cx={-50} cy={-8} rx={40} ry={24} />
        </g>
        <g transform="translate(2850 170)">
          <ellipse cx={0} cy={0} rx={64} ry={22} />
          <ellipse cx={36} cy={-12} rx={38} ry={26} />
        </g>
        <g transform="translate(3900 120)">
          <ellipse cx={0} cy={0} rx={80} ry={26} />
          <ellipse cx={-44} cy={-14} rx={44} ry={28} />
        </g>
      </g>
    </svg>
  );
});

export const FarHills = memo(function FarHills() {
  return (
    <svg
      className="absolute"
      style={{ left: -1200, top: 380 }}
      width={6600}
      height={260}
      viewBox="0 0 6600 260"
      aria-hidden="true"
    >
      <path
        d="M0 200 C 400 90 800 60 1300 150 C 1700 210 2000 70 2500 110 C 3000 150 3300 50 3800 120 C 4300 190 4600 80 5100 120 C 5600 160 6000 90 6600 140 L 6600 260 L 0 260 Z"
        fill="#d8e8cc"
      />
      <path
        d="M0 230 C 500 170 900 150 1400 200 C 1900 240 2300 160 2800 190 C 3300 220 3700 150 4300 190 C 4800 220 5300 170 6600 200 L 6600 260 L 0 260 Z"
        fill="#cfe2c1"
      />
    </svg>
  );
});

export const TreeLine = memo(function TreeLine() {
  const trees: [number, number][] = [
    [-300, 1],
    [-60, 0.8],
    [380, 0.9],
    [700, 0.7],
    [1720, 1],
    [1980, 0.8],
    [2580, 0.9],
    [3350, 1],
    [4250, 0.85],
    [4600, 1],
  ];
  return (
    <svg
      className="absolute"
      style={{ left: -600, top: 470 }}
      width={5600}
      height={140}
      viewBox="-600 470 5600 140"
      aria-hidden="true"
    >
      {trees.map(([x, s]) => (
        <g key={x} transform={`translate(${x} 600) scale(${s})`}>
          <rect x={-6} y={-40} width={12} height={40} fill="#c2b291" />
          <circle cx={0} cy={-62} r={34} fill="#bcd6aa" />
          <circle cx={-22} cy={-46} r={22} fill="#b4d0a0" />
          <circle cx={22} cy={-48} r={24} fill="#b4d0a0" />
        </g>
      ))}
    </svg>
  );
});

export const Ground = memo(function Ground() {
  return (
    <svg
      className="absolute"
      style={{ left: -3000, top: WORLD.horizon }}
      width={10200}
      height={6000}
      aria-hidden="true"
    >
      <rect width="100%" height="100%" fill={GRASS_FRONT} />
      <rect width="100%" height={110} fill={GRASS_BACK} />
      <g transform={`translate(3000 ${-WORLD.horizon})`}>
        <path
          d="M-600 985 C 200 950 500 1000 900 975 C 1400 945 1800 1000 2300 975 C 2800 950 3200 1000 3700 975 C 4100 955 4500 990 4800 970 L 4800 1030 C 4400 1050 4000 1020 3600 1040 C 3100 1060 2700 1015 2200 1040 C 1700 1060 1300 1010 800 1040 C 400 1055 100 1015 -600 1040 Z"
          fill="#efe4cb"
        />
        <g fill="#c8dcb2">
          {[150, 520, 1180, 1700, 2600, 3150, 3700, 4150].map((x) => (
            <path key={x} d={`M${x} 960 q4 -14 8 0 q4 -12 8 0`} />
          ))}
        </g>
      </g>
    </svg>
  );
});
