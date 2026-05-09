export type AtlasRenderMode = 'webgl' | 'canvas-fallback' | 'page-fallback';

export function isAtlasDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('atlasDebug') === '1';
}

export function AtlasDebugOverlay({
  mode,
  fallbackReason,
  detail,
}: {
  mode: AtlasRenderMode;
  fallbackReason?: string;
  detail?: string;
}): JSX.Element | null {
  if (!isAtlasDebugEnabled()) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[80] max-w-xs rounded-md border border-white/16 bg-[#020817]/92 px-3 py-2 text-[11px] leading-5 text-white/80 shadow-[0_18px_55px_rgba(2,6,23,0.45)] backdrop-blur">
      <div className="font-semibold uppercase tracking-[0.18em] text-blue-200">Atlas render</div>
      <div className="mt-1 font-mono text-white">{mode}</div>
      {fallbackReason ? <div className="text-white/64">Reason: {fallbackReason}</div> : null}
      {detail ? <div className="text-white/64">{detail}</div> : null}
    </div>
  );
}
