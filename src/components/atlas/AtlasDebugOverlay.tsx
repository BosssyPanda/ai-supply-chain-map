import { useEffect, useState } from 'react';
import { getAtlasRelatedLocalStorageKeys, type AtlasCacheCleanupResult } from '../../lib/atlasCacheCleanup';
import { getAppBuildInfo, type AppBuildInfo } from '../../lib/buildInfo';
import { probeAtlasWebGL, type AtlasWebGLProbe } from '../../lib/atlasWebGL';

export type AtlasRenderMode = 'webgl' | 'canvas-fallback' | 'page-fallback';

interface AtlasDebugRuntime {
  document?: Document;
  location?: Pick<Location, 'pathname' | 'search'>;
  localStorage?: Storage;
  matchMedia?: Window['matchMedia'];
  navigator?: {
    userAgent?: string;
    serviceWorker?: {
      controller?: ServiceWorker | null;
    };
  };
  __ATLAS_CACHE_CLEANUP_RESULT__?: AtlasCacheCleanupResult;
}

export interface AtlasDebugSnapshot {
  buildInfo: AppBuildInfo;
  route: string;
  mode: AtlasRenderMode;
  fallbackReason?: string;
  detail?: string;
  webGLProbe: AtlasWebGLProbe;
  prefersReducedMotion: boolean;
  serviceWorkerControlled: boolean;
  cleanupResult?: AtlasCacheCleanupResult;
  atlasLocalStorageKeys: string[];
  userAgentSummary: string;
}

function getRuntime(): AtlasDebugRuntime | undefined {
  if (typeof window === 'undefined') return undefined;
  return window;
}

export function isAtlasDebugEnabled(search = getRuntime()?.location?.search ?? ''): boolean {
  return new URLSearchParams(search).get('atlasDebug') === '1';
}

export function summarizeUserAgent(userAgent = getRuntime()?.navigator?.userAgent ?? 'unknown'): string {
  const browser = userAgent.match(/(Firefox|Edg|Chrome|Safari)\/[\d.]+/)?.[0] ?? 'unknown browser';
  const platform = userAgent.match(/\(([^)]+)\)/)?.[1]?.split(';').slice(0, 2).join(';').trim() ?? 'unknown platform';
  return `${browser} / ${platform}`;
}

export function collectAtlasDebugSnapshot({
  mode,
  fallbackReason,
  detail,
  webGLProbe,
  runtime = getRuntime(),
}: {
  mode: AtlasRenderMode;
  fallbackReason?: string;
  detail?: string;
  webGLProbe?: AtlasWebGLProbe | null;
  runtime?: AtlasDebugRuntime;
}): AtlasDebugSnapshot {
  const reducedMotionQuery = runtime?.matchMedia?.('(prefers-reduced-motion: reduce)');

  return {
    buildInfo: getAppBuildInfo(),
    route: `${runtime?.location?.pathname ?? 'unknown'}${runtime?.location?.search ?? ''}`,
    mode,
    fallbackReason,
    detail,
    webGLProbe: webGLProbe ?? probeAtlasWebGL(runtime?.document),
    prefersReducedMotion: Boolean(reducedMotionQuery?.matches),
    serviceWorkerControlled: Boolean(runtime?.navigator?.serviceWorker?.controller),
    cleanupResult: runtime?.__ATLAS_CACHE_CLEANUP_RESULT__,
    atlasLocalStorageKeys: getAtlasRelatedLocalStorageKeys(runtime?.localStorage),
    userAgentSummary: summarizeUserAgent(runtime?.navigator?.userAgent),
  };
}

function summarizeCleanupResult(result: AtlasCacheCleanupResult | undefined): string {
  if (!result) return 'pending';

  const workerLabel = result.registrationsUnregistered === 1 ? 'worker' : 'workers';
  const cacheLabel = result.deletedCacheKeys.length === 1 ? 'cache' : 'caches';
  const storageLabel = result.removedLocalStorageKeys.length === 1 ? 'storage key' : 'storage keys';
  return `${result.registrationsUnregistered} ${workerLabel} / ${result.deletedCacheKeys.length} ${cacheLabel} / ${result.removedLocalStorageKeys.length} ${storageLabel}`;
}

