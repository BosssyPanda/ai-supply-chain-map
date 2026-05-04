import { describe, expect, it } from 'vitest';
import { loadExplorerData } from '../data/loaders';
import { buildFocusGraph } from './focusGraph';

const data = loadExplorerData();

describe('buildFocusGraph', () => {
  it('shows a compact staged board for the root instead of every raw L1 node', () => {
    const graph = buildFocusGraph(data, {
      selectedNodeId: 'L0_AI_ECOSYSTEM',
      supplierDepth: 2,
      maxRelatedPerGroup: 8,
      viewMode: 'category',
    });

    expect(graph.nodes.map((node) => node.id)).toEqual([
      'L0_AI_ECOSYSTEM',
      'stage-demand',
      'stage-models-cloud',
      'stage-compute',
      'stage-semiconductor',
      'stage-data-centers',
      'stage-power-cooling',
      'stage-materials',
      'stage-policy-capital-labor',
    ]);
    expect(graph.nodes.some((node) => node.id === 'L1_APPLICATIONS')).toBe(false);
  });

  it('expands power/grid/cooling into a bounded stage cluster with overflow', () => {
    const graph = buildFocusGraph(data, {
      selectedNodeId: 'stage-power-cooling',
      supplierDepth: 2,
      maxRelatedPerGroup: 6,
      maxVisibleNodes: 18,
      focusMode: true,
    });

    const ids = graph.nodes.map((node) => node.id);
    expect(ids).toContain('stage-power-cooling');
    expect(ids).toContain('L1_DC_POWER_INTERNAL');
    expect(ids.some((id) => id.startsWith('overflow-stage-power-cooling'))).toBe(true);
  });

  it('supplier depth changes upstream reach for a component', () => {
    const depthOne = buildFocusGraph(data, {
      selectedNodeId: 'L3_GPU',
      supplierDepth: 1,
      maxRelatedPerGroup: 8,
      focusMode: true,
    });
    const depthThree = buildFocusGraph(data, {
      selectedNodeId: 'L3_GPU',
      supplierDepth: 3,
      maxRelatedPerGroup: 8,
      focusMode: true,
    });

    expect(depthThree.nodes.length).toBeGreaterThan(depthOne.nodes.length);
  });

  it('caps all supplier depth outside focus mode', () => {
    const graph = buildFocusGraph(data, {
      selectedNodeId: 'L3_GPU',
      supplierDepth: 'all',
      maxRelatedPerGroup: 8,
      focusMode: false,
      maxVisibleNodes: 24,
    });

    expect(graph.nodes.length).toBeLessThanOrEqual(24);
  });

  it('keeps geography and risk views distinct', () => {
    const geography = buildFocusGraph(data, {
      selectedNodeId: 'L0_AI_ECOSYSTEM',
      supplierDepth: 2,
      viewMode: 'geography',
    });
    const risk = buildFocusGraph(data, {
      selectedNodeId: 'L0_AI_ECOSYSTEM',
      supplierDepth: 2,
      viewMode: 'risk',
    });

    expect(geography.nodes.some((node) => node.type === 'geography')).toBe(true);
    expect(risk.nodes.some((node) => node.type === 'risk')).toBe(true);
  });

  it('builds a bounded supplier tree around a selected component', () => {
    const graph = buildFocusGraph(data, {
      selectedNodeId: 'L3_GPU',
      supplierDepth: 2,
      maxRelatedPerGroup: 8,
    });

    const ids = graph.nodes.map((node) => node.id);
    expect(ids).toContain('L3_GPU');
    expect(ids).toContain('L2_AI_ACCELERATORS');
    expect(ids).toContain('L4_HBM');
    expect(ids).toContain('L2_LEADING_EDGE_FOUNDRY');
    expect(ids).toContain('L2_COWOS');
    expect(ids.length).toBeLessThanOrEqual(24);
  });

  it('keeps upstream-root and downstream-customer focus modes visibly distinct', () => {
    const upstream = buildFocusGraph(data, {
      selectedNodeId: 'L1_COMPUTE',
      supplierDepth: 2,
      maxRelatedPerGroup: 8,
      focusMode: true,
      explorationMode: 'upstream',
    });
    const downstream = buildFocusGraph(data, {
      selectedNodeId: 'L1_COMPUTE',
      supplierDepth: 2,
      maxRelatedPerGroup: 8,
      focusMode: true,
      explorationMode: 'downstream',
    });

    const upstreamIds = upstream.nodes.map((node) => node.id);
    const downstreamIds = downstream.nodes.map((node) => node.id);

    expect(upstreamIds).toContain('L1_FAB');
    expect(upstreamIds).not.toContain('L1_TRAIN_INFER_PLATFORMS');
    expect(downstreamIds).toContain('L1_TRAIN_INFER_PLATFORMS');
    expect(downstreamIds).not.toContain('L1_FAB');
  });
});
