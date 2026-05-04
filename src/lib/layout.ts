import ELK from 'elkjs/lib/elk.bundled.js';
import type { Edge, Node } from '@xyflow/react';
import type { LayoutDirection, SupplyChainNode } from '../data/schema';
import { stageIds } from './stages';

const elk = new ELK();

const normalNode = { width: 300, height: 116 };
const stageNode = { width: 352, height: 248 };
const rootNode = { width: 330, height: 94 };
const overflowNode = { width: 240, height: 84 };
const virtualSummaryNode = { width: 300, height: 126 };

function modelFor<TNodeData extends Record<string, unknown>>(node: Node<TNodeData>): SupplyChainNode | undefined {
  return (node.data as { node?: SupplyChainNode }).node;
}

function sizeFor<TNodeData extends Record<string, unknown>>(node: Node<TNodeData>): { width: number; height: number } {
  const model = modelFor(node);
  if (model?.id === 'L0_AI_ECOSYSTEM') return rootNode;
  if (model?.id.startsWith('overflow-')) return overflowNode;
  if (model?.virtual && stageIds.includes(model.id)) return stageNode;
  if (model?.virtual) return virtualSummaryNode;
  return normalNode;
}

function isRootStageBoard<TNodeData extends Record<string, unknown>>(nodes: Node<TNodeData>[]): boolean {
  const ids = new Set(nodes.map((node) => node.id));
  return nodes.length === stageIds.length + 1 && ids.has('L0_AI_ECOSYSTEM') && stageIds.every((stageId) => ids.has(stageId));
}

function layoutStageBoard<TNodeData extends Record<string, unknown>, TEdgeData extends Record<string, unknown>>(
  nodes: Node<TNodeData>[],
  edges: Edge<TEdgeData>[],
): { nodes: Node<TNodeData>[]; edges: Edge<TEdgeData>[] } {
  const columns = typeof window !== 'undefined' && window.innerWidth < 1100 ? 2 : 4;
  const columnGap = typeof window !== 'undefined' && window.innerWidth < 1100 ? 30 : 48;
  const rowGap = 58;
  const startX = 24;
  const stageY = 150;
  const stageWidth = stageNode.width;
  const rootX = startX + ((stageWidth + columnGap) * (columns - 1)) / 2;

  const positions = new Map<string, { x: number; y: number }>([
    ['L0_AI_ECOSYSTEM', { x: rootX, y: 18 }],
  ]);

  stageIds.forEach((stageId, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    positions.set(stageId, {
      x: startX + column * (stageWidth + columnGap),
      y: stageY + row * (stageNode.height + rowGap),
    });
  });

  return {
    nodes: nodes.map((node) => ({ ...node, position: positions.get(node.id) ?? node.position })),
    edges,
  };
}

function compactWideRows<TNodeData extends Record<string, unknown>>(nodes: Node<TNodeData>[]): Node<TNodeData>[] {
  if (nodes.length < 12) return nodes;
  const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);
  const rows: Node<TNodeData>[][] = [];

  sorted.forEach((node) => {
    const last = rows[rows.length - 1];
    if (!last || Math.abs(last[0].position.y - node.position.y) > 70) {
      rows.push([node]);
    } else {
      last.push(node);
    }
  });

  let cursorY = Math.min(...nodes.map((node) => node.position.y));
  const compacted = new Map<string, Node<TNodeData>>();
  rows.forEach((row) => {
    const maxPerRow = row.length > 5 ? 4 : row.length;
    const rowHeight = Math.ceil(row.length / maxPerRow) * (normalNode.height + 28);
    const minX = Math.min(...row.map((node) => node.position.x));
    const startX = Math.max(20, minX);
    row.forEach((node, index) => {
      const size = sizeFor(node);
      compacted.set(node.id, {
        ...node,
        position: {
          x: startX + (index % maxPerRow) * (Math.max(size.width, normalNode.width) + 36),
          y: cursorY + Math.floor(index / maxPerRow) * (size.height + 28),
        },
      });
    });
    cursorY += rowHeight + 58;
  });

  return nodes.map((node) => compacted.get(node.id) ?? node);
}

export async function getLayoutedElements<TNodeData extends Record<string, unknown>, TEdgeData extends Record<string, unknown>>(
  nodes: Node<TNodeData>[],
  edges: Edge<TEdgeData>[],
  direction: LayoutDirection,
): Promise<{ nodes: Node<TNodeData>[]; edges: Edge<TEdgeData>[] }> {
  if (isRootStageBoard(nodes)) return layoutStageBoard(nodes, edges);

  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': direction,
      'elk.spacing.nodeNode': '54',
      'elk.layered.spacing.nodeNodeBetweenLayers': '96',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    },
    children: nodes.map((node) => ({ id: node.id, ...sizeFor(node) })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(elkGraph);
  const layoutedNodes = nodes.map((node) => {
    const layoutedNode = layoutedGraph.children?.find((child) => child.id === node.id);
    return {
      ...node,
      position: {
        x: layoutedNode?.x ?? node.position.x,
        y: layoutedNode?.y ?? node.position.y,
      },
    };
  });

  return { nodes: compactWideRows(layoutedNodes), edges };
}
