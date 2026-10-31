import type { VeggieId } from '../domain/types';

interface VeggieIconProps {
  id: VeggieId;
  size?: number;
}

/** Tijdelijk icoon; wordt in mijlpaal 5 vervangen door het vriendje zelf. */
export function VeggieIcon({ id, size = 40 }: VeggieIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="22" r="14" fill={`var(--veg-${id}-body)`} />
      <path d="M20 9c-2-4 1-7 4-7-0.5 3-2 5-4 7z" fill={`var(--veg-${id}-leaf)`} />
    </svg>
  );
}
