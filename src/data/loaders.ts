import Papa from 'papaparse';
import categoriesCsv from '../../data/categories.csv?raw';
import companiesPublicCsv from '../../data/companies_public_us_listed.csv?raw';
import companiesNonInvestableCsv from '../../data/companies_non_investable_bottlenecks.csv?raw';
import edgesCsv from '../../data/edges.csv?raw';
import mineralSuppliersCsv from '../../data/mineral_supplier_mapping.csv?raw';
import mineralsCsv from '../../data/minerals_to_ai_inputs.csv?raw';
import nodesCsv from '../../data/nodes.csv?raw';
import sourcesCsv from '../../data/sources.csv?raw';
import watchlistCsv from '../../data/watchlist_private_spac_ipo.csv?raw';
import { sampleData } from './sampleData';
import type {
  BottleneckLevel,
  CompanyStatus,
  Confidence,
  Source,
  SupplyChainData,
  SupplyChainEdge,
  SupplyChainNode,
} from './schema';

type CsvRow = Record<string, string>;

export interface ResearchCsvSnapshot {
  categories: CsvRow[];
  nodes: CsvRow[];
  edges: CsvRow[];
  publicCompanies: CsvRow[];
  nonInvestableCompanies: CsvRow[];
  watchlist: CsvRow[];
  minerals: CsvRow[];
  mineralSuppliers: CsvRow[];
  sources: CsvRow[];
}

export function parseCsv(raw: string): CsvRow[] {
  const result = Papa.parse<CsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });
  return result.data.filter((row) => Object.values(row).some(Boolean));
}

export function getResearchCsvSnapshot(): ResearchCsvSnapshot {
  return {
    categories: parseCsv(categoriesCsv),
    nodes: parseCsv(nodesCsv),
    edges: parseCsv(edgesCsv),
    publicCompanies: parseCsv(companiesPublicCsv),
    nonInvestableCompanies: parseCsv(companiesNonInvestableCsv),
    watchlist: parseCsv(watchlistCsv),
    minerals: parseCsv(mineralsCsv),
    mineralSuppliers: parseCsv(mineralSuppliersCsv),
    sources: parseCsv(sourcesCsv),
  };
}

function mapBottleneck(value?: string): BottleneckLevel | undefined {
  const normalized = value?.toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'severe') return 'critical';
  if (['low', 'medium', 'high', 'critical'].includes(normalized)) return normalized as BottleneckLevel;
  return undefined;
}

function mapConfidence(value?: string): Confidence | undefined {
  const normalized = value?.toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized;
  return undefined;
}

function mapPublicCompanyStatus(row: CsvRow): CompanyStatus {
  const country = row.country?.toLowerCase() ?? '';
  return country === 'us' ? 'us_listed_public' : 'us_listed_adr';
}

function mapNonInvestableStatus(row: CsvRow): CompanyStatus {
  const state = `${row.public_private_state} ${row.listing_status}`.toLowerCase();
  if (state.includes('state') || state.includes('soe')) return 'state_owned';
  if (state.includes('private')) return 'private';
  return 'non_us_listed';
}

