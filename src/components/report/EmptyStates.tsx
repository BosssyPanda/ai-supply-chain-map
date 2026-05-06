import { AlertCircle, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function EmptyState({
  title = 'No results',
  message,
  className,
}: {
  title?: string;
  message: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('rounded-lg border border-dashed border-border bg-surface-muted px-5 py-8 text-center', className)}>
      <AlertCircle className="mx-auto h-5 w-5 text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function DataPendingState({
  children = 'Data pending — source needed',
  className,
}: {
  children?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-muted-foreground', className)}>
      <Clock className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}
