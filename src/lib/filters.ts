import type { CompanyStatus, GraphFilters, SupplyChainNode } from '../data/schema';

export const defaultFilters: GraphFilters = {
  layers: [],
  statuses: [],
  bottleneckLevels: [],
  geographies: [],
  material: '',
  purePlayScores: [],
  usListedOnly: false,
  adrOnly: false,
  showCompanies: true,
  showNonInvestable: true,
  showMinerals: true,
  showWatchlist: true,
};

const usListedStatuses: CompanyStatus[] = ['us_listed_public', 'us_listed_adr'];
const nonInvestableStatuses: CompanyStatus[] = ['private', 'state_owned', 'non_us_listed'];

export function isUsListed(status?: CompanyStatus): boolean {
  return status ? usListedStatuses.includes(status) : false;
}

export function isNonInvestable(status?: CompanyStatus): boolean {
  return status ? nonInvestableStatuses.includes(status) : false;
}

export function applySupplyChainFilters(nodes: SupplyChainNode[], filters: GraphFilters): SupplyChainNode[] {
  const materialQuery = filters.material.trim().toLowerCase();

  return nodes.filter((node) => {
    if (!filters.showCompanies && node.type === 'company') return false;
    if (!filters.showMinerals && (node.type === 'mineral' || node.type === 'material')) return false;
    if (!filters.showWatchlist && node.type === 'watchlist') return false;
    if (!filters.showNonInvestable && isNonInvestable(node.status)) return false;
    if (filters.usListedOnly && !isUsListed(node.status)) return false;
    if (filters.adrOnly && node.status !== 'us_listed_adr') return false;
    if (filters.layers.length > 0 && !filters.layers.includes(node.layer)) return false;
    if (filters.statuses.length > 0 && (!node.status || !filters.statuses.includes(node.status))) return false;
    if (filters.bottleneckLevels.length > 0 && (!node.bottleneckLevel || !filters.bottleneckLevels.includes(node.bottleneckLevel))) return false;
    if (filters.geographies.length > 0 && (!node.country || !filters.geographies.includes(node.country))) return false;
    if (filters.purePlayScores.length > 0 && (!node.purePlayScore || !filters.purePlayScores.includes(node.purePlayScore))) return false;

    if (materialQuery) {
      const text = [node.label, node.layer, node.description, node.whyItMatters, node.tags.join(' '), node.notes ?? '']
        .join(' ')
        .toLowerCase();
      if (!text.includes(materialQuery)) return false;
    }

    return true;
  });
}

export function uniqueLayers(nodes: SupplyChainNode[]): string[] {
  return Array.from(new Set(nodes.map((node) => node.layer))).sort();
}

export function uniqueGeographies(nodes: SupplyChainNode[]): string[] {
  return Array.from(new Set(nodes.map((node) => node.country).filter(Boolean) as string[])).sort();
}
