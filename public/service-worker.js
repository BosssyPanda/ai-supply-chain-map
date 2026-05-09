const legacyAtlasCachePatterns = [/ai-supply-chain/i, /supply-chain/i, /atlas/i, /workbox/i, /vite-pwa/i, /^precache-/i, /^runtime-/i];

async function clearLegacyAtlasCaches() {
  if (!self.caches?.keys || !self.caches.delete) return;

  const cacheKeys = await self.caches.keys();
  await Promise.all(
    cacheKeys
      .filter((cacheKey) => legacyAtlasCachePatterns.some((pattern) => pattern.test(cacheKey)))
      .map((cacheKey) => self.caches.delete(cacheKey)),
  );
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(clearLegacyAtlasCaches());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await clearLegacyAtlasCaches();
      await self.registration.unregister();
      await self.clients.claim();
    })(),
  );
});
