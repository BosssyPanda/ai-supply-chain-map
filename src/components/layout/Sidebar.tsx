import {
  Bell,
  Building2,
  GitCompare,
  Globe2,
  Home,
  Network,
  Route,
  Star,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';

const navigation = [
  { label: 'Overview', href: '/', icon: Home },
  { label: 'Supply Chain', href: '/supply-chain', icon: Network },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Watchlist', href: '/watchlist', icon: Star },
  { label: 'Comparisons', href: '/comparisons', icon: GitCompare },
  { label: 'Alerts', href: '/alerts', icon: Bell },
];

const views = [
  { label: 'By Category', href: '/supply-chain?view=category', view: 'category', icon: Route },
  { label: 'By Geography', href: '/supply-chain?view=geography', view: 'geography', icon: Globe2 },
  { label: 'By Risk', href: '/supply-chain?view=risk', view: 'risk', icon: Bell },
  { label: 'Custom View', href: '/supply-chain?view=custom', view: 'custom', icon: Network },
];

export function Sidebar(): JSX.Element {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeView = location.pathname === '/supply-chain' ? params.get('view') ?? 'category' : '';

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-night-900/92 backdrop-blur xl:block">
      <div className="flex h-screen flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-blue-400/50 bg-blue-500/10 shadow-glowBlue">
            <Network className="h-5 w-5 text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">AI Supply Chain</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Explorer</p>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-5" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition',
                  'hover:bg-slate-800/70 hover:text-slate-100',
                  isActive && 'bg-blue-500/12 text-blue-300 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.22)]',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 border-t border-slate-800 pt-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Views</p>
          <div className="mt-3 space-y-1">
            {views.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-800/70 hover:text-slate-100',
                  activeView === item.view && 'bg-slate-800 text-blue-300',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mx-4 mt-auto border-t border-slate-800 py-5 text-xs text-slate-500">
          Research map only. No buy, sell, or price-target recommendations.
        </div>
      </div>
    </aside>
  );
}
