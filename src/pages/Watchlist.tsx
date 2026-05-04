import { Link } from 'react-router-dom';
import { loadExplorerData } from '../data/loaders';

const data = loadExplorerData();

export function Watchlist(): JSX.Element {
  const watchlist = data.nodes.filter((node) => node.type === 'watchlist' || node.status === 'watchlist_private_ipo_spac' || node.status === 'private');

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-300">Separate from ranked public companies</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Private / SPAC / IPO Watchlist</h1>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {watchlist.map((node) => (
            <Link key={node.id} to={node.type === 'company' ? `/companies/${node.id}` : '/supply-chain'} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl hover:border-lime-400/40">
              <p className="text-lg font-bold text-white">{node.label}</p>
              <p className="mt-1 text-sm text-slate-500">{node.layer}</p>
              <p className="mt-4 text-sm text-slate-400">{node.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg bg-lime-500/10 px-2 py-1 text-lime-200">{node.status?.replaceAll('_', ' ') ?? node.type}</span>
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-slate-300">{node.country ?? 'Geography pending'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
