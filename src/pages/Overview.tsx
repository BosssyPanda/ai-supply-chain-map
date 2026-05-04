import { AlertTriangle, Building2, Database, Network, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getResearchStats, loadExplorerData } from '../data/loaders';

const data = loadExplorerData();
const researchStats = getResearchStats();

export function Overview(): JSX.Element {
  const companies = data.nodes.filter((node) => node.type === 'company');
  const critical = data.nodes.filter((node) => node.bottleneckLevel === 'critical');
  const watchlist = data.nodes.filter((node) => node.status === 'watchlist_private_ipo_spac' || node.type === 'watchlist');

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">Research Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-white">AI Supply Chain Explorer</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              A dark, interactive graph interface layered over the existing editable research database. The app separates physical bottlenecks from U.S.-listed investable exposure.
            </p>
          </div>
          <Link to="/supply-chain" className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-glowBlue hover:bg-blue-400">
            Open Graph Explorer
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<Network />} label="Sample graph nodes" value={String(data.nodes.length)} />
          <Stat icon={<Building2 />} label="Sample companies" value={String(companies.length)} />
          <Stat icon={<AlertTriangle />} label="Critical bottlenecks" value={String(critical.length)} />
          <Stat icon={<Database />} label="CSV research nodes" value={String(researchStats.nodes)} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              <h2 className="text-lg font-bold text-white">Top Bottleneck Categories</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {critical.slice(0, 10).map((node) => (
                <Link key={node.id} to="/supply-chain" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-400/50">
                  <p className="font-semibold text-white">{node.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{node.layer}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-lime-300" />
              <h2 className="text-lg font-bold text-white">Watchlist Names</h2>
            </div>
            <div className="space-y-3">
              {watchlist.slice(0, 8).map((node) => (
                <div key={node.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="font-semibold text-white">{node.label}</p>
                  <p className="text-sm text-slate-500">{node.layer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: JSX.Element; label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-blue-400/40 bg-blue-500/10 text-blue-200">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
