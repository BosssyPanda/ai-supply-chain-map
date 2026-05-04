import { describe, expect, it } from 'vitest';
import { loadExplorerData } from '../data/loaders';
import {
  getNonInvestableBottlenecksForNode,
  getTopRankedCompaniesForNode,
  getWatchlistMentionsForNode,
} from './researchSelectors';

const data = loadExplorerData();

describe('research ranking selectors', () => {
  it('returns top ranked U.S.-listed companies for a selected supply-chain node', () => {
    expect(getTopRankedCompaniesForNode(data, 'L3_GPU').map((node) => node.ticker)).toEqual(['NVDA', 'AMD', 'INTC']);
  });

  it('keeps watchlist and non-investable bottlenecks separate from public rankings', () => {
    expect(getWatchlistMentionsForNode(data, 'L3_AI_STARTUP_ASIC').map((node) => node.label)).toContain('Cerebras Systems');

    const hbmTopCompanies = getTopRankedCompaniesForNode(data, 'L2_HBM');
    expect(hbmTopCompanies.every((node) => node.status === 'us_listed_public' || node.status === 'us_listed_adr')).toBe(true);
    expect(hbmTopCompanies.map((node) => node.label)).not.toContain('SK hynix');

    expect(getNonInvestableBottlenecksForNode(data, 'L2_HBM').map((node) => node.label)).toContain('SK hynix');
  });
});
