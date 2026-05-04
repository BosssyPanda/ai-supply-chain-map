import type { SupplyChainData, SupplyChainNode } from '../data/schema';
import { isUsListed } from './filters';
import { isStageNodeId, getStageRootNodes } from './stages';

function childrenByParent(data: SupplyChainData): Map<string, SupplyChainNode[]> {
  const map = new Map<string, SupplyChainNode[]>();
  data.nodes.forEach((node) => {
    if (!node.parentId) return;
    const list = map.get(node.parentId) ?? [];
    list.push(node);
    map.set(node.parentId, list);
  });
  return map;
}

export function getDescendantIds(data: SupplyChainData, nodeId: string): Set<string> {
  const children = childrenByParent(data);
  const ids = new Set<string>([nodeId]);
  const visit = (id: string) => {
    (children.get(id) ?? []).forEach((child) => {
      if (ids.has(child.id)) return;
      ids.add(child.id);
      visit(child.id);
    });
  };
  visit(nodeId);
  return ids;
}

function rankingScopeIds(data: SupplyChainData, nodeId: string): Set<string> {
  if (!isStageNodeId(nodeId)) return getDescendantIds(data, nodeId);
  const ids = new Set<string>([nodeId]);
  getStageRootNodes(data, nodeId).forEach((node) => getDescendantIds(data, node.id).forEach((id) => ids.add(id)));
  return ids;
}

function distanceFromScopeRoot(data: SupplyChainData, candidate: SupplyChainNode, scope: Set<string>): number {
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  let distance = 0;
  let current: SupplyChainNode | undefined = candidate;
  while (current?.parentId) {
    if (scope.has(current.parentId)) return distance;
    current = nodesById.get(current.parentId);
    distance += 1;
  }
  return distance + 100;
}

export function getTopRankedCompaniesForNode(data: SupplyChainData, nodeId: string, limit = 3): SupplyChainNode[] {
  const scope = rankingScopeIds(data, nodeId);
  return data.nodes
    .filter((node) => node.type === 'company' && node.parentId && scope.has(node.parentId) && isUsListed(node.status) && node.rankWithinNode)
    .sort((a, b) => {
      const distanceDelta = distanceFromScopeRoot(data, a, scope) - distanceFromScopeRoot(data, b, scope);
      if (distanceDelta !== 0) return distanceDelta;
      return (a.rankWithinNode ?? 999) - (b.rankWithinNode ?? 999) || a.label.localeCompare(b.label);
    })
    .slice(0, limit);
}

export function getWatchlistMentionsForNode(data: SupplyChainData, nodeId: string, limit = 8): SupplyChainNode[] {
  const scope = rankingScopeIds(data, nodeId);
  return data.nodes
    .filter((node) => node.type === 'watchlist' && node.parentId && scope.has(node.parentId))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function getNonInvestableBottlenecksForNode(data: SupplyChainData, nodeId: string, limit = 8): SupplyChainNode[] {
  const scope = rankingScopeIds(data, nodeId);
  return data.nodes
    .filter((node) => node.type === 'company' && node.parentId && scope.has(node.parentId) && !isUsListed(node.status))
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (severityOrder[a.bottleneckLevel ?? 'low'] ?? 9) - (severityOrder[b.bottleneckLevel ?? 'low'] ?? 9) || a.label.localeCompare(b.label);
    })
    .slice(0, limit);
}
