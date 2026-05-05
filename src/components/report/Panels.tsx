import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function InsightPanel({
  title,
  eyebrow,
  children,
  action,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section className={cn('rounded-lg border border-border bg-surface p-5 shadow-report-soft', className)}>
      {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p> : null}
      <h2 className="font-display text-2xl leading-tight text-foreground">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-muted-foreground">{children}</div>
      {action ? <div className="mt-5 border-t border-border pt-4 text-sm font-semibold text-accent">{action}</div> : null}
    </section>
  );
}

export function ChapterCard({
  icon,
  title,
  description,
  meta,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <article className={cn('rounded-lg border border-border bg-surface p-4 shadow-report-soft transition hover:border-accent/40', className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">{icon}</div> : null}
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-foreground">{title}</h3>
          {description ? <div className="mt-1 text-sm leading-6 text-muted-foreground">{description}</div> : null}
          {meta ? <div className="mt-3 text-xs text-muted-foreground">{meta}</div> : null}
        </div>
      </div>
      {action ? <div className="mt-4 text-sm font-semibold text-accent">{action}</div> : null}
    </article>
  );
}

export function DossierSection({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section className={cn('rounded-lg border border-border bg-surface p-5 shadow-report-soft', className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon ? <span className="text-accent">{icon}</span> : null}
        {title}
      </div>
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}