export function AtlasDebugOverlay({
  mode,
  fallbackReason,
  detail,
  webGLProbe,
}: {
  mode: AtlasRenderMode;
  fallbackReason?: string;
  detail?: string;
  webGLProbe?: AtlasWebGLProbe | null;
}): JSX.Element | null {
  const enabled = isAtlasDebugEnabled();
  const [snapshot, setSnapshot] = useState<AtlasDebugSnapshot | null>(() =>
    enabled ? collectAtlasDebugSnapshot({ mode, fallbackReason, detail, webGLProbe }) : null,
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const refresh = () => setSnapshot(collectAtlasDebugSnapshot({ mode, fallbackReason, detail, webGLProbe }));
    refresh();

    const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    reducedMotionQuery?.addEventListener('change', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      reducedMotionQuery?.removeEventListener('change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [detail, enabled, fallbackReason, mode, webGLProbe]);

  if (!enabled || !snapshot) return null;

  const localStorageKeys = snapshot.atlasLocalStorageKeys.length > 0 ? snapshot.atlasLocalStorageKeys.join(', ') : 'none';
  const webGLReason = snapshot.webGLProbe.reason ?? 'none';
  const cleanupSummary = summarizeCleanupResult(snapshot.cleanupResult);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[80] w-[min(22rem,calc(100vw-2rem))] rounded-md border border-white/16 bg-[#020817]/94 px-3 py-2 text-[11px] leading-5 text-white/80 shadow-[0_18px_55px_rgba(2,6,23,0.45)] backdrop-blur">
      <div className="font-semibold uppercase tracking-[0.18em] text-blue-200">Atlas render debug</div>
      <dl className="mt-1 grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-2 font-mono">
        <dt className="text-white/46">Build</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.buildId}</dd>
        <dt className="text-white/46">Built at</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.builtAt}</dd>
        <dt className="text-white/46">Version</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.version}</dd>
        <dt className="text-white/46">Commit</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.commit ?? 'none'}</dd>
        <dt className="text-white/46">Environment</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.environment}</dd>
        <dt className="text-white/46">Deployment</dt>
        <dd className="truncate text-white">{snapshot.buildInfo.deploymentId ?? 'none'}</dd>
        <dt className="text-white/46">Route</dt>
        <dd className="truncate text-white">{snapshot.route}</dd>
        <dt className="text-white/46">Render mode</dt>
        <dd className="text-white">{snapshot.mode}</dd>
        <dt className="text-white/46">WebGL status</dt>
        <dd className="text-white">{snapshot.webGLProbe.status}</dd>
        <dt className="text-white/46">WebGL supported</dt>
        <dd className="text-white">{String(snapshot.webGLProbe.supported)}</dd>
        <dt className="text-white/46">WebGL context</dt>
        <dd className="text-white">{snapshot.webGLProbe.contextType ?? 'none'}</dd>
        <dt className="text-white/46">Reduced motion</dt>
        <dd className="text-white">{String(snapshot.prefersReducedMotion)}</dd>
        <dt className="text-white/46">SW controlled</dt>
        <dd className="text-white">{String(snapshot.serviceWorkerControlled)}</dd>
        <dt className="text-white/46">Cleanup</dt>
        <dd className="truncate text-white">{cleanupSummary}</dd>
        <dt className="text-white/46">Local storage</dt>
        <dd className="truncate text-white">{localStorageKeys}</dd>
        <dt className="text-white/46">User agent</dt>
        <dd className="truncate text-white">{snapshot.userAgentSummary}</dd>
      </dl>
      {snapshot.fallbackReason ? <div className="mt-1 text-white/64">Reason: {snapshot.fallbackReason}</div> : null}
      {webGLReason !== 'none' ? <div className="text-white/64">WebGL reason: {webGLReason}</div> : null}
      {snapshot.detail ? <div className="text-white/64">{snapshot.detail}</div> : null}
    </div>
  );
}
