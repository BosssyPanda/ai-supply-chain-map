import type {
  BottleneckLevel,
  Confidence,
  Source,
  SupplyChainData,
  SupplyChainNode,
} from '../data/schema';
import type { ResearchCsvSnapshot } from '../data/loaders';
import { isUsListed } from './filters';
import { getDescendantIds, getTopRankedCompaniesForNode } from './researchSelectors';

export const pendingCopy = 'Data pending — source needed';

const severityRank = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} satisfies Record<BottleneckLevel, number>;

const confidenceRank = {
  high: 3,
  medium: 2,
  low: 1,
} satisfies Record<Confidence, number>;

type SupplierRow = ResearchCsvSnapshot['mineralSuppliers'][number];

export interface DerivedReportStats {
  mappedCompanies: number;
  usListedCompanies: number;
  watchlistNames: number;
  criticalBottlenecks: number;
  highRiskItems: number;
  highConfidenceMappings: number;
  confidencePercent: number;
  materials: number;
  materialSuppliers: number;
  sources: number;
  datedSources: number;
  latestSourceDate?: string;
}

export interface OverviewStageReport {
  id: string;
  title: string;
  description: string;
  keyEnablers: string[];
  focusId: string;
  companies: SupplyChainNode[];
}

export interface MaterialCategoryReport {
  id: string;
  title: string;
  usedIn: string;
  whyItMatters: string;
  keyEnablers: string[];
  materials: SupplyChainNode[];
  supplierRows: SupplierRow[];
  bottleneckLevel?: BottleneckLevel;
  publicProxy?: SupplierRow;
  geography: string;
  confidence?: Confidence;
}

export interface BottleneckCategoryReport {
  id: string;
  title: string;
  stage: string;
  severity?: BottleneckLevel;
  constraintType: string;
  whyItMatters: string;
  substitutability?: string;
  affectedCompanies: SupplyChainNode[];
  nodes: SupplyChainNode[];
  confidence?: Confidence;
}

export interface WatchlistGroups {
  all: SupplyChainNode[];
  publicPath: SupplyChainNode[];
  privateNames: SupplyChainNode[];
  emergingSuppliers: SupplyChainNode[];
  nearTermCatalysts: SupplyChainNode[];
}

export function dataPending(value?: string | number | null): string {
  if (typeof value === 'number') return String(value);
  const normalized = value?.trim();
  return normalized || pendingCopy;
}

export function getLatestSourceDate(sources: Source[]): string | undefined {
  const dates = sources
    .map((source) => source.dateAccessed)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1];
}

export function getDerivedReportStats(data: SupplyChainData, snapshot?: ResearchCsvSnapshot): DerivedReportStats {
  const mappedCompanies = data.nodes.filter((node) => node.type === 'company' || node.type === 'watchlist');
  const confidenceItems = [
    ...data.nodes.map((node) => node.confidence),
    ...data.edges.map((edge) => edge.confidence),
  ].filter(Boolean) as Confidence[];
  const highConfidenceMappings = confidenceItems.filter((confidence) => confidence === 'high').length;
  const datedSources = snapshot
    ? snapshot.sources.filter((source) => Boolean(source.date_accessed)).length
    : data.sources.filter((source) => Boolean(source.dateAccessed)).length;

  return {
    mappedCompanies: mappedCompanies.length,
    usListedCompanies: mappedCompanies.filter((node) => isUsListed(node.status)).length,
    watchlistNames: mappedCompanies.filter((node) => node.type === 'watchlist' || node.status === 'watchlist_private_ipo_spac').length,
    criticalBottlenecks: data.nodes.filter((node) => node.bottleneckLevel === 'critical').length,
    highRiskItems: data.nodes.filter((node) => node.bottleneckLevel === 'critical' || node.bottleneckLevel === 'high').length,
    highConfidenceMappings,
    confidencePercent: confidenceItems.length > 0 ? Math.round((highConfidenceMappings / confidenceItems.length) * 100) : 0,
    materials: snapshot?.minerals.length ?? data.nodes.filter((node) => node.type === 'material' || node.type === 'mineral').length,
    materialSuppliers: snapshot?.mineralSuppliers.length ?? 0,
    sources: snapshot?.sources.length ?? data.sources.length,
    datedSources,
    latestSourceDate: getLatestSourceDate(data.sources),
  };
}

