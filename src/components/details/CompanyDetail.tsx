import { ExternalLink, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Source, SupplyChainNode } from '../../data/schema';
import { cn } from '../../lib/cn';

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
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-blue-400/50 bg-blue-500/20 text-lg font-black text-white shadow-glowBlue">
          {node.ticker ?? node.label.slice(0, 3).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-2xl font-bold text-white">{node.label}</h2>
            <Star className="h-5 w-5 text-amber-300" />
          </div>
          <p className="text-sm text-slate-400">
            {node.ticker ? `${node.ticker} · ${node.exchange} · ` : ''}
            {node.status?.replaceAll('_', ' ')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone={node.confidence === 'high' ? 'green' : node.confidence === 'medium' ? 'amber' : 'red'}>
              {node.confidence ?? 'low'} confidence
            </Badge>
            <Badge tone="blue">{lastUpdated ? `Updated ${lastUpdated}` : 'Last updated pending'}</Badge>
          </div>
          {!compact && node.type === 'company' ? (
            <Link
              to={`/companies/${node.id}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200 hover:bg-blue-500/20"
            >
              Open Company Page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <Panel title="Company Overview">
        <p>{node.description}</p>
        <p className="mt-3 text-slate-300">{node.whyItMatters}</p>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        <ResearchStatusCard label={status.label} detail={status.detail} tone={status.tone} />
        <Panel title="Supply-chain Role">
          <div className="space-y-2 text-sm text-slate-300">
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
          <span className="text-xs text-slate-500">Data pending. Financial fields stay blank until a source is attached and verified.</span>
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
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{title}</h3>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value?: string }): JSX.Element {
  const hasValue = Boolean(value);
  return (
    <div className={cn('rounded-xl border p-4', hasValue ? 'border-slate-800 bg-slate-900/70' : 'border-dashed border-slate-700 bg-slate-950/60')}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn('mt-1 text-lg font-bold', hasValue ? 'text-white' : 'text-slate-500')}>{value ?? 'Data pending'}</p>
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
            <span key={item} className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500">{emptyLabel}</span>
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
          sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className={cn('block rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-blue-200 hover:border-blue-400/50')}
            >
              {source.title}
              <span className="block text-slate-500">
                {source.publisher}
                {source.dateAccessed ? ` · ${source.dateAccessed}` : ''}
                {source.reliabilityScore ? ` · ${source.reliabilityScore} reliability` : ''}
              </span>
            </a>
          ))
        ) : (
          <span className="text-xs text-slate-500">No source attached yet. Treat confidence as low until this row is verified.</span>
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
          <p className="text-lg font-bold text-white">{label}</p>
          <p className="mt-1 text-sm text-slate-400">{detail}</p>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>
    </Panel>
  );
}

function MetaLine({ label, value }: { label: string; value?: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-2 first:border-t-0 first:pt-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold capitalize text-slate-200">{value?.replaceAll('_', ' ') ?? 'Data pending'}</span>
    </div>
  );
}

type BadgeTone = 'blue' | 'green' | 'amber' | 'red';

function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }): JSX.Element {
  const styles = {
    blue: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
    green: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    red: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  };
  return <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize', styles[tone])}>{children}</span>;
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
  if (!hasSources && node.confidence === 'low') return { label: 'Not researched yet', detail: 'No source row is attached and confidence is low.', tone: 'red' };
  if (node.confidence === 'low' || !hasSources) return { label: 'Needs verification', detail: 'The mapping is useful but still needs source confirmation.', tone: 'amber' };
  if (missingFinancials > 1) return { label: 'Partial', detail: 'Supply-chain mapping exists; financial fields can be filled later.', tone: 'blue' };
  return { label: 'Complete', detail: 'Core source and company fields are populated.', tone: 'green' };
}
