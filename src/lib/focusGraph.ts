import type { BottleneckLevel, GraphViewMode, SupplyChainData, SupplyChainEdge, SupplyChainNode } from '../data/schema';
import {
  getNonInvestableBottlenecksForNode,
  getTopRankedCompaniesForNode,
  getWatchlistMentionsForNode,
} from './researchSelectors';
import { createStageNode, getStageRootNodes, isStageNodeId, supplyChainStages } from './stages';

export type SupplierDepth = 1 | 2 | 3 | 'all';
export type ExplorationMode = 'branch' | 'upstream' | 'downstream';

export interface FocusGraphOptions {
  selectedNodeId: string;
  supplierDepth: SupplierDepth;
  explorationMode?: ExplorationMode;
  viewMode?: GraphViewMode;
  focusMode?: boolean;
  maxRelatedPerGroup?: number;
  maxVisibleNodes?: number;
  includeDownstream?: boolean;
}

export interface FocusGraphResult {
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
}

const rootId = 'L0_AI_ECOSYSTEM';
const hierarchyRelationships = new Set(['contains', 'mapped_to', 'stage_contains', 'stage_flow']);
const riskLevels: BottleneckLevel[] = ['critical', 'high', 'medium', 'low'];

function makeVirtualEdge(source: string, target: string, relationshipType: string): SupplyChainEdge {
  return {
    id: `${source}->${target}:${relationshipType}`,
    source,
    target,
    relationshipType,
    description: `${source} ${relationshipType} ${target}`,
    criticality: 'medium',
    confidence: 'medium',
    sourceIds: [],
  };
}

function makeOverflowNode(id: string, parentId: string, hiddenCount: number): SupplyChainNode {
  return {
    id,
    label: `${hiddenCount} hidden children`,
    type: 'subcategory',
    parentId,
    level: 9,
    layer: 'Overflow',
    description: `${hiddenCount} related nodes are hidden to keep the graph readable.`,
    whyItMatters: 'Use search, supplier-depth controls, or the detail panel to inspect the full list.',
    bottleneckLevel: 'medium',
    tags: ['overflow'],
    expanded: false,
    sourceIds: [],
    virtual: true,
  };
}

function makeVirtualNode(
  id: string,
  label: string,
  type: SupplyChainNode['type'],
  layer: string,
  description: string,
  parentId = rootId,
): SupplyChainNode {
  return {
    id,
    label,
    type,
    parentId,
    level: 1,
    layer,
    description,
    whyItMatters: description,
    bottleneckLevel: type === 'risk' ? 'critical' : 'high',
    tags: ['virtual', layer, label],
    expanded: false,
    sourceIds: [],
    virtual: true,
  };
}

function addNode(map: Map<string, SupplyChainNode>, node?: SupplyChainNode): void {
  if (node && !map.has(node.id)) map.set(node.id, node);
}

function addCappedGroup(
  nodes: Map<string, SupplyChainNode>,
  edges: SupplyChainEdge[],
  parentId: string,
  items: SupplyChainNode[],
  relationshipType: string,
  maxItems: number,
): void {
  const visible = items.slice(0, maxItems);
  visible.forEach((item) => {
    addNode(nodes, item);
    edges.push(makeVirtualEdge(parentId, item.id, relationshipType));
  });
  const hiddenCount = items.length - visible.length;
  if (hiddenCount > 0) {
    const overflow = makeOverflowNode(`overflow-${parentId}-${relationshipType}`, parentId, hiddenCount);
    addNode(nodes, overflow);
    edges.push(makeVirtualEdge(parentId, overflow.id, relationshipType));
  }
}

function stageBoard(data: SupplyChainData): FocusGraphResult {
  const root = data.nodes.find((node) => node.id === rootId);
  const nodes = new Map<string, SupplyChainNode>();
  const edges: SupplyChainEdge[] = [];
  addNode(nodes, root);
  supplyChainStages.forEach((stage, index) => {
    addNode(nodes, createStageNode(stage));
    edges.push(makeVirtualEdge(index === 0 ? rootId : supplyChainStages[index - 1].id, stage.id, 'stage_flow'));
  });
  return { nodes: Array.from(nodes.values()), edges };
}

