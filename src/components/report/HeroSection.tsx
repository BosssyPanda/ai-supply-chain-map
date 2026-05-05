import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  action,
  stats,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  stats?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section className={cn('grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)] lg:items-start', className)}>
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p> : null}
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] text-foreground md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{subtitle}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
      {stats ? <div className="grid gap-4 sm:grid-cols-2">{stats}</div> : null}
    </section>
  );
}

export function SectionHeader({
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
    <div className={cn('flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl leading-tight text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
