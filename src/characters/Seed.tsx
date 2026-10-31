import type { VeggieId } from '../domain/types';

interface SeedProps {
  veggie: VeggieId;
  size?: number;
  className?: string;
}

/** Fase 0: een zaadje in de moestuin, met een bordje in de kleur van de groente. */
export function Seed({ veggie, size = 60, className }: SeedProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x={52} y={22} width={5} height={50} rx={2} fill="#b08a5f" />
      <rect x={42} y={14} width={26} height={18} rx={4} fill="#e9dcc3" />
      <circle cx={55} cy={23} r={6} fill={`var(--veg-${veggie}-body)`} />
      <ellipse cx={34} cy={72} rx={30} ry={9} fill="#8a6a4a" />
      <ellipse cx={34} cy={68} rx={10} ry={7} fill="#a57b52" />
      <path
        d="M30 66 q4 -3 8 0"
        fill="none"
        stroke="#c9a37a"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M34 62 C 34 54 34 48 34 44" stroke="#6fa85a" strokeWidth={3} strokeLinecap="round" />
      <path d="M34 48 C 26 40 18 42 16 46 C 22 50 30 50 34 48 Z" fill="#7ab865" />
      <path d="M34 46 C 40 36 50 36 52 40 C 46 46 40 46 34 46 Z" fill="#7ab865" />
    </svg>
  );
}
