import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DetailPanel } from '../components/details/DetailPanel';
import { FilterPanel } from '../components/filters/FilterPanel';
import { SupplyChainGraph } from '../components/graph/SupplyChainGraph';
import { Legend } from '../components/legend/Legend';
import { SearchBar } from '../components/search/SearchBar';
import { loadExplorerData } from '../data/loaders';
import type { GraphFilters, GraphViewMode } from '../data/schema';
import { defaultFilters, isNonInvestable } from '../lib/filters';
import type { ExplorationMode } from '../lib/focusGraph';
import { getStageNode } from '../lib/stages';

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
    <div className="min-h-screen px-4 py-5 lg:px-6">
      <header className="mb-5 flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Interactive Explorer</p>
          <h1 className="mt-1 text-3xl font-bold text-white">AI Supply Chain Explorer</h1>
        </div>
        <SearchBar nodes={data.nodes} value={searchQuery} onChange={setSearchQuery} onSelect={focus} />
      </header>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="min-w-0 space-y-4">
          <FilterPanel nodes={data.nodes} filters={filters} onChange={setFilters} />
          <StatStrip stats={stats} />
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
    </div>
  );
}

function getExplorerStats() {
  const lastUpdated = data.sources
    .map((source) => source.dateAccessed)
    .filter(Boolean)
    .sort();
  const latestDate = lastUpdated[lastUpdated.length - 1];

  return [
    { label: 'Total nodes', value: data.nodes.length },
    { label: 'U.S. public', value: data.nodes.filter((node) => node.status === 'us_listed_public').length },
    { label: 'ADRs', value: data.nodes.filter((node) => node.status === 'us_listed_adr').length },
    { label: 'Critical bottlenecks', value: data.nodes.filter((node) => node.bottleneckLevel === 'critical').length },
    { label: 'Root materials', value: data.nodes.filter((node) => node.type === 'material' || node.type === 'mineral').length },
    { label: 'Non-investable', value: data.nodes.filter((node) => isNonInvestable(node.status)).length },
    { label: 'Last updated', value: latestDate ?? 'Data pending' },
  ];
}

function StatStrip({ stats }: { stats: Array<{ label: string; value: string | number }> }): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-950/72 px-3 py-2.5 shadow-lg">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
          <p className="mt-0.5 text-base font-black text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
