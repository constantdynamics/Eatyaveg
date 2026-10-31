/**
 * Dieren als maatvergelijking (§7.2): vriendelijk, zonder tanden, in dezelfde vlakke stijl.
 * Vak van 200 × 200 met de grond op y = 196.
 */
import type { ReactNode } from 'react';

const INK = '#2b2722';
const CHEEK = '#f4a3a0';

function Eye({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill="#fff" />
    </g>
  );
}

function Smile({ x, y, w = 10 }: { x: number; y: number; w?: number }) {
  return (
    <path
      d={`M${x - w / 2} ${y} q${w / 2} ${w * 0.55} ${w} 0`}
      fill="none"
      stroke={INK}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

export const ANIMALS: Record<string, () => ReactNode> = {
  mier: () => (
    <g>
      <g stroke="#5a2a1c" strokeWidth={5} strokeLinecap="round" fill="none">
        <path d="M92 142 L74 190" />
        <path d="M100 146 L100 192" />
        <path d="M108 142 L128 190" />
        <path d="M58 92 C 50 72 42 64 30 62" />
        <path d="M72 90 C 74 70 82 60 94 56" />
      </g>
      <circle cx={30} cy={62} r={5} fill="#5a2a1c" />
      <circle cx={94} cy={56} r={5} fill="#5a2a1c" />
      <ellipse cx={146} cy={140} rx={36} ry={28} fill="#9c4a32" />
      <ellipse cx={100} cy={134} rx={17} ry={15} fill="#8a3f2a" />
      <circle cx={64} cy={114} r={28} fill="#9c4a32" />
      <Eye x={54} y={110} r={6} />
      <Eye x={74} y={110} r={6} />
      <ellipse cx={46} cy={124} rx={6} ry={4} fill={CHEEK} />
      <Smile x={64} y={126} w={12} />
    </g>
  ),
  lieveheersbeestje: () => (
    <g>
      <g stroke={INK} strokeWidth={5} strokeLinecap="round">
        <path d="M84 176 L74 194" />
        <path d="M112 182 L112 196" />
        <path d="M140 176 L150 194" />
        <path d="M44 112 C 38 96 30 90 22 90" fill="none" />
        <path d="M60 110 C 62 94 70 86 80 84" fill="none" />
      </g>
      <ellipse cx={112} cy={136} rx={64} ry={50} fill="#e04b3c" />
      <path d="M112 88 L112 186" stroke={INK} strokeWidth={4} />
      <g fill={INK}>
        <circle cx={86} cy={118} r={11} />
        <circle cx={140} cy={118} r={11} />
        <circle cx={80} cy={156} r={9} />
        <circle cx={144} cy={156} r={9} />
        <circle cx={128} cy={176} r={6} />
        <circle cx={96} cy={176} r={6} />
      </g>
      <circle cx={54} cy={134} r={28} fill={INK} />
      <circle cx={44} cy={128} r={7} fill="#fff" />
      <circle cx={64} cy={128} r={7} fill="#fff" />
      <circle cx={45} cy={129} r={3.5} fill={INK} />
      <circle cx={65} cy={129} r={3.5} fill={INK} />
      <path d="M46 144 q8 6 16 0" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  egel: () => (
    <g>
      <path
        d="M44 168 C 40 132 60 104 92 96 L 92 84 L 104 94 L 110 80 L 118 94 L 128 82 L 132 98 L 146 90 L 146 106 L 160 102 L 156 118 L 170 120 L 160 132 L 174 140 L 160 148 L 172 160 L 158 164 C 160 180 150 190 130 190 L 70 190 C 54 190 46 182 44 168 Z"
        fill="#8b6b4a"
      />
      <path
        d="M44 150 C 44 132 58 118 76 118 C 90 118 98 132 98 150 C 98 172 84 188 66 188 C 50 188 44 168 44 150 Z"
        fill="#e9d2b0"
      />
      <path d="M48 150 C 34 154 22 160 16 166 C 26 174 40 174 54 168 Z" fill="#e9d2b0" />
      <circle cx={16} cy={166} r={6} fill={INK} />
      <Eye x={60} y={146} r={5} />
      <ellipse cx={74} cy={162} rx={6} ry={4} fill={CHEEK} />
      <path d="M36 170 q8 6 16 2" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={74} cy={192} rx={10} ry={5} fill="#6f5238" />
      <ellipse cx={130} cy={192} rx={10} ry={5} fill="#6f5238" />
    </g>
  ),
  konijn: () => (
    <g>
      <ellipse cx={84} cy={46} rx={12} ry={36} fill="#d9cfc4" />
      <ellipse cx={116} cy={46} rx={12} ry={36} fill="#d9cfc4" />
      <ellipse cx={84} cy={50} rx={6} ry={26} fill="#f2b8b5" />
      <ellipse cx={116} cy={50} rx={6} ry={26} fill="#f2b8b5" />
      <ellipse cx={100} cy={154} rx={50} ry={42} fill="#d9cfc4" />
      <ellipse cx={100} cy={162} rx={28} ry={26} fill="#efe8e0" />
      <circle cx={100} cy={100} r={36} fill="#d9cfc4" />
      <Eye x={86} y={96} r={5.5} />
      <Eye x={114} y={96} r={5.5} />
      <path d="M96 108 L104 108 L100 113 Z" fill="#e8838a" />
      <path d="M92 116 q8 6 16 0" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={74} cy={110} rx={7} ry={4.5} fill={CHEEK} />
      <ellipse cx={126} cy={110} rx={7} ry={4.5} fill={CHEEK} />
      <ellipse cx={78} cy={192} rx={16} ry={7} fill="#efe8e0" />
      <ellipse cx={122} cy={192} rx={16} ry={7} fill="#efe8e0" />
    </g>
  ),
  poes: () => (
    <g>
      <path
        d="M140 176 C 176 168 184 132 164 112"
        fill="none"
        stroke="#e9a35e"
        strokeWidth={13}
        strokeLinecap="round"
      />
      <ellipse cx={100} cy={152} rx={46} ry={44} fill="#e9a35e" />
      <g stroke="#d9853f" strokeWidth={5} strokeLinecap="round">
        <path d="M66 140 l12 4" />
        <path d="M134 140 l-12 4" />
        <path d="M64 160 l12 2" />
        <path d="M136 160 l-12 2" />
      </g>
      <ellipse cx={100} cy={164} rx={24} ry={26} fill="#f6d2a8" />
      <path d="M68 74 L76 40 L96 64 Z" fill="#e9a35e" />
      <path d="M132 74 L124 40 L104 64 Z" fill="#e9a35e" />
      <path d="M74 66 L78 50 L88 62 Z" fill="#f2b8b5" />
      <path d="M126 66 L122 50 L112 62 Z" fill="#f2b8b5" />
      <circle cx={100} cy={94} r={36} fill="#e9a35e" />
      <Eye x={86} y={90} r={5.5} />
      <Eye x={114} y={90} r={5.5} />
      <path d="M96 102 L104 102 L100 107 Z" fill="#e8838a" />
      <path
        d="M90 110 q5 5 10 0 q5 5 10 0"
        fill="none"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <g stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.7}>
        <path d="M70 102 l-14 -3" />
        <path d="M70 108 l-14 2" />
        <path d="M130 102 l14 -3" />
        <path d="M130 108 l14 2" />
      </g>
      <ellipse cx={80} cy={192} rx={14} ry={6} fill="#f6d2a8" />
      <ellipse cx={120} cy={192} rx={14} ry={6} fill="#f6d2a8" />
    </g>
  ),
  jaguar: () => (
    <g>
      <path
        d="M146 176 C 184 170 192 132 172 112"
        fill="none"
        stroke="#e3b04b"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <circle cx={180} cy={126} r={4} fill="#8a5a2b" />
      <ellipse cx={100} cy={150} rx={54} ry={46} fill="#e3b04b" />
      <g fill="none" stroke="#8a5a2b" strokeWidth={4}>
        <circle cx={68} cy={140} r={7} />
        <circle cx={132} cy={140} r={7} />
        <circle cx={78} cy={170} r={6} />
        <circle cx={124} cy={172} r={6} />
        <circle cx={100} cy={128} r={5} />
      </g>
      <g fill="#8a5a2b">
        <circle cx={68} cy={140} r={2} />
        <circle cx={132} cy={140} r={2} />
        <circle cx={78} cy={170} r={2} />
        <circle cx={124} cy={172} r={2} />
      </g>
      <ellipse cx={100} cy={168} rx={22} ry={22} fill="#f3ddb0" />
      <circle cx={70} cy={58} r={13} fill="#e3b04b" />
      <circle cx={130} cy={58} r={13} fill="#e3b04b" />
      <circle cx={70} cy={58} r={6} fill="#c98f3a" />
      <circle cx={130} cy={58} r={6} fill="#c98f3a" />
      <circle cx={100} cy={88} r={38} fill="#e3b04b" />
      <ellipse cx={100} cy={104} rx={18} ry={13} fill="#f3ddb0" />
      <g fill="#8a5a2b">
        <circle cx={76} cy={74} r={3} />
        <circle cx={124} cy={74} r={3} />
        <circle cx={100} cy={62} r={3} />
      </g>
      <Eye x={86} y={84} r={5.5} />
      <Eye x={114} y={84} r={5.5} />
      <path d="M95 98 L105 98 L100 104 Z" fill="#7a4b2e" />
      <path
        d="M90 108 q5 5 10 0 q5 5 10 0"
        fill="none"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <ellipse cx={74} cy={100} rx={6} ry={4} fill={CHEEK} />
      <ellipse cx={126} cy={100} rx={6} ry={4} fill={CHEEK} />
      <ellipse cx={78} cy={192} rx={15} ry={6} fill="#f3ddb0" />
      <ellipse cx={122} cy={192} rx={15} ry={6} fill="#f3ddb0" />
    </g>
  ),
  beer: () => (
    <g>
      <circle cx={66} cy={50} r={16} fill="#9b6b43" />
      <circle cx={134} cy={50} r={16} fill="#9b6b43" />
      <circle cx={66} cy={50} r={8} fill="#c9956a" />
      <circle cx={134} cy={50} r={8} fill="#c9956a" />
      <ellipse cx={100} cy={150} rx={58} ry={48} fill="#9b6b43" />
      <ellipse cx={100} cy={160} rx={32} ry={30} fill="#c9956a" />
      <circle cx={100} cy={88} r={42} fill="#9b6b43" />
      <ellipse cx={100} cy={104} rx={20} ry={15} fill="#d9b48a" />
      <ellipse cx={100} cy={98} rx={8} ry={6} fill={INK} />
      <Eye x={84} y={80} r={5.5} />
      <Eye x={116} y={80} r={5.5} />
      <path d="M92 110 q8 6 16 0" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={70} cy={100} rx={7} ry={4.5} fill={CHEEK} />
      <ellipse cx={130} cy={100} rx={7} ry={4.5} fill={CHEEK} />
      <ellipse cx={76} cy={192} rx={18} ry={7} fill="#7d5434" />
      <ellipse cx={124} cy={192} rx={18} ry={7} fill="#7d5434" />
    </g>
  ),
  dinosaurus: () => (
    <g>
      <path d="M150 150 Q 188 160 198 188 Q 172 176 146 172 Z" fill="#6db39a" />
      <g fill="#4e9a80">
        <path d="M92 116 l8 -12 l8 12 z" />
        <path d="M112 112 l8 -12 l8 12 z" />
        <path d="M132 116 l8 -12 l8 12 z" />
      </g>
      <rect x={72} y={150} width={20} height={44} rx={9} fill="#5ea58c" />
      <rect x={136} y={150} width={20} height={44} rx={9} fill="#5ea58c" />
      <ellipse cx={112} cy={148} rx={58} ry={36} fill="#6db39a" />
      <ellipse cx={110} cy={160} rx={40} ry={18} fill="#a7d7c3" />
      <path d="M70 140 C 56 110 50 80 52 60 L 74 62 C 74 84 80 110 92 128 Z" fill="#6db39a" />
      <rect x={90} y={156} width={20} height={40} rx={9} fill="#6db39a" />
      <rect x={120} y={156} width={20} height={40} rx={9} fill="#6db39a" />
      <ellipse cx={58} cy={54} rx={26} ry={18} fill="#6db39a" />
      <Eye x={50} y={48} r={5} />
      <path d="M38 62 q8 6 18 2" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={66} cy={60} rx={5} ry={3.5} fill={CHEEK} />
    </g>
  ),
  walvis: () => (
    <g>
      <g fill="#9cc7ee">
        <path d="M62 64 C 58 50 50 42 40 40 C 48 48 54 56 56 66 Z" />
        <path d="M70 62 C 70 46 74 36 82 30 C 80 42 78 52 76 64 Z" />
        <circle cx={38} cy={38} r={5} />
        <circle cx={84} cy={28} r={5} />
      </g>
      <path
        d="M172 128 C 184 106 196 96 198 82 C 186 88 178 96 172 104 C 170 94 164 86 156 82 C 160 96 164 110 166 128 Z"
        fill="#4b7fb8"
      />
      <path
        d="M16 136 C 16 98 62 74 112 78 C 152 81 174 104 176 134 C 178 166 146 186 98 186 C 46 186 16 168 16 136 Z"
        fill="#5b8fc9"
      />
      <path
        d="M26 150 C 50 178 130 184 168 152 C 158 176 128 186 98 186 C 60 186 34 174 26 150 Z"
        fill="#cfe3f5"
      />
      <g stroke="#a9c9e8" strokeWidth={3} strokeLinecap="round">
        <path d="M60 168 l0 10" />
        <path d="M84 172 l0 10" />
        <path d="M108 172 l0 10" />
        <path d="M132 168 l0 10" />
      </g>
      <Eye x={52} y={122} r={6} />
      <path
        d="M30 140 q16 12 34 4"
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <ellipse cx={66} cy={136} rx={7} ry={4.5} fill={CHEEK} />
      <path
        d="M96 140 q14 -6 26 4"
        fill="none"
        stroke="#4b7fb8"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  ),
};

/** Volgorde gelijk aan de fases 1–9. */
export const ANIMAL_ORDER = [
  'mier',
  'lieveheersbeestje',
  'egel',
  'konijn',
  'poes',
  'jaguar',
  'beer',
  'dinosaurus',
  'walvis',
] as const;
