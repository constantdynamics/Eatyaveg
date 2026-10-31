/**
 * Herkenbare objecten per zone (twee à drie per zone, §14.2). Alles mag aangeraakt worden:
 * de eend kwaakt, de schommel schommelt, een bloem gaat open, de vlinder fladdert weg.
 */
import { memo } from 'react';
import { WORLD } from './world';

export type ObjectId =
  | 'gieter'
  | 'schommel'
  | 'glijbaan'
  | 'bal'
  | 'eend-1'
  | 'eend-2'
  | 'lelie'
  | 'bloemen-1'
  | 'bloemen-2'
  | 'bloemen-3'
  | 'vlinder'
  | 'bankje'
  | 'boom';

interface ObjectsProps {
  /** Per object een teller; een nieuwe waarde start de animatie opnieuw. */
  active: Partial<Record<ObjectId, number>>;
}

function Tulip({ x, y, color, h = 46 }: { x: number; y: number; color: string; h?: number }) {
  return (
    <g>
      <path
        d={`M${x} ${y} L${x} ${y - h}`}
        stroke="#86b06e"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path d={`M${x} ${y - 14} q-12 -6 -14 -18 q10 2 14 12`} fill="#9cc58a" />
      <path
        d={`M${x - 11} ${y - h - 2} q0 -18 11 -20 q11 2 11 20 q-5 6 -11 6 q-6 0 -11 -6 z`}
        fill={color}
      />
      <path d={`M${x - 4} ${y - h - 4} l4 -14 l4 14 z`} fill="#fff" opacity={0.35} />
    </g>
  );
}

function Daisy({ x, y, h = 34 }: { x: number; y: number; h?: number }) {
  const cy = y - h;
  return (
    <g>
      <path d={`M${x} ${y} L${x} ${cy}`} stroke="#86b06e" strokeWidth={3.5} strokeLinecap="round" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx={x}
          cy={cy - 7}
          rx={4}
          ry={7.5}
          fill="#ffffff"
          transform={`rotate(${a} ${x} ${cy})`}
        />
      ))}
      <circle cx={x} cy={cy} r={5} fill="#f2c14e" />
    </g>
  );
}

function FlowerCluster({
  x,
  y,
  id,
  active,
}: {
  x: number;
  y: number;
  id: ObjectId;
  active?: number;
}) {
  return (
    <g data-tap="object" data-object={id}>
      <rect x={x - 70} y={y - 110} width={140} height={120} fill="transparent" />
      <g key={active} className={active ? 'fv-bloom fv-bloom--open' : 'fv-bloom'}>
        <Tulip x={x - 34} y={y} color="#e88a8a" />
        <Daisy x={x - 12} y={y + 4} />
        <Tulip x={x + 8} y={y - 2} color="#f2c14e" h={54} />
        <Daisy x={x + 30} y={y + 2} h={30} />
        <Tulip x={x + 48} y={y + 4} color="#c3aed8" h={40} />
      </g>
    </g>
  );
}

function Duck({
  x,
  y,
  id,
  active,
  flip = false,
}: {
  x: number;
  y: number;
  id: ObjectId;
  active?: number;
  flip?: boolean;
}) {
  return (
    <g data-tap="object" data-object={id} className="fv-detail">
      <rect x={x - 46} y={y - 50} width={92} height={70} fill="transparent" />
      <g key={active} className={active ? 'fv-duck fv-duck--quack' : 'fv-duck'}>
        <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
          <ellipse cx={x} cy={y} rx={26} ry={14} fill="#f4d77a" />
          <path d={`M${x + 18} ${y - 6} q14 -4 16 -20 q-10 4 -16 6 z`} fill="#f4d77a" />
          <circle cx={x - 18} cy={y - 18} r={12} fill="#f4d77a" />
          <path d={`M${x - 30} ${y - 18} q-10 2 -12 6 q8 2 13 -1 z`} fill="#e8a33a" />
          <circle cx={x - 21} cy={y - 21} r={2.4} fill="#2b2722" />
          <path
            d={`M${x - 8} ${y - 2} q10 6 22 0`}
            fill="none"
            stroke="#e6c35a"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      </g>
    </g>
  );
}

