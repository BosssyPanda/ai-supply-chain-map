import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { loadExplorerData } from '../data/loaders';
import { AtlasDebugOverlay } from '../components/atlas/AtlasDebugOverlay';
import { AtlasFallback } from '../components/atlas/AtlasFallback';
import { getAtlasInsight, getAtlasStages } from '../components/atlas/atlasStages';

const AtlasConceptPage = lazy(() => import('../components/atlas/AtlasConceptPage').then((module) => ({ default: module.AtlasConceptPage })));
const routeFallbackData = loadExplorerData();
const routeFallbackStages = getAtlasStages(routeFallbackData);
const routeFallbackInsight = getAtlasInsight(routeFallbackData);
const routeLoadFailureReason = 'atlas route failed to load';

export function AtlasRouteFallback({ reason = routeLoadFailureReason }: { reason?: string }): JSX.Element {
  return (
    <div className="min-h-screen bg-white text-slate-950 xl:bg-[#030814] xl:text-white">
      <AtlasFallback stages={routeFallbackStages} insight={routeFallbackInsight} fallbackReason={reason} />
      <AtlasDebugOverlay mode="page-fallback" fallbackReason={reason} />
    </div>
  );
}

class AtlasRouteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('[Atlas] Route chunk failed to load; rendering atlas fallback.', { error, componentStack: errorInfo.componentStack });
  }

  render(): ReactNode {
    if (this.state.hasError) return <AtlasRouteFallback />;
    return this.props.children;
  }
}

export function AtlasRoute(): JSX.Element {
  return (
    <AtlasRouteErrorBoundary>
      <Suspense
        fallback={
          <AtlasRouteFallback reason="atlas route loading" />
        }
      >
        <AtlasConceptPage />
      </Suspense>
    </AtlasRouteErrorBoundary>
  );
}
