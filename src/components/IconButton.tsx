import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Toegankelijke naam; verplicht voor icoonknoppen (§15.15). */
  label: string;
  icon: ReactNode;
  tone?: 'plain' | 'accent' | 'soft';
  size?: 'md' | 'lg';
}

const tones = {
  plain: 'text-ink hover:bg-sand active:bg-sand',
  accent: 'bg-accent text-white hover:bg-accent-strong active:bg-accent-strong',
  soft: 'bg-accent-soft text-accent-strong hover:bg-accent-soft-strong active:bg-accent-soft-strong',
};

export function IconButton({
  label,
  icon,
  tone = 'plain',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: IconButtonProps) {
  const dim = size === 'lg' ? 'h-14 w-14' : 'h-12 w-12';
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-out disabled:opacity-40 ${dim} ${tones[tone]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
