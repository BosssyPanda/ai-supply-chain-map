import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { AtlasStage } from './atlasStages';

export type AtlasScrollPhase = 'overview' | 'focus' | 'handoff';

export interface AtlasScrollState {
  progress: number;
  activeIndex: number | null;
  activeStage: AtlasStage | null;
  isOverview: boolean;
  isHandoff: boolean;
  phase: AtlasScrollPhase;
}

export function AtlasScrollController({
  stages,
  children,
}: {
  stages: AtlasStage[];
  children: (state: AtlasScrollState) => ReactNode;
}): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState<AtlasScrollState>(() => getAtlasScrollState(0, stages));

  const updateState = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    const walked = Math.min(Math.max(-rect.top, 0), scrollable);
    const progress = walked / scrollable;
    const nextState = getAtlasScrollState(progress, stages);

    setState((current) => {
      if (
        Math.abs(current.progress - nextState.progress) < 0.004 &&
        current.activeIndex === nextState.activeIndex &&
        current.phase === nextState.phase
      ) {
        return current;
      }
      return nextState;
    });
  }, [stages]);

  useEffect(() => {
    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateState();
      });
    };

    updateState();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateState]);

  return (
    <section ref={sectionRef} className="relative min-h-[520vh]" aria-label="Immersive atlas scroll journey">
      <div className="sticky top-[7.75rem] flex min-h-[calc(100vh-7.75rem)] items-start pb-4 pt-4 lg:pt-6 xl:top-20 xl:min-h-[calc(100vh-5rem)]">
        {children(state)}
      </div>
    </section>
  );
}

export function getAtlasScrollState(progress: number, stages: AtlasStage[]): AtlasScrollState {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const isOverview = clampedProgress < 0.12 || stages.length === 0;
  const isHandoff = clampedProgress >= 0.94 && stages.length > 0;
  const activeIndex = isOverview || isHandoff ? null : getActiveIndex(clampedProgress, stages.length);
  const phase: AtlasScrollPhase = isOverview ? 'overview' : isHandoff ? 'handoff' : 'focus';

  return {
    progress: clampedProgress,
    activeIndex,
    activeStage: activeIndex === null ? null : stages[activeIndex] ?? null,
    isOverview,
    isHandoff,
    phase,
  };
}

function getActiveIndex(progress: number, stageCount: number): number | null {
  if (stageCount === 0) return null;
  if (progress < 0.32) return 0;
  if (progress < 0.52) return Math.min(1, stageCount - 1);
  if (progress < 0.72) return Math.min(2, stageCount - 1);
  if (progress < 0.84) return Math.min(3, stageCount - 1);
  if (progress < 0.94) return Math.min(4, stageCount - 1);
  return null;
}
