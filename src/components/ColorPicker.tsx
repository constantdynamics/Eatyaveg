import { CHILD_COLORS, type ChildColor } from '../domain/types';
import { CHILD_COLOR_LABEL, COLOR_CLASS } from './child-colors';

interface ColorPickerProps {
  value: ChildColor;
  onChange: (color: ChildColor) => void;
  name: string;
}

export function ColorPicker({ value, onChange, name }: ColorPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 font-bold">Kleur</legend>
      <div className="flex flex-wrap gap-2">
        {CHILD_COLORS.map((c) => (
          <label
            key={c}
            className={`relative inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full ${COLOR_CLASS[c]} ${
              value === c ? 'ring-4 ring-accent ring-offset-2 ring-offset-paper' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={c}
              checked={value === c}
              onChange={() => onChange(c)}
              className="peer absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="sr-only">{CHILD_COLOR_LABEL[c]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