function splitSourceIds(value?: string): string[] {
  return value
    ? value
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function splitSemicolon(value?: string): string[] {
  return value
    ? value
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function parseRank(value?: string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();
  items.forEach((item) => {
    if (!map.has(item.id)) map.set(item.id, item);
  });
  return Array.from(map.values());
}

function uniqueEdges(edges: SupplyChainEdge[]): SupplyChainEdge[] {
  const map = new Map<string, SupplyChainEdge>();
  edges.forEach((edge) => {
    const key = `${edge.source}->${edge.target}:${edge.relationshipType}`;
    if (!map.has(key)) map.set(key, { ...edge, id: key });
  });
  return Array.from(map.values());
}

export function adaptResearchCsvsToSupplyChainData(snapshot = getResearchCsvSnapshot()): SupplyChainData {
  const researchNodes: SupplyChainNode[] = snapshot.nodes.map((row) => ({
    id: row.node_id,
    label: row.name,
    type: row.level === '0' ? 'root' : Number(row.level) <= 1 ? 'category' : Number(row.level) === 5 ? 'material' : 'subcategory',
    parentId: row.parent_node_id || undefined,
    level: Number(row.level || 0),
    layer: row.name,
    description: row.description,
    whyItMatters: row.why_it_matters,
    bottleneckLevel: mapBottleneck(row.bottleneck_level),
    substitutability: row.substitutability as SupplyChainNode['substitutability'],
    dependsOn: splitSemicolon(row.depends_on),
    dependencyTypes: splitSemicolon(row.dependency_type),
    confidence: mapConfidence(row.confidence),
    tags: [row.node_type, row.name, row.notes].filter(Boolean),
    expanded: row.level === '0',
    sourceIds: [],
    notes: row.notes,
  }));

  const publicCompanies: SupplyChainNode[] = snapshot.publicCompanies.map((row) => ({
    id: row.company_id,
    label: row.name,
    type: 'company',
    parentId: row.category_node_id,
    level: 4,
    layer: row.market_segment || row.category_node_id,
    description: row.role,
    whyItMatters: row.why_top_3,
    ticker: row.ticker,
    exchange: row.exchange,
    country: row.country,
    status: mapPublicCompanyStatus(row),
    bottleneckLevel: mapBottleneck(row.bottleneck_exposure),
    purePlayScore: row.pure_play_score as SupplyChainNode['purePlayScore'],
    rankWithinNode: parseRank(row.rank_within_node),
    marketSegment: row.market_segment,
    role: row.role,
    confidence: mapConfidence(row.confidence),
    tags: [row.market_segment, row.role, row.key_risks, row.ticker].filter(Boolean),
    expanded: false,
    sourceIds: splitSourceIds(row.source_id),
    risks: row.key_risks ? row.key_risks.split(';').map((risk) => risk.trim()) : [],
  }));

  const nonInvestableCompanies: SupplyChainNode[] = snapshot.nonInvestableCompanies.map((row) => ({
    id: row.company_id,
    label: row.name,
    type: 'company',
    parentId: row.category_node_id,
    level: 4,
    layer: 'Non-Investable Bottlenecks',
    description: row.role,
    whyItMatters: row.why_it_matters,
    country: row.country,
    status: mapNonInvestableStatus(row),
    bottleneckLevel: mapBottleneck(row.bottleneck_exposure),
    confidence: mapConfidence(row.confidence),
    tags: [row.public_private_state, row.listing_status, row.role, row.key_risks].filter(Boolean),
    expanded: false,
    sourceIds: splitSourceIds(row.source_id),
    risks: row.key_risks ? row.key_risks.split(';').map((risk) => risk.trim()) : [],
    notes: row.why_not_investable_under_project_rules,
  }));

  const watchlistCompanies: SupplyChainNode[] = snapshot.watchlist.map((row) => ({
    id: row.company_id,
    label: row.name,
    type: 'watchlist',
    parentId: row.related_supply_chain_node,
    level: 4,
    layer: 'Watchlist / IPO-SPAC',
    description: row.current_status,
    whyItMatters: row.why_it_matters,
    status: 'watchlist_private_ipo_spac',
    bottleneckLevel: undefined,
    confidence: mapConfidence(row.confidence),
    tags: [row.current_status, row.rumored_or_announced_public_path, row.estimated_maturity, row.risks].filter(Boolean),
    expanded: false,
    sourceIds: splitSourceIds(row.source_id),
    publicPath: row.rumored_or_announced_public_path,
    estimatedMaturity: row.estimated_maturity,
    risks: row.risks ? row.risks.split(';').map((risk) => risk.trim()) : [],
    notes: row.rumored_or_announced_public_path,
  }));

  const mineralNodes: SupplyChainNode[] = snapshot.minerals.map((row) => ({
    id: row.mineral_id,
    label: row.mineral_name,
    type: 'mineral',
    parentId: 'L1_MINERALS',
    level: 5,
    layer: 'Minerals / Materials',
    description: row.ai_use_case,
    whyItMatters: row.used_in_component,
    bottleneckLevel: mapBottleneck(row.bottleneck_level),
    substitutability: row.substitutability as SupplyChainNode['substitutability'],
    confidence: mapConfidence(row.confidence),
    tags: [row.mineral_name, row.used_in_component, row.upstream_source_material, row.processing_step].filter(Boolean),
    expanded: false,
    sourceIds: splitSourceIds(row.source_id),
    notes: row.notes,
  }));

  const dependencyEdgesFromNodes: SupplyChainEdge[] = snapshot.nodes.flatMap((row) => {
    const dependsOn = splitSemicolon(row.depends_on);
    const dependencyTypes = splitSemicolon(row.dependency_type);
    return dependsOn.map((target, index) => ({
      id: `${row.node_id}->${target}:${dependencyTypes[index] ?? 'depends_on'}`,
      source: row.node_id,
      target,
      relationshipType: dependencyTypes[index] ?? 'depends_on',
      description: `${row.name} depends on ${target}`,
      criticality: mapBottleneck(row.bottleneck_level),
      confidence: mapConfidence(row.confidence),
      sourceIds: [],
    }));
  });

  const edges: SupplyChainEdge[] = uniqueEdges([
    ...snapshot.edges.map((row) => ({
      id: `${row.source_node_id}->${row.target_node_id}`,
      source: row.source_node_id,
      target: row.target_node_id,
      relationshipType: row.relationship_type,
      description: row.relationship_description,
      criticality: mapBottleneck(row.criticality),
      confidence: mapConfidence(row.confidence),
      sourceIds: splitSourceIds(row.source_id),
    })),
    ...dependencyEdgesFromNodes,
    ...[...publicCompanies, ...nonInvestableCompanies, ...watchlistCompanies, ...mineralNodes]
      .filter((row) => row.parentId)
      .map((row) => ({
        id: `${row.parentId}->${row.id}`,
        source: row.parentId!,
        target: row.id,
        relationshipType: 'mapped_to',
        description: `${row.label} is mapped to ${row.parentId}`,
        criticality: row.bottleneckLevel,
        confidence: row.confidence,
        sourceIds: row.sourceIds,
      })),
  ]);

  const sources: Source[] = snapshot.sources.map((row) => ({
    id: row.source_id,
    title: row.title,
    publisher: row.publisher,
    url: row.url,
    dateAccessed: row.date_accessed,
    reliabilityScore: row.reliability_score,
  }));

  return {
    nodes: uniqueById([...researchNodes, ...publicCompanies, ...nonInvestableCompanies, ...watchlistCompanies, ...mineralNodes]),
    edges,
    sources,
  };
}

export function loadExplorerData(): SupplyChainData {
  try {
    const data = adaptResearchCsvsToSupplyChainData();
    if (data.nodes.some((node) => node.id === 'L0_AI_ECOSYSTEM')) return data;
  } catch {
    return sampleData;
  }
  return sampleData;
}

export function getResearchStats(snapshot = getResearchCsvSnapshot()) {
  return {
    categories: snapshot.categories.length,
    nodes: snapshot.nodes.length,
    edges: snapshot.edges.length,
    publicCompanies: snapshot.publicCompanies.length,
    nonInvestableCompanies: snapshot.nonInvestableCompanies.length,
    watchlist: snapshot.watchlist.length,
    minerals: snapshot.minerals.length,
    sources: snapshot.sources.length,
  };
}
