import { describe, expect, it } from 'vitest';
import { getResearchCsvSnapshot, loadExplorerData } from '../data/loaders';
import {
  dataPending,
  getBottleneckCategoryReports,
  getDerivedReportStats,
  getLatestSourceDate,
  getMaterialCategoryReports,
  getOverviewFocusCompanies,
  getOverviewStages,
  getWatchlistGroups,
} from './reportSelectors';

const data = loadExplorerData();
const snapshot = getResearchCsvSnapshot();

describe('report selectors', () => {
  it('derives overview stats and five editorial stages from current research data', () => {
    const stats = getDerivedReportStats(data, snapshot);
    const stages = getOverviewStages(data);

    expect(stats.mappedCompanies).toBe(data.nodes.filter((node) => node.type === 'company' || node.type === 'watchlist').length);
    expect(stats.sources).toBe(snapshot.sources.length);
    expect(stats.confidencePercent).toBeGreaterThan(0);
    expect(stats.confidencePercent).toBeLessThanOrEqual(100);
    expect(stages.map((stage) => stage.title)).toEqual([
      'Models & Cloud',
      'Compute & Chips',
      'Data Centers & Networking',
      'Power & Cooling',
      'Materials & Minerals',
    ]);
    expect(stages.every((stage) => stage.keyEnablers.length > 0)).toBe(true);
  });

  it('groups materials into fixed AI-relevance categories with supplier proxies', () => {
    const categories = getMaterialCategoryReports(data, snapshot);

    expect(categories.map((category) => category.title)).toEqual([
      'Silicon & Wafers',
      'Copper & Conductors',
      'Rare Earths & Magnets',
      'Chemicals & Industrial Gases',
      'Thermal & Battery Materials',
    ]);
    expect(categories.find((category) => category.id === 'copper-conductors')?.supplierRows.some((row) => row.company_name === 'Freeport-McMoRan')).toBe(true);
    expect(categories.find((category) => category.id === 'rare-earths-magnets')?.materials.some((node) => node.label.includes('Rare earths'))).toBe(true);
  });

  it('derives bottleneck categories and affected companies without merging public and non-investable rows', () => {
    const categories = getBottleneckCategoryReports(data);
    const hbm = categories.find((category) => category.id === 'hbm-memory');

    expect(categories.map((category) => category.title)).toContain('GPUs & Accelerators');
    expect(hbm?.severity).toBe('critical');
    expect(hbm?.affectedCompanies.map((node) => node.label)).toContain('Micron Technology');
    expect(hbm?.affectedCompanies.map((node) => node.label)).toContain('SK hynix');
  });

  it('separates watchlist research groups and resolves data-pending text', () => {
    const groups = getWatchlistGroups(data);

    expect(groups.publicPath.some((node) => node.label === 'Cerebras Systems')).toBe(true);
    expect(groups.privateNames.length).toBeGreaterThan(0);
    expect(getLatestSourceDate(data.sources)).toBe(data.sources.map((source) => source.dateAccessed).filter(Boolean).sort().at(-1));
    expect(dataPending()).toBe('Data pending — source needed');
    expect(dataPending('Mapped')).toBe('Mapped');
  });

  it('derives overview focus companies from networking and interconnect research fields', () => {
    const focusCompanies = getOverviewFocusCompanies(data);

    expect(focusCompanies).toHaveLength(3);
    expect(focusCompanies.every((node) => node.type === 'company')).toBe(true);
    expect(
      focusCompanies.every((node) =>
        [node.id, node.label, node.layer, node.description, node.whyItMatters, node.marketSegment, node.role, node.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .match(/network|interconnect|switch|optical|ethernet|infiniband/),
      ),
    ).toBe(true);
  });
});
