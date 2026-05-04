import { describe, expect, it } from 'vitest';
import { applySupplyChainFilters, defaultFilters } from './filters';
import type { SupplyChainNode } from '../data/schema';

const nodes: SupplyChainNode[] = [
  {
    id: 'company-asml',
    label: 'ASML',
    type: 'company',
    level: 3,
    layer: 'Semiconductor Creation',
    description: 'Lithography equipment.',
    whyItMatters: 'EUV monopoly.',
    ticker: 'ASML',
    exchange: 'NASDAQ',
    country: 'Netherlands',
    status: 'us_listed_adr',
    bottleneckLevel: 'critical',
    purePlayScore: 'high',
    tags: ['EUV'],
    expanded: false,
    sourceIds: [],
  },
  {
    id: 'company-sk-hynix',
    label: 'SK hynix',
    type: 'company',
    level: 3,
    layer: 'Memory / HBM',
    description: 'HBM supplier.',
    whyItMatters: 'HBM share leader.',
    country: 'South Korea',
    status: 'non_us_listed',
    bottleneckLevel: 'critical',
    purePlayScore: 'high',
    tags: ['HBM'],
    expanded: false,
    sourceIds: [],
  },
  {
    id: 'mineral-copper',
    label: 'Copper',
    type: 'mineral',
    level: 5,
    layer: 'Minerals / Materials',
    description: 'Transformer and grid wiring metal.',
    whyItMatters: 'Volume bottleneck.',
    country: 'Global',
    bottleneckLevel: 'high',
    tags: ['copper', 'transformers'],
    expanded: false,
    sourceIds: [],
  },
];

describe('applySupplyChainFilters', () => {
  it('filters by U.S.-listed only and ADR status', () => {
    expect(
      applySupplyChainFilters(nodes, {
        ...defaultFilters,
        usListedOnly: true,
      }).map((node) => node.id),
    ).toEqual(['company-asml']);

    expect(
      applySupplyChainFilters(nodes, {
        ...defaultFilters,
        statuses: ['us_listed_adr'],
      }).map((node) => node.id),
    ).toEqual(['company-asml']);
  });

  it('filters by layer, severity, geography, material, and pure-play score', () => {
    expect(
      applySupplyChainFilters(nodes, {
        ...defaultFilters,
        layers: ['Minerals / Materials'],
        bottleneckLevels: ['high'],
        geographies: ['Global'],
        material: 'copper',
      }).map((node) => node.id),
    ).toEqual(['mineral-copper']);

    expect(
      applySupplyChainFilters(nodes, {
        ...defaultFilters,
        purePlayScores: ['high'],
        showMinerals: false,
      }).map((node) => node.id),
    ).toEqual(['company-asml', 'company-sk-hynix']);
  });
});
