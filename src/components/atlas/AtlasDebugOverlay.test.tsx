import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AtlasDebugOverlay, collectAtlasDebugSnapshot, isAtlasDebugEnabled } from './AtlasDebugOverlay';
import type { AtlasWebGLProbe } from '../../lib/atlasWebGL';

const availableWebGLProbe: AtlasWebGLProbe = {
  status: 'available',
  supported: true,
  contextType: 'webgl2',
  reason: null,
};

function makeStorage(keys: string[]): Storage {
  return {
    length: keys.length,
    clear: vi.fn(),
    getItem: vi.fn(),
    key: (index: number) => keys[index] ?? null,
    removeItem: vi.fn(),
    setItem: vi.fn(),
  };
}

function makeDebugWindow(search: string): Window {
  return {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    location: {
      pathname: '/concept/atlas',
      search,
    },
    localStorage: makeStorage(['atlas-mode', 'unrelated-key']),
    matchMedia: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    navigator: {
      serviceWorker: {
        controller: null,
      },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    },
    __ATLAS_CACHE_CLEANUP_RESULT__: {
      serviceWorkerSupported: true,
      serviceWorkerControlled: false,
      registrationsFound: 1,
      registrationsUnregistered: 1,
      cacheStorageSupported: true,
      cacheKeys: ['ai-supply-chain-precache-v1'],
      deletedCacheKeys: ['ai-supply-chain-precache-v1'],
      retainedCacheKeys: ['third-party-cache'],
      removedLocalStorageKeys: ['atlas-mode'],
      errors: [],
    },
  } as unknown as Window;
}

describe('AtlasDebugOverlay', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is enabled only by the atlasDebug query param', () => {
    expect(isAtlasDebugEnabled('?atlasDebug=1')).toBe(true);
    expect(isAtlasDebugEnabled('?atlasDebug=0')).toBe(false);
    expect(isAtlasDebugEnabled('')).toBe(false);
  });

  it('collects route, build, WebGL, motion, service worker, storage, and user-agent diagnostics', () => {
    const snapshot = collectAtlasDebugSnapshot({
      mode: 'webgl',
      webGLProbe: availableWebGLProbe,
      runtime: makeDebugWindow('?atlasDebug=1'),
    });

    expect(snapshot.route).toBe('/concept/atlas?atlasDebug=1');
    expect(snapshot.mode).toBe('webgl');
    expect(snapshot.webGLProbe.supported).toBe(true);
    expect(snapshot.webGLProbe.contextType).toBe('webgl2');
    expect(snapshot.prefersReducedMotion).toBe(false);
    expect(snapshot.serviceWorkerControlled).toBe(false);
    expect(snapshot.atlasLocalStorageKeys).toEqual(['atlas-mode']);
    expect(snapshot.buildInfo.buildId).toBeTruthy();
    expect(snapshot.cleanupResult?.registrationsUnregistered).toBe(1);
    expect(snapshot.cleanupResult?.deletedCacheKeys).toEqual(['ai-supply-chain-precache-v1']);
    expect(snapshot.userAgentSummary).toContain('Chrome');
  });

  it('renders the debug panel with required fields only when requested', () => {
    vi.stubGlobal('window', makeDebugWindow('?atlasDebug=1'));

    const html = renderToStaticMarkup(createElement(AtlasDebugOverlay, { mode: 'webgl', webGLProbe: availableWebGLProbe }));

    expect(html).toContain('Atlas render debug');
    expect(html).toContain('Build');
    expect(html).toContain('Built at');
    expect(html).toContain('Version');
    expect(html).toContain('Commit');
    expect(html).toContain('Environment');
    expect(html).toContain('Deployment');
    expect(html).toContain('/concept/atlas?atlasDebug=1');
    expect(html).toContain('Render mode');
    expect(html).toContain('WebGL status');
    expect(html).toContain('WebGL supported');
    expect(html).toContain('Reduced motion');
    expect(html).toContain('SW controlled');
    expect(html).toContain('Cleanup');
    expect(html).toContain('1 worker / 1 cache / 1 storage key');
    expect(html).toContain('Local storage');
    expect(html).toContain('atlas-mode');
    expect(html).toContain('User agent');
    expect(html).toContain('Chrome');
  });

  it('does not render without the debug query param', () => {
    vi.stubGlobal('window', makeDebugWindow(''));

    const html = renderToStaticMarkup(createElement(AtlasDebugOverlay, { mode: 'webgl', webGLProbe: availableWebGLProbe }));

    expect(html).toBe('');
  });
});
