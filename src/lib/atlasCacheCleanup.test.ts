import { describe, expect, it, vi } from 'vitest';
import {
  cleanupLegacyAtlasCaches,
  getAtlasRelatedLocalStorageKeys,
  isLegacyAtlasCacheKey,
  isLegacyAtlasRenderModeStorageKey,
} from './atlasCacheCleanup';

function makeStorage(keys: string[]): Storage {
  const currentKeys = [...keys];
  return {
    get length() {
      return currentKeys.length;
    },
    clear: vi.fn(),
    getItem: vi.fn(),
    key: (index: number) => currentKeys[index] ?? null,
    removeItem: vi.fn((key: string) => {
      const index = currentKeys.indexOf(key);
      if (index >= 0) currentKeys.splice(index, 1);
    }),
    setItem: vi.fn(),
  };
}

function makeRegistration(scope: string, scriptURL: string): { unregister: ReturnType<typeof vi.fn>; registration: ServiceWorkerRegistration } {
  const unregister = vi.fn().mockResolvedValue(true);
  return {
    unregister,
    registration: {
      scope,
      active: { scriptURL } as ServiceWorker,
      installing: null,
      waiting: null,
      unregister,
    } as unknown as ServiceWorkerRegistration,
  };
}

describe('atlasCacheCleanup', () => {
  it('identifies only app-related legacy cache names', () => {
    expect(isLegacyAtlasCacheKey('ai-supply-chain-precache-v1')).toBe(true);
    expect(isLegacyAtlasCacheKey('atlas-runtime-cache')).toBe(true);
    expect(isLegacyAtlasCacheKey('workbox-precache-v2')).toBe(false);
    expect(isLegacyAtlasCacheKey('workbox-precache-v2', { allowGenericWorkerCache: true })).toBe(true);
    expect(isLegacyAtlasCacheKey('third-party-cache')).toBe(false);
  });

  it('unregisters only legacy app service workers and deletes matching app caches', async () => {
    const appWorker = makeRegistration('https://example.com/', 'https://example.com/service-worker.js');
    const unrelatedWorker = makeRegistration('https://example.com/docs/', 'https://example.com/docs/service-worker.js');
    const deletedCacheKeys: string[] = [];
    const storage = makeStorage(['atlas-mode', 'ai-supply-chain-theme', 'random']);
    const result = await cleanupLegacyAtlasCaches({
      navigator: {
        serviceWorker: {
          controller: {} as ServiceWorker,
          getRegistrations: async () => [appWorker.registration, unrelatedWorker.registration],
        },
      },
      localStorage: storage,
      caches: {
        keys: async () => ['ai-supply-chain-precache-v1', 'third-party-cache', 'workbox-precache-v2'],
        delete: async (key: string) => {
          deletedCacheKeys.push(key);
          return true;
        },
      },
    });

    expect(appWorker.unregister).toHaveBeenCalledTimes(1);
    expect(unrelatedWorker.unregister).not.toHaveBeenCalled();
    expect(result.serviceWorkerSupported).toBe(true);
    expect(result.serviceWorkerControlled).toBe(true);
    expect(result.registrationsFound).toBe(2);
    expect(result.registrationsUnregistered).toBe(1);
    expect(result.deletedCacheKeys).toEqual(['ai-supply-chain-precache-v1', 'workbox-precache-v2']);
    expect(result.retainedCacheKeys).toEqual(['third-party-cache']);
    expect(deletedCacheKeys).toEqual(['ai-supply-chain-precache-v1', 'workbox-precache-v2']);
    expect(result.removedLocalStorageKeys).toEqual(['atlas-mode']);
    expect(getAtlasRelatedLocalStorageKeys(storage)).toEqual(['ai-supply-chain-theme']);
  });

  it('no-ops when service worker and CacheStorage are unavailable', async () => {
    const result = await cleanupLegacyAtlasCaches({});

    expect(result.serviceWorkerSupported).toBe(false);
    expect(result.cacheStorageSupported).toBe(false);
    expect(result.deletedCacheKeys).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('reports atlas-related localStorage keys for diagnostics', () => {
    expect(getAtlasRelatedLocalStorageKeys(makeStorage(['atlas-mode', 'ai-supply-chain-theme', 'random']))).toEqual([
      'ai-supply-chain-theme',
      'atlas-mode',
    ]);
    expect(isLegacyAtlasRenderModeStorageKey('atlas-mode')).toBe(true);
    expect(isLegacyAtlasRenderModeStorageKey('ai-supply-chain-theme')).toBe(false);
  });
});
