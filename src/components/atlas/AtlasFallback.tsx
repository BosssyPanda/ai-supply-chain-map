import { ArrowRight, Cloud, Cpu, Factory, Mountain, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { AtlasStage } from './atlasStages';
import { AtlasStageCard } from './AtlasStageCard';

const iconMap = [Cloud, Cpu, Network, Factory, Mountain] as const;

export function AtlasFallback({ stages, reducedMotion = false }: { stages: AtlasStage[]; reducedMotion?: boolean }): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-5 lg:px-8" aria-labelledby="atlas-fallback-title">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-300">Immersive Supply-Chain Atlas</p>
        <h1 id="atlas-fallback-title" className="mt-4 font-display text-4xl leading-[1.05] text-white sm:text-5xl">
          Understand the supply chain powering intelligence.
        </h1>
        <p className="mt-4 text-base leading-7 text-white/68">
          {reducedMotion
            ? 'A static atlas view is shown because reduced motion is enabled.'
            : 'Explore the end-to-end AI supply chain through a lighter static view built for small screens.'}
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-white/12 bg-[#07111f]/72 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.38)]">
        <div className="relative mx-auto min-h-[220px] max-w-xl">
          <div className="absolute left-7 right-7 top-[48%] h-1 rounded-full bg-gradient-to-r from-blue-300/25 via-cyan-200/75 to-amber-200/70 shadow-[0_0_22px_rgba(96,165,250,0.34)]" />
          {stages.map((stage, index) => {
            const Icon = iconMap[index] ?? Cloud;
            return (
              <div
                key={stage.id}
                className={cn(
                  'absolute grid h-20 w-20 -translate-x-1/2 place-items-center rounded-lg border border-white/14 bg-white/[0.08] text-white shadow-[0_16px_45px_rgba(2,6,23,0.34)] backdrop-blur',
                  index % 2 === 0 ? 'top-6' : 'bottom-6',
                )}
                style={{ left: `${10 + index * 20}%` }}
              >
                <span className="absolute -top-3 grid h-7 w-7 place-items-center rounded-full border border-blue-200/40 bg-[#07111f] text-xs font-semibold text-blue-100">
                  {stage.step}
                </span>
                <Icon className="h-8 w-8" style={{ color: stage.scene.accent }} />
              </div>
            );
          })}
        </div>
      </div>

      <Link
        to="/supply-chain"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)] transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300/70 sm:w-auto"
      >
        Open supply-chain graph
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-8" aria-labelledby="atlas-mobile-stages">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Atlas Journey</p>
        <h2 id="atlas-mobile-stages" className="mt-1 font-display text-2xl leading-tight text-white">
          Explore the five stages
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {stages.map((stage) => (
            <AtlasStageCard key={stage.id} stage={stage} compact linked={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
