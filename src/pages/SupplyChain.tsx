import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DetailPanel } from '../components/details/DetailPanel';
import { FilterPanel } from '../components/filters/FilterPanel';
import { SupplyChainGraph } from '../components/graph/SupplyChainGraph';
import { Legend } from '../components/legend/Legend';
import { PageShell } from '../components/layout/PageShell';
import { HeroSection, StatCard } from '../components/report';
import { SearchBar } from '../components/search/SearchBar';
import { loadExplorerData } from '../data/loaders';
import type { GraphFilters, GraphViewMode } from '../data/schema';
import { defaultFilters, isNonInvestable } from '../lib/filters';
import type { ExplorationMode } from '../lib/focusGraph';
import { dataPending, getDerivedReportStats } from '../lib/reportSelectors';
import { getStageNode } from '../lib/stages';
import { AlertTriangle, ArrowLeft, Building2, GitBranch, Network } from 'lucide-react';

const data = loadExplorerData();
const rootId = 'L0_AI_ECOSYSTEM';
const viewModes: GraphViewMode[] = ['category', 'geography', 'risk', 'custom'];

export function SupplyChain(): JSX.Element {
  const [filters, setFilters] = useState<GraphFilters>(defaultFilters);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const focusParam = searchParams.get('focus');
  const initialFocus = focusParam ?? rootId;
  const requestedView = searchParams.get('view') as GraphViewMode | null;
  const viewMode = requestedView && viewModes.includes(requestedView) ? requestedView : 'category';
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialFocus);
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>(initialFocus);
  const [focusMode, setFocusMode] = useState(initialFocus !== rootId);
  const [explorationMode, setExplorationMode] = useState<ExplorationMode>('branch');

  const selectedNode = useMemo(() => data.nodes.find((node) => node.id === selectedNodeId) ?? getStageNode(selectedNodeId), [selectedNodeId]);
  const stats = useMemo(() => getExplorerStats(), []);
  const reportStats = useMemo(() => getDerivedReportStats(data), []);

  const focus = useCallback((nodeId: string, mode: ExplorationMode = 'branch') => {
    setSelectedNodeId(nodeId);
    setExplorationMode(mode);
    setFocusMode(nodeId !== rootId);
    setFocusNodeId(undefined);
    window.requestAnimationFrame(() => setFocusNodeId(nodeId));
  }, []);

  const exitFocus = () => {
    setFocusMode(false);
    setFocusNodeId(undefined);
    setExplorationMode('branch');
  };

  const collapse = () => {
    exitFocus();
    setSelectedNodeId(rootId);
  };

  useEffect(() => {
    if (!focusParam) return;
    focus(focusParam);
  }, [focus, focusParam]);

  useEffect(() => {
    if (focusParam) return;
    setSelectedNodeId(rootId);
    setFocusNodeId(undefined);
    setFocusMode(false);
    setExplorationMode('branch');
  }, [focusParam, viewMode]);

  return (
    <PageShell fullWidth>
      <HeroSection
        className="lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.9fr)]"
        title="The AI Supply Chain, Mapped"
        subtitle="This is the advanced research workspace for exploring mapped relationships, focus branches, supplier depth, and how companies, materials, and bottlenecks connect."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Link>
            <div className="w-full max-w-xl 2xl:w-[520px]">
              <SearchBar nodes={data.nodes} value={searchQuery} onChange={setSearchQuery} onSelect={focus} />
            </div>
          </div>
        }
        stats={
          <>
            <StatCard icon={<Network className="h-4 w-4" />} label="Graph nodes" value={stats.totalNodes} context="Visible research universe" />
            <StatCard icon={<GitBranch className="h-4 w-4" />} label="Relationships" value={stats.relationships} context="Mapped graph edges" />
            <StatCard icon={<Building2 className="h-4 w-4" />} label="Companies" value={reportStats.mappedCompanies} context="Public, private, and watchlist rows" />
            <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Critical bottlenecks" value={reportStats.criticalBottlenecks} context="Rows marked critical" />
          </>
        }
      />

      <div className="mt-8 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="min-w-0 space-y-4">
          <FilterPanel nodes={data.nodes} filters={filters} onChange={setFilters} />
          <SupplyChainGraph
            data={data}
            filters={filters}
            searchQuery={searchQuery}
            selectedNodeId={selectedNodeId}
            focusNodeId={focusNodeId}
            viewMode={viewMode}
            focusMode={focusMode}
            explorationMode={explorationMode}
            onSelectNode={setSelectedNodeId}
            onEnterFocus={focus}
            onExitFocus={exitFocus}
          />
          <Legend />
        </section>
        <DetailPanel
          data={data}
          selectedNode={selectedNode}
          onClose={collapse}
          onFocus={focus}
          onShowUpstream={(nodeId) => focus(nodeId, 'upstream')}
          onShowDownstream={(nodeId) => focus(nodeId, 'downstream')}
          onCollapse={collapse}
        />
      </div>
    </PageShell>
  );
}

function getExplorerStats() {
  const dates = data.sources.map((source) => source.dateAccessed).filter(Boolean).sort();
  return {
    totalNodes: data.nodes.length,
    relationships: data.edges.length,
    usPublic: data.nodes.filter((node) => node.status === 'us_listed_public').length,
    nonInvestable: data.nodes.filter((node) => isNonInvestable(node.status)).length,
    lastUpdated: dataPending(dates[dates.length - 1]),
  };
}
