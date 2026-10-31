interface DropsProps {
  filled: number;
  total: number;
  size?: number;
}

/** Waterdruppels als tussenstap (§4.4.3). Ook zonder kleur te lezen: gevuld vs. omlijnd. */
export function Drops({ filled, total, size = 18 }: DropsProps) {
  if (total <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20">
          <path
            d="M10 2 C 10 2, 4 9, 4 12.5 A 6 6 0 0 0 16 12.5 C 16 9, 10 2, 10 2 Z"
            fill={i < filled ? 'var(--color-water)' : 'none'}
            stroke="var(--color-water)"
            strokeWidth="1.6"
          />
        </svg>
      ))}
    </span>
  );
}
