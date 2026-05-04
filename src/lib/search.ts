import type { SearchResult, SupplyChainNode } from '../data/schema';

function haystackFor(node: SupplyChainNode): Record<string, string> {
  return {
    label: node.label,
    ticker: node.ticker ?? '',
    layer: node.layer,
    country: node.country ?? '',
    description: node.description,
    whyItMatters: node.whyItMatters,
    tags: node.tags.join(' '),
    risks: node.risks?.join(' ') ?? '',
    notes: node.notes ?? '',
  };
}

export function searchSupplyChain(nodes: SupplyChainNode[], query: string): SupplyChainNode[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return nodes;
  return searchSupplyChainDetailed(nodes, normalizedQuery).map((result) => result.node);
}

export function searchSupplyChainDetailed(nodes: SupplyChainNode[], query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return nodes.map((node) => ({ node, score: 0, matchedFields: [] }));
  }

  return nodes
    .map((node) => {
      const fields = haystackFor(node);
      const matchedFields: string[] = [];
      let score = 0;

      Object.entries(fields).forEach(([field, value]) => {
        const normalizedValue = value.toLowerCase();
        if (!normalizedValue.includes(normalizedQuery)) return;
        matchedFields.push(field);
        score += field === 'ticker' ? 8 : field === 'label' ? 6 : field === 'risks' ? 5 : field === 'tags' ? 4 : 2;
        if (normalizedValue === normalizedQuery) score += 4;
      });

      return { node, score, matchedFields };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label));
}
