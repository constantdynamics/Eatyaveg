import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  text?: string;
  illustration?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, text, illustration, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {illustration && <div className="mb-4">{illustration}</div>}
      <h2 className="text-lg">{title}</h2>
      {text && <p className="mt-1 max-w-sm text-ink-soft">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
