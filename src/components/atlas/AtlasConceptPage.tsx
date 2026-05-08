import { useReducedMotion } from 'motion/react';
import { loadExplorerData } from '../../data/loaders';
import { AtlasFallback } from './AtlasFallback';
import { AtlasHeroShell } from './AtlasHeroShell';
import { AtlasProgressRail } from './AtlasProgressRail';
import { AtlasScrollController } from './AtlasScrollController';
import { AtlasStageCard } from './AtlasStageCard';
import { getAtlasInsight, getAtlasStages } from './atlasStages';

const data = loadExplorerData();

export function AtlasConceptPage(): JSX.Element {
  const stages = getAtlasStages(data);
  const insight = getAtlasInsight(data);
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#030814] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_28%_18%,rgba(37,99,235,0.2),transparent_30%),radial-gradient(circle_at_80%_42%,rgba(245,158,11,0.12),transparent_26%),linear-gradient(180deg,#07111f_0%,#08111d_48%,#030814_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white/10 to-transparent" />

      {!prefersReducedMotion ? (
        <div className="hidden lg:block">
          <AtlasScrollController stages={stages}>
            {(scrollState) => (
              <div className="mx-auto grid w-full max-w-[1780px] gap-8 px-5 lg:px-8 xl:grid-cols-[minmax(0,1fr)_260px]">
                <AtlasHeroShell stages={stages} insight={insight} scrollState={scrollState} />
                <AtlasProgressRail stages={stages} activeId={scrollState.activeStage?.id} progress={scrollState.progress} isHandoff={scrollState.isHandoff} />
              </div>
            )}
          </AtlasScrollController>
        </div>
      ) : null}

      <div className={prefersReducedMotion ? 'block' : 'lg:hidden'}>
        <AtlasFallback stages={stages} reducedMotion={prefersReducedMotion} />
      </div>

      <section id="atlas-report-content" className="mx-auto hidden w-full max-w-[1780px] px-5 pb-20 pt-6 lg:block lg:px-8" aria-labelledby="atlas-stage-cards">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Report continuation</p>
            <h2 id="atlas-stage-cards" className="mt-1 font-display text-3xl leading-tight text-white">
              Five stages, one dependency map
            </h2>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-5">
          {stages.map((stage) => (
            <AtlasStageCard key={stage.id} stage={stage} />
          ))}
        </div>
      </section>
    </div>
  );
}
