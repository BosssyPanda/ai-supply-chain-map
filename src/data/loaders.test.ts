import { describe, expect, it } from 'vitest';
import { loadExplorerData } from './loaders';

describe('loadExplorerData', () => {
  it('loads the existing research CSV data as the primary app data source', () => {
    const data = loadExplorerData();

    expect(data.nodes.some((node) => node.id === 'L0_AI_ECOSYSTEM')).toBe(true);

    const nvidiaGpu = data.nodes.find((node) => node.id === 'COMP_NVDA_GPU');
    expect(nvidiaGpu).toMatchObject({
      label: 'NVIDIA',
      ticker: 'NVDA',
      parentId: 'L3_GPU',
      rankWithinNode: 1,
      status: 'us_listed_public',
    });

    expect(data.nodes.some((node) => node.id === 'WL_CEREBRAS' && node.type === 'watchlist')).toBe(true);
    expect(data.nodes.some((node) => node.id === 'NIB_OPENAI' && node.status === 'private')).toBe(true);
  });
});
