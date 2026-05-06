import { ArrowDownUp, Building2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ContentSection, MainContentGrid, PageShell, RightRail } from '../components/layout/PageShell';
import {
  CompanyMiniCard,
  ConfidenceIndicator,
  FilterBar,
  FilterSearch,
  FilterSelect,
  FilterToggle,
  HeroSection,
  InsightPanel,
  ReportTable,
  RiskBadge,
  SectionHeader,
  StatCard,
  StatusBadge,
  PendingCell,
  type ReportTableColumn,
} from '../components/report';
import { loadExplorerData } from '../data/loaders';
import type { BottleneckLevel, CompanyStatus, Confidence, SupplyChainNode } from '../data/schema';
import { isUsListed, uniqueGeographies, uniqueLayers } from '../lib/filters';
import { cn } from '../lib/cn';
import { dataPending, getDerivedReportStats } from '../lib/reportSelectors';
import { searchSupplyChain } from '../lib/search';

const data = loadExplorerData();
const statuses: CompanyStatus[] = ['us_listed_public', 'us_listed_adr', 'private', 'state_owned', 'non_us_listed', 'watchlist_private_ipo_spac'];
const bottlenecks: BottleneckLevel[] = ['critical', 'high', 'medium', 'low'];
const confidences: Confidence[] = ['high', 'medium', 'low'];

type SortKey = 'company' | 'ticker' | 'layer' | 'bottleneck' | 'geography' | 'purePlayScore' | 'confidence';
type SortDirection = 'asc' | 'desc';