export function getOverviewStages(data: SupplyChainData): OverviewStageReport[] {
  const stageDefinitions = [
    {
      id: 'models-cloud',
      title: 'Models & Cloud',
      description: 'Foundation models, AI platforms, hyperscalers, neoclouds, and hosted compute demand.',
      keyEnablers: ['Hyperscalers', 'Model providers', 'Training platforms'],
      focusId: 'stage-models-cloud',
    },
    {
      id: 'compute-chips',
      title: 'Compute & Chips',
      description: 'GPUs, custom accelerators, CPUs, semiconductor IP, fabs, packaging, and memory.',
      keyEnablers: ['Accelerators', 'Foundries', 'HBM', 'Packaging'],
      focusId: 'stage-compute',
    },
    {
      id: 'data-centers-networking',
      title: 'Data Centers & Networking',
      description: 'Data centers, switching, optics, servers, storage, and network infrastructure.',
      keyEnablers: ['DC operators', 'Networking chips', 'Optics'],
      focusId: 'stage-data-centers',
    },
    {
      id: 'power-cooling',
      title: 'Power & Cooling',
      description: 'Power delivery, grid equipment, backup systems, thermal management, and water.',
      keyEnablers: ['Grid equipment', 'UPS', 'Cooling', 'Generation'],
      focusId: 'stage-power-cooling',
    },
    {
      id: 'materials-minerals',
      title: 'Materials & Minerals',
      description: 'Rare earths, copper, silicon, specialty chemicals, industrial gases, and battery materials.',
      keyEnablers: ['Mining', 'Refining', 'Chemicals', 'Gases'],
      focusId: 'stage-materials',
    },
  ];

  return stageDefinitions.map((stage) => ({
    ...stage,
    companies: getTopRankedCompaniesForNode(data, stage.focusId, 3),
  }));
}

const materialCategoryDefinitions = [
  {
    id: 'silicon-wafers',
    title: 'Silicon & Wafers',
    usedIn: 'Chips, advanced logic nodes, substrates, and semiconductor manufacturing.',
    whyItMatters: 'Silicon inputs and wafer quality set the physical foundation for advanced AI chips.',
    keyEnablers: ['Silicon', 'wafers', 'polysilicon', 'quartz'],
    keywords: ['silicon', 'wafer', 'polysilicon', 'quartz', 'photoresist'],
  },
  {
    id: 'copper-conductors',
    title: 'Copper & Conductors',
    usedIn: 'Power delivery, grid build-out, data-center wiring, busbars, and interconnects.',
    whyItMatters: 'Copper carries power and signal across every layer of AI infrastructure.',
    keyEnablers: ['Copper', 'cabling', 'busbars', 'aluminum'],
    keywords: ['copper', 'conduct', 'aluminum', 'busbar', 'cabling'],
  },
  {
    id: 'rare-earths-magnets',
    title: 'Rare Earths & Magnets',
    usedIn: 'Motors, cooling systems, wind power, HVAC fans, and high-efficiency power systems.',
    whyItMatters: 'Magnet inputs can create geopolitical and refining exposure in power and cooling equipment.',
    keyEnablers: ['Neodymium', 'praseodymium', 'dysprosium', 'terbium'],
    keywords: ['rare earth', 'neodymium', 'praseodymium', 'dysprosium', 'terbium', 'magnet'],
  },
  {
    id: 'chemicals-industrial-gases',
    title: 'Chemicals & Industrial Gases',
    usedIn: 'Lithography, etch, deposition, cleaning, cooling, and semiconductor process steps.',
    whyItMatters: 'Purity and process availability are essential for advanced nodes and packaging.',
    keyEnablers: ['HF', 'photoresists', 'solvents', 'noble gases'],
    keywords: ['chemical', 'gas', 'neon', 'helium', 'krypton', 'xenon', 'photoresist', 'fluor', 'solvent'],
  },
  {
    id: 'thermal-battery-materials',
    title: 'Thermal & Battery Materials',
    usedIn: 'Cooling systems, backup power, energy storage, and high-density rack thermal management.',
    whyItMatters: 'Thermal and battery inputs support reliable compute density and backup power at scale.',
    keyEnablers: ['Graphite', 'cobalt', 'nickel', 'lithium', 'phase-change materials'],
    keywords: ['thermal', 'battery', 'graphite', 'cobalt', 'nickel', 'lithium', 'cooling'],
  },
] as const;

