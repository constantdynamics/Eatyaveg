import { Minus, Plus } from 'lucide-react';
import { IconButton } from './IconButton';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function Stepper({ label, value, min = 1, max = 12, onChange, format }: StepperProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-card bg-sand p-1"
      role="group"
      aria-label={label}
    >
      <IconButton
        label={`${label}: minder`}
        icon={<Minus size={20} aria-hidden="true" />}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      />
      <span className="min-w-20 text-center font-heading text-lg font-bold" aria-live="polite">
        {format ? format(value) : value}
      </span>
      <IconButton
        label={`${label}: meer`}
        icon={<Plus size={20} aria-hidden="true" />}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      />
    </div>
  );
}
