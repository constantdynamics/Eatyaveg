import type { Child } from '../domain/types';
import { COLOR_CLASS } from './child-colors';

interface ChildAvatarProps {
  child: Pick<Child, 'name' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
}

export function ChildAvatar({ child, size = 'md' }: ChildAvatarProps) {
  const dim =
    size === 'lg' ? 'h-14 w-14 text-2xl' : size === 'sm' ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-lg';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-heading font-extrabold text-ink ${dim} ${COLOR_CLASS[child.color]}`}
    >
      {child.name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
