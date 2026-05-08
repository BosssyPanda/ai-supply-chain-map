import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { AtlasStage } from './atlasStages';

export function AtlasProgressRail({
  stages,
  activeId,
  progress = 0,
  isHandoff = false,
}: {
  stages: AtlasStage[];
  activeId?: string;
  progress?: number;
  isHandoff?: boolean;
}): JSX.Element {
  return (
    <aside className="hidden min-h-[680px] border-l border-white/10 pl-7 xl:block" aria-label="Atlas journey">
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Your Journey</p>
      <div className="relative">
        <span
          className="absolute left-[11px] top-3 w-px rounded-full bg-gradient-to-b from-blue-300 via-cyan-200 to-amber-200 shadow-[0_0_18px_rgba(96,165,250,0.36)] transition-[height] duration-300"
          style={{ height: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
          aria-hidden="true"
        />
        <ol className="relative space-y-7 before:absolute before:left-[11px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-white/18">
          {stages.map((stage) => {
            const isActive = stage.id === activeId;
            return (
              <li key={stage.id} className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-4">
                <span
                  className={cn(
                    'relative z-10 mt-0.5 grid h-6 w-6 place-items-center rounded-full border bg-[#07111f] text-[10px] font-semibold',
                    isActive
                      ? 'border-blue-200 text-white shadow-[0_0_24px_rgba(96,165,250,0.52)]'
                      : 'border-white/25 text-white/50',
                  )}
                >
                  {stage.step}
                </span>
                <Link
                  to={stage.href}
                  aria-current={isActive ? 'step' : undefined}
                  className={cn('rounded-sm text-sm leading-5 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300/50', isActive ? 'text-white' : 'text-white/48')}
                >
                  {stage.title}
                </Link>
              </li>
            );
          })}
          <li className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-4">
            <span
              className={cn(
                'relative z-10 mt-0.5 grid h-6 w-6 place-items-center rounded-full border bg-[#07111f] text-[10px] font-semibold',
                isHandoff ? 'border-amber-200 text-white shadow-[0_0_24px_rgba(245,158,11,0.48)]' : 'border-white/25 text-white/50',
              )}
            >
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <a
              href="#atlas-report-content"
              aria-current={isHandoff ? 'step' : undefined}
              className={cn('rounded-sm text-sm leading-5 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200/50', isHandoff ? 'text-white' : 'text-white/48')}
            >
              Report content
            </a>
          </li>
        </ol>
      </div>
      <Link to="/supply-chain" className="mt-8 inline-flex rounded-sm text-sm font-semibold text-white/55 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300/50">
        Explore full graph
      </Link>
    </aside>
  );
}
