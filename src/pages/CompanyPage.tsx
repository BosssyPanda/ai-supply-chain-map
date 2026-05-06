import { ArrowLeft, ArrowRight, Boxes, Building2, CalendarClock, Database, Network, Sparkles, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  CompanyLogo,
  ConfidenceIndicator,
  DataPendingState,
  DossierSection,
  MetricItem,
  MetricStrip,
  RiskBadge,
  SectionHeader,
  SourceLink,
  SourceStatusBadge,
  StatusBadge,
} from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { Source, SupplyChainNode } from '../data/schema';
import { dataPending, getSourceRowsForNode, pendingCopy } from '../lib/reportSelectors';

const data = loadExplorerData();

export function CompanyPage(): JSX.Element {
  const { id } = useParams();
  const node = data.nodes.find((item) => item.id === id && (item.type === 'company' || item.type === 'watchlist'));
  const nodesById = new Map(data.nodes.map((item) => [item.id, item]));

  if (!node) {
    return (
      <PageShell>
        <div className="grid min-h-[60vh] place-items-center">
          <div className="rounded-lg border border-border bg-surface p-8 text-center shadow-report-soft">
            <h1 className="font-display text-3xl text-foreground">Company not found</h1>
            <Link to="/companies" className="mt-4 inline-flex text-accent">
              Back to companies
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const upstream = data.edges.filter((edge) => edge.target === node.id).map((edge) => nodesById.get(edge.source)).filter(Boolean) as SupplyChainNode[];
  const downstream = data.edges.filter((edge) => edge.source === node.id).map((edge) => nodesById.get(edge.target)).filter(Boolean) as SupplyChainNode[];
  const sources = getSourceRowsForNode(data, node);
  const peers = data.nodes.filter((item) => item.id !== node.id && item.type === 'company' && item.layer === node.layer).slice(0, 5);
  const products = [node.marketSegment, node.role, ...node.tags.slice(0, 3)].filter(Boolean);
  const lastUpdated = getLastUpdated(sources);

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>
        <Link
          to={`/supply-chain?focus=${node.id}`}
          className="inline-flex items-center gap-2 rounded-md border border-accent/35 bg-accent-soft px-4 py-2 text-sm font-semibold text-accent"
        >
          <Network className="h-4 w-4" />
          View in supply-chain map
        </Link>
      </div>

      <MainContentGrid className="xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-surface p-6 shadow-report-soft">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <CompanyLogo company={node} className="h-20 w-20 rounded-lg text-lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-5xl leading-none text-foreground">{node.label}</h1>
                  {node.ticker ? <span className="rounded-md border border-border bg-surface-muted px-3 py-1 text-sm font-semibold text-foreground">{node.ticker}</span> : null}
                  <StatusBadge status={node.status} />
                </div>
                <p className="mt-3 max-w-4xl text-base leading-7 text-muted-foreground">{node.description || pendingCopy}</p>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">{node.whyItMatters || pendingCopy}</p>
              </div>
            </div>
          </section>

          <MetricStrip className="xl:grid-cols-4">
            <MetricItem icon={<Building2 className="h-4 w-4" />} label="Ticker / Exchange" value={node.ticker ? `${node.ticker}${node.exchange ? ` / ${node.exchange}` : ''}` : pendingCopy} context={dataPending(node.country)} />
            <MetricItem icon={<Boxes className="h-4 w-4" />} label="Supply-chain role" value={node.marketSegment || node.layer || pendingCopy} context={node.role || pendingCopy} />
            <MetricItem icon={<TriangleAlert className="h-4 w-4" />} label="Bottleneck risk" value={node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : pendingCopy} context={`Substitutability: ${dataPending(node.substitutability)}`} />
            <MetricItem icon={<Sparkles className="h-4 w-4" />} label="Confidence" value={node.confidence ? <ConfidenceIndicator confidence={node.confidence} /> : pendingCopy} context={`${sources.length} attached source rows`} />
          </MetricStrip>

          <div className="grid gap-5 lg:grid-cols-2">
            <DossierSection title="What the company does" icon={<Database className="h-4 w-4" />}>
              <p>{node.description || pendingCopy}</p>
            </DossierSection>
            <DossierSection title="Why it matters" icon={<Sparkles className="h-4 w-4" />}>
              <p>{node.whyItMatters || pendingCopy}</p>
            </DossierSection>
          </div>

          <ContentSection>
            <SectionHeader title="Key AI products / platforms" description="Rendered from current role, segment, and tag fields only." />
            <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
              {products.length > 0 ? products.map((product) => (
                <div key={product} className="rounded-md border border-border bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground">
                  {product}
                </div>
              )) : <DataPendingState className="p-4" />}
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Financial data status" description="Financial metrics are intentionally withheld unless sourced through the project research data." />
            <div className="p-5">
              <div className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3">
                <DataPendingState>
                  Data pending — source needed. This dossier does not display fallback or illustrative financial values.
                </DataPendingState>
              </div>
            </div>
          </ContentSection>

          <ContentSection>
            <SectionHeader title="Supply-chain position" description="Immediate upstream and downstream relationships from the graph data." />
            <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)]">
              <DependencyList title="Upstream dependencies" items={upstream} fallback={node.suppliers} />
              <div className="grid place-items-center rounded-lg border border-accent/35 bg-accent-soft p-5 text-center text-accent">
                <CompanyLogo company={node} />
                <p className="mt-3 font-semibold text-foreground">{node.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{dataPending(node.marketSegment || node.layer)}</p>
              </div>
              <DependencyList title="Downstream customers" items={downstream} fallback={node.customers} />
            </div>
          </ContentSection>
        </div>

        <RightRail>
          <RailCard title="At a glance">
            <MetaLine label="Geography" value={node.country} />
            <MetaLine label="Exchange / Ticker" value={node.ticker && node.exchange ? `${node.exchange} / ${node.ticker}` : node.ticker} />
            <MetaLine label="Status" value={node.status?.replaceAll('_', ' ')} />
            <MetaLine label="Stage" value={node.layer} />
            <MetaLine label="Pure-play exposure" value={node.purePlayScore} />
            <MetaLine label="Last updated" value={lastUpdated} />
          </RailCard>

          <RailCard title="Key risks">
            {node.risks && node.risks.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {node.risks.map((risk) => <li key={risk}>• {risk}</li>)}
              </ul>
            ) : <DataPendingState />}
          </RailCard>

          <RailCard title="Peers / comparables">
            <div className="space-y-2">
              {peers.length > 0 ? peers.map((peer) => (
                <Link key={peer.id} to={`/companies/${peer.id}`} className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm hover:border-accent/45">
                  <span className="font-semibold text-foreground">{peer.label}</span>
                  <span className="text-muted-foreground">{peer.ticker ?? 'Private'}</span>
                </Link>
              )) : <DataPendingState />}
            </div>
          </RailCard>

          <RailCard title="Exposure summary">
            <MetaLine label="Supply-chain role" value={node.marketSegment || node.role || node.layer} />
            <MetaLine label="Bottleneck level" value={node.bottleneckLevel} />
            <MetaLine label="Substitutability" value={node.substitutability} />
            <MetaLine label="Source status" value={sources.length > 0 ? 'Sources attached' : undefined} />
          </RailCard>

          <RailCard title="Confidence & sources">
            <div className="mb-3 flex flex-wrap gap-2">
              <SourceStatusBadge sourceCount={sources.length} confidence={node.confidence} />
              <ConfidenceIndicator confidence={node.confidence} />
            </div>
            <div className="space-y-2">
              {sources.length > 0 ? sources.slice(0, 3).map((source) => <SourceLink key={source.id} source={source} />) : <DataPendingState />}
            </div>
            <Link to="/sources" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              View sources
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </RailCard>

          <RailCard title="Last updated">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <CalendarClock className="mt-0.5 h-4 w-4 text-accent" />
              <span>{lastUpdated ?? pendingCopy}</span>
            </div>
          </RailCard>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function DependencyList({ title, items, fallback }: { title: string; items: SupplyChainNode[]; fallback?: string[] }): JSX.Element {
  const labels = items.length > 0 ? items.map((item) => item.label) : fallback ?? [];
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.length > 0 ? labels.map((label) => (
          <span key={label} className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground">
            {label}
          </span>
        )) : <DataPendingState />}
      </div>
    </div>
  );
}

function RailCard({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-report-soft">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MetaLine({ label, value }: { label: string; value?: string }): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-border py-2 text-sm first:border-t-0 first:pt-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold capitalize text-foreground">{dataPending(value)}</span>
    </div>
  );
}

function getLastUpdated(sources: Source[]): string | undefined {
  const dates = sources
    .map((source) => source.dateAccessed)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1];
}
