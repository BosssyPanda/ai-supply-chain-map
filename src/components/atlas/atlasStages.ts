import type { SupplyChainData } from '../../data/schema';
import { getDerivedReportStats, getOverviewStages } from '../../lib/reportSelectors';

export type AtlasStageTone = 'blue' | 'indigo' | 'cyan' | 'amber' | 'slate';
export type AtlasStageIcon = 'cloud' | 'chip' | 'network' | 'power' | 'materials';
export type AtlasStagePrimitive = 'cloud' | 'chip' | 'network' | 'power' | 'materials';

export interface AtlasSceneTarget {
  position: readonly [number, number, number];
  camera: readonly [number, number, number];
  target: readonly [number, number, number];
  cardClassName: string;
  accent: string;
  glow: string;
  primitive: AtlasStagePrimitive;
}

export interface AtlasStage {
  id: string;
  step: string;
  title: string;
  shortTitle: string;
  description: string;
  keyEnablers: string[];
  mappedExamples: string[];
  href: string;
  tone: AtlasStageTone;
  icon: AtlasStageIcon;
  scene: AtlasSceneTarget;
}

export interface AtlasInsight {
  title: string;
  summary: string;
  lastUpdated: string;
  sourceCount: number;
}

export const atlasPendingCopy = 'Data pending - source needed';

const stagePresentation = [
  {
    shortTitle: 'Models',
    tone: 'blue',
    icon: 'cloud',
    scene: {
      position: [-3.95, 0, -1.28],
      camera: [-5.45, 3.3, 3.7],
      target: [-3.65, 0.14, -0.92],
      cardClassName: 'left-[50%] top-[8%]',
      accent: '#60a5fa',
      glow: '#2563eb',
      primitive: 'cloud',
    },
  },
  {
    shortTitle: 'Compute',
    tone: 'indigo',
    icon: 'chip',
    scene: {
      position: [-1.42, 0, 0.32],
      camera: [-2.92, 3.08, 4.08],
      target: [-1.18, 0.14, 0.34],
      cardClassName: 'left-[70%] top-[14%]',
      accent: '#818cf8',
      glow: '#4f46e5',
      primitive: 'chip',
    },
  },
  {
    shortTitle: 'Networks',
    tone: 'cyan',
    icon: 'network',
    scene: {
      position: [1.12, 0, -0.42],
      camera: [0.1, 3.36, 3.95],
      target: [1.1, 0.1, -0.2],
      cardClassName: 'left-[48%] bottom-[18%]',
      accent: '#22d3ee',
      glow: '#0891b2',
      primitive: 'network',
    },
  },
  {
    shortTitle: 'Power',
    tone: 'amber',
    icon: 'power',
    scene: {
      position: [3.52, 0, 0.78],
      camera: [2.2, 3.18, 4.55],
      target: [3.32, 0.12, 0.6],
      cardClassName: 'right-[7%] bottom-[27%]',
      accent: '#f59e0b',
      glow: '#d97706',
      primitive: 'power',
    },
  },
  {
    shortTitle: 'Materials',
    tone: 'slate',
    icon: 'materials',
    scene: {
      position: [0.05, 0, 2.82],
      camera: [-0.9, 3.18, 5.96],
      target: [0.08, 0.1, 2.45],
      cardClassName: 'left-[66%] bottom-[6%]',
      accent: '#cbd5e1',
      glow: '#94a3b8',
      primitive: 'materials',
    },
  },
] as const;

export function getAtlasStages(data: SupplyChainData): AtlasStage[] {
  return getOverviewStages(data).map((stage, index) => {
    const presentation = stagePresentation[index] ?? stagePresentation[0];
    return {
      id: stage.id,
      step: String(index + 1).padStart(2, '0'),
      title: stage.title,
      shortTitle: presentation.shortTitle,
      description: stage.description || atlasPendingCopy,
      keyEnablers: stage.keyEnablers.length > 0 ? stage.keyEnablers : [atlasPendingCopy],
      mappedExamples: stage.companies.map((company) => company.label).filter(Boolean).slice(0, 2),
      href: `/supply-chain?focus=${stage.focusId}`,
      tone: presentation.tone,
      icon: presentation.icon,
      scene: presentation.scene,
    };
  });
}

export function getAtlasInsight(data: SupplyChainData): AtlasInsight {
  const stats = getDerivedReportStats(data);
  const lastUpdated = stats.latestSourceDate ?? atlasPendingCopy;

  return {
    title: 'Research coverage',
    summary: `${stats.sources} source rows support the current atlas dataset. Missing fields remain marked as ${atlasPendingCopy}.`,
    lastUpdated,
    sourceCount: stats.sources,
  };
}
