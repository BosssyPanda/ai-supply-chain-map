export interface AppBuildInfo {
  version: string;
  buildId: string;
  builtAt: string;
  commit: string | null;
  deploymentId: string | null;
  environment: string;
}

const fallbackBuildInfo: AppBuildInfo = {
  version: '0.0.0',
  buildId: 'dev',
  builtAt: 'unknown',
  commit: null,
  deploymentId: null,
  environment: 'development',
};

export function getAppBuildInfo(): AppBuildInfo {
  if (typeof __APP_BUILD_INFO__ === 'undefined') return fallbackBuildInfo;

  return {
    ...fallbackBuildInfo,
    ...__APP_BUILD_INFO__,
    commit: __APP_BUILD_INFO__.commit || null,
    deploymentId: __APP_BUILD_INFO__.deploymentId || null,
  };
}

export function formatBuildMarker(buildInfo = getAppBuildInfo()): string {
  return `${buildInfo.version}:${buildInfo.buildId}:${buildInfo.builtAt}`;
}

export function ensureAppBuildMarker(documentRef: Document = document, buildInfo = getAppBuildInfo()): void {
  const marker = formatBuildMarker(buildInfo);
  documentRef.documentElement.dataset.appBuildId = buildInfo.buildId;
  documentRef.documentElement.dataset.appBuildAt = buildInfo.builtAt;
  documentRef.documentElement.dataset.appVersion = buildInfo.version;
  documentRef.documentElement.dataset.appEnvironment = buildInfo.environment;
  if (buildInfo.commit) {
    documentRef.documentElement.dataset.appCommit = buildInfo.commit;
  } else {
    delete documentRef.documentElement.dataset.appCommit;
  }
  if (buildInfo.deploymentId) {
    documentRef.documentElement.dataset.appDeploymentId = buildInfo.deploymentId;
  } else {
    delete documentRef.documentElement.dataset.appDeploymentId;
  }

  const existingMeta = documentRef.querySelector<HTMLMetaElement>('meta[name="ai-supply-chain-build"]');
  const meta = existingMeta ?? documentRef.createElement('meta');
  meta.name = 'ai-supply-chain-build';
  meta.content = marker;

  if (!existingMeta) {
    documentRef.head.appendChild(meta);
  }
}
