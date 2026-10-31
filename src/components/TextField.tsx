import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, className = '', ...rest }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block font-bold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-describedby={hint ? hintId : undefined}
        className="min-h-12 w-full rounded-card border border-line bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:border-accent"
        {...rest}
      />
    </div>
  );
}
