import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { SupplyChainNode } from '../../data/schema';
import { CompanyDetail } from './CompanyDetail';

const sourcedNodeWithDemoFinancials: SupplyChainNode = {
  id: 'TEST_COMPANY',
  label: 'Test Infrastructure',
  type: 'company',
  level: 4,
  layer: 'Networking',
  description: 'A test company with source-backed supply-chain fields.',
  whyItMatters: 'Included to verify the detail panel does not surface fallback financial values.',
  ticker: 'TEST',
  exchange: 'NASDAQ',
  country: 'US',
  status: 'us_listed_public',
  bottleneckLevel: 'high',
  purePlayScore: 'medium',
  confidence: 'high',
  tags: ['networking'],
  expanded: false,
  sourceIds: ['SRC_TEST'],
  financials: {
    revenue: '$999B',
    marketCap: '$4T',
    grossMargin: '99%',
    freeCashFlow: '$123B',
  },
};

const sources = [
  {
    id: 'SRC_TEST',
    title: 'Test source',
    publisher: 'Test publisher',
    url: 'https://example.com',
    dateAccessed: '2026-05-04',
    reliabilityScore: 'high',
  },
];

describe('CompanyDetail', () => {
  it('keeps financial fields pending instead of rendering fallback financial values', () => {
    const html = renderToStaticMarkup(
      <CompanyDetail node={sourcedNodeWithDemoFinancials} upstream={[]} downstream={[]} sources={sources} compact />,
    );

    expect(html).toContain('Financial data');
    expect(html).toContain('Data pending');
    expect(html).not.toContain('$999B');
    expect(html).not.toContain('$4T');
    expect(html).not.toContain('99%');
    expect(html).not.toContain('$123B');
    expect(html).not.toContain('Complete');
  });
});
