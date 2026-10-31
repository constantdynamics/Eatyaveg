/**
 * Lichaamsvormen per groente, in een vak van 200 × 240 met de voeten op y = 232.
 * Elk silhouet is ook zonder kleur herkenbaar (§9.1).
 */
import type { VeggieId } from '../domain/types';
import type { BodySpec } from './types';

const STEM = 'var(--veg-stem)';

export const BODIES: Record<VeggieId, BodySpec> = {
  wortel: {
    render: (c) => (
      <>
        <g fill={c.leaf}>
          <path d="M100 58 C 90 40 92 18 100 6 C 108 18 110 40 100 58 Z" />
          <path d="M96 60 C 76 50 62 34 64 16 C 80 22 92 38 96 60 Z" />
          <path d="M104 60 C 124 50 138 34 136 16 C 120 22 108 38 104 60 Z" />
        </g>
        <path
          d="M56 74 C 56 58 76 54 100 54 C 124 54 144 58 144 74 C 144 112 122 160 106 194 C 103 200 97 200 94 194 C 78 160 56 112 56 74 Z"
          fill={c.body}
        />
        <path
          d="M132 62 C 144 72 140 104 126 138 C 118 158 112 172 104 188 C 112 162 126 130 130 100 C 132 86 134 74 132 62 Z"
          fill={c.shade}
          opacity={0.55}
        />
        <g stroke={c.shade} strokeWidth={4} strokeLinecap="round">
          <path d="M70 134 L82 136" />
          <path d="M114 152 L124 150" />
          <path d="M90 170 L98 171" />
        </g>
      </>
    ),
    face: { x: 100, y: 100, scale: 0.95 },
    shoulders: [
      [66, 122],
      [134, 122],
    ],
    hips: [
      [94, 186],
      [106, 186],
    ],
    headTop: 56,
    belly: 140,
  },

  courgette: {
    render: (c) => (
      <>
        <path d="M95 18 L105 18 L106 46 L94 46 Z" fill={c.shade} />
        <path
          d="M100 44 C 84 44 78 58 78 80 C 78 110 56 136 52 168 C 48 202 76 214 100 214 C 124 214 152 202 148 168 C 144 136 122 110 122 80 C 122 58 116 44 100 44 Z"
          fill={c.body}
        />
        <path
          d="M116 60 C 122 86 126 112 140 146 C 148 176 140 202 116 210 C 132 198 140 178 134 150 C 126 122 118 90 116 60 Z"
          fill={c.shade}
          opacity={0.5}
        />
        <g fill={c.accent} opacity={0.7}>
          <ellipse cx={80} cy={160} rx={3} ry={6} />
          <ellipse cx={92} cy={182} rx={3} ry={5} />
          <ellipse cx={116} cy={176} rx={3} ry={6} />
          <ellipse cx={124} cy={156} rx={2.5} ry={5} />
          <ellipse cx={104} cy={196} rx={3} ry={5} />
          <ellipse cx={84} cy={70} rx={2.5} ry={5} />
        </g>
        <path
          d="M100 30 L108 42 L124 40 L113 51 L120 64 L104 57 L100 70 L96 57 L80 64 L87 51 L76 40 L92 42 Z"
          fill={c.leaf}
        />
      </>
    ),
    face: { x: 100, y: 130, scale: 0.85 },
    shoulders: [
      [62, 150],
      [138, 150],
    ],
    hips: [
      [88, 210],
      [112, 210],
    ],
    headTop: 52,
    belly: 168,
  },

  pompoen: {
    render: (c) => (
      <>
        <path d="M96 78 C 96 62 100 52 110 44 L117 50 C 108 57 106 65 106 78 Z" fill={STEM} />
        <path
          d="M108 56 C 120 46 134 52 130 62 C 127 69 118 66 122 59"
          fill="none"
          stroke={c.leaf}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path d="M112 62 C 128 52 148 58 152 70 C 138 78 122 74 112 62 Z" fill={c.leaf} />
        <path
          d="M100 78 C 118 70 140 72 154 82 C 176 96 182 130 176 158 C 170 186 150 198 130 196 C 120 202 80 202 70 196 C 50 198 30 186 24 158 C 18 130 24 96 46 82 C 60 72 82 70 100 78 Z"
          fill={c.body}
        />
        <g fill="none" stroke={c.shade} strokeWidth={4} strokeLinecap="round" opacity={0.8}>
          <path d="M60 84 C 44 112 44 166 62 194" />
          <path d="M140 84 C 156 112 156 166 138 194" />
          <path d="M84 76 C 80 80 78 84 77 88" />
          <path d="M116 76 C 120 80 122 84 123 88" />
        </g>
        <path
          d="M38 112 C 34 126 34 142 38 154"
          fill="none"
          stroke={c.accent}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.7}
        />
      </>
    ),
    face: { x: 100, y: 132, scale: 1.05 },
    shoulders: [
      [30, 148],
      [170, 148],
    ],
    hips: [
      [84, 196],
      [116, 196],
    ],
    headTop: 76,
    belly: 165,
  },

  komkommer: {
    render: (c) => (
      <>
        <path
          d="M100 30 C 80 30 72 46 72 70 L 72 186 C 72 206 84 216 100 216 C 116 216 128 206 128 186 L 128 70 C 128 46 120 30 100 30 Z"
          fill={c.body}
        />
        <path
          d="M118 40 C 126 52 126 70 126 96 L 126 186 C 126 200 120 210 110 214 C 118 202 120 192 120 182 L 120 64 C 120 54 120 46 118 40 Z"
          fill={c.shade}
          opacity={0.6}
        />
        <g fill={c.shade}>
          {[56, 88, 120, 152, 184].map((y) => (
            <circle key={`l${y}`} cx={71} cy={y} r={6} />
          ))}
          {[72, 104, 136, 168, 200].map((y) => (
            <circle key={`r${y}`} cx={129} cy={y} r={6} />
          ))}
        </g>
        <g fill={c.accent} opacity={0.75}>
          <circle cx={86} cy={150} r={2.5} />
          <circle cx={112} cy={160} r={2.5} />
          <circle cx={94} cy={180} r={2.5} />
          <circle cx={108} cy={196} r={2.5} />
          <circle cx={88} cy={52} r={2.5} />
          <circle cx={112} cy={50} r={2.5} />
        </g>
        <g fill={c.leaf}>
          <circle cx={100} cy={20} r={5} />
          <circle cx={92} cy={25} r={5} />
          <circle cx={108} cy={25} r={5} />
          <circle cx={95} cy={33} r={5} />
          <circle cx={105} cy={33} r={5} />
        </g>
        <circle cx={100} cy={27} r={3.5} fill="#e0a92e" />
      </>
    ),
    face: { x: 100, y: 98, scale: 0.78 },
    shoulders: [
      [74, 134],
      [126, 134],
    ],
    hips: [
      [91, 212],
      [109, 212],
    ],
    headTop: 34,
    belly: 160,
  },

  tomaat: {
    render: (c) => (
      <>
        <ellipse cx={100} cy={132} rx={68} ry={62} fill={c.body} />
        <path
          d="M150 92 C 174 120 170 168 136 190 C 156 168 162 132 150 92 Z"
          fill={c.shade}
          opacity={0.6}
        />
        <ellipse
          cx={66}
          cy={100}
          rx={13}
          ry={7}
          transform="rotate(-35 66 100)"
          fill={c.accent}
          opacity={0.8}
        />
        <path d="M97 50 L103 50 L104 68 L96 68 Z" fill={c.leaf} />
        <path
          d="M100 62 L109 73 L126 69 L115 80 L123 93 L104 85 L100 98 L96 85 L77 93 L85 80 L74 69 L91 73 Z"
          fill={c.leaf}
        />
      </>
    ),
    face: { x: 100, y: 134, scale: 1 },
    shoulders: [
      [36, 144],
      [164, 144],
    ],
    hips: [
      [84, 190],
      [116, 190],
    ],
    headTop: 72,
    belly: 165,
  },

  doperwten: {
    render: (c) => (
      <>
        <g fill={c.body}>
          <circle cx={60} cy={104} r={22} />
          <circle cx={100} cy={96} r={24} />
          <circle cx={140} cy={104} r={22} />
        </g>
        <g fill={c.accent} opacity={0.85}>
          <circle cx={53} cy={96} r={5} />
          <circle cx={92} cy={86} r={5.5} />
          <circle cx={133} cy={96} r={5} />
        </g>
        <path d="M22 108 Q100 128 178 108 Q174 178 100 184 Q26 178 22 108 Z" fill={c.shade} />
        <path
          d="M30 113 Q100 132 170 113"
          fill="none"
          stroke={c.accent}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.8}
        />
        <path
          d="M178 108 C 188 100 194 90 188 80"
          fill="none"
          stroke={c.leaf}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </>
    ),
    face: { x: 100, y: 152, scale: 0.85 },
    shoulders: [
      [32, 140],
      [168, 140],
    ],
    hips: [
      [86, 180],
      [114, 180],
    ],
    headTop: 76,
    belly: 165,
  },

  bloemkool: {
    render: (c) => (
      <>
        <path d="M90 168 L110 168 L108 200 L92 200 Z" fill={c.leaf} />
        <g fill={c.body}>
          <circle cx={66} cy={92} r={30} />
          <circle cx={100} cy={74} r={36} />
          <circle cx={134} cy={92} r={30} />
          <circle cx={56} cy={126} r={26} />
          <circle cx={144} cy={126} r={26} />
          <circle cx={100} cy={118} r={50} />
        </g>
        <g fill="none" stroke={c.shade} strokeWidth={3} strokeLinecap="round">
          <path d="M60 74 q8 -7 16 0" />
          <path d="M92 52 q8 -7 16 0" />
          <path d="M124 74 q8 -7 16 0" />
          <path d="M38 118 q6 -6 12 0" />
          <path d="M150 118 q6 -6 12 0" />
        </g>
      </>
    ),
    front: (c) => (
      <>
        <path
          d="M98 200 C 64 200 30 180 26 138 C 26 126 32 118 40 114 C 44 142 64 170 98 178 Z"
          fill={c.leaf}
        />
        <path
          d="M102 200 C 136 200 170 180 174 138 C 174 126 168 118 160 114 C 156 142 136 170 102 178 Z"
          fill={c.leaf}
        />
        <g fill="none" stroke={c.shade} strokeWidth={2.5} strokeLinecap="round" opacity={0.5}>
          <path d="M92 192 C 70 186 48 166 38 134" />
          <path d="M108 192 C 130 186 152 166 162 134" />
        </g>
      </>
    ),
    face: { x: 100, y: 116, scale: 1 },
    shoulders: [
      [46, 160],
      [154, 160],
    ],
    hips: [
      [91, 198],
      [109, 198],
    ],
    headTop: 42,
    belly: 165,
  },

  sperziebonen: {
    render: (c) => (
      <>
        <path
          d="M96 24 C 94 16 92 10 84 8"
          fill="none"
          stroke={c.leaf}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M98 20 C 120 20 128 38 126 66 C 124 104 130 146 126 184 C 124 206 112 214 100 212 C 86 210 76 196 78 172 C 80 136 72 100 74 64 C 75 36 80 20 98 20 Z"
          fill={c.body}
        />
        <path
          d="M120 30 C 126 42 126 56 124 70 C 122 108 128 146 124 184 C 123 198 116 208 108 211 C 116 200 118 190 119 180 C 122 144 114 106 116 70 C 117 54 118 42 120 30 Z"
          fill={c.shade}
          opacity={0.55}
        />
        <g fill={c.body}>
          <circle cx={124} cy={130} r={8} />
          <circle cx={127} cy={160} r={8} />
          <circle cx={124} cy={190} r={7} />
          <circle cx={78} cy={144} r={7} />
          <circle cx={80} cy={176} r={7} />
        </g>
        <g fill={c.accent} opacity={0.75}>
          <ellipse cx={101} cy={132} rx={5} ry={8} />
          <ellipse cx={103} cy={160} rx={5} ry={8} />
          <ellipse cx={103} cy={188} rx={5} ry={7} />
        </g>
        <path
          d="M112 206 C 124 212 130 222 120 228"
          fill="none"
          stroke={c.shade}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </>
    ),
    face: { x: 100, y: 80, scale: 0.7 },
    shoulders: [
      [76, 110],
      [125, 110],
    ],
    hips: [
      [94, 206],
      [108, 206],
    ],
    headTop: 26,
    belly: 150,
  },

  prei: {
    render: (c) => (
      <>
        <g fill={c.leaf}>
          <path d="M90 82 C 78 52 58 32 36 24 C 48 42 64 64 84 88 Z" />
          <path d="M110 82 C 122 52 142 32 164 24 C 152 42 136 64 116 88 Z" />
          <path d="M95 84 C 93 52 97 26 106 6 C 111 30 109 62 105 86 Z" />
        </g>
        <path d="M80 78 L120 78 L122 120 L78 120 Z" fill={c.shade} />
        <path
          d="M76 110 C 76 106 80 104 86 104 L114 104 C 120 104 124 106 124 110 L 126 196 C 126 206 116 210 100 210 C 84 210 74 206 74 196 Z"
          fill={c.body}
        />
        <path
          d="M76 104 Q100 112 124 104 L124 112 Q100 120 76 112 Z"
          fill={c.shade}
          opacity={0.6}
        />
        <path
          d="M116 112 L118 196 C 118 202 114 206 108 208 C 112 200 112 196 112 190 L112 112 Z"
          fill={c.accent}
          opacity={0.9}
        />
        <g stroke="#c8b08a" strokeWidth={2} strokeLinecap="round">
          <path d="M96 210 l-3 9" />
          <path d="M100 211 l0 10" />
          <path d="M104 210 l3 9" />
        </g>
      </>
    ),
    face: { x: 100, y: 148, scale: 0.72 },
    shoulders: [
      [77, 168],
      [123, 168],
    ],
    hips: [
      [93, 206],
      [107, 206],
    ],
    headTop: 82,
    belly: 176,
  },

  paprika: {
    render: (c) => (
      <>
        <path d="M98 66 C 98 50 104 40 116 34 L121 40 C 111 46 107 54 107 66 Z" fill={c.leaf} />
        <path
          d="M100 64 C 116 58 140 60 146 80 C 152 104 152 140 150 166 C 148 190 134 200 122 194 C 114 202 86 202 78 194 C 66 200 52 190 50 166 C 48 140 48 104 54 80 C 60 60 84 58 100 64 Z"
          fill={c.body}
        />
        <path d="M80 67 C 90 58 110 58 120 67 C 110 74 90 74 80 67 Z" fill={c.leaf} />
        <path
          d="M136 82 C 146 108 146 150 140 176 C 136 186 130 192 124 194 C 134 172 138 132 136 82 Z"
          fill={c.shade}
          opacity={0.55}
        />
        <g fill="none" stroke={c.shade} strokeWidth={4} strokeLinecap="round" opacity={0.7}>
          <path d="M82 192 C 78 180 78 168 80 156" />
          <path d="M118 192 C 122 180 122 168 120 156" />
        </g>
        <path
          d="M62 92 C 58 110 58 130 60 146"
          fill="none"
          stroke={c.accent}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.6}
        />
      </>
    ),
    face: { x: 100, y: 120, scale: 1 },
    shoulders: [
      [53, 138],
      [147, 138],
    ],
    hips: [
      [86, 196],
      [114, 196],
    ],
    headTop: 66,
    belly: 168,
  },

  broccoli: {
    render: (c) => (
      <>
        <g stroke={c.accent} strokeWidth={9} strokeLinecap="round">
          <path d="M88 118 L78 96" />
          <path d="M112 118 L122 96" />
        </g>
        <path
          d="M76 112 C 80 130 82 160 82 196 C 82 204 90 208 100 208 C 110 208 118 204 118 196 C 118 160 120 130 124 112 Z"
          fill={c.accent}
        />
        <path
          d="M112 116 C 112 140 112 170 114 200 C 116 196 118 190 118 184 C 118 156 118 132 120 116 Z"
          fill={c.shade}
          opacity={0.25}
        />
        <g fill={c.body}>
          <circle cx={56} cy={74} r={26} />
          <circle cx={82} cy={50} r={28} />
          <circle cx={118} cy={50} r={28} />
          <circle cx={144} cy={74} r={26} />
          <circle cx={66} cy={100} r={26} />
          <circle cx={100} cy={86} r={34} />
          <circle cx={134} cy={100} r={26} />
        </g>
        <g fill={c.shade}>
          <circle cx={48} cy={66} r={4} />
          <circle cx={74} cy={38} r={4} />
          <circle cx={92} cy={32} r={3.5} />
          <circle cx={124} cy={36} r={4} />
          <circle cx={150} cy={64} r={4} />
          <circle cx={40} cy={88} r={3.5} />
          <circle cx={160} cy={90} r={3.5} />
          <circle cx={58} cy={112} r={3.5} />
          <circle cx={144} cy={114} r={3.5} />
          <circle cx={108} cy={30} r={3} />
        </g>
      </>
    ),
    face: { x: 100, y: 88, scale: 0.92 },
    shoulders: [
      [80, 150],
      [120, 150],
    ],
    hips: [
      [92, 204],
      [108, 204],
    ],
    headTop: 28,
    belly: 165,
  },

  spinazie: {
    render: (c) => (
      <>
        <path d="M70 192 C 38 178 24 140 34 102 C 50 120 62 150 76 182 Z" fill={c.shade} />
        <path d="M130 192 C 162 178 176 140 166 102 C 150 120 138 150 124 182 Z" fill={c.shade} />
        <path
          d="M100 16 C 136 40 160 84 156 132 C 152 174 128 200 100 200 C 72 200 48 174 44 132 C 40 84 64 40 100 16 Z"
          fill={c.body}
        />
        <g fill="none" stroke={c.accent} strokeLinecap="round" opacity={0.75}>
          <path d="M100 30 L100 84" strokeWidth={4} />
          <path d="M100 146 L100 194" strokeWidth={4} />
          <path d="M100 58 Q84 64 70 80" strokeWidth={3} />
          <path d="M100 58 Q116 64 130 80" strokeWidth={3} />
          <path d="M100 166 Q80 170 64 180" strokeWidth={3} />
          <path d="M100 166 Q120 170 136 180" strokeWidth={3} />
        </g>
      </>
    ),
    face: { x: 100, y: 114, scale: 1 },
    shoulders: [
      [48, 142],
      [152, 142],
    ],
    hips: [
      [90, 196],
      [110, 196],
    ],
    headTop: 34,
    belly: 165,
  },

  'rode-biet': {
    render: (c) => (
      <>
        <g fill="none" stroke={c.accent} strokeWidth={4} strokeLinecap="round">
          <path d="M96 76 C 90 60 82 46 72 36" />
          <path d="M100 74 C 100 56 100 40 102 26" />
          <path d="M104 76 C 112 60 120 48 130 40" />
        </g>
        <g fill={c.leaf}>
          <ellipse cx={66} cy={26} rx={14} ry={22} transform="rotate(-35 66 26)" />
          <ellipse cx={102} cy={14} rx={13} ry={20} />
          <ellipse cx={136} cy={30} rx={14} ry={21} transform="rotate(35 136 30)" />
        </g>
        <g fill="none" stroke={c.accent} strokeWidth={2} strokeLinecap="round" opacity={0.8}>
          <path d="M72 36 L60 16" />
          <path d="M102 26 L102 2" />
          <path d="M130 40 L142 20" />
        </g>
        <path
          d="M100 70 C 140 70 166 98 164 136 C 162 172 136 194 108 198 C 106 210 104 220 98 228 C 98 214 96 206 92 198 C 64 194 38 172 36 136 C 34 98 60 70 100 70 Z"
          fill={c.body}
        />
        <path
          d="M146 92 C 166 116 164 160 134 186 C 150 162 156 126 146 92 Z"
          fill={c.shade}
          opacity={0.7}
        />
        <path
          d="M58 156 C 80 172 120 172 142 156"
          fill="none"
          stroke={c.accent}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.45}
        />
      </>
    ),
    face: { x: 100, y: 128, scale: 1 },
    shoulders: [
      [40, 146],
      [160, 146],
    ],
    hips: [
      [84, 192],
      [116, 192],
    ],
    headTop: 72,
    belly: 168,
  },

  spruitjes: {
    render: (c) => (
      <>
        <circle cx={100} cy={134} r={70} fill={c.body} />
        <path
          d="M150 86 C 176 110 176 160 146 190 C 162 162 164 118 150 86 Z"
          fill={c.shade}
          opacity={0.6}
        />
        <g fill="none" stroke={c.shade} strokeWidth={4} strokeLinecap="round" opacity={0.85}>
          <path d="M42 112 C 58 90 84 80 104 82" />
          <path d="M158 116 C 148 92 126 80 104 82" />
          <path d="M36 150 C 44 176 70 196 100 200" />
          <path d="M164 150 C 156 176 130 196 100 200" />
        </g>
        <path d="M72 76 C 56 60 52 40 64 30 C 80 40 88 58 86 78 Z" fill={c.accent} />
        <path
          d="M66 36 C 72 48 78 60 80 74"
          fill="none"
          stroke={c.shade}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.8}
        />
      </>
    ),
    face: { x: 100, y: 138, scale: 1 },
    shoulders: [
      [34, 152],
      [166, 152],
    ],
    hips: [
      [86, 200],
      [114, 200],
    ],
    headTop: 66,
    belly: 175,
  },
};
