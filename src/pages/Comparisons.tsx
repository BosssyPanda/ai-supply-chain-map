import { ArrowDownUp, Building2, Database, Search, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  ConfidenceIndicator,
  DataPendingState,
  DossierSection,
  EmptyState,
  HeroSection,
  InsightPanel,
  MetricItem,
  MetricStrip,
  RiskBadge,
  SectionHeader,
  StatCard,
  StatusBadge,
} from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { SupplyChainNode } from '../data/schema';
import { dataPending, getDerivedReportStats, getFeaturedCompanies } from '../lib/reportSelectors';

const data = loadExplorerData();

export function Comparisons(): JSX.Element {
  const companies = useMemo(() => data.nodes.filter((node) => node.type === 'company' || node.type === 'watchlist'), []);
  const featured = useMemo(() => getFeaturedCompanies(data, 8), []);
  const [leftId, setLeftId] = useState(featured[0]?.id ?? '');
  const [rightId, setRightId] = useState(featured[1]?.id ?? '');
  const left = companies.find((node) => node.id === leftId);
  const right = companies.find((node) => node.id === rightId);
  const stats = getDerivedReportStats(data);

  return (
    <PageShell>
      <HeroSection
        title="Comparisons"
        subtitle="A focused research surface for comparing two companies or mapped names across structural fields with research-only language."
        stats={
          <>
            <StatCard icon={<Building2 className="h-4 w-4" />} label="Comparable rows" value={companies.length} context="Company and watchlist names" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence mappings" value={`${stats.confidencePercent}%`} context="Share of scored mappings" />
          </>
        }
      />

      <MainContentGrid className="mt-8">
        <div className="space-y-6">
          <ContentSection>
            <SectionHeader title="Select comparison" description="Choose two mapped names to compare their role, exposure, bottleneck, geography, and source confidence." />
            <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
              <CompanySelect label="First company" value={leftId} onChange={setLeftId} companies={companies} />
              <div className="hidden place-items-center pb-2 text-muted-foreground md:grid">
                <ArrowDownUp className="h-5 w-5" />
              </div>
              <CompanySelect label="Second company" value={rightId} onChange={setRightId} companies={companies} />
            </div>
          </ContentSection>

          {left && right ? (
            <>
              <MetricStrip className="xl:grid-cols-4">
                <MetricItem icon={<Building2 className="h-4 w-4" />} label="Left" value={left.label} context={dataPending(left.ticker || left.status)} />
                <MetricItem icon={<Building2 className="h-4 w-4" />} label="Right" value={right.label} context={dataPending(right.ticker || right.status)} />
                <MetricItem icon={<Database className="h-4 w-4" />} label="Shared stage" value={left.layer === right.layer ? left.layer : 'Different stages'} context={`${left.layer} / ${right.layer}`} />
                <MetricItem icon={<ShieldCheck className="h-4 w-4" />} label="Source state" value={left.confidence === right.confidence ? dataPending(left.confidence) : 'Mixed'} context="Confidence comparison" />
              </MetricStrip>

              <div className="grid gap-5 lg:grid-cols-2">
                <CompanyComparison node={left} />
                <CompanyComparison node={right} />
              </div>
            </>
          ) : (
            <EmptyState title="Select two names" message="Choose two companies or watchlist names to compare research fields." />
          )}
        </div>

        <RightRail>
          <InsightPanel title="What this page is for">
            <p>Use comparisons to understand structural differences: role, stage, mapped exposure, bottleneck relevance, geography, confidence, and source state.</p>
          </InsightPanel>
          <InsightPanel title="Current limitation">
            <p>This view currently compares two company-style records. Stage-to-stage and material comparisons are reserved for a later research workflow.</p>
          </InsightPanel>
          <InsightPanel title="Research boundary">
            <p>Comparisons are structural research views, not investment advice. Missing data remains visible as <DataPendingState />.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function CompanySelect({
  label,
  value,
  onChange,
  companies,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  companies: SupplyChainNode[];
}): JSX.Element {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
        >
          <option value="">Choose a mapped name</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.label} {company.ticker ? `(${company.ticker})` : ''}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function CompanyComparison({ node }: { node: SupplyChainNode }): JSX.Element {
  return (
    <DossierSection title={node.label}>
      <p className="text-sm text-muted-foreground">
        {node.ticker ? `${node.ticker} · ` : ''}
        {node.layer}
      </p>
      <dl className="mt-5 space-y-3 text-sm">
        <Row label="Status" value={<StatusBadge status={node.status} />} />
        <Row label="Bottleneck" value={node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : <DataPendingState />} />
        <Row label="Exposure" value={<span className="capitalize">{dataPending(node.purePlayScore)}</span>} />
        <Row label="Geography" value={dataPending(node.country)} />
        <Row label="Confidence" value={node.confidence ? <ConfidenceIndicator confidence={node.confidence} /> : <DataPendingState />} />
      </dl>
      <p className="mt-5 text-sm text-muted-foreground">{node.whyItMatters || node.description || dataPending()}</p>
    </DossierSection>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold capitalize text-foreground">{value}</dd>
    </div>
  );
}
