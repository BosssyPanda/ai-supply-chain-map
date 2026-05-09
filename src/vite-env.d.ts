/// <reference types="vite/client" />

declare module '*?raw' {
  const content: string;
  export default content;
}

interface AppBuildInfo {
  version: string;
  buildId: string;
  builtAt: string;
  commit: string | null;
  deploymentId: string | null;
  environment: string;
}

declare const __APP_BUILD_INFO__: AppBuildInfo;

interface Window {
  __ATLAS_CACHE_CLEANUP_RESULT__?: import('./lib/atlasCacheCleanup').AtlasCacheCleanupResult;
}
