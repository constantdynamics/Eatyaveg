import { Check } from 'lucide-react';
import type { Veggie, VeggieId } from '../domain/types';
import { VeggieIcon } from './VeggieIcon';

interface VeggieGridProps {
  veggies: Veggie[];
  selected: ReadonlySet<VeggieId>;
  onToggle: (id: VeggieId) => void;
  label: string;
}

/** Raster met grote groente-tegels (tikvlak minstens 72 px), meerdere tegelijk te kiezen. */
export function VeggieGrid({ veggies, selected, onToggle, label }: VeggieGridProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {veggies.map((v) => {
        const isOn = selected.has(v.id);
        return (
          <li key={v.id}>
            <button
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(v.id)}
              className={`relative flex min-h-28 w-full flex-col items-center justify-center gap-1 rounded-card border-2 px-1 py-3 transition-colors duration-200 ease-out ${
                isOn
                  ? 'border-accent bg-accent-soft'
                  : 'border-transparent bg-paper shadow-card hover:bg-sand'
              }`}
            >
              <VeggieIcon id={v.id} size={52} />
              <span className="text-center font-heading text-base font-bold leading-tight">
                {v.name}
              </span>
              {isOn && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"
                >
                  <Check size={16} strokeWidth={3} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
