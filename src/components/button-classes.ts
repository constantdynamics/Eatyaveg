/** Gedeelde knopstijlen: één afrondingsmaat, rustige kleuren (§14.1). */
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-card font-heading font-bold transition-colors duration-200 ease-out disabled:opacity-50 select-none';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong active:bg-accent-strong',
  secondary: 'bg-paper text-ink border border-line hover:bg-sand active:bg-sand',
  ghost: 'bg-transparent text-accent hover:bg-accent-soft active:bg-accent-soft',
  danger: 'bg-paper text-danger border border-line hover:bg-sand active:bg-sand',
};

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-4 text-base',
  lg: 'min-h-14 px-5 text-lg',
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}

export function buttonClasses({
  variant = 'secondary',
  size = 'md',
  block = false,
  className = '',
}: ButtonStyleProps): string {
  return [base, variants[variant], sizes[size], block ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ');
}