export function getMaterialCategoryReports(data: SupplyChainData, snapshot: ResearchCsvSnapshot): MaterialCategoryReport[] {
  const materialNodes = data.nodes.filter((node) => node.type === 'material' || node.type === 'mineral');

  return materialCategoryDefinitions.map((definition) => {
    const materials = materialNodes.filter((node) => matchesKeywords(nodeText(node), definition.keywords));
    const supplierRows = snapshot.mineralSuppliers.filter((row) =>
      matchesKeywords(
        [row.company_name, row.mineral_or_material, row.role, row.why_relevant, row.key_risks, row.country].join(' '),
        definition.keywords,
      ),
    );
    const publicProxy = supplierRows.find((row) => row.investable_under_project_rules === 'yes');
    const geography = uniqueList(supplierRows.map((row) => row.country).filter(Boolean)).join(', ');

    return {
      id: definition.id,
      title: definition.title,
      usedIn: definition.usedIn,
      whyItMatters: definition.whyItMatters,
      keyEnablers: [...definition.keyEnablers],
      materials,
      supplierRows,
      bottleneckLevel: worstSeverity(materials),
      publicProxy,
      geography: geography || pendingCopy,
      confidence: bestConfidence([
        ...materials.map((node) => node.confidence),
        ...supplierRows.map((row) => normalizeConfidence(row.confidence)),
      ]),
    };
  });
}

