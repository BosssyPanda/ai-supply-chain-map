import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { cleanupLegacyAtlasCaches, type AtlasCacheCleanupResult } from './lib/atlasCacheCleanup';
import { ensureAppBuildMarker } from './lib/buildInfo';
import { router } from './router';
import './index.css';

ensureAppBuildMarker();

function exposeAtlasCacheCleanupResult(result: AtlasCacheCleanupResult): void {
  window.__ATLAS_CACHE_CLEANUP_RESULT__ = result;
}

void cleanupLegacyAtlasCaches()
  .then((result) => {
    exposeAtlasCacheCleanupResult(result);
    if (result.errors.length > 0) {
      console.warn('[Atlas] Legacy cache cleanup completed with errors.', result.errors);
    }
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    exposeAtlasCacheCleanupResult({
      serviceWorkerSupported: false,
      serviceWorkerControlled: false,
      registrationsFound: 0,
      registrationsUnregistered: 0,
      registrationDetails: [],
      cacheStorageSupported: false,
      cacheKeys: [],
      deletedCacheKeys: [],
      retainedCacheKeys: [],
      removedLocalStorageKeys: [],
      errors: [message],
    });
    console.warn('[Atlas] Legacy cache cleanup failed.', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
