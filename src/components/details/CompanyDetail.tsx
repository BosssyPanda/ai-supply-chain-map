import { ExternalLink, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Source, SupplyChainNode } from '../../data/schema';
import { cn } from '../../lib/cn';
import { ConfidenceIndicator, SourceLink, SourceStatusBadge } from '../report';

interface CompanyDetailProps {
  node: SupplyChainNode;
  upstream: SupplyChainNode[];
  downstream: SupplyChainNode[];
  sources: Source[];
  compact?: boolean;
}

export function CompanyDetail({ node, upstream, downstream, sources, compact = false }: CompanyDetailProps): JSX.Element {
  const status = getResearchStatus(node, sources);
  const lastUpdated = getLastUpdated(sources);
  const financialEntries = [
    { label: 'Revenue', value: node.financials?.revenue },
    { label: 'Market Cap', value: node.financials?.marketCap },
    { label: 'Gross Margin', value: node.financials?.grossMargin },
    { label: 'Free Cash Flow', value: node.financials?.freeCashFlow },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value));

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-border bg-accent-soft text-lg font-black text-accent">
          {node.ticker ?? node.label.slice(0, 3).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-display text-3xl text-foreground">{node.label}</h2>
            <Star className="h-5 w-5 text-high" />
          </div>
          <p className="text-sm text-muted-foreground">
            {node.ticker ? `${node.ticker} · ${node.exchange} · ` : ''}
            {node.status?.replaceAll('_', ' ')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SourceStatusBadge sourceCount={sources.length} confidence={node.confidence} />
            <ConfidenceIndicator confidence={node.confidence} />
            <Badge tone="partial">{lastUpdated ? `Updated ${lastUpdated}` : 'Last updated pending'}</Badge>
          </div>
          {!compact && node.type === 'company' ? (
            <Link
              to={`/companies/${node.id}`}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-accent/35 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent hover:border-accent/60"
            >
              Open Company Page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <Panel title="Company Overview">
        <p>{node.description}</p>
        <p className="mt-3 text-foreground">{node.whyItMatters}</p>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        <ResearchStatusCard label={status.label} detail={status.detail} tone={status.tone} />
        <Panel title="Supply-chain Role">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{node.role || node.marketSegment || node.layer}</p>
            <MetaLine label="Ticker / exchange" value={node.ticker && node.exchange ? `${node.ticker} / ${node.exchange}` : node.ticker} />
            <MetaLine label="Status" value={node.status?.replaceAll('_', ' ')} />
            <MetaLine label="AI supply-chain role" value={node.marketSegment || node.role || node.layer} />
            <MetaLine label="Bottleneck" value={node.bottleneckLevel} />
            <MetaLine label="Substitutability" value={node.substitutability} />
            <MetaLine label="Pure-play score" value={node.purePlayScore} />
            <MetaLine label="Confidence score" value={node.confidence} />
            <MetaLine label="Last updated" value={lastUpdated} />
          </div>
        </Panel>
      </div>

      {financialEntries.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {financialEntries.map((entry) => (
            <Metric key={entry.label} label={entry.label} value={entry.value} />
          ))}
        </div>
      ) : (
        <Panel title="Financial Data">
          <span className="text-xs text-muted-foreground">Data pending. Financial fields stay blank until a source is attached and verified.</span>
        </Panel>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <TagPanel title="Upstream Dependencies" items={upstream.map((item) => item.label)} />
        <TagPanel title="Downstream Customers" items={downstream.map((item) => item.label)} fallback={node.customers} />
      </div>

      <TagPanel title="Key Suppliers" items={node.suppliers ?? []} />
      <TagPanel title="Key Risks" items={node.risks ?? []} emptyLabel="No mapped risks yet." />
      <SourceLinks sources={sources} />

      {node.notes ? (
        <Panel title="Notes">
          <p>{node.notes}</p>
        </Panel>
      ) : null}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value?: string }): JSX.Element {
  const hasValue = Boolean(value);
  return (
    <div className={cn('rounded-lg border p-4', hasValue ? 'border-border bg-surface' : 'border-dashed border-border bg-surface-muted')}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-lg font-bold', hasValue ? 'text-foreground' : 'text-muted-foreground')}>{value ?? 'Data pending'}</p>
    </div>
  );
}

function TagPanel({
  title,
  items,
  fallback,
  emptyLabel = 'Data pending. No mapped items yet.',
}: {
  title: string;
  items: string[];
  fallback?: string[];
  emptyLabel?: string;
}): JSX.Element {
  const values = items.length > 0 ? items : fallback ?? [];
  return (
    <Panel title={title}>
      <div className="flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((item) => (
            <span key={item} className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs text-foreground">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">{emptyLabel}</span>
        )}
      </div>
    </Panel>
  );
}

export function SourceLinks({ sources }: { sources: Source[] }): JSX.Element {
  return (
    <Panel title="Source Links">
      <div className="space-y-2">
        {sources.length > 0 ? (
          sources.map((source) => <SourceLink key={source.id} source={source} />)
        ) : (
          <span className="text-xs text-muted-foreground">No source attached yet. Treat confidence as low until this row is verified.</span>
        )}
      </div>
    </Panel>
  );
}

function ResearchStatusCard({ label, detail, tone }: { label: string; detail: string; tone: BadgeTone }): JSX.Element {
  return (
    <Panel title="Research Status">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-foreground">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>
    </Panel>
  );
}

function MetaLine({ label, value }: { label: string; value?: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-2 first:border-t-0 first:pt-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold capitalize text-foreground">{value?.replaceAll('_', ' ') ?? 'Data pending'}</span>
    </div>
  );
}

type BadgeTone = 'partial' | 'verified' | 'high' | 'critical';

function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }): JSX.Element {
  const styles = {
    partial: 'border-partial/30 bg-partial/10 text-partial',
    verified: 'border-verified/30 bg-verified/10 text-verified',
    high: 'border-high/30 bg-high/10 text-high',
    critical: 'border-critical/30 bg-critical/10 text-critical',
  };
  return <span className={cn('rounded-md border px-2.5 py-1 text-[11px] font-bold capitalize', styles[tone])}>{children}</span>;
}

function getLastUpdated(sources: Source[]): string | undefined {
  const dates = sources
    .map((source) => source.dateAccessed)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1];
}

function getResearchStatus(node: SupplyChainNode, sources: Source[]): { label: string; detail: string; tone: BadgeTone } {
  const hasSources = sources.length > 0;
  const missingFinancials = ['revenue', 'marketCap', 'grossMargin', 'freeCashFlow'].filter((key) => !node.financials?.[key as keyof typeof node.financials]).length;
  if (!hasSources && node.confidence === 'low') return { label: 'Not researched yet', detail: 'No source row is attached and confidence is low.', tone: 'critical' };
  if (node.confidence === 'low' || !hasSources) return { label: 'Needs verification', detail: 'The mapping is useful but still needs source confirmation.', tone: 'high' };
  if (missingFinancials > 1) return { label: 'Partial', detail: 'Supply-chain mapping exists; financial fields can be filled later.', tone: 'partial' };
  return { label: 'Complete', detail: 'Core source and company fields are populated.', tone: 'verified' };
}
