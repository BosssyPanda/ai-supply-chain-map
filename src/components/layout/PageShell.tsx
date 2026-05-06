import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function PageShell({
  children,
  className,
  fullWidth = false,
}: {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}): JSX.Element {
  return (
    <div className={cn('mx-auto w-full px-4 py-6 sm:px-5 sm:py-8 lg:px-8 lg:py-10', fullWidth ? 'max-w-[1780px]' : 'max-w-[1640px]', className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <header className={cn('mb-7 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p> : null}
        <h1 className="font-display text-4xl leading-[1.04] text-foreground sm:text-5xl md:text-6xl">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function MainContentGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <div className={cn('grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]', className)}>{children}</div>;
}

export function RightRail({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return <aside className={cn('space-y-4 lg:space-y-5', className)}>{children}</aside>;
}

export function ContentSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <section className={cn('rounded-lg border border-border bg-surface shadow-report-soft', className)}>{children}</section>;
}
