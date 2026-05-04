import { ArrowLeft, Network } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CompanyDetail } from '../components/details/CompanyDetail';
import { loadExplorerData } from '../data/loaders';
import type { Source, SupplyChainNode } from '../data/schema';

const data = loadExplorerData();

export function CompanyPage(): JSX.Element {
  const { id } = useParams();
  const node = data.nodes.find((item) => item.id === id && (item.type === 'company' || item.type === 'watchlist'));
  const nodesById = new Map(data.nodes.map((item) => [item.id, item]));

  if (!node) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Company not found</h1>
          <Link to="/companies" className="mt-4 inline-flex text-blue-300">
            Back to companies
          </Link>
        </div>
      </div>
    );
  }

  const upstream = data.edges.filter((edge) => edge.target === node.id).map((edge) => nodesById.get(edge.source)).filter(Boolean) as SupplyChainNode[];
  const downstream = data.edges.filter((edge) => edge.source === node.id).map((edge) => nodesById.get(edge.target)).filter(Boolean) as SupplyChainNode[];
  const sources = node.sourceIds.map((sourceId) => data.sources.find((source) => source.id === sourceId)).filter(Boolean) as Source[];
  const peers = data.nodes.filter((item) => item.id !== node.id && item.type === 'company' && item.layer === node.layer).slice(0, 8);

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-200">
            <ArrowLeft className="h-4 w-4" />
            Back to companies
          </Link>
          <Link
            to={`/supply-chain?focus=${node.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-400/50 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200"
          >
            <Network className="h-4 w-4" />
            Back to graph focused
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl border border-slate-800 bg-night-900/90 p-5 shadow-2xl">
            <CompanyDetail node={node} upstream={upstream} downstream={downstream} sources={sources} compact />
          </section>
          <aside className="space-y-4">
            <Panel title="Supply-chain position" value={node.layer} />
            <Panel title="Geography" value={node.country ?? 'Data pending'} />
            <Panel title="Bottleneck" value={node.bottleneckLevel ?? 'Unscored'} />
            <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="mb-3 text-sm font-bold text-white">Peers / Comparables</h2>
              <div className="space-y-2">
                {peers.length > 0 ? peers.map((peer) => (
                  <Link key={peer.id} to={`/companies/${peer.id}`} className="block rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 hover:text-blue-200">
                    {peer.label}
                  </Link>
                )) : <p className="text-sm text-slate-500">Peer mapping pending.</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, value }: { title: string; value: string }): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-lg font-bold capitalize text-white">{value}</p>
    </section>
  );
}
