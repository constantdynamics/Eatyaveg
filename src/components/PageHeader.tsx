import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { IconButton } from './IconButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean | string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="flex items-start gap-2 pb-4 pt-2">
      {back && (
        <IconButton
          label="Terug"
          className="-ml-3"
          icon={<ChevronLeft size={26} aria-hidden="true" />}
          onClick={() => {
            if (typeof back === 'string') void navigate(back);
            else void navigate(-1);
          }}
        />
      )}
      <div className="min-w-0 flex-1 pt-1">
        <h1 className="text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </header>
  );
}
