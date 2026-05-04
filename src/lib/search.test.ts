import { describe, expect, it } from 'vitest';
import { searchSupplyChain } from './search';
import type { SupplyChainNode } from '../data/schema';

const nodes: SupplyChainNode[] = [
  {
    id: 'company-nvidia',
    label: 'NVIDIA',
    type: 'company',
    level: 3,
    layer: 'AI Accelerators',
    description: 'Data-center GPUs and AI networking.',
    whyItMatters: 'Anchor supplier for training compute.',
    ticker: 'NVDA',
    exchange: 'NASDAQ',
    country: 'US',
    status: 'us_listed_public',
    bottleneckLevel: 'critical',
    tags: ['gpu', 'cuda'],
    risks: ['HBM supply', 'export controls'],
    expanded: false,
    sourceIds: [],
  },
  {
    id: 'material-gallium',
    label: 'Gallium',
    type: 'mineral',
    level: 5,
    layer: 'Minerals / Materials',
    description: 'Refined gallium for compound semiconductors.',
    whyItMatters: 'China-heavy refining chain.',
    country: 'China',
    bottleneckLevel: 'critical',
    tags: ['GaN', 'export controls'],
    expanded: false,
    sourceIds: [],
  },
];

describe('searchSupplyChain', () => {
  it('finds nodes by ticker, label, material tag, and risk text', () => {
    expect(searchSupplyChain(nodes, 'nvda').map((node) => node.id)).toEqual(['company-nvidia']);
    expect(searchSupplyChain(nodes, 'gallium').map((node) => node.id)).toEqual(['material-gallium']);
    expect(searchSupplyChain(nodes, 'export controls').map((node) => node.id)).toEqual([
      'company-nvidia',
      'material-gallium',
    ]);
  });

  it('returns all nodes for an empty query', () => {
    expect(searchSupplyChain(nodes, '')).toHaveLength(2);
  });
});
