import type { BottleneckLevel, CompanyStatus, Confidence } from '../../data/schema';

export type ReportBadgeTone =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'verified'
  | 'partial'
  | 'pending';

export interface ReportBadgeRule {
  label: string;
  tone: ReportBadgeTone;
}

const riskRules = {
  critical: { label: 'Critical', tone: 'critical' },
  high: { label: 'High', tone: 'high' },
  medium: { label: 'Medium', tone: 'medium' },
  low: { label: 'Low', tone: 'low' },
} satisfies Record<BottleneckLevel, ReportBadgeRule>;

const confidenceRules = {
  high: { label: 'High', tone: 'verified' },
  medium: { label: 'Medium', tone: 'partial' },
  low: { label: 'Low', tone: 'pending' },
} satisfies Record<Confidence, ReportBadgeRule>;

const statusRules = {
  us_listed_public: { label: 'U.S.-listed', tone: 'verified' },
  us_listed_adr: { label: 'ADR', tone: 'partial' },
  private: { label: 'Private', tone: 'pending' },
  state_owned: { label: 'State-owned', tone: 'pending' },
  non_us_listed: { label: 'Non-U.S.-listed', tone: 'pending' },
  watchlist_private_ipo_spac: { label: 'Watchlist', tone: 'pending' },
  etf_optional: undefined,
} satisfies Record<CompanyStatus, ReportBadgeRule | undefined>;

export function getRiskBadge(level?: BottleneckLevel): ReportBadgeRule | undefined {
  return level ? riskRules[level] : undefined;
}

export function getConfidenceBadge(confidence?: Confidence): ReportBadgeRule | undefined {
  return confidence ? confidenceRules[confidence] : undefined;
}

export function getStatusBadge(status?: CompanyStatus): ReportBadgeRule | undefined {
  return status ? statusRules[status] : undefined;
}

export function getSourceStatusBadge({
  sourceCount,
  confidence,
}: {
  sourceCount: number;
  confidence?: Confidence;
}): ReportBadgeRule {
  if (sourceCount === 0) return { label: 'Pending', tone: 'pending' };
  if (confidence === 'high') return { label: 'Verified', tone: 'verified' };
  return { label: 'Partial', tone: 'partial' };
}
