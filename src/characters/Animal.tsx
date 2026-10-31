import { ANIMALS, ANIMAL_ORDER } from './animals';

interface AnimalProps {
  phase: number;
  size?: number;
  title?: string;
}

/** Het dier dat bij een fase hoort, als maatvergelijking naast het vriendje. */
export function Animal({ phase, size = 100, title }: AnimalProps) {
  const key = ANIMAL_ORDER[Math.min(9, Math.max(1, phase)) - 1]!;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      overflow="visible"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {ANIMALS[key]!()}
    </svg>
  );
}
