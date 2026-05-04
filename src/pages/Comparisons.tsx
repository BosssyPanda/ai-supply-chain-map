import { loadExplorerData } from '../data/loaders';

const data = loadExplorerData();
const defaultComparisonIds = ['COMP_NVDA_GPU', 'COMP_ASML_LITHO', 'COMP_VRT_PWR'];

export function Comparisons(): JSX.Element {
  const defaults = defaultComparisonIds
    .map((id) => data.nodes.find((node) => node.id === id))
    .filter(Boolean) as NonNullable<(typeof data.nodes)[number]>[];

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Research comparison</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Comparisons</h1>
          <p className="mt-2 text-sm text-slate-500">Side-by-side research fields only. No buy, sell, or price-target recommendations.</p>
        </header>
        <div className="grid gap-4 xl:grid-cols-3">
          {defaults.map((node) => (
            <section key={node.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl">
              <p className="text-xl font-bold text-white">{node.label}</p>
              <p className="mt-1 text-sm text-slate-500">
                {node.ticker ? `${node.ticker} · ` : ''}
                {node.layer}
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Status" value={node.status?.replaceAll('_', ' ') ?? 'Data pending'} />
                <Row label="Bottleneck" value={node.bottleneckLevel ?? 'Unscored'} />
                <Row label="Pure-play" value={node.purePlayScore ?? 'Data pending'} />
                <Row label="Geography" value={node.country ?? 'Data pending'} />
              </dl>
              <p className="mt-5 text-sm text-slate-400">{node.whyItMatters}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold capitalize text-slate-200">{value}</dd>
    </div>
  );
}
