interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  /** Tekstuele waarde voor schermlezers, bijvoorbeeld "stap 2 van 3". */
  valueText?: string;
}

export function ProgressBar({ value, max, label, valueText }: ProgressBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      className="h-1.5 w-full overflow-hidden rounded-full bg-sand"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
