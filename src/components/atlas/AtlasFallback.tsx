import { ArrowRight, BookOpen, Cloud, Cpu, Database, Factory, Mountain, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { AtlasInsight, AtlasStage } from './atlasStages';

const iconMap = [Cloud, Cpu, Network, Factory, Mountain] as const;
const stageSubtitles = ['Where intelligence is built', 'The silicon behind the surge', 'The backbone of scale', 'Fueling performance', 'Physical inputs that start it all'];

export function getFallbackMarkerPosition(index: number, total: number): { leftPercent: number } {
  if (total <= 1) return { leftPercent: 50 };

  const min = 14;
  const max = 86;
  const step = (max - min) / (total - 1);
  return { leftPercent: Math.round(min + index * step) };
}

export function AtlasFallback({
  stages,
  insight,
  reducedMotion = false,
  fallbackReason,
}: {
  stages: AtlasStage[];
  insight?: AtlasInsight;
  reducedMotion?: boolean;
  fallbackReason?: string;
}): JSX.Element {
  const resolvedFallbackReason = fallbackReason ?? (reducedMotion ? 'reduced motion enabled' : 'small viewport');
  const fallbackCopy = reducedMotion
    ? 'A static atlas view is shown because reduced motion is enabled.'
    : resolvedFallbackReason === 'small viewport'
      ? 'Explore the end-to-end AI supply chain through a lighter static view built for small screens.'
      : 'A static atlas view is shown while the full atlas is unavailable in this browser session.';

  return (
    <section
      className="mx-auto w-full max-w-4xl bg-white px-4 py-8 text-slate-950 sm:px-5 lg:px-8 xl:bg-transparent xl:text-white"
      aria-labelledby="atlas-fallback-title"
      data-atlas-render-mode="page-fallback"
      data-atlas-fallback-reason={resolvedFallbackReason}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 pb-8 xl:hidden">
        <div className="leading-tight">
          <p className="text-lg font-semibold uppercase tracking-[0.18em] text-blue-950">AI Supply Chain</p>
          <p className="text-sm font-medium uppercase tracking-[0.44em] text-slate-500">Explorer</p>
        </div>
        <button
          type="button"
          className="grid h-14 w-14 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          aria-label="Open navigation"
        >
          <span className="block h-4 w-6 bg-[linear-gradient(to_bottom,currentColor_0_2px,transparent_2px_7px,currentColor_7px_9px,transparent_9px_14px,currentColor_14px_16px)]" aria-hidden="true" />
        </button>
      </div>

      <div className="mx-auto mb-10 max-w-2xl xl:hidden" aria-label="Atlas progress">
        <div className="relative h-10">
          <div className="absolute left-[6%] right-[6%] top-3 h-px bg-slate-200" aria-hidden="true" />
          {stages.slice(0, 5).map((stage, index) => {
            const position = getFallbackMarkerPosition(index, stages.length);
            return (
              <div key={`top-progress-${stage.id}`} className="absolute -translate-x-1/2 text-center" style={{ left: `${position.leftPercent}%` }}>
                <span className={cn('mx-auto block h-4 w-4 rounded-full', index === 0 ? 'bg-blue-700 shadow-[0_0_0_5px_rgba(37,99,235,0.08)]' : 'bg-slate-300')} />
                <span className={cn('mt-2 block text-sm font-medium', index === 0 ? 'text-blue-800' : 'text-slate-500')}>{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <FallbackStagePreview stages={stages} />

      <div className="mt-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-800 xl:text-blue-300">The AI Supply Chain Atlas</p>
        <h1 id="atlas-fallback-title" className="mt-4 font-display text-5xl leading-[1.02] text-slate-950 sm:text-6xl xl:text-white">
          Understand the supply chain powering intelligence.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 xl:text-white/68">{fallbackCopy}</p>
      </div>

      <div className="mt-7 grid gap-3 sm:max-w-2xl sm:grid-cols-2 xl:flex xl:flex-wrap">
        <Link
          to="/supply-chain"
          className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-blue-700 px-5 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)] transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300/70 xl:w-auto xl:px-5 xl:py-3 xl:text-sm"
        >
          Explore the Atlas
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          to="/sources"
          className="inline-flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-blue-800 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300/70 xl:w-auto xl:border-white/18 xl:bg-white/[0.06] xl:px-5 xl:py-3 xl:text-sm xl:text-white/84"
        >
          Read the Overview
          <BookOpen className="h-5 w-5" />
        </Link>
      </div>

      {insight ? (
        <Link
          to="/sources"
          className="mt-6 flex max-w-2xl items-center gap-5 rounded-lg border border-slate-100 bg-white p-4 text-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-2 focus:ring-blue-300/70 xl:border-white/14 xl:bg-white/[0.08] xl:text-white"
        >
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[#f3eee8] text-blue-900 xl:bg-white/[0.08] xl:text-blue-200">
            <Database className="h-7 w-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-blue-800 xl:text-blue-300">Insight</span>
            <span className="mt-1 block font-display text-2xl leading-tight text-slate-950 xl:text-white">{insight.title}</span>
            <span className="mt-1 block text-sm text-slate-500 xl:text-white/60">Updated from current research sources</span>
          </span>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-blue-800 xl:bg-white/[0.08] xl:text-blue-200">
            <ArrowRight className="h-5 w-5" />
          </span>
        </Link>
      ) : null}

      <div className="mt-8" aria-labelledby="atlas-mobile-stages">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-900/70 xl:text-white/50">Explore the five stages</p>
        <h2 id="atlas-mobile-stages" className="sr-only">
          Explore the five stages
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {stages.map((stage, index) => {
            const Icon = iconMap[index] ?? Cloud;
            return (
              <Link
                key={stage.id}
                to={stage.href}
                className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-4 text-slate-950 shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300/70 xl:border-white/18 xl:bg-white/[0.08] xl:text-white"
                data-atlas-stage-card={stage.id}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-base font-semibold text-blue-800 xl:bg-white/[0.08] xl:text-blue-100">{index + 1}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-blue-800 xl:bg-white/[0.08]" style={{ color: stage.scene.accent }}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold leading-tight">{stage.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-slate-500 xl:text-white/60">{stageSubtitles[index] ?? stage.shortTitle}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 xl:text-white/45" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FallbackStagePreview({ stages }: { stages: AtlasStage[] }): JSX.Element {
  return (
    <div className="relative mx-auto min-h-[230px] max-w-2xl xl:hidden" data-atlas-progress-rail="fallback">
      <svg className="absolute inset-x-4 top-[44%] h-16 w-[calc(100%-2rem)] text-sky-300" viewBox="0 0 100 35" preserveAspectRatio="none" aria-hidden="true">
        <path d="M7 21 C20 8 28 28 40 16 C53 5 60 26 72 16 C82 8 88 21 95 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M7 21 C20 8 28 28 40 16 C53 5 60 26 72 16 C82 8 88 21 95 12" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
      </svg>
      {stages.slice(0, 5).map((stage, index) => {
        const Icon = iconMap[index] ?? Cloud;
        const leftPercent = [14, 32, 50, 68, 86][index] ?? 50;
        const topClass = index % 2 === 0 ? 'top-12' : 'top-20';
        return (
          <div key={stage.id} className={cn('absolute -translate-x-1/2', topClass)} style={{ left: `${leftPercent}%` }} aria-label={`${stage.step} ${stage.title}`}>
            <span className="mx-auto mb-3 grid h-7 w-7 place-items-center rounded-full border border-blue-700 bg-white text-sm font-semibold text-blue-900 shadow-[0_8px_22px_rgba(37,99,235,0.12)]">
              {index + 1}
            </span>
            <span className="relative grid h-20 w-24 place-items-center">
              <span className="absolute inset-x-2 bottom-0 h-10 -skew-x-12 rounded-md border border-slate-200 bg-white shadow-[0_18px_30px_rgba(15,23,42,0.14)]" />
              <span className="absolute inset-x-4 bottom-3 h-11 -skew-x-12 rounded-md bg-slate-100" />
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-blue-50" style={{ color: stage.scene.accent }}>
                <Icon className="h-7 w-7" />
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