const bottleneckCategoryDefinitions = [
  {
    id: 'gpus-accelerators',
    title: 'GPUs & Accelerators',
    stage: 'Compute & Chips',
    constraintType: 'Capacity and ecosystem concentration',
    whyItMatters: 'Leading accelerators concentrate performance, memory bandwidth, software ecosystem, and supplier capacity.',
    keywords: ['gpu', 'accelerator', 'ai accelerator', 'cuda', 'mi-series'],
    scopeIds: ['L2_AI_ACCELERATORS', 'L3_GPU', 'L3_HYPERSCALER_ASIC'],
  },
  {
    id: 'hbm-memory',
    title: 'HBM Memory',
    stage: 'Compute & Chips',
    constraintType: 'Capacity and supplier concentration',
    whyItMatters: 'HBM bandwidth is mandatory for leading AI accelerators and is concentrated among a small supplier base.',
    keywords: ['hbm', 'memory', 'dram'],
    scopeIds: ['L1_MEMORY', 'L2_HBM', 'L4_HBM'],
  },
  {
    id: 'advanced-packaging',
    title: 'Advanced Packaging',
    stage: 'Compute & Chips',
    constraintType: 'Capacity and process complexity',
    whyItMatters: 'Advanced packaging connects compute dies and HBM, making capacity constraints visible across accelerator supply.',
    keywords: ['packaging', 'cowos', 'hybrid bonding', 'substrate'],
    scopeIds: ['L1_PACKAGING', 'L2_COWOS', 'L2_HYBRID_BONDING'],
  },
  {
    id: 'networking-chips',
    title: 'Networking Chips',
    stage: 'Data Centers & Networking',
    constraintType: 'Switch silicon, optics, and interconnect concentration',
    whyItMatters: 'Training and inference clusters require high-bandwidth networking and optical components at scale.',
    keywords: ['networking', 'switch', 'optical', 'interconnect', 'ethernet', 'infiniband'],
    scopeIds: ['L1_NETWORKING', 'L1_OPTICAL'],
  },
  {
    id: 'transformers-grid-equipment',
    title: 'Transformers & Grid Equipment',
    stage: 'Power & Cooling',
    constraintType: 'Lead times and grid capacity',
    whyItMatters: 'AI data-center build-outs depend on power equipment, transmission capacity, and interconnection queues.',
    keywords: ['transformer', 'grid', 'interconnect', 'power', 'ups', 'transmission'],
    scopeIds: ['L1_GRID_EQUIPMENT', 'L1_GRID_INTERCONNECT', 'L1_DC_POWER_INTERNAL', 'L1_T_AND_D', 'L1_UPS'],
  },
  {
    id: 'rare-earth-critical-minerals',
    title: 'Rare Earths & Critical Minerals',
    stage: 'Materials & Minerals',
    constraintType: 'Geopolitical concentration and refining exposure',
    whyItMatters: 'Critical minerals support chips, magnets, power equipment, and semiconductor process inputs.',
    keywords: ['rare earth', 'critical mineral', 'gallium', 'germanium', 'copper', 'mineral', 'refining'],
    scopeIds: ['L1_MINERALS', 'L1_RARE_EARTHS', 'L1_COPPER', 'L1_REFINING', 'MIN_GALLIUM', 'MIN_GERMANIUM', 'MIN_RARE_EARTHS'],
  },
] as const;

export function getBottleneckCategoryReports(data: SupplyChainData): BottleneckCategoryReport[] {
  return bottleneckCategoryDefinitions.map((definition) => {
    const scope = collectScopeIds(data, definition.scopeIds);
    const nodes = data.nodes.filter((node) => scope.has(node.id) || matchesKeywords(nodeText(node), definition.keywords));
    const affectedCompanies = data.nodes
      .filter((node) => (node.type === 'company' || node.type === 'watchlist') && (isInScope(node, scope) || matchesKeywords(nodeText(node), definition.keywords)))
      .sort(compareResearchPriority)
      .slice(0, 6);

    return {
      id: definition.id,
      title: definition.title,
      stage: definition.stage,
      constraintType: definition.constraintType,
      whyItMatters: definition.whyItMatters,
      substitutability: mostConstrainedSubstitutability(nodes),
      severity: worstSeverity([...nodes, ...affectedCompanies]),
      affectedCompanies,
      nodes: nodes.sort(compareResearchPriority),
      confidence: bestConfidence([...nodes.map((node) => node.confidence), ...affectedCompanies.map((node) => node.confidence)]),
    };
  });
}

export function getRankedBottleneckNodes(data: SupplyChainData, limit?: number): SupplyChainNode[] {
  const rows = data.nodes
    .filter((node) => node.bottleneckLevel)
    .sort(compareResearchPriority);
  return typeof limit === 'number' ? rows.slice(0, limit) : rows;
}

export function getFeaturedCompanies(data: SupplyChainData, limit = 6): SupplyChainNode[] {
  return data.nodes
    .filter((node) => node.type === 'company' && isUsListed(node.status))
    .sort((a, b) => {
      const rankDelta = (a.rankWithinNode ?? 999) - (b.rankWithinNode ?? 999);
      if (rankDelta !== 0) return rankDelta;
      return compareResearchPriority(a, b);
    })
    .slice(0, limit);
}

export function getOverviewFocusCompanies(data: SupplyChainData, limit = 3): SupplyChainNode[] {
  const networkingKeywords = ['network', 'interconnect', 'switch', 'optical', 'ethernet', 'infiniband'];

  return data.nodes
    .filter((node) => node.type === 'company' && matchesKeywords(nodeText(node), networkingKeywords))
    .sort(compareResearchPriority)
    .slice(0, limit);
}

