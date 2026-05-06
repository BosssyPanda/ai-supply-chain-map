import { Filter, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { BottleneckLevel, CompanyStatus, GraphFilters, PurePlayScore, SupplyChainNode } from '../../data/schema';
import { defaultFilters, uniqueGeographies, uniqueLayers } from '../../lib/filters';
import { cn } from '../../lib/cn';

interface FilterPanelProps {
  nodes: SupplyChainNode[];
  filters: GraphFilters;
  onChange: (filters: GraphFilters) => void;
}

const statuses: CompanyStatus[] = [
  'us_listed_public',
  'us_listed_adr',
  'private',
  'state_owned',
  'non_us_listed',
  'watchlist_private_ipo_spac',
];
const levels: BottleneckLevel[] = ['critical', 'high', 'medium', 'low'];
const purePlay: PurePlayScore[] = ['low', 'medium', 'high'];

function toggleArray<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function FilterPanel({ nodes, filters, onChange }: FilterPanelProps): JSX.Element {
  const layers = uniqueLayers(nodes);
  const geographies = uniqueGeographies(nodes).slice(0, 18);
  const [expanded, setExpanded] = useState(false);
  const activeCount = [
    filters.layers.length,
    filters.statuses.length,
    filters.bottleneckLevels.length,
    filters.geographies.length,
    filters.material ? 1 : 0,
    filters.usListedOnly ? 1 : 0,
    filters.adrOnly ? 1 : 0,
    filters.showCompanies ? 0 : 1,
    filters.showNonInvestable ? 0 : 1,
    filters.showMinerals ? 0 : 1,
    filters.showWatchlist ? 0 : 1,
    filters.purePlayScores.length,
  ].reduce((total, value) => total + value, 0);

  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-report-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="h-4 w-4 text-accent" />
          Research filters
          <span className="rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {activeCount === 0 ? 'Default view' : `${activeCount} active`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(defaultFilters)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent/45 hover:text-accent"
          >
            {expanded ? 'Hide filters' : 'Show filters'}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Use filters when investigating a specific branch. The default map remains the primary editorial view.
      </p>

      <div className={cn('mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4', !expanded && 'hidden')}>
        <FilterGroup label="Supply-chain layer">
          <select
            value={filters.layers[0] ?? ''}
            onChange={(event) => onChange({ ...filters, layers: event.target.value ? [event.target.value] : [] })}
            className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
          >
            <option value="">All layers</option>
            {layers.map((layer) => (
              <option key={layer} value={layer}>
                {layer}
              </option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup label="Status">
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((status) => (
              <Chip
                key={status}
                active={filters.statuses.includes(status)}
                onClick={() => onChange({ ...filters, statuses: toggleArray(filters.statuses, status) })}
              >
                {status.replaceAll('_', ' ')}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Bottleneck">
          <div className="flex flex-wrap gap-1.5">
            {levels.map((level) => (
              <Chip
                key={level}
                active={filters.bottleneckLevels.includes(level)}
                onClick={() => onChange({ ...filters, bottleneckLevels: toggleArray(filters.bottleneckLevels, level) })}
              >
                {level}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Material / geography">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={filters.material}
              onChange={(event) => onChange({ ...filters, material: event.target.value })}
              placeholder="copper, HBM..."
              className="h-9 rounded-md border border-border bg-surface px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
            <select
              value={filters.geographies[0] ?? ''}
              onChange={(event) => onChange({ ...filters, geographies: event.target.value ? [event.target.value] : [] })}
              className="h-9 rounded-md border border-border bg-surface px-3 text-xs text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            >
              <option value="">All geos</option>
              {geographies.map((geo) => (
                <option key={geo} value={geo}>
                  {geo}
                </option>
              ))}
            </select>
          </div>
        </FilterGroup>
      </div>

      <div className={cn('mt-4 flex flex-wrap gap-2 border-t border-border pt-4', !expanded && 'hidden')}>
        <Toggle active={filters.usListedOnly} onClick={() => onChange({ ...filters, usListedOnly: !filters.usListedOnly })}>
          U.S.-listed only
        </Toggle>
        <Toggle active={filters.adrOnly} onClick={() => onChange({ ...filters, adrOnly: !filters.adrOnly })}>
          ADR
        </Toggle>
        <Toggle active={filters.showCompanies} onClick={() => onChange({ ...filters, showCompanies: !filters.showCompanies })}>
          Companies
        </Toggle>
        <Toggle active={filters.showNonInvestable} onClick={() => onChange({ ...filters, showNonInvestable: !filters.showNonInvestable })}>
          Non-investable
        </Toggle>
        <Toggle active={filters.showMinerals} onClick={() => onChange({ ...filters, showMinerals: !filters.showMinerals })}>
          Mineral roots
        </Toggle>
        <Toggle active={filters.showWatchlist} onClick={() => onChange({ ...filters, showWatchlist: !filters.showWatchlist })}>
          Watchlist
        </Toggle>
        {purePlay.map((score) => (
          <Toggle
            key={score}
            active={filters.purePlayScores.includes(score)}
            onClick={() => onChange({ ...filters, purePlayScores: toggleArray(filters.purePlayScores, score) })}
          >
            {score} pure-play
          </Toggle>
        ))}
      </div>
    </section>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs capitalize transition',
        active ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-3 py-1.5 text-xs font-medium transition',
        active ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
