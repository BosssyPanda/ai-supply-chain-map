import type { SupplyChainData, SupplyChainNode } from '../data/schema';

export interface SupplyChainStage {
  id: string;
  label: string;
  description: string;
  l1NodeIds: string[];
}

export const supplyChainStages: SupplyChainStage[] = [
  {
    id: 'stage-demand',
    label: 'Demand / Applications',
    description: 'AI applications, data, software, and governance demand entering the stack.',
    l1NodeIds: ['L1_APPLICATIONS', 'L1_DATA_LICENSING', 'L1_SYNTHETIC_DATA', 'L1_AI_SOFTWARE_STACK', 'L1_MLOPS', 'L1_GOVERNANCE'],
  },
  {
    id: 'stage-models-cloud',
    label: 'Models / Cloud Platforms',
    description: 'Model developers and compute platforms that convert demand into infrastructure load.',
    l1NodeIds: ['L1_MODELS', 'L1_TRAIN_INFER_PLATFORMS', 'L1_HYPERSCALERS', 'L1_NEOCLOUDS'],
  },
  {
    id: 'stage-compute',
    label: 'Compute / Accelerators',
    description: 'AI accelerators and processors that run training and inference workloads.',
    l1NodeIds: ['L1_COMPUTE'],
  },
  {
    id: 'stage-semiconductor',
    label: 'Semiconductor Stack',
    description: 'Chip design, EDA/IP, fabs, packaging, memory, and semiconductor manufacturing equipment.',
    l1NodeIds: [
      'L1_SEMI_DESIGN',
      'L1_SEMI_IP',
      'L1_EDA',
      'L1_FAB',
      'L1_PACKAGING',
      'L1_MEMORY',
      'L1_SEMI_EQUIP',
      'L1_LITHO',
      'L1_DEPOSITION',
      'L1_ETCH',
      'L1_METROLOGY',
      'L1_WAFER_CLEAN',
      'L1_ION_IMPLANT',
      'L1_CMP',
    ],
  },
  {
    id: 'stage-data-centers',
    label: 'Data Centers / Networking',
    description: 'Networking, servers, storage, data-center operators, REITs, construction, land, and security.',
    l1NodeIds: ['L1_NETWORKING', 'L1_OPTICAL', 'L1_SERVERS', 'L1_STORAGE', 'L1_DC_OPS', 'L1_DC_REIT', 'L1_DC_CONSTRUCTION', 'L1_REAL_ESTATE', 'L1_CYBERSEC'],
  },
  {
    id: 'stage-power-cooling',
    label: 'Power / Grid / Cooling',
    description: 'Power delivery, generation, backup, cooling, water, interconnection, and grid equipment.',
    l1NodeIds: [
      'L1_DC_POWER_INTERNAL',
      'L1_UPS',
      'L1_GRID_EQUIPMENT',
      'L1_GENSETS',
      'L1_COOLING',
      'L1_WATER',
      'L1_GRID_INTERCONNECT',
      'L1_GENERATION',
      'L1_NUCLEAR',
      'L1_GAS_POWER',
      'L1_RENEWABLES',
      'L1_STORAGE_ESS',
      'L1_T_AND_D',
      'L1_FUEL',
    ],
  },
  {
    id: 'stage-materials',
    label: 'Materials / Minerals / Chemicals / Gases',
    description: 'Critical minerals, mining, refining, semiconductor chemicals, photoresists, gases, and cleanroom inputs.',
    l1NodeIds: [
      'L1_MINERALS',
      'L1_MINING',
      'L1_REFINING',
      'L1_RARE_EARTHS',
      'L1_COPPER',
      'L1_ALUMINUM',
      'L1_SI_POLYSI',
      'L1_GALLIUM',
      'L1_GERMANIUM',
      'L1_TUNGSTEN',
      'L1_COBALT',
      'L1_NICKEL',
      'L1_LITHIUM',
      'L1_GRAPHITE',
      'L1_FLUORSPAR',
      'L1_HELIUM',
      'L1_NOBLE_GASES',
      'L1_QUARTZ',
      'L1_SPECIALTY_CHEM',
      'L1_PHOTORESIST',
      'L1_INDUSTRIAL_GAS',
      'L1_CLEANROOM',
    ],
  },
  {
    id: 'stage-policy-capital-labor',
    label: 'Policy / Capital / Labor',
    description: 'Logistics, permitting, export controls, subsidies, finance, leases, project capital, and specialized labor.',
    l1NodeIds: [
      'L1_LOGISTICS',
      'L1_PERMITTING',
      'L1_POLICY',
      'L1_FINANCE',
      'L1_LABOR',
    ],
  },
];

export const stageIds = supplyChainStages.map((stage) => stage.id);

export function isStageNodeId(nodeId: string): boolean {
  return supplyChainStages.some((stage) => stage.id === nodeId);
}

export function createStageNode(stage: SupplyChainStage): SupplyChainNode {
  return {
    id: stage.id,
    label: stage.label,
    type: 'category',
    parentId: 'L0_AI_ECOSYSTEM',
    level: 1,
    layer: 'Supply Chain Stage',
    description: stage.description,
    whyItMatters: 'This is an app-only grouping that keeps the large CSV taxonomy readable on the graph canvas.',
    bottleneckLevel: stage.id === 'stage-materials' || stage.id === 'stage-power-cooling' ? 'critical' : 'high',
    tags: ['stage', stage.label],
    expanded: false,
    sourceIds: [],
    virtual: true,
  };
}

export function getStageNode(stageId: string): SupplyChainNode | undefined {
  const stage = supplyChainStages.find((item) => item.id === stageId);
  return stage ? createStageNode(stage) : undefined;
}

export function getStageForNodeId(data: SupplyChainData, nodeId: string): SupplyChainStage | undefined {
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  let current = nodesById.get(nodeId);
  while (current) {
    const currentNode = current;
    if (current.level === 1) {
      return supplyChainStages.find((stage) => stage.l1NodeIds.includes(currentNode.id));
    }
    current = currentNode.parentId ? nodesById.get(currentNode.parentId) : undefined;
  }
  return undefined;
}

export function getStageRootNodes(data: SupplyChainData, stageId: string): SupplyChainNode[] {
  const stage = supplyChainStages.find((item) => item.id === stageId);
  if (!stage) return [];
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  return stage.l1NodeIds.map((id) => nodesById.get(id)).filter(Boolean) as SupplyChainNode[];
}
