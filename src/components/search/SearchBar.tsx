import { Search, X } from 'lucide-react';
import type { SupplyChainNode } from '../../data/schema';
import { searchSupplyChainDetailed } from '../../lib/search';

interface SearchBarProps {
  nodes: SupplyChainNode[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (nodeId: string) => void;
}

export function SearchBar({ nodes, value, onChange, onSelect }: SearchBarProps): JSX.Element {
  const results = value.trim() ? searchSupplyChainDetailed(nodes, value).slice(0, 8) : [];

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search companies, categories, tickers, materials, risks..."
        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      {results.length > 0 ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-800 bg-night-900/98 shadow-2xl backdrop-blur">
          {results.map((result) => (
            <button
              key={result.node.id}
              type="button"
              onClick={() => onSelect(result.node.id)}
              className="flex w-full items-center justify-between gap-4 border-b border-slate-800/70 px-4 py-3 text-left last:border-b-0 hover:bg-slate-800/80"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-100">{result.node.label}</span>
                <span className="text-xs text-slate-500">
                  {result.node.ticker ? `${result.node.ticker} · ` : ''}
                  {result.node.layer} · {result.node.type}
                </span>
              </span>
              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                {result.matchedFields.slice(0, 2).join(', ')}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
