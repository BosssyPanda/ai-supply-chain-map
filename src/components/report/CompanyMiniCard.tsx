import { Building2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SupplyChainNode } from '../../data/schema';
import { cn } from '../../lib/cn';
import { RiskBadge, StatusBadge } from './Badges';

function initials(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export function CompanyLogo({
  company,
  className,
}: {
  company: Pick<SupplyChainNode, 'label' | 'ticker'>;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface-muted text-sm font-bold text-foreground', className)}>
      {company.ticker || initials(company.label) || <Building2 className="h-4 w-4" />}
    </div>
  );
}

export function CompanyMiniCard({
  company,
  to,
  action,
  className,
}: {
  company: SupplyChainNode;
  to?: string;
  action?: ReactNode;
  className?: string;
}): JSX.Element {
  const content = (
    <article className={cn('rounded-lg border border-border bg-surface p-4 shadow-report-soft transition', to && 'hover:border-accent/45', className)}>
      <div className="flex items-start gap-3">
        <CompanyLogo company={company} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">{company.label}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {company.ticker ? `${company.ticker} · ` : ''}
            {company.exchange ?? company.country ?? company.layer}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{company.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={company.status} />
            {company.bottleneckLevel ? <RiskBadge level={company.bottleneckLevel} /> : null}
          </div>
        </div>
      </div>
      {action ? <div className="mt-4 text-sm font-semibold text-accent">{action}</div> : null}
    </article>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
