import { GitBranch, Layers3, Route, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Source, SupplyChainData, SupplyChainNode } from '../../data/schema';
import { cn } from '../../lib/cn';
import {
  getNonInvestableBottlenecksForNode,
  getTopRankedCompaniesForNode,
  getWatchlistMentionsForNode,
} from '../../lib/researchSelectors';
import { getStageRootNodes } from '../../lib/stages';
import { CategoryDetail } from './CategoryDetail';
import { CompanyDetail } from './CompanyDetail';
import { MaterialDetail } from './MaterialDetail';

interface DetailPanelProps {
  data: SupplyChainData;
  selectedNode?: SupplyChainNode;
  onClose: () => void;
  onFocus: (nodeId: string) => void;
  onShowUpstream: (nodeId: string) => void;
  onShowDownstream: (nodeId: string) => void;
  onCollapse: () => void;
}

export function DetailPanel({
  data,
  selectedNode,
  onClose,
  onFocus,
  onShowUpstream,
  onShowDownstream,
  onCollapse,
}: DetailPanelProps): JSX.Element {
  const node = selectedNode ?? data.nodes[0];
  const nodesById = new Map(data.nodes.map((item) => [item.id, item]));
  const breadcrumbs = getBreadcrumbs(node, nodesById);
  const childrenNodes = node.virtual ? getStageRootNodes(data, node.id) : data.nodes.filter((item) => item.parentId === node.id);
  const upstream = data.edges.filter((edge) => edge.target === node.id).map((edge) => nodesById.get(edge.source)).filter(Boolean) as SupplyChainNode[];
  const downstream = data.edges.filter((edge) => edge.source === node.id).map((edge) => nodesById.get(edge.target)).filter(Boolean) as SupplyChainNode[];
  const sources = node.sourceIds.map((id) => data.sources.find((source) => source.id === id)).filter(Boolean) as Source[];
  const topCompanies = getTopRankedCompaniesForNode(data, node.id);
  const watchlistMentions = getWatchlistMentionsForNode(data, node.id);
  const nonInvestableBottlenecks = getNonInvestableBottlenecksForNode(data, node.id);
  const showRankings = node.type !== 'company' && node.type !== 'watchlist';

  return (
    <aside className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-night-900/96 shadow-2xl backdrop-blur">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 text-xs text-slate-500">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.id}>
                  {index > 0 ? <span className="mx-2 text-slate-700">/</span> : null}
                  <span className={cn(index === breadcrumbs.length - 1 && 'font-semibold text-slate-300')}>{crumb.label}</span>
                </span>
              ))}
            </div>
            <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {node.type === 'company' || node.type === 'watchlist' ? (
            <CompanyDetail node={node} upstream={upstream} downstream={downstream} sources={sources} />
          ) : node.type === 'material' || node.type === 'mineral' ? (
            <>
              <MaterialDetail node={node} suppliers={upstream} customers={downstream} sources={sources} />
              <RankedResearchPanel topCompanies={topCompanies} watchlistMentions={watchlistMentions} nonInvestableBottlenecks={nonInvestableBottlenecks} />
            </>
          ) : (
            <>
              <CategoryDetail node={node} childrenNodes={childrenNodes} />
              {showRankings ? <RankedResearchPanel topCompanies={topCompanies} watchlistMentions={watchlistMentions} nonInvestableBottlenecks={nonInvestableBottlenecks} /> : null}
            </>
          )}
        </div>

        <div className="grid gap-2 border-t border-slate-800 p-5 md:grid-cols-2">
          <ActionButton icon={<Layers3 className="h-4 w-4" />} label="Focus this branch" onClick={() => onFocus(node.id)} />
          <ActionButton icon={<Route className="h-4 w-4" />} label="Show upstream roots" onClick={() => onShowUpstream(node.id)} />
          <ActionButton icon={<GitBranch className="h-4 w-4" />} label="Show downstream customers" onClick={() => onShowDownstream(node.id)} />
          <ActionButton icon={<X className="h-4 w-4" />} label="Collapse branch" onClick={onCollapse} />
        </div>
      </div>
    </aside>
  );
}

function RankedResearchPanel({
  topCompanies,
  watchlistMentions,
  nonInvestableBottlenecks,
}: {
  topCompanies: SupplyChainNode[];
  watchlistMentions: SupplyChainNode[];
  nonInvestableBottlenecks: SupplyChainNode[];
}): JSX.Element {
  return (
    <div className="mt-4 space-y-4">
      <ResearchList
        title="Top 3 U.S.-Listed Companies"
        empty="No clean U.S.-listed public top-3 mapping is available for this node yet."
        items={topCompanies}
        variant="public"
      />
      <ResearchList
        title="Honorable Mentions / IPO-SPAC Watchlist"
        empty="No private, IPO, SPAC, or watchlist mentions are mapped to this node yet."
        items={watchlistMentions}
        variant="watchlist"
      />
      <ResearchList
        title="Non-Investable Bottleneck Dependencies"
        empty="No separate non-investable bottleneck dependencies are mapped to this node yet."
        items={nonInvestableBottlenecks}
        variant="bottleneck"
      />
    </div>
  );
}

function ResearchList({
  title,
  empty,
  items,
  variant,
}: {
  title: string;
  empty: string;
  items: SupplyChainNode[];
  variant: 'public' | 'watchlist' | 'bottleneck';
}): JSX.Element {
  const accents = {
    public: 'border-green-400/30 bg-green-500/8 text-green-200',
    watchlist: 'border-lime-400/30 bg-lime-500/8 text-lime-200',
    bottleneck: 'border-orange-400/30 bg-orange-500/8 text-orange-200',
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{title}</h3>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/companies/${item.id}`}
              className={cn('block rounded-xl border p-3 transition hover:border-blue-400/50 hover:bg-slate-800/70', accents[variant])}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.ticker ? `${item.ticker} · ${item.exchange} · ` : ''}
                    {item.status?.replaceAll('_', ' ')}
                  </p>
                </div>
                {item.rankWithinNode ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs font-black text-white">#{item.rankWithinNode}</span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-slate-300">{item.whyItMatters || item.description}</p>
            </Link>
          ))
        ) : (
          <p className="text-xs text-slate-500">{empty}</p>
        )}
      </div>
    </section>
  );
}

function getBreadcrumbs(node: SupplyChainNode, nodesById: Map<string, SupplyChainNode>): SupplyChainNode[] {
  const path: SupplyChainNode[] = [node];
  let current = node;
  while (current.parentId) {
    const parent = nodesById.get(current.parentId);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }
  return path;
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-blue-400/50 hover:text-blue-200"
    >
      {icon}
      {label}
    </button>
  );
}