function geographyView(data: SupplyChainData, maxPerGroup: number): FocusGraphResult {
  const root = data.nodes.find((node) => node.id === rootId);
  const nodes = new Map<string, SupplyChainNode>();
  const edges: SupplyChainEdge[] = [];
  addNode(nodes, root);

  const grouped = new Map<string, SupplyChainNode[]>();
  data.nodes
    .filter((node) => (node.type === 'company' || node.type === 'watchlist' || node.type === 'material' || node.type === 'mineral') && node.country)
    .forEach((node) => {
      const key = node.country ?? 'Unknown';
      grouped.set(key, [...(grouped.get(key) ?? []), node]);
    });

  Array.from(grouped.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .forEach(([country, items]) => {
      const group = makeVirtualNode(`view-geo-${country.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, country, 'geography', 'Geography View', `${items.length} mapped supply-chain entities have country exposure here.`);
      addNode(nodes, group);
      edges.push(makeVirtualEdge(rootId, group.id, 'geography_group'));
      addCappedGroup(nodes, edges, group.id, items.sort((a, b) => a.label.localeCompare(b.label)), 'located_in', maxPerGroup);
    });

  return { nodes: Array.from(nodes.values()), edges };
}

function riskView(data: SupplyChainData, maxPerGroup: number): FocusGraphResult {
  const root = data.nodes.find((node) => node.id === rootId);
  const nodes = new Map<string, SupplyChainNode>();
  const edges: SupplyChainEdge[] = [];
  addNode(nodes, root);

  riskLevels.forEach((level) => {
    const items = data.nodes
      .filter((node) => node.bottleneckLevel === level && node.id !== rootId)
      .sort((a, b) => a.level - b.level || a.label.localeCompare(b.label));
    const group = makeVirtualNode(`view-risk-${level}`, `${level} bottlenecks`, 'risk', 'Risk View', `${items.length} nodes are currently tagged ${level}.`);
    group.bottleneckLevel = level;
    addNode(nodes, group);
    edges.push(makeVirtualEdge(rootId, group.id, 'risk_group'));
    addCappedGroup(nodes, edges, group.id, items, 'risk_contains', maxPerGroup);
  });

  return { nodes: Array.from(nodes.values()), edges };
}

function customView(): FocusGraphResult {
  const node = makeVirtualNode(
    'view-custom-builder',
    'Custom View Builder - Coming Soon',
    'category',
    'Custom View',
    'Coming soon: saved filters, selected branches, pinned companies, and custom research workspaces.',
  );
  return {
    nodes: [
      {
        ...node,
        parentId: undefined,
        bottleneckLevel: 'medium',
      },
    ],
    edges: [],
  };
}

function nonHierarchyEdges(data: SupplyChainData): SupplyChainEdge[] {
  return data.edges.filter((edge) => !hierarchyRelationships.has(edge.relationshipType));
}

function ancestorsFor(data: SupplyChainData, nodeId: string): SupplyChainNode[] {
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  const path: SupplyChainNode[] = [];
  let current = nodesById.get(nodeId);
  while (current?.parentId) {
    const parent = nodesById.get(current.parentId);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }
  return path;
}

function childrenFor(data: SupplyChainData, nodeId: string): SupplyChainNode[] {
  return data.nodes
    .filter((node) => node.parentId === nodeId && node.type !== 'company' && node.type !== 'watchlist')
    .sort((a, b) => a.level - b.level || a.label.localeCompare(b.label));
}

function upstreamFor(data: SupplyChainData, nodeId: string): SupplyChainNode[] {
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  return nonHierarchyEdges(data)
    .filter((edge) => edge.source === nodeId)
    .map((edge) => nodesById.get(edge.target))
    .filter(Boolean) as SupplyChainNode[];
}

function downstreamFor(data: SupplyChainData, nodeId: string): SupplyChainNode[] {
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  return nonHierarchyEdges(data)
    .filter((edge) => edge.target === nodeId)
    .map((edge) => nodesById.get(edge.source))
    .filter(Boolean) as SupplyChainNode[];
}

function supplierDepthValue(depth: SupplierDepth): number {
  return depth === 'all' ? 8 : depth;
}

function effectiveDepth(depth: SupplierDepth, focusMode: boolean): SupplierDepth {
  return depth === 'all' && !focusMode ? 3 : depth;
}

function rootsWithin(nodes: Iterable<SupplyChainNode>): SupplyChainNode[] {
  return Array.from(nodes).filter((node) => node.type === 'material' || node.type === 'mineral');
}

export function buildFocusGraph(data: SupplyChainData, options: FocusGraphOptions): FocusGraphResult {
  const maxRelated = options.maxRelatedPerGroup ?? 8;
  const maxVisibleNodes = options.maxVisibleNodes ?? 24;
  const viewMode = options.viewMode ?? 'category';
  const focusMode = options.focusMode ?? false;
  const explorationMode = options.explorationMode ?? 'branch';
  const selectedId = options.selectedNodeId;
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));

  if (!focusMode && (selectedId === rootId || !selectedId)) {
    if (viewMode === 'geography') return geographyView(data, Math.min(5, maxRelated));
    if (viewMode === 'risk') return riskView(data, Math.min(6, maxRelated));
    if (viewMode === 'custom') return customView();
    return stageBoard(data);
  }

  const baseBoard = stageBoard(data);
  const visibleNodes = new Map(baseBoard.nodes.map((node) => [node.id, node]));
  const visibleEdges = [...baseBoard.edges];

  if (!focusMode && isStageNodeId(selectedId)) {
    const stageNode = visibleNodes.get(selectedId);
    const roots = getStageRootNodes(data, selectedId);
    addCappedGroup(visibleNodes, visibleEdges, stageNode?.id ?? selectedId, roots, 'stage_contains', maxRelated);
    return { nodes: Array.from(visibleNodes.values()), edges: visibleEdges };
  }

  const selected = nodesById.get(selectedId) ?? (isStageNodeId(selectedId) ? visibleNodes.get(selectedId) : undefined);
  if (!selected) return stageBoard(data);

  visibleNodes.clear();
  visibleEdges.length = 0;

  const ancestors = isStageNodeId(selectedId) ? [] : ancestorsFor(data, selectedId);
  ancestors.forEach((node, index) => {
    addNode(visibleNodes, node);
    const next = ancestors[index + 1]?.id ?? selectedId;
    visibleEdges.push(makeVirtualEdge(node.id, next, 'contains'));
  });
  addNode(visibleNodes, selected);

  const directChildren = isStageNodeId(selectedId) ? getStageRootNodes(data, selectedId) : childrenFor(data, selectedId);
  if (explorationMode !== 'upstream' || isStageNodeId(selectedId)) {
    addCappedGroup(visibleNodes, visibleEdges, selectedId, directChildren, isStageNodeId(selectedId) ? 'stage_contains' : 'contains', maxRelated);
  }

  const rankedCompanies = [
    ...getTopRankedCompaniesForNode(data, selectedId, 5),
    ...getWatchlistMentionsForNode(data, selectedId, 3),
    ...getNonInvestableBottlenecksForNode(data, selectedId, 4),
  ];
  addCappedGroup(visibleNodes, visibleEdges, selectedId, rankedCompanies, 'important_company', Math.min(maxRelated, 8));

  const maxDepth = supplierDepthValue(effectiveDepth(options.supplierDepth, focusMode));
  if (explorationMode !== 'downstream') {
    const queue: Array<{ id: string; depth: number }> = [{ id: selectedId, depth: 0 }];
    const visited = new Set<string>([selectedId]);
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= maxDepth) continue;
      const suppliers = upstreamFor(data, current.id).sort((a, b) => a.label.localeCompare(b.label));
      const remainingSlots = Math.max(0, maxVisibleNodes - visibleNodes.size);
      const visibleSuppliers = suppliers.slice(0, Math.min(maxRelated, remainingSlots));
      visibleSuppliers.forEach((supplier) => {
        addNode(visibleNodes, supplier);
        visibleEdges.push(makeVirtualEdge(current.id, supplier.id, 'requires_supplier'));
        if (!visited.has(supplier.id)) {
          visited.add(supplier.id);
          queue.push({ id: supplier.id, depth: current.depth + 1 });
        }
      });
      const hiddenCount = suppliers.length - visibleSuppliers.length;
      if (hiddenCount > 0 && visibleNodes.size < maxVisibleNodes) {
        const overflow = makeOverflowNode(`overflow-${current.id}-suppliers`, current.id, hiddenCount);
        addNode(visibleNodes, overflow);
        visibleEdges.push(makeVirtualEdge(current.id, overflow.id, 'requires_supplier'));
      }
    }
  }

  if (explorationMode !== 'upstream' && (options.includeDownstream ?? true)) {
    const downstreamLimit = explorationMode === 'downstream' ? maxRelated : Math.min(4, maxRelated);
    addCappedGroup(visibleNodes, visibleEdges, selectedId, downstreamFor(data, selectedId), 'downstream_customer', downstreamLimit);
  }

  if (focusMode && maxDepth >= 2 && visibleNodes.size < maxVisibleNodes) {
    const materialRoots = rootsWithin(visibleNodes.values()).slice(0, Math.max(0, maxVisibleNodes - visibleNodes.size));
    materialRoots.forEach((root) => {
      if (!visibleNodes.has(root.id)) addNode(visibleNodes, root);
    });
  }

  data.edges.forEach((edge) => {
    if (visibleNodes.has(edge.source) && visibleNodes.has(edge.target)) {
      visibleEdges.push(edge);
    }
  });

  return {
    nodes: Array.from(visibleNodes.values()),
    edges: Array.from(new Map(visibleEdges.map((edge) => [edge.id, edge])).values()),
  };
}
