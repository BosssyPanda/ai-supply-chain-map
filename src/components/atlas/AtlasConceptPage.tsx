import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { loadExplorerData } from '../../data/loaders';
import { AtlasDebugOverlay } from './AtlasDebugOverlay';
import { AtlasFallback } from './AtlasFallback';
import { AtlasHeroShell } from './AtlasHeroShell';
import { AtlasProgressRail } from './AtlasProgressRail';
import { AtlasScrollController } from './AtlasScrollController';
import { AtlasStageCard } from './AtlasStageCard';
import { getAtlasInsight, getAtlasStages } from './atlasStages';

const data = loadExplorerData();
export const atlasDesktopViewportQuery = '(min-width: 1280px)';

export function shouldRenderDesktopAtlas({
  isLargeViewport,
  prefersReducedMotion,
}: {
  isLargeViewport: boolean;
  prefersReducedMotion: boolean;
}): boolean {
  return isLargeViewport && !prefersReducedMotion;
}

export function AtlasConceptPage(): JSX.Element {
  const stages = getAtlasStages(data);
  const insight = getAtlasInsight(data);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isLargeViewport = useIsLargeAtlasViewport();
  const renderDesktopAtlas = shouldRenderDesktopAtlas({ isLargeViewport, prefersReducedMotion });
  const pageFallbackReason = prefersReducedMotion ? 'reduced motion enabled' : 'small viewport';

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-white text-slate-950 xl:bg-[#030814] xl:text-white">
      {renderDesktopAtlas ? (
        <>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_28%_18%,rgba(37,99,235,0.2),transparent_30%),radial-gradient(circle_at_80%_42%,rgba(245,158,11,0.12),transparent_26%),linear-gradient(180deg,#07111f_0%,#08111d_48%,#030814_100%)]" />
          <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white/10 to-transparent" />
        </>
      ) : null}

      {renderDesktopAtlas ? (
        <div>
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

      {!renderDesktopAtlas ? (
        <>
          <AtlasFallback stages={stages} insight={insight} reducedMotion={prefersReducedMotion} fallbackReason={pageFallbackReason} />
          <AtlasDebugOverlay mode="page-fallback" fallbackReason={pageFallbackReason} />
        </>
      ) : null}

      <section id="atlas-report-content" className="mx-auto hidden w-full max-w-[1780px] px-5 pb-20 pt-6 lg:px-8 xl:block" aria-labelledby="atlas-stage-cards">
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

function useIsLargeAtlasViewport(): boolean {
  const [isLargeViewport, setIsLargeViewport] = useState(() => getIsLargeAtlasViewport());

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(atlasDesktopViewportQuery);
    if (!mediaQuery) return undefined;

    const updateViewport = () => setIsLargeViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  return isLargeViewport;
}

function getIsLargeAtlasViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(atlasDesktopViewportQuery).matches;
}