export function getWatchlistGroups(data: SupplyChainData): WatchlistGroups {
  const all = data.nodes
    .filter((node) => node.type === 'watchlist' || node.status === 'private' || node.status === 'watchlist_private_ipo_spac')
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    all,
    publicPath: all.filter((node) => Boolean(node.publicPath)),
    privateNames: all.filter((node) => node.status === 'private' || node.type === 'watchlist'),
    emergingSuppliers: all.filter((node) => !/model|frontier|application/i.test(node.layer)),
    nearTermCatalysts: all.filter((node) => node.estimatedMaturity === 'short' || node.estimatedMaturity === 'medium' || Boolean(node.publicPath)),
  };
}

export function getSourceRowsForNode(data: SupplyChainData, node: SupplyChainNode): Source[] {
  return node.sourceIds
    .map((sourceId) => data.sources.find((source) => source.id === sourceId))
    .filter(Boolean) as Source[];
}

function collectScopeIds(data: SupplyChainData, rootIds: readonly string[]): Set<string> {
  const scope = new Set<string>();
  rootIds.forEach((id) => {
    getDescendantIds(data, id).forEach((descendantId) => scope.add(descendantId));
  });
  return scope;
}

function isInScope(node: SupplyChainNode, scope: Set<string>): boolean {
  return scope.has(node.id) || Boolean(node.parentId && scope.has(node.parentId));
}

function nodeText(node: SupplyChainNode): string {
  return [
    node.id,
    node.label,
    node.layer,
    node.description,
    node.whyItMatters,
    node.marketSegment,
    node.role,
    node.notes,
    node.tags.join(' '),
    node.risks?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');
}

function matchesKeywords(text: string, keywords: readonly string[]): boolean {
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function worstSeverity(nodes: Array<Pick<SupplyChainNode, 'bottleneckLevel'>>): BottleneckLevel | undefined {
  return nodes.reduce<BottleneckLevel | undefined>((worst, node) => {
    if (!node.bottleneckLevel) return worst;
    if (!worst) return node.bottleneckLevel;
    return severityRank[node.bottleneckLevel] > severityRank[worst] ? node.bottleneckLevel : worst;
  }, undefined);
}

function bestConfidence(values: Array<Confidence | undefined>): Confidence | undefined {
  return values.reduce<Confidence | undefined>((best, value) => {
    if (!value) return best;
    if (!best) return value;
    return confidenceRank[value] > confidenceRank[best] ? value : best;
  }, undefined);
}

function normalizeConfidence(value?: string): Confidence | undefined {
  return value === 'high' || value === 'medium' || value === 'low' ? value : undefined;
}

function mostConstrainedSubstitutability(nodes: SupplyChainNode[]): string | undefined {
  const order = ['none', 'low', 'medium', 'high'];
  return nodes
    .map((node) => node.substitutability)
    .filter((value): value is NonNullable<SupplyChainNode['substitutability']> => Boolean(value))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))[0];
}

function compareResearchPriority(a: SupplyChainNode, b: SupplyChainNode): number {
  const severityDelta = severityRank[b.bottleneckLevel ?? 'low'] - severityRank[a.bottleneckLevel ?? 'low'];
  if (severityDelta !== 0) return severityDelta;
  const confidenceDelta = confidenceRank[b.confidence ?? 'low'] - confidenceRank[a.confidence ?? 'low'];
  if (confidenceDelta !== 0) return confidenceDelta;
  const rankDelta = (a.rankWithinNode ?? 999) - (b.rankWithinNode ?? 999);
  if (rankDelta !== 0) return rankDelta;
  return a.label.localeCompare(b.label);
}

function uniqueList(values: string[]): string[] {
  return Array.from(new Set(values));
}
