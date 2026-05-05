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
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search companies, categories, tickers, materials, risks..."
        className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      {results.length > 0 ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-report backdrop-blur">
          {results.map((result) => (
            <button
              key={result.node.id}
              type="button"
              onClick={() => onSelect(result.node.id)}
              className="flex w-full items-center justify-between gap-4 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-accent-soft/60"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">{result.node.label}</span>
                <span className="text-xs text-muted-foreground">
                  {result.node.ticker ? `${result.node.ticker} · ` : ''}
                  {result.node.layer} · {result.node.type}
                </span>
              </span>
              <span className="rounded-md bg-surface-muted px-2 py-1 text-xs text-muted-foreground">
                {result.matchedFields.slice(0, 2).join(', ')}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
