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

type NavigationItem = (typeof navigation)[number];
export type TopNavVariant = 'default' | 'atlas';

export function TopNav({ lastUpdated, variant = 'default' }: { lastUpdated?: string; variant?: TopNavVariant }): JSX.Element {
  const isAtlas = variant === 'atlas';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur',
        isAtlas
          ? 'hidden border-white/10 bg-[#030814]/88 text-white shadow-[0_24px_80px_rgba(2,6,23,0.28)] xl:block'
          : 'border-border bg-surface/92',
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-[1780px] items-center gap-4 px-4 sm:min-h-20 sm:gap-5 sm:px-5 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div
            className={cn(
              'grid h-10 w-10 place-items-center rounded-lg border sm:h-11 sm:w-11',
              isAtlas ? 'border-blue-300/35 bg-blue-400/10 text-blue-200' : 'border-accent/35 bg-accent-soft text-accent',
            )}
          >
            <Network className="h-5 w-5" />
          </div>
          <div className="block leading-tight">
            <p className={cn('text-xs font-bold uppercase sm:text-sm', isAtlas ? 'text-white' : 'text-foreground')}>AI Supply</p>
            <p className={cn('text-xs font-bold uppercase sm:text-sm', isAtlas ? 'text-white' : 'text-foreground')}>Chain Explorer</p>
          </div>
        </NavLink>

        <nav className={cn('hidden min-w-0 flex-1 items-center justify-center gap-1', isAtlas ? 'xl:flex' : '2xl:flex')} aria-label="Primary navigation">
          <NavItems items={navigation} variant={variant} />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <label className={cn('relative hidden w-[360px]', isAtlas ? 'xl:block' : 'lg:block')}>
            <Search className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', isAtlas ? 'text-white/48' : 'text-muted-foreground')} />
            <input
              type="search"
              placeholder="Search companies, technologies, materials..."
              className={cn(
                'h-11 w-full rounded-md border pl-10 pr-3 text-sm outline-none transition focus:ring-2',
                isAtlas
                  ? 'border-white/12 bg-white/[0.06] text-white placeholder:text-white/42 focus:border-blue-300/60 focus:ring-blue-300/20'
                  : 'border-border bg-surface text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent/15',
              )}
            />
          </label>
          <button
            type="button"
            className={cn(
              'hidden h-10 w-10 place-items-center rounded-md border transition md:grid',
              isAtlas
                ? 'border-white/12 bg-white/[0.06] text-white/62 hover:border-blue-300/45 hover:text-blue-100'
                : 'border-border bg-surface text-muted-foreground hover:border-accent/45 hover:text-accent',
            )}
            aria-label="Bookmark report"
            title="Bookmark report"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              'hidden h-10 w-10 place-items-center rounded-md border transition md:grid',
              isAtlas
                ? 'border-white/12 bg-white/[0.06] text-white/62 hover:border-blue-300/45 hover:text-blue-100'
                : 'border-border bg-surface text-muted-foreground hover:border-accent/45 hover:text-accent',
            )}
            aria-label="Share report"
            title="Share report"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <ThemeToggle />
          {isAtlas ? null : <LastUpdatedIndicator value={lastUpdated} />}
        </div>
      </div>
      <nav
        className={cn(
          'mx-auto flex w-full max-w-[1780px] min-w-0 gap-1 overflow-x-auto overscroll-x-contain border-t px-3 [scrollbar-width:none] sm:px-5 lg:px-8 [&::-webkit-scrollbar]:hidden',
          isAtlas ? 'border-white/10 xl:hidden' : 'border-border 2xl:hidden',
        )}
        aria-label="Primary navigation"
      >
        <NavItems items={navigation} variant={variant} />
      </nav>
    </header>
  );
}

function NavItems({ items, variant }: { items: readonly NavigationItem[]; variant: TopNavVariant }): JSX.Element {
  const isAtlas = variant === 'atlas';

  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/'}
          className={({ isActive }) =>
            cn(
              'relative whitespace-nowrap px-3 py-3 text-sm font-medium transition sm:px-4',
              isAtlas ? 'text-white/56 hover:text-white xl:py-6' : 'text-muted-foreground hover:text-foreground xl:py-7',
              isActive &&
                (isAtlas
                  ? 'text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-blue-300 after:shadow-[0_0_16px_rgba(147,197,253,0.75)] sm:after:left-4 sm:after:right-4'
                  : 'text-accent after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-accent sm:after:left-4 sm:after:right-4'),
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );
}
