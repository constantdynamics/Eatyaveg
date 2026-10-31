import type { ReactNode } from 'react';

interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  /** Extra uitleg voor schermlezers. */
  label?: string;
}

export function Chip({ selected, onClick, children, icon, label }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex min-h-12 items-center gap-2 rounded-card border px-4 text-base font-bold transition-colors duration-200 ease-out ${
        selected
          ? 'border-accent bg-accent-soft text-accent-strong'
          : 'border-line bg-paper text-ink hover:bg-sand'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
