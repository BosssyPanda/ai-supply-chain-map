import type { BottleneckLevel, CompanyStatus, Confidence } from '../../data/schema';
import { cn } from '../../lib/cn';
import {
  getConfidenceBadge,
  getRiskBadge,
  getSourceStatusBadge,
  getStatusBadge,
  type ReportBadgeRule,
  type ReportBadgeTone,
} from './badgeRules';

const toneClasses = {
  critical: 'border-critical/30 bg-critical/10 text-critical',
  high: 'border-high/35 bg-high/10 text-high',
  medium: 'border-medium/30 bg-medium/10 text-medium',
  low: 'border-low/25 bg-low/10 text-low',
  verified: 'border-verified/30 bg-verified/10 text-verified',
  partial: 'border-partial/30 bg-partial/10 text-partial',
  pending: 'border-pending/25 bg-pending/10 text-pending',
} satisfies Record<ReportBadgeTone, string>;

interface BaseBadgeProps {
  rule?: ReportBadgeRule;
  className?: string;
}

function BaseBadge({ rule, className }: BaseBadgeProps): JSX.Element | null {
  if (!rule) return null;

  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-semibold leading-none',
        toneClasses[rule.tone],
        className,
      )}
    >
      {rule.label}
    </span>
  );
}

export function RiskBadge({ level, className }: { level?: BottleneckLevel; className?: string }): JSX.Element | null {
  return <BaseBadge rule={getRiskBadge(level)} className={className} />;
}

export function StatusBadge({ status, className }: { status?: CompanyStatus; className?: string }): JSX.Element | null {
  return <BaseBadge rule={getStatusBadge(status)} className={className} />;
}

export function ConfidenceIndicator({
  confidence,
  className,
}: {
  confidence?: Confidence;
  className?: string;
}): JSX.Element | null {
  return <BaseBadge rule={getConfidenceBadge(confidence)} className={className} />;
}

export function SourceStatusBadge({
  sourceCount,
  confidence,
  className,
}: {
  sourceCount: number;
  confidence?: Confidence;
  className?: string;
}): JSX.Element | null {
  return <BaseBadge rule={getSourceStatusBadge({ sourceCount, confidence })} className={className} />;
}
