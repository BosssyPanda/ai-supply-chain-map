const items = [
  ['Root', 'bg-accent'],
  ['Stage / category', 'bg-medium'],
  ['Subcategory / component', 'bg-partial'],
  ['U.S.-listed company', 'bg-verified'],
  ['ADR', 'bg-partial'],
  ['Private / non-investable', 'bg-pending'],
  ['Watchlist / IPO-SPAC', 'bg-pending'],
  ['Material / mineral', 'bg-high'],
  ['Policy / critical risk', 'bg-critical'],
] as const;

export function Legend(): JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-report-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legend</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-3 xl:grid-cols-5">
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