export const ZoneObjects = memo(function ZoneObjects({ active }: ObjectsProps) {
  return (
    <svg
      className="absolute left-0 top-0"
      width={WORLD.width}
      height={WORLD.height}
      viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      overflow="visible"
      aria-hidden="true"
    >
      {/* Weide: heuvel achterin */}
      <ellipse cx={3800} cy={770} rx={560} ry={150} fill="#c9dfae" />
      <ellipse cx={3640} cy={700} rx={260} ry={60} fill="#d2e6b8" opacity={0.7} />

      {/* Moestuin: hekje, bed, gieter */}
      <g fill="#e6d6b6">
        <rect x={40} y={664} width={760} height={8} rx={4} />
        <rect x={40} y={688} width={760} height={8} rx={4} />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={46 + i * 56} y={640} width={12} height={70} rx={5} />
        ))}
      </g>
      <rect x={60} y={858} width={730} height={64} rx={10} fill="#b98f63" />
      <rect x={60} y={858} width={730} height={20} rx={8} fill="#8a6a4a" />
      <g stroke="#7a5c3f" strokeWidth={3} strokeLinecap="round" opacity={0.5}>
        <path d="M80 868 L770 868" strokeDasharray="10 14" />
      </g>
      <g data-tap="object" data-object="gieter">
        <rect x={770} y={830} width={110} height={110} fill="transparent" />
        <g transform="translate(822 922)">
          <path d="M-28 0 L-24 -46 L24 -46 L28 0 Z" fill="#8fb9a8" />
          <path d="M-24 -46 C -26 -64 26 -64 24 -46" fill="none" stroke="#7aa595" strokeWidth={6} />
          <path d="M-26 -30 L-58 -54 L-54 -60 L-22 -38 Z" fill="#7aa595" />
          <ellipse cx={-58} cy={-58} rx={7} ry={4} fill="#7aa595" transform="rotate(-35 -58 -58)" />
          {active.gieter && (
            <g key={active.gieter} fill="#9cc7ee">
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  className="fv-water-drop"
                  cx={-62 + i * 4}
                  cy={-52 + i * 6}
                  r={4}
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </g>
          )}
        </g>
      </g>

      {/* Speeltuin: schommel, glijbaan, bal */}
      <g data-tap="object" data-object="schommel">
        <rect x={1176} y={556} width={184} height={214} fill="transparent" />
        <g stroke="#c49a6c" strokeWidth={12} strokeLinecap="round">
          <path d="M1190 760 L1216 570" />
          <path d="M1342 760 L1316 570" />
          <path d="M1202 570 L1330 570" />
        </g>
        <g
          key={active.schommel}
          className={active.schommel ? 'fv-swing-seat fv-swing--go' : 'fv-swing-seat'}
          style={{ transformOrigin: '1266px 574px' }}
        >
          <path d="M1238 574 L1238 712 M1294 574 L1294 712" stroke="#8a7a66" strokeWidth={3.5} />
          <rect x={1226} y={708} width={80} height={12} rx={5} fill="#e07a5f" />
        </g>
      </g>
      <g data-tap="object" data-object="glijbaan">
        <path
          d="M1590 760 L1590 612 M1626 760 L1626 612"
          stroke="#c49a6c"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <g stroke="#c49a6c" strokeWidth={5}>
          {[642, 674, 706, 738].map((y) => (
            <path key={y} d={`M1590 ${y} L1626 ${y}`} />
          ))}
        </g>
        <rect x={1566} y={604} width={66} height={12} rx={5} fill="#c49a6c" />
        <path
          d="M1572 612 C 1532 628 1516 730 1462 760 L1486 766 C 1540 740 1554 646 1588 622 Z"
          fill="#e4b363"
        />
      </g>
      <g data-tap="object" data-object="bal" className="fv-detail">
        <rect x={980} y={880} width={70} height={70} fill="transparent" />
        <g key={active.bal} className={active.bal ? 'fv-ball--bounce' : undefined}>
          <circle cx={1012} cy={922} r={18} fill="#e07a5f" />
          <path d="M996 914 q16 10 32 0" fill="none" stroke="#fffdf8" strokeWidth={5} />
        </g>
      </g>

      {/* Vijver: water, waterlelies, riet, eendjes */}
      <ellipse cx={2100} cy={846} rx={212} ry={66} fill="#c9dcc0" />
      <ellipse cx={2100} cy={842} rx={202} ry={58} fill="#b9d7e6" />
      <ellipse cx={2050} cy={830} rx={80} ry={13} fill="#cfe3ee" opacity={0.8} />
      <g fill="#9cc58a">
        <path d="M2010 862 a26 11 0 1 1 18 6 l-14 -6 z" />
        <path d="M2150 826 a22 9 0 1 1 15 5 l-12 -5 z" />
      </g>
      <g data-tap="object" data-object="lelie">
        <rect x={2200} y={830} width={80} height={60} fill="transparent" />
        <path d="M2232 870 a28 11 0 1 1 18 6 l-14 -6 z" fill="#9cc58a" />
        <g key={active.lelie} className={active.lelie ? 'fv-bloom fv-bloom--open' : 'fv-bloom'}>
          <path
            d="M2240 864 q-8 -14 0 -22 q8 8 0 22 z M2240 864 q-14 -8 -16 -18 q12 0 16 18 z M2240 864 q14 -8 16 -18 q-12 0 -16 18 z"
            fill="#efb0c0"
          />
        </g>
      </g>
      <g stroke="#9bbf8a" strokeWidth={4} strokeLinecap="round">
        <path d="M1906 836 l-4 -70 M1920 840 l2 -84 M1934 838 l6 -60" />
        <path d="M2266 832 l-6 -60 M2280 836 l0 -80 M2294 838 l6 -64" />
      </g>
      <g fill="#a98a6a">
        <rect x={1914} y={748} width={10} height={26} rx={5} />
        <rect x={2275} y={748} width={10} height={26} rx={5} />
      </g>
      <Duck x={2010} y={828} id="eend-1" active={active['eend-1']} />
      <Duck x={2120} y={862} id="eend-2" active={active['eend-2']} flip />

      {/* Bloementuin: bankje, bloemen, vlinder */}
      <g data-tap="object" data-object="bankje">
        <rect x={2880} y={676} width={150} height={56} rx={8} fill="#c49a6c" />
        <rect x={2876} y={712} width={158} height={12} rx={5} fill="#b5835a" />
        <rect x={2886} y={720} width={10} height={30} rx={4} fill="#a87a50" />
        <rect x={3014} y={720} width={10} height={30} rx={4} fill="#a87a50" />
        <g fill="#b5835a">
          <rect x={2888} y={684} width={134} height={8} rx={4} />
          <rect x={2888} y={698} width={134} height={8} rx={4} />
        </g>
      </g>
      <FlowerCluster x={2700} y={940} id="bloemen-1" active={active['bloemen-1']} />
      <FlowerCluster x={2960} y={912} id="bloemen-2" active={active['bloemen-2']} />
      <FlowerCluster x={3200} y={944} id="bloemen-3" active={active['bloemen-3']} />
      <g data-tap="object" data-object="vlinder" className="fv-detail">
        <g
          key={active.vlinder}
          className={active.vlinder ? 'fv-butterfly fv-butterfly--away' : 'fv-butterfly'}
        >
          <rect x={2800} y={740} width={70} height={60} fill="transparent" />
          <g transform="translate(2836 770)">
            <g className="fv-butterfly-wing">
              <path d="M0 0 C -14 -22 -30 -16 -26 -2 C -30 10 -14 16 0 0 Z" fill="#f2b8b5" />
            </g>
            <g className="fv-butterfly-wing fv-butterfly-wing--r">
              <path d="M0 0 C 14 -22 30 -16 26 -2 C 30 10 14 16 0 0 Z" fill="#f2b8b5" />
            </g>
            <ellipse cx={0} cy={0} rx={2.5} ry={10} fill="#6b5a4a" />
          </g>
        </g>
      </g>

      {/* Weide: boom op de heuvel */}
      <g data-tap="object" data-object="boom">
        <rect x={3520} y={500} width={170} height={210} fill="transparent" />
        <g key={active.boom} className={active.boom ? 'fv-tree--rustle' : undefined}>
          <rect x={3594} y={600} width={22} height={100} rx={8} fill="#a98a6a" />
          <circle cx={3605} cy={570} r={64} fill="#a9cc8f" />
          <circle cx={3560} cy={600} r={42} fill="#9fc585" />
          <circle cx={3652} cy={598} r={44} fill="#9fc585" />
          <circle cx={3586} cy={548} r={10} fill="#e88a8a" />
          <circle cx={3636} cy={580} r={9} fill="#e88a8a" />
        </g>
      </g>
      <g className="fv-detail">
        {[3420, 3900, 4060].map((x) => (
          <Daisy key={x} x={x} y={930} h={26} />
        ))}
      </g>
    </svg>
  );
});
