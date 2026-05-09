import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: {
  env: Record<string, string | undefined>;
};

const buildTimestamp = new Date().toISOString();
const buildCommit = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? null;
const deploymentId = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_URL ?? null;
const deployedBuildId = deploymentId?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 16);
const buildId = deployedBuildId || buildCommit?.slice(0, 12) || `local-${buildTimestamp.replace(/[^0-9]/g, '').slice(0, 14)}`;
const appBuildInfo = {
  version: process.env.npm_package_version ?? '0.2.0',
  buildId,
  builtAt: buildTimestamp,
  commit: buildCommit,
  deploymentId,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
};

const lucideIconExports = {
  AlertCircle: 'alert-circle',
  AlertTriangle: 'alert-triangle',
  ArrowDownUp: 'arrow-down-up',
  ArrowLeft: 'arrow-left',
  ArrowRight: 'arrow-right',
  Beaker: 'beaker',
  Bell: 'bell',
  BookOpen: 'book-open',
  Bookmark: 'bookmark',
  Boxes: 'boxes',
  Building2: 'building-2',
  CalendarClock: 'calendar-clock',
  ChevronDown: 'chevron-down',
  Clock: 'clock',
  Cloud: 'cloud',
  Cpu: 'cpu',
  Database: 'database',
  DatabaseZap: 'database-zap',
  ExternalLink: 'external-link',
  Factory: 'factory',
  Filter: 'filter',
  FlaskConical: 'flask-conical',
  GitBranch: 'git-branch',
  Globe2: 'globe-2',
  HelpCircle: 'help-circle',
  Landmark: 'landmark',
  Layers3: 'layers-3',
  Map: 'map',
  Maximize2: 'maximize-2',
  Moon: 'moon',
  Mountain: 'mountain',
  Network: 'network',
  PackageOpen: 'package-open',
  RotateCcw: 'rotate-ccw',
  Rocket: 'rocket',
  Route: 'route',
  Search: 'search',
  Share2: 'share-2',
  Shield: 'shield',
  ShieldCheck: 'shield-check',
  Sparkles: 'sparkles',
  Star: 'star',
  Sun: 'sun',
  TriangleAlert: 'triangle-alert',
  Users: 'users',
  X: 'x',
  Zap: 'zap',
} satisfies Record<string, string>;

function lucideReactSubset(): Plugin {
  const virtualId = 'virtual:lucide-react-subset';
  const resolvedVirtualId = `\0${virtualId}`;

  return {
    name: 'lucide-react-subset',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'lucide-react') return resolvedVirtualId;
      return null;
    },
    load(id) {
      if (id !== resolvedVirtualId) return null;

      return Object.entries(lucideIconExports)
        .map(([exportName, iconPath]) => `export { default as ${exportName} } from 'lucide-react/dist/esm/icons/${iconPath}.js';`)
        .join('\n');
    },
  };
}

export default defineConfig({
  plugins: [lucideReactSubset(), react()],
  define: {
    __APP_BUILD_INFO__: JSON.stringify(appBuildInfo),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
