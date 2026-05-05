import { Bookmark, Network, Search, Share2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { LastUpdatedIndicator } from './LastUpdatedIndicator';
import { ThemeToggle } from './ThemeToggle';

const navigation = [
  { label: 'Overview', href: '/' },
  { label: 'Supply Chain', href: '/supply-chain' },
  { label: 'Companies', href: '/companies' },
  { label: 'Materials', href: '/materials' },
  { label: 'Bottlenecks', href: '/bottlenecks' },
  { label: 'Sources', href: '/sources' },
  { label: 'Names to Watch', href: '/watchlist' },
] as const;

export function TopNav({ lastUpdated }: { lastUpdated?: string }): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/92 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-[1780px] items-center gap-5 px-5 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-accent/35 bg-accent-soft text-accent">
            <Network className="h-5 w-5" />
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-bold uppercase text-foreground">AI Supply</p>
            <p className="text-sm font-bold uppercase text-foreground">Chain Explorer</p>
          </div>
        </NavLink>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Primary navigation">
          <NavItems />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <label className="relative hidden w-[360px] lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search companies, technologies, materials..."
              className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-accent/45 hover:text-accent md:grid"
            aria-label="Bookmark report"
            title="Bookmark report"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-accent/45 hover:text-accent md:grid"
            aria-label="Share report"
            title="Share report"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <LastUpdatedIndicator value={lastUpdated} />
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1780px] gap-1 overflow-x-auto border-t border-border px-5 lg:px-8 xl:hidden" aria-label="Primary navigation">
        <NavItems />
      </nav>
    </header>
  );
}

function NavItems(): JSX.Element {
  return (
    <>
      {navigation.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/'}
          className={({ isActive }) =>
            cn(
              'relative whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground xl:py-7',
              isActive &&
                'text-accent after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-accent',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );
}
