import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { buttonClasses, type ButtonStyleProps } from './button-classes';

interface CommonProps extends ButtonStyleProps {
  icon?: ReactNode;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function Button({
  variant,
  size,
  block,
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, block, className })} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

type LinkButtonProps = CommonProps & {
  to: string;
  onClick?: () => void;
  'aria-label'?: string;
};

export function LinkButton({
  variant,
  size,
  block,
  icon,
  children,
  className,
  to,
  onClick,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={buttonClasses({ variant, size, block, className })}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
