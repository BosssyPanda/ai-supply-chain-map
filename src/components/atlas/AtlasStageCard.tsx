import { ArrowRight, Cloud, Cpu, Factory, Mountain, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { AtlasStage } from './atlasStages';

const iconMap = {
  cloud: Cloud,
  chip: Cpu,
  network: Network,
  power: Factory,
  materials: Mountain,
} satisfies Record<AtlasStage['icon'], typeof Cloud>;

const toneClass = {
  blue: 'border-blue-400/35 bg-blue-500/10 text-blue-200 dark:border-blue-300/30 dark:bg-blue-400/10 dark:text-blue-100',
  indigo: 'border-indigo-400/35 bg-indigo-500/10 text-indigo-200 dark:border-indigo-300/30 dark:bg-indigo-400/10 dark:text-indigo-100',
  cyan: 'border-cyan-400/35 bg-cyan-500/10 text-cyan-200 dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-100',
  amber: 'border-amber-400/40 bg-amber-500/10 text-amber-200 dark:border-amber-300/35 dark:bg-amber-400/10 dark:text-amber-100',
  slate: 'border-slate-300/35 bg-slate-500/10 text-slate-200 dark:border-slate-200/25 dark:bg-slate-300/10 dark:text-slate-100',
} satisfies Record<AtlasStage['tone'], string>;

export function AtlasStageCard({ stage, compact = false, linked = true }: { stage: AtlasStage; compact?: boolean; linked?: boolean }): JSX.Element {
  const Icon = iconMap[stage.icon];
  const className = cn(
    'group flex h-full flex-col rounded-lg border border-white/18 bg-white/[0.08] p-4 text-white shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl transition dark:border-white/12',
    linked ? 'hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-blue-300/50' : '',
    compact ? 'gap-3' : 'gap-4',
  );
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg border', toneClass[stage.tone])}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{stage.step}</p>
            <h3 className="text-base font-semibold leading-tight text-white">{stage.title}</h3>
          </div>
        </div>
        {linked ? <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white" /> : null}
      </div>
      <p className="text-sm leading-6 text-white/68">{stage.description}</p>
      {!compact ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {stage.keyEnablers.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/70">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );

  if (!linked) {
    return (
      <article className={className} data-atlas-stage-card={stage.id}>
        {content}
      </article>
    );
  }

  return (
    <Link to={stage.href} className={className} data-atlas-stage-card={stage.id}>
      {content}
    </Link>
  );
}
