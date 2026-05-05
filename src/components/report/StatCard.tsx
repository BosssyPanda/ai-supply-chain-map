import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export function StatCard({
  icon,
  label,
  value,
  context,
  to,
  className,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  context?: ReactNode;
  to?: string;
  className?: string;
}): JSX.Element {
  const content = (
    <article className={cn('h-full rounded-lg border border-border bg-surface p-5 shadow-report-soft transition', to && 'hover:border-accent/45', className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">{icon}</div> : null}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-4xl leading-none text-foreground">{value}</p>
          {context ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{context}</p> : null}
        </div>
      </div>
      {to ? (
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </article>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export function MetricStrip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('grid overflow-hidden rounded-lg border border-border bg-surface shadow-report-soft md:grid-cols-2 xl:grid-cols-4', className)}>
      {children}
    </div>
  );
}

export function MetricItem({
  label,
  value,
  context,
  icon,
}: {
  label: string;
  value: ReactNode;
  context?: ReactNode;
  icon?: ReactNode;
}): JSX.Element {
  return (
    <div className="border-border p-5 md:border-l md:first:border-l-0">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 font-display text-3xl leading-none text-foreground">{value}</p>
      {context ? <p className="mt-2 text-xs text-muted-foreground">{context}</p> : null}
    </div>
  );
}
