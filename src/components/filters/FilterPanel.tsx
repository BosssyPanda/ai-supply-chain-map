import { Filter, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
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
const levels: BottleneckLevel[] = ['low', 'medium', 'high', 'critical'];
const purePlay: PurePlayScore[] = ['low', 'medium', 'high'];

function toggleArray<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function FilterPanel({ nodes, filters, onChange }: FilterPanelProps): JSX.Element {
  const layers = uniqueLayers(nodes);
  const geographies = uniqueGeographies(nodes).slice(0, 18);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Filter className="h-4 w-4 text-blue-300" />
          Filters
        </div>
        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <FilterGroup label="Supply-chain layer">
          <select
            value={filters.layers[0] ?? ''}
            onChange={(event) => onChange({ ...filters, layers: event.target.value ? [event.target.value] : [] })}
            className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 outline-none"
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
              className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 outline-none"
            />
            <select
              value={filters.geographies[0] ?? ''}
              onChange={(event) => onChange({ ...filters, geographies: event.target.value ? [event.target.value] : [] })}
              className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 outline-none"
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

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
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
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
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
        active ? 'border-blue-400/70 bg-blue-500/15 text-blue-200' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-100',
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
        'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
        active ? 'border-teal-400/60 bg-teal-400/10 text-teal-200' : 'border-slate-800 bg-slate-900 text-slate-500',
      )}
    >
      {children}
    </button>
  );
}