export function Companies(): JSX.Element {
  const navigate = useNavigate();
  const companies = useMemo(() => data.nodes.filter((node) => node.type === 'company' || node.type === 'watchlist'), []);
  const layers = useMemo(() => uniqueLayers(companies), [companies]);
  const geographies = useMemo(() => uniqueGeographies(companies), [companies]);
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [geography, setGeography] = useState('');
  const [status, setStatus] = useState('');
  const [confidence, setConfidence] = useState('');
  const [usListedOnly, setUsListedOnly] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('company');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filtered = useMemo(() => {
    const searched = query ? searchSupplyChain(companies, query) : companies;
    return searched
      .filter((node) => !layer || node.layer === layer)
      .filter((node) => !bottleneck || node.bottleneckLevel === bottleneck)
      .filter((node) => !geography || node.country === geography)
      .filter((node) => !status || node.status === status)
      .filter((node) => !confidence || node.confidence === confidence)
      .filter((node) => !usListedOnly || isUsListed(node.status))
      .filter((node) => !criticalOnly || node.bottleneckLevel === 'critical')
      .sort((a, b) => compareCompanies(a, b, sortKey, sortDirection));
  }, [bottleneck, companies, confidence, criticalOnly, geography, layer, query, sortDirection, sortKey, status, usListedOnly]);

  const setSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const columns: ReportTableColumn<SupplyChainNode>[] = [
    {
      id: 'company',
      header: <SortableHeader label="Company" sortKey="company" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => (
        <div>
          <p className="font-semibold text-foreground">{node.label}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{node.role || node.marketSegment || node.description}</p>
        </div>
      ),
      className: 'min-w-[250px]',
    },
    {
      id: 'ticker',
      header: <SortableHeader label="Ticker" sortKey="ticker" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => node.ticker ? <span className="font-semibold text-foreground">{node.ticker}</span> : <PendingCell />,
    },
    {
      id: 'role',
      header: 'Role / Segment',
      render: (node) => node.marketSegment || node.role || <PendingCell />,
      className: 'min-w-[220px]',
    },
    {
      id: 'layer',
      header: <SortableHeader label="Layer" sortKey="layer" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => node.layer,
    },
    { id: 'status', header: 'Status', render: (node) => <StatusBadge status={node.status} /> },
    {
      id: 'bottleneck',
      header: <SortableHeader label="Bottleneck" sortKey="bottleneck" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => node.bottleneckLevel ? <RiskBadge level={node.bottleneckLevel} /> : <PendingCell />,
    },
    {
      id: 'geography',
      header: <SortableHeader label="Geography" sortKey="geography" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => node.country || <PendingCell />,
    },
    {
      id: 'pure-play',
      header: <SortableHeader label="Exposure" sortKey="purePlayScore" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => node.purePlayScore ? <span className="capitalize">{node.purePlayScore}</span> : <PendingCell />,
    },
    {
      id: 'confidence',
      header: <SortableHeader label="Confidence" sortKey="confidence" activeKey={sortKey} direction={sortDirection} onSort={setSort} />,
      render: (node) => <ConfidenceIndicator confidence={node.confidence} />,
    },
  ];

  const usListedCount = companies.filter((node) => isUsListed(node.status)).length;
  const highConfidenceCount = companies.filter((node) => node.confidence === 'high').length;
  const criticalCount = companies.filter((node) => node.bottleneckLevel === 'critical').length;
  const reportStats = getDerivedReportStats(data);
  const keyGroups = layers
    .map((name) => ({ name, count: companies.filter((node) => node.layer === name).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <PageShell>
      <HeroSection
        title="Companies Across the AI Supply Chain"
        subtitle="Explore the organizations mapped to the AI infrastructure stack. Companies are organized by role, bottleneck relevance, listing status, geography, and confidence."
        stats={
          <>
            <StatCard icon={<Building2 className="h-4 w-4" />} label="Mapped companies" value={companies.length} context="Across the current research graph" />
            <StatCard icon={<Building2 className="h-4 w-4" />} label="U.S.-listed" value={usListedCount} context="Public and ADR rows from CSV data" />
            <StatCard icon={<TriangleAlert className="h-4 w-4" />} label="Critical bottleneck names" value={criticalCount} context="High-impact mapped constraints" />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="High-confidence profiles" value={highConfidenceCount} context={`${reportStats.confidencePercent}% of scored mappings are high confidence`} />
          </>
        }
      />

      <MainContentGrid className="mt-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <FilterBar>
            <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(4,minmax(140px,180px))]">
              <FilterSearch value={query} onChange={setQuery} placeholder="Search companies by name, ticker, role, or keyword..." />
              <FilterSelect label="Stage" value={layer} onChange={setLayer} options={layers} allLabel="All" />
              <FilterSelect label="Geography" value={geography} onChange={setGeography} options={geographies} allLabel="All" />
              <FilterSelect label="Listing status" value={status} onChange={setStatus} options={statuses} allLabel="All" />
              <FilterSelect label="Bottleneck risk" value={bottleneck} onChange={setBottleneck} options={bottlenecks} allLabel="All" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              <FilterSelect label="Confidence" value={confidence} onChange={setConfidence} options={confidences} allLabel="All confidence" className="w-44" />
              <div className="flex items-end gap-2">
                <FilterToggle active={usListedOnly} onClick={() => setUsListedOnly((value) => !value)}>U.S.-listed</FilterToggle>
                <FilterToggle active={criticalOnly} onClick={() => setCriticalOnly((value) => !value)}>Critical</FilterToggle>
              </div>
            </div>
          </FilterBar>

          <ContentSection>
            <SectionHeader title="Featured companies" action={<span className="text-sm font-semibold text-accent">{filtered.length} visible</span>} />
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, 6).map((node) => (
                <CompanyMiniCard key={node.id} company={node} to={`/companies/${node.id}`} />
              ))}
            </div>
          </ContentSection>

          <ReportTable
            title="All mapped companies"
            description={`${filtered.length} visible from ${companies.length} mapped company rows`}
            columns={columns}
            rows={filtered}
            getRowKey={(node) => node.id}
            onRowClick={(node) => navigate(`/companies/${node.id}`)}
            emptyMessage="No companies match the current filters."
            note="Pending cells indicate fields that need an attached source before they are promoted into the report view."
          />
        </div>

        <RightRail>
          <InsightPanel title="Why these companies matter">
            <p>AI performance and scale depend on specialized companies across chips, data centers, power, cooling, materials, and services. This page shows role, exposure, bottleneck relevance, geography, and source confidence with research-only framing.</p>
          </InsightPanel>
          <InsightPanel title="Key groups" eyebrow="Database structure">
            <div className="space-y-2">
              {keyGroups.map((group) => (
                <button
                  key={group.name}
                  type="button"
                  onClick={() => setLayer(group.name)}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-left text-sm hover:border-accent/45"
                >
                  <span className="font-semibold text-foreground">{group.name}</span>
                  <span className="text-muted-foreground">{group.count} rows</span>
                </button>
              ))}
            </div>
          </InsightPanel>
          <InsightPanel title="Spotlight" eyebrow="Report chapter">
            <p>Company dossiers show the source-backed role, upstream and downstream position, mapped risks, peers, and confidence state for each organization.</p>
            <Link to={filtered[0] ? `/companies/${filtered[0].id}` : '/companies'} className="mt-4 inline-flex text-sm font-semibold text-accent">
              Open a dossier
            </Link>
          </InsightPanel>
          <InsightPanel title="Data status">
            <p>Company counts, filters, and row details are derived from loaded research files. Unknown fields stay marked as {dataPending()}.</p>
          </InsightPanel>
        </RightRail>
      </MainContentGrid>
    </PageShell>
  );
}

function compareCompanies(a: SupplyChainNode, b: SupplyChainNode, key: SortKey, direction: SortDirection): number {
  const severity = { critical: 0, high: 1, medium: 2, low: 3 };
  const confidence = { high: 0, medium: 1, low: 2 };
  const purePlay = { high: 0, medium: 1, low: 2 };
  const values: Record<SortKey, [string | number, string | number]> = {
    company: [a.label, b.label],
    ticker: [a.ticker ?? '', b.ticker ?? ''],
    layer: [a.layer, b.layer],
    bottleneck: [severity[a.bottleneckLevel ?? 'low'], severity[b.bottleneckLevel ?? 'low']],
    geography: [a.country ?? '', b.country ?? ''],
    purePlayScore: [purePlay[a.purePlayScore ?? 'low'], purePlay[b.purePlayScore ?? 'low']],
    confidence: [confidence[a.confidence ?? 'low'], confidence[b.confidence ?? 'low']],
  };
  const [left, right] = values[key];
  const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right));
  return direction === 'asc' ? result : -result;
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}): JSX.Element {
  return (
    <button type="button" onClick={() => onSort(sortKey)} className={cn('inline-flex items-center gap-1 hover:text-accent', activeKey === sortKey && 'text-accent')}>
      {label}
      <ArrowDownUp className={cn('h-3.5 w-3.5', activeKey === sortKey && direction === 'desc' && 'rotate-180')} />
    </button>
  );
}
