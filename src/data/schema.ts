export type NodeType =
  | 'root'
  | 'category'
  | 'subcategory'
  | 'component'
  | 'company'
  | 'material'
  | 'mineral'
  | 'risk'
  | 'policy'
  | 'geography'
  | 'watchlist';

export type CompanyStatus =
  | 'us_listed_public'
  | 'us_listed_adr'
  | 'private'
  | 'state_owned'
  | 'non_us_listed'
  | 'watchlist_private_ipo_spac'
  | 'etf_optional';

export type BottleneckLevel = 'low' | 'medium' | 'high' | 'critical';

export type Confidence = 'low' | 'medium' | 'high';
export type PurePlayScore = 'low' | 'medium' | 'high';
export type LayoutDirection = 'DOWN' | 'RIGHT';
export type GraphViewMode = 'category' | 'geography' | 'risk' | 'custom';

export interface CompanyFinancials {
  revenue?: string;
  grossMargin?: string;
  operatingMargin?: string;
  marketCap?: string;
  evEbitda?: string;
  debt?: string;
  freeCashFlow?: string;
  year?: string;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  dateAccessed?: string;
  reliabilityScore?: Confidence | string;
}

export interface SupplyChainNode {
  id: string;
  label: string;
  type: NodeType;
  parentId?: string;
  level: number;
  layer: string;
  description: string;
  whyItMatters: string;
  ticker?: string;
  exchange?: string;
  country?: string;
  status?: CompanyStatus;
  bottleneckLevel?: BottleneckLevel;
  substitutability?: 'none' | 'low' | 'medium' | 'high';
  purePlayScore?: PurePlayScore;
  rankWithinNode?: number;
  marketSegment?: string;
  role?: string;
  dependsOn?: string[];
  dependencyTypes?: string[];
  publicPath?: string;
  estimatedMaturity?: string;
  virtual?: boolean;
  confidence?: Confidence;
  tags: string[];
  expanded: boolean;
  sourceIds: string[];
  financials?: CompanyFinancials;
  customers?: string[];
  suppliers?: string[];
  risks?: string[];
  notes?: string;
}

export interface SupplyChainEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: string;
  description: string;
  criticality?: BottleneckLevel;
  confidence?: Confidence;
  sourceIds: string[];
}

export interface SupplyChainData {
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  sources: Source[];
}

export interface GraphFilters {
  layers: string[];
  statuses: CompanyStatus[];
  bottleneckLevels: BottleneckLevel[];
  geographies: string[];
  material: string;
  purePlayScores: PurePlayScore[];
  usListedOnly: boolean;
  adrOnly: boolean;
  showCompanies: boolean;
  showNonInvestable: boolean;
  showMinerals: boolean;
  showWatchlist: boolean;
}

export interface GraphViewState {
  direction: LayoutDirection;
  focusNodeId?: string;
  directDependenciesOnly: boolean;
  showUpstreamRoots: boolean;
  showDownstreamCustomers: boolean;
}

export interface SearchResult {
  node: SupplyChainNode;
  score: number;
  matchedFields: string[];
}
