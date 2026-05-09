export interface AtlasCacheCleanupRuntime {
  navigator?: {
    serviceWorker?: {
      controller?: ServiceWorker | null;
      getRegistrations?: () => Promise<ReadonlyArray<AtlasServiceWorkerRegistration>>;
    };
  };
  localStorage?: Storage;
  caches?: {
    keys: () => Promise<string[]>;
    delete: (key: string) => Promise<boolean>;
  };
}

interface AtlasServiceWorkerRegistration {
  scope?: string;
  active?: { scriptURL?: string } | null;
  installing?: { scriptURL?: string } | null;
  waiting?: { scriptURL?: string } | null;
  unregister: () => Promise<boolean>;
}

export interface AtlasServiceWorkerCleanupDetail {
  scope: string;
  scriptURL: string | null;
  isLegacyAtlasRegistration: boolean;
  unregistered: boolean;
}

export interface AtlasCacheKeyOptions {
  allowGenericWorkerCache?: boolean;
}

export interface AtlasCacheCleanupResult {
  serviceWorkerSupported: boolean;
  serviceWorkerControlled: boolean;
  registrationsFound: number;
  registrationsUnregistered: number;
  registrationDetails: AtlasServiceWorkerCleanupDetail[];
  cacheStorageSupported: boolean;
  cacheKeys: string[];
  deletedCacheKeys: string[];
  retainedCacheKeys: string[];
  removedLocalStorageKeys: string[];
  errors: string[];
}

const appSpecificCachePatterns = [/ai-supply-chain/i, /supply-chain/i, /atlas/i];
const genericWorkerCachePatterns = [/workbox/i, /vite-pwa/i, /^precache-/i, /^runtime-/i];
const appSpecificWorkerPatterns = [/ai-supply-chain/i, /supply-chain/i, /atlas/i];
const rootWorkerScriptPattern = /\/(?:service-worker|sw)\.js(?:$|[?#])/i;
const atlasStorageKeyPattern = /atlas|ai-supply-chain|supply-chain/i;
const legacyAtlasRenderModeStorageKeyPatterns = [
  /^atlas-mode$/i,
  /^atlas-render-mode$/i,
  /^atlasRenderMode$/,
  /^atlas:renderMode$/i,
  /^ai-supply-chain-atlas-render-mode$/i,
  /^ai-supply-chain-render-mode$/i,
  /^supply-chain-atlas-render-mode$/i,
];

function getRuntime(): AtlasCacheCleanupRuntime | undefined {
  if (typeof window === 'undefined') return undefined;
  return window;
}

export function isLegacyAtlasCacheKey(cacheKey: string, options: AtlasCacheKeyOptions = {}): boolean {
  if (appSpecificCachePatterns.some((pattern) => pattern.test(cacheKey))) return true;
  return Boolean(options.allowGenericWorkerCache && genericWorkerCachePatterns.some((pattern) => pattern.test(cacheKey)));
}

export function isAtlasRelatedStorageKey(storageKey: string): boolean {
  return atlasStorageKeyPattern.test(storageKey);
}

export function isLegacyAtlasRenderModeStorageKey(storageKey: string): boolean {
  return legacyAtlasRenderModeStorageKeyPatterns.some((pattern) => pattern.test(storageKey));
}

export function getAtlasRelatedLocalStorageKeys(storage: Storage | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): string[] {
  if (!storage) return [];

  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && isAtlasRelatedStorageKey(key)) keys.push(key);
  }

  return keys.sort();
}

function getStorageKeys(storage: Storage): string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key) keys.push(key);
  }
  return keys;
}

function removeLegacyAtlasRenderModeStorageKeys(storage: Storage | undefined): string[] {
  if (!storage) return [];

  const removedKeys: string[] = [];
  for (const key of getStorageKeys(storage)) {
    if (isLegacyAtlasRenderModeStorageKey(key)) {
      storage.removeItem(key);
      removedKeys.push(key);
    }
  }

  return removedKeys.sort();
}

function getRegistrationScriptURL(registration: AtlasServiceWorkerRegistration): string | null {
  return registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? registration.installing?.scriptURL ?? null;
}

function isRootScope(scope: string): boolean {
  if (scope === '/' || scope === '') return true;

  try {
    return new URL(scope).pathname === '/';
  } catch {
    return scope.endsWith('/');
  }
}

function isLegacyAtlasRegistration(registration: AtlasServiceWorkerRegistration): boolean {
  const scope = registration.scope ?? '';
  const scriptURL = getRegistrationScriptURL(registration) ?? '';
  const descriptor = `${scope} ${scriptURL}`;

  if (appSpecificWorkerPatterns.some((pattern) => pattern.test(descriptor))) return true;
  return isRootScope(scope) && rootWorkerScriptPattern.test(scriptURL);
}

export async function cleanupLegacyAtlasCaches(runtime: AtlasCacheCleanupRuntime | undefined = getRuntime()): Promise<AtlasCacheCleanupResult> {
  const serviceWorker = runtime?.navigator?.serviceWorker;
  const cacheStorage = runtime?.caches;
  const result: AtlasCacheCleanupResult = {
    serviceWorkerSupported: Boolean(serviceWorker?.getRegistrations),
    serviceWorkerControlled: Boolean(serviceWorker?.controller),
    registrationsFound: 0,
    registrationsUnregistered: 0,
    registrationDetails: [],
    cacheStorageSupported: Boolean(cacheStorage?.keys && cacheStorage.delete),
    cacheKeys: [],
    deletedCacheKeys: [],
    retainedCacheKeys: [],
    removedLocalStorageKeys: [],
    errors: [],
  };
  let foundLegacyAtlasRegistration = false;

  if (serviceWorker?.getRegistrations) {
    try {
      const registrations = await serviceWorker.getRegistrations();
      result.registrationsFound = registrations.length;

      for (const registration of registrations) {
        const isLegacyRegistration = isLegacyAtlasRegistration(registration);
        foundLegacyAtlasRegistration = foundLegacyAtlasRegistration || isLegacyRegistration;
        let unregistered = false;

        if (isLegacyRegistration) {
          unregistered = await registration.unregister();
          if (unregistered) result.registrationsUnregistered += 1;
        }

        result.registrationDetails.push({
          scope: registration.scope ?? '',
          scriptURL: getRegistrationScriptURL(registration),
          isLegacyAtlasRegistration: isLegacyRegistration,
          unregistered,
        });
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (cacheStorage?.keys && cacheStorage.delete) {
    try {
      const cacheKeys = await cacheStorage.keys();
      result.cacheKeys = cacheKeys;
      const hasAppSpecificCache = cacheKeys.some((cacheKey) => isLegacyAtlasCacheKey(cacheKey));
      const allowGenericWorkerCache = foundLegacyAtlasRegistration || hasAppSpecificCache;

      for (const cacheKey of cacheKeys) {
        if (isLegacyAtlasCacheKey(cacheKey, { allowGenericWorkerCache })) {
          const deleted = await cacheStorage.delete(cacheKey);
          if (deleted) result.deletedCacheKeys.push(cacheKey);
        } else {
          result.retainedCacheKeys.push(cacheKey);
        }
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  try {
    result.removedLocalStorageKeys = removeLegacyAtlasRenderModeStorageKeys(runtime?.localStorage);
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error));
  }

  return result;
}
