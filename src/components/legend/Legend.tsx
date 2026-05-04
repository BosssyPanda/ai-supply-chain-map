const items = [
  ['Root', 'bg-electric-purple'],
  ['Stage / category', 'bg-blue-500'],
  ['Subcategory / component', 'bg-cyan-500'],
  ['U.S.-listed company', 'bg-green-500'],
  ['ADR', 'bg-emerald-300'],
  ['Private / non-investable', 'bg-slate-500'],
  ['Watchlist / IPO-SPAC', 'bg-lime-400'],
  ['Material / mineral', 'bg-amber-500'],
  ['Policy / critical risk', 'bg-rose-500'],
] as const;

export function Legend(): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Legend</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300 md:grid-cols-3 xl:grid-cols-5">
        {items.map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
