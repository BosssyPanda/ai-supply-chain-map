import type { Source, SupplyChainData, SupplyChainEdge, SupplyChainNode } from './schema';

const sourceIds = ['SRC_SAMPLE_RESEARCH'];

function node(input: Omit<SupplyChainNode, 'tags' | 'expanded' | 'sourceIds'> & Partial<Pick<SupplyChainNode, 'tags' | 'expanded' | 'sourceIds'>>): SupplyChainNode {
  return {
    tags: [],
    expanded: false,
    sourceIds,
    confidence: 'medium',
    ...input,
  };
}

function edge(source: string, target: string, relationshipType = 'contains', criticality: SupplyChainEdge['criticality'] = 'medium'): SupplyChainEdge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    relationshipType,
    description: `${source} ${relationshipType} ${target}`,
    criticality,
    confidence: 'medium',
    sourceIds,
  };
}

const topLevel = [
  ['cat-applications', 'Applications', 'AI software demand entering the infrastructure stack.'],
  ['cat-models', 'Models', 'Frontier and open model developers that translate compute into AI capability.'],
  ['cat-cloud', 'Cloud Platforms', 'Hyperscale compute platforms buying the largest accelerator clusters.'],
  ['cat-neocloud', 'GPU Cloud / Neocloud', 'Specialized GPU rental providers and sovereign-AI infrastructure builders.'],
  ['cat-accelerators', 'AI Accelerators', 'GPUs, custom ASICs, CPUs, FPGAs, and data-processing silicon.'],
  ['cat-semi-design', 'Semiconductor Design', 'Chip designers, IP, and the design workflow.'],
  ['cat-eda-ip', 'EDA / IP', 'Design automation and licensed IP needed to tape out advanced chips.'],
  ['cat-foundries', 'Foundries', 'Leading-edge and specialty wafer fabrication.'],
  ['cat-packaging', 'Advanced Packaging', '2.5D and 3D assembly that attaches HBM to logic.'],
  ['cat-memory', 'Memory / HBM', 'HBM, DRAM, and NAND feeding AI servers.'],
  ['cat-networking', 'Networking', 'Switch silicon, routers, NICs, and optical links.'],
  ['cat-servers', 'Servers / OEMs', 'AI rack, server, and storage integration.'],
  ['cat-data-centers', 'Data Centers', 'Physical colocation, hyperscale sites, and operators.'],
  ['cat-power-grid', 'Power / Grid', 'Generation, grid interconnect, transformers, and fuel chains.'],
  ['cat-cooling-water', 'Cooling / Water', 'Air, liquid, immersion, and water-treatment systems.'],
  ['cat-construction-land', 'Construction / Land', 'EPC, specialty trades, land, and real estate constraints.'],
  ['cat-minerals', 'Minerals / Materials', 'Root metals, gases, and minerals needed by chips and data centers.'],
  ['cat-chemicals-gases', 'Chemicals / Gases', 'Photoresists, process chemicals, gases, and cleanroom inputs.'],
  ['cat-logistics', 'Logistics', 'Shipping, warehousing, and heavy-equipment movement.'],
  ['cat-policy', 'Policy / Geopolitics', 'Export controls, subsidies, permits, and local politics.'],
  ['cat-finance', 'Finance', 'Debt, project finance, leases, and infrastructure capital.'],
  ['cat-labor', 'Labor / Talent', 'Specialized AI, fab, grid, and construction workforce.'],
] as const;

const categoryNodes: SupplyChainNode[] = topLevel.map(([id, label, description]) =>
  node({
    id,
    label,
    type: 'category',
    parentId: 'root-ai-supply-chain',
    level: 1,
    layer: label,
    description,
    whyItMatters: description,
    bottleneckLevel: id === 'cat-policy' ? 'high' : id.includes('power') || id.includes('minerals') ? 'critical' : 'medium',
    tags: label.toLowerCase().split(/[\s/]+/),
  }),
);

const nodes: SupplyChainNode[] = [
  node({
    id: 'root-ai-supply-chain',
    label: 'AI Supply Chain',
    type: 'root',
    level: 0,
    layer: 'AI Supply Chain',
    description: 'Interactive map from AI demand to compute, data centers, power, chemicals, minerals, finance, policy, and labor.',
    whyItMatters: 'Keeps the full physical supply chain separate from the narrower U.S.-listed investable map.',
    bottleneckLevel: 'critical',
    expanded: true,
    tags: ['ai', 'supply chain', 'infrastructure'],
  }),
  ...categoryNodes,

  node({ id: 'sub-enterprise-software', label: 'Enterprise Software', type: 'subcategory', parentId: 'cat-applications', level: 2, layer: 'Applications', description: 'Enterprise AI applications and copilots.', whyItMatters: 'Demand layer for model and cloud usage.', tags: ['enterprise', 'applications'] }),
  node({ id: 'co-microsoft-apps', label: 'Microsoft', type: 'company', parentId: 'sub-enterprise-software', level: 3, layer: 'Applications', description: 'Enterprise software and cloud provider with Copilot and Azure AI exposure.', whyItMatters: 'Large buyer and seller of AI services.', ticker: 'MSFT', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['copilot', 'azure'], financials: { revenue: '$245B', marketCap: '$3T+', year: 'illustrative' }, customers: ['Enterprise customers'], suppliers: ['NVIDIA', 'OpenAI', 'Data centers'], risks: ['AI capex efficiency', 'Model partner concentration'] }),
  node({ id: 'co-adobe', label: 'Adobe', type: 'company', parentId: 'sub-enterprise-software', level: 3, layer: 'Applications', description: 'Creative and document software with generative AI features.', whyItMatters: 'Application-layer AI monetization example.', ticker: 'ADBE', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['creative ai', 'firefly'], risks: ['Competitive AI tools'] }),
  node({ id: 'co-salesforce', label: 'Salesforce', type: 'company', parentId: 'sub-enterprise-software', level: 3, layer: 'Applications', description: 'CRM and enterprise workflow software with AI agents.', whyItMatters: 'Enterprise AI demand proxy.', ticker: 'CRM', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['agents', 'crm'] }),
  node({ id: 'co-servicenow', label: 'ServiceNow', type: 'company', parentId: 'sub-enterprise-software', level: 3, layer: 'Applications', description: 'Workflow automation platform with AI copilots and agents.', whyItMatters: 'Enterprise AI workflow demand.', ticker: 'NOW', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['workflow', 'agents'] }),
  node({ id: 'sub-consumer-ai', label: 'Consumer AI', type: 'subcategory', parentId: 'cat-applications', level: 2, layer: 'Applications', description: 'Consumer-facing AI products and productivity tools.', whyItMatters: 'Shows demand outside enterprise IT.', tags: ['consumer', 'applications'] }),
  node({ id: 'co-perplexity', label: 'Perplexity', type: 'watchlist', parentId: 'sub-consumer-ai', level: 3, layer: 'Applications', description: 'Private AI search and answer engine.', whyItMatters: 'Private consumer AI demand source.', country: 'US', status: 'private', bottleneckLevel: 'low', tags: ['search', 'private'], risks: ['Private company', 'Content licensing'] }),
  node({ id: 'co-midjourney', label: 'Midjourney', type: 'watchlist', parentId: 'sub-consumer-ai', level: 3, layer: 'Applications', description: 'Private image-generation company.', whyItMatters: 'Generative media workload demand.', country: 'US', status: 'private', bottleneckLevel: 'low', tags: ['image generation'] }),
  node({ id: 'co-duolingo', label: 'Duolingo', type: 'company', parentId: 'sub-consumer-ai', level: 3, layer: 'Applications', description: 'Consumer education app using AI features.', whyItMatters: 'AI app demand example with a U.S.-listed ticker.', ticker: 'DUOL', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['consumer ai'] }),
  node({ id: 'co-notion', label: 'Notion', type: 'watchlist', parentId: 'sub-consumer-ai', level: 3, layer: 'Applications', description: 'Private productivity and AI workspace company.', whyItMatters: 'Watchlist application-layer AI name.', country: 'US', status: 'watchlist_private_ipo_spac', bottleneckLevel: 'low', tags: ['productivity', 'watchlist'] }),

  node({ id: 'sub-foundation-models', label: 'Foundation Models', type: 'subcategory', parentId: 'cat-models', level: 2, layer: 'Models', description: 'Model labs driving training and inference demand.', whyItMatters: 'Sets demand for accelerators, cloud, data, and power.', bottleneckLevel: 'high', tags: ['models'] }),
  node({ id: 'co-openai', label: 'OpenAI', type: 'watchlist', parentId: 'sub-foundation-models', level: 3, layer: 'Models', description: 'Private frontier model lab.', whyItMatters: 'Major compute demand driver and non-investable bottleneck customer.', country: 'US', status: 'private', bottleneckLevel: 'critical', tags: ['frontier model', 'private'], customers: ['Enterprise AI users'], suppliers: ['Microsoft Azure', 'NVIDIA', 'Data centers'], risks: ['Private company', 'Governance', 'Compute commitments'] }),
  node({ id: 'co-anthropic', label: 'Anthropic', type: 'watchlist', parentId: 'sub-foundation-models', level: 3, layer: 'Models', description: 'Private frontier model lab.', whyItMatters: 'Large cloud and accelerator buyer through partners.', country: 'US', status: 'private', bottleneckLevel: 'high', tags: ['frontier model'], suppliers: ['AWS', 'Google Cloud'] }),
  node({ id: 'co-deepmind', label: 'Google DeepMind', type: 'company', parentId: 'sub-foundation-models', level: 3, layer: 'Models', description: 'Alphabet AI lab behind Gemini and research models.', whyItMatters: 'Captive model demand tied to Google Cloud and TPU supply.', ticker: 'GOOGL', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['gemini', 'tpu'] }),
  node({ id: 'co-meta-ai', label: 'Meta AI', type: 'company', parentId: 'sub-foundation-models', level: 3, layer: 'Models', description: 'Meta AI and open Llama model ecosystem.', whyItMatters: 'Large GPU buyer and open-weight model distributor.', ticker: 'META', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['llama', 'open model'] }),
  node({ id: 'sub-model-infra', label: 'Model Infrastructure', type: 'subcategory', parentId: 'cat-models', level: 2, layer: 'Models', description: 'Tools that host, tune, evaluate, and serve model workloads.', whyItMatters: 'Makes compute usable by developers.', tags: ['inference', 'mlops'] }),
  node({ id: 'co-huggingface', label: 'Hugging Face', type: 'watchlist', parentId: 'sub-model-infra', level: 3, layer: 'Models', description: 'Private model hub and tooling platform.', whyItMatters: 'Important non-public developer infrastructure.', country: 'US/France', status: 'watchlist_private_ipo_spac', bottleneckLevel: 'medium', tags: ['model hub'] }),
  node({ id: 'co-wandb', label: 'Weights & Biases', type: 'watchlist', parentId: 'sub-model-infra', level: 3, layer: 'Models', description: 'Private MLOps and experiment-tracking platform.', whyItMatters: 'Operational layer for model development.', country: 'US', status: 'private', bottleneckLevel: 'low', tags: ['mlops'] }),
  node({ id: 'co-pinecone', label: 'Pinecone', type: 'watchlist', parentId: 'sub-model-infra', level: 3, layer: 'Models', description: 'Private vector database company.', whyItMatters: 'RAG infrastructure and data retrieval layer.', country: 'US', status: 'private', bottleneckLevel: 'low', tags: ['vector database'] }),

  node({ id: 'co-aws', label: 'AWS', type: 'company', parentId: 'cat-cloud', level: 2, layer: 'Cloud Platforms', description: 'Amazon Web Services with Trainium, Inferentia, Bedrock, and hyperscale GPU capacity.', whyItMatters: 'One of the largest buyers and providers of AI infrastructure.', ticker: 'AMZN', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['cloud', 'trainium'], suppliers: ['NVIDIA', 'Broadcom', 'Data centers'], risks: ['Capex intensity'] }),
  node({ id: 'co-azure', label: 'Microsoft Azure', type: 'company', parentId: 'cat-cloud', level: 2, layer: 'Cloud Platforms', description: 'Azure cloud platform and OpenAI infrastructure partner.', whyItMatters: 'Central buyer of GPUs, data-center capacity, and power.', ticker: 'MSFT', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['azure', 'openai'] }),
  node({ id: 'co-gcp', label: 'Google Cloud', type: 'company', parentId: 'cat-cloud', level: 2, layer: 'Cloud Platforms', description: 'Google Cloud and TPU infrastructure.', whyItMatters: 'Combines cloud, model lab, and captive ASIC stack.', ticker: 'GOOGL', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['gcp', 'tpu'] }),
  node({ id: 'co-oci', label: 'Oracle Cloud Infrastructure', type: 'company', parentId: 'cat-cloud', level: 2, layer: 'Cloud Platforms', description: 'Oracle cloud infrastructure with large AI training cluster deals.', whyItMatters: 'Important specialized cloud buyer of GPUs and networking.', ticker: 'ORCL', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'low', tags: ['oci', 'cloud'] }),
  node({ id: 'co-coreweave', label: 'CoreWeave', type: 'company', parentId: 'cat-neocloud', level: 2, layer: 'GPU Cloud / Neocloud', description: 'Public GPU cloud provider focused on accelerated compute.', whyItMatters: 'Pure-play public neocloud exposure and large NVIDIA capacity buyer.', ticker: 'CRWV', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['gpu cloud', 'neocloud'], risks: ['Customer concentration', 'Lease and debt intensity'] }),

  node({ id: 'co-nvidia', label: 'NVIDIA', type: 'company', parentId: 'cat-accelerators', level: 2, layer: 'AI Accelerators', description: 'Dominant data-center GPU, networking, and AI systems supplier.', whyItMatters: 'Structural center of training and inference compute.', ticker: 'NVDA', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', substitutability: 'low', tags: ['gpu', 'cuda', 'accelerator'], financials: { revenue: '$130B+', grossMargin: 'high', marketCap: '$3T+', year: 'illustrative' }, customers: ['Hyperscalers', 'Neoclouds', 'Enterprise AI'], suppliers: ['TSMC', 'Micron', 'SK hynix', 'CoWoS'], risks: ['HBM availability', 'CoWoS capacity', 'Export controls', 'ASIC substitution'] }),
  node({ id: 'co-amd', label: 'AMD', type: 'company', parentId: 'cat-accelerators', level: 2, layer: 'AI Accelerators', description: 'MI-series GPUs, EPYC CPUs, and adaptive compute.', whyItMatters: 'Credible second-source accelerator supplier.', ticker: 'AMD', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['gpu', 'cpu'] }),
  node({ id: 'co-broadcom', label: 'Broadcom', type: 'company', parentId: 'cat-accelerators', level: 2, layer: 'AI Accelerators', description: 'Custom AI ASIC partner and data-center switch silicon leader.', whyItMatters: 'Central to hyperscaler custom silicon and networking.', ticker: 'AVGO', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['asic', 'switch silicon'] }),
  node({ id: 'co-marvell', label: 'Marvell', type: 'company', parentId: 'cat-accelerators', level: 2, layer: 'AI Accelerators', description: 'Custom silicon, optical DSP, and networking semiconductor supplier.', whyItMatters: 'Custom ASIC and optical-connectivity proxy.', ticker: 'MRVL', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['custom silicon', 'optical dsp'] }),
  node({ id: 'co-qualcomm', label: 'Qualcomm', type: 'company', parentId: 'cat-accelerators', level: 2, layer: 'AI Accelerators', description: 'Edge AI processor and mobile SoC supplier.', whyItMatters: 'More relevant to edge AI than hyperscale training.', ticker: 'QCOM', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['edge ai'] }),

  node({ id: 'co-synopsys', label: 'Synopsys', type: 'company', parentId: 'cat-eda-ip', level: 2, layer: 'EDA / IP', description: 'Top-tier EDA and semiconductor IP vendor.', whyItMatters: 'Advanced chips cannot be designed without EDA workflows.', ticker: 'SNPS', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', substitutability: 'low', tags: ['eda', 'ip'] }),
  node({ id: 'co-cadence', label: 'Cadence', type: 'company', parentId: 'cat-eda-ip', level: 2, layer: 'EDA / IP', description: 'Top-tier EDA, simulation, and verification platform.', whyItMatters: 'Co-leader in chip design automation.', ticker: 'CDNS', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['eda'] }),
  node({ id: 'co-arm', label: 'Arm', type: 'company', parentId: 'cat-eda-ip', level: 2, layer: 'EDA / IP', description: 'CPU IP licensor for mobile, edge, and server-class compute designs.', whyItMatters: 'Royalty layer attached to non-x86 compute growth.', ticker: 'ARM', exchange: 'NASDAQ', country: 'UK', status: 'us_listed_adr', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['ip', 'cpu'] }),
  node({ id: 'co-tsmc', label: 'TSMC', type: 'company', parentId: 'cat-foundries', level: 2, layer: 'Foundries', description: 'Dominant leading-edge foundry and CoWoS capacity owner.', whyItMatters: 'Core physical bottleneck for most AI accelerators.', ticker: 'TSM', exchange: 'NYSE', country: 'Taiwan', status: 'us_listed_adr', bottleneckLevel: 'critical', purePlayScore: 'high', substitutability: 'none', tags: ['foundry', 'cowos'], customers: ['NVIDIA', 'AMD', 'Broadcom', 'Marvell'], suppliers: ['ASML', 'Applied Materials', 'Lam Research', 'KLA'], risks: ['Taiwan concentration', 'Advanced packaging capacity'] }),
  node({ id: 'co-samsung-foundry', label: 'Samsung Foundry', type: 'company', parentId: 'cat-foundries', level: 2, layer: 'Foundries', description: 'Non-U.S.-listed foundry and memory supplier.', whyItMatters: 'Important alternative leading-edge foundry and memory source.', country: 'South Korea', status: 'non_us_listed', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['foundry', 'memory'], risks: ['Non-U.S.-listed under project rules'] }),
  node({ id: 'co-intel-foundry', label: 'Intel Foundry', type: 'company', parentId: 'cat-foundries', level: 2, layer: 'Foundries', description: 'U.S.-listed IDM and foundry effort.', whyItMatters: 'Potential U.S.-based leading-edge capacity option.', ticker: 'INTC', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'low', tags: ['foundry', 'chips'], risks: ['Roadmap execution'] }),
  node({ id: 'co-asml', label: 'ASML', type: 'company', parentId: 'cat-semi-design', level: 2, layer: 'Semiconductor Creation', description: 'Sole supplier of EUV lithography systems and major DUV lithography supplier.', whyItMatters: 'Without EUV tools, leading-edge logic and HBM scaling stalls.', ticker: 'ASML', exchange: 'NASDAQ', country: 'Netherlands', status: 'us_listed_adr', bottleneckLevel: 'critical', purePlayScore: 'high', substitutability: 'none', tags: ['euv', 'lithography', 'equipment'], financials: { revenue: 'EUR 27.6B', grossMargin: '51.3%', operatingMargin: '31.1%', debt: 'EUR 1.3B', freeCashFlow: 'EUR 7.6B', year: 'FY2023 example' }, customers: ['TSMC', 'Samsung', 'Intel', 'SK hynix', 'Micron'], suppliers: ['ZEISS', 'TRUMPF', 'Cymer'], risks: ['Single-supplier optics chain', 'Export controls', 'Long lead times'], notes: 'Financial figures are illustrative sample values for UI demonstration.' }),
  node({ id: 'co-amat', label: 'Applied Materials', type: 'company', parentId: 'cat-semi-design', level: 2, layer: 'Semiconductor Creation', description: 'Broad wafer-fab equipment supplier across deposition, implant, CMP, and process systems.', whyItMatters: 'Core supplier to advanced logic and memory fabs.', ticker: 'AMAT', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['equipment', 'deposition'] }),
  node({ id: 'co-lam', label: 'Lam Research', type: 'company', parentId: 'cat-semi-design', level: 2, layer: 'Semiconductor Creation', description: 'Etch, deposition, and wafer-clean equipment vendor.', whyItMatters: 'Critical patterning and memory process supplier.', ticker: 'LRCX', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['etch', 'clean'] }),
  node({ id: 'co-kla', label: 'KLA', type: 'company', parentId: 'cat-semi-design', level: 2, layer: 'Semiconductor Creation', description: 'Process-control and inspection equipment leader.', whyItMatters: 'Yield learning at advanced nodes depends on inspection and metrology.', ticker: 'KLAC', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['inspection', 'metrology'] }),
  node({ id: 'co-tokyo-electron', label: 'Tokyo Electron', type: 'company', parentId: 'cat-semi-design', level: 2, layer: 'Semiconductor Creation', description: 'Major Japanese wafer-fab equipment supplier.', whyItMatters: 'Real bottleneck supplier, excluded from U.S.-listed map.', country: 'Japan', status: 'non_us_listed', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['equipment', 'non-us-listed'] }),
  node({ id: 'co-amkor', label: 'Amkor', type: 'company', parentId: 'cat-packaging', level: 2, layer: 'Advanced Packaging', description: 'U.S.-listed OSAT with advanced packaging exposure.', whyItMatters: 'Closest U.S.-listed OSAT proxy for packaging bottlenecks.', ticker: 'AMKR', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['osat', 'packaging'] }),
  node({ id: 'co-ase', label: 'ASE Technology', type: 'company', parentId: 'cat-packaging', level: 2, layer: 'Advanced Packaging', description: 'Large Taiwan-based OSAT with U.S.-listed ADR.', whyItMatters: 'Global packaging leader, but CoWoS proper remains TSMC-dominated.', ticker: 'ASX', exchange: 'NYSE', country: 'Taiwan', status: 'us_listed_adr', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['osat', 'adr'] }),
  node({ id: 'co-micron', label: 'Micron', type: 'company', parentId: 'cat-memory', level: 2, layer: 'Memory / HBM', description: 'U.S.-listed DRAM, NAND, and HBM supplier.', whyItMatters: 'Only U.S.-listed HBM producer in the sample map.', ticker: 'MU', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['hbm', 'dram'] }),
  node({ id: 'co-sk-hynix', label: 'SK hynix', type: 'company', parentId: 'cat-memory', level: 2, layer: 'Memory / HBM', description: 'South Korean HBM leader.', whyItMatters: 'Major real-world HBM bottleneck but not U.S.-listed under project rules.', country: 'South Korea', status: 'non_us_listed', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['hbm', 'non-us-listed'] }),
  node({ id: 'co-samsung-memory', label: 'Samsung Electronics', type: 'company', parentId: 'cat-memory', level: 2, layer: 'Memory / HBM', description: 'Global memory and foundry supplier.', whyItMatters: 'Large HBM, DRAM, NAND, and foundry player excluded from ranked U.S.-listed map.', country: 'South Korea', status: 'non_us_listed', bottleneckLevel: 'critical', purePlayScore: 'medium', tags: ['hbm', 'dram'] }),

  node({ id: 'co-arista', label: 'Arista Networks', type: 'company', parentId: 'cat-networking', level: 2, layer: 'Networking', description: 'Cloud and AI data-center Ethernet switching vendor.', whyItMatters: 'Clean U.S.-listed networking exposure to AI clusters.', ticker: 'ANET', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['ethernet', 'switching'] }),
  node({ id: 'co-coherent', label: 'Coherent', type: 'company', parentId: 'cat-networking', level: 2, layer: 'Networking', description: 'Optical components and transceivers for data centers.', whyItMatters: 'Optical bandwidth is a scale-out constraint.', ticker: 'COHR', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['optical', 'transceiver'] }),
  node({ id: 'co-lumentum', label: 'Lumentum', type: 'company', parentId: 'cat-networking', level: 2, layer: 'Networking', description: 'Optical and laser components supplier.', whyItMatters: 'Laser and transceiver components for AI networking.', ticker: 'LITE', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['optical'] }),
  node({ id: 'co-dell', label: 'Dell Technologies', type: 'company', parentId: 'cat-servers', level: 2, layer: 'Servers / OEMs', description: 'AI server and enterprise infrastructure vendor.', whyItMatters: 'Large U.S.-listed AI server integrator.', ticker: 'DELL', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['server', 'rack'] }),
  node({ id: 'co-hpe', label: 'HPE', type: 'company', parentId: 'cat-servers', level: 2, layer: 'Servers / OEMs', description: 'Servers, supercomputing, and Juniper networking exposure.', whyItMatters: 'Integrated server and networking platform for AI systems.', ticker: 'HPE', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['server', 'networking'] }),
  node({ id: 'co-smci', label: 'Supermicro', type: 'company', parentId: 'cat-servers', level: 2, layer: 'Servers / OEMs', description: 'GPU server and rack integrator.', whyItMatters: 'Pure-play AI server assembly exposure.', ticker: 'SMCI', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['gpu server'] }),

  node({ id: 'co-equinix', label: 'Equinix', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Global interconnection and colocation data-center REIT.', whyItMatters: 'Physical infrastructure and interconnection exposure.', ticker: 'EQIX', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['data center', 'reit'] }),
  node({ id: 'co-dlr', label: 'Digital Realty', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Wholesale and hyperscale data-center REIT.', whyItMatters: 'Large U.S.-listed data-center platform.', ticker: 'DLR', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['data center', 'reit'] }),
  node({ id: 'co-vertiv', label: 'Vertiv', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Data-center power and thermal equipment supplier.', whyItMatters: 'Most direct public exposure to AI data-center power and cooling systems.', ticker: 'VRT', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['power', 'cooling', 'ups'] }),
  node({ id: 'co-eaton', label: 'Eaton', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Electrical equipment for data centers and grid infrastructure.', whyItMatters: 'Switchgear, UPS, and power-distribution exposure.', ticker: 'ETN', exchange: 'NYSE', country: 'Ireland/US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['switchgear', 'ups'] }),
  node({ id: 'co-schneider', label: 'Schneider Electric', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Global electrical and data-center power supplier.', whyItMatters: 'Important real bottleneck supplier but U.S. exposure is not a qualifying exchange listing in the research rules.', country: 'France', status: 'non_us_listed', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['power', 'non-us-listed'] }),
  node({ id: 'co-comfort', label: 'Comfort Systems', type: 'company', parentId: 'cat-construction-land', level: 2, layer: 'Construction / Land', description: 'Mechanical contractor with data-center fitout exposure.', whyItMatters: 'Specialty trades are a data-center buildout bottleneck.', ticker: 'FIX', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['construction', 'mechanical'] }),
  node({ id: 'co-quanta', label: 'Quanta Services', type: 'company', parentId: 'cat-construction-land', level: 2, layer: 'Construction / Land', description: 'Electric power and infrastructure contractor.', whyItMatters: 'Builds grid and data-center-adjacent infrastructure.', ticker: 'PWR', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['grid construction'] }),
  node({ id: 'co-fluor', label: 'Fluor', type: 'company', parentId: 'cat-construction-land', level: 2, layer: 'Construction / Land', description: 'Engineering and construction services.', whyItMatters: 'Large project execution capacity for industrial infrastructure.', ticker: 'FLR', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'low', tags: ['epc'] }),
  node({ id: 'co-jacobs', label: 'Jacobs', type: 'company', parentId: 'cat-construction-land', level: 2, layer: 'Construction / Land', description: 'Engineering services for infrastructure and advanced facilities.', whyItMatters: 'Design and engineering capacity for complex infrastructure.', ticker: 'J', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'low', tags: ['engineering'] }),
  node({ id: 'co-caterpillar', label: 'Caterpillar', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Backup power and industrial engine supplier.', whyItMatters: 'Data centers need backup gensets and heavy equipment.', ticker: 'CAT', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'low', tags: ['genset'] }),
  node({ id: 'co-cummins', label: 'Cummins', type: 'company', parentId: 'cat-data-centers', level: 2, layer: 'Data Centers', description: 'Backup generator and power systems supplier.', whyItMatters: 'Standby power remains part of data-center reliability design.', ticker: 'CMI', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['genset'] }),

  node({ id: 'co-constellation', label: 'Constellation Energy', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Large U.S. nuclear fleet operator.', whyItMatters: 'Existing nuclear fleet is attractive for hyperscaler power deals.', ticker: 'CEG', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['nuclear'] }),
  node({ id: 'co-vistra', label: 'Vistra', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Power producer with nuclear and gas assets.', whyItMatters: 'Dispatchable power exposure for data-center load growth.', ticker: 'VST', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'medium', tags: ['power', 'nuclear', 'gas'] }),
  node({ id: 'co-nextera', label: 'NextEra Energy', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Large utility and renewables developer.', whyItMatters: 'Major renewable PPA and grid-scale power developer.', ticker: 'NEE', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['renewables'] }),
  node({ id: 'co-gev', label: 'GE Vernova', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Gas turbines, grid equipment, and power technology.', whyItMatters: 'Gas turbine and grid backlog sits directly in data-center power constraints.', ticker: 'GEV', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['gas turbine', 'grid'] }),
  node({ id: 'co-siemens-energy', label: 'Siemens Energy', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Non-U.S.-listed gas turbine and grid supplier.', whyItMatters: 'Major real-world power equipment supplier outside ranked U.S.-listed table.', country: 'Germany', status: 'non_us_listed', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['gas turbine', 'grid'] }),
  node({ id: 'co-hubbell', label: 'Hubbell', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Utility and electrical products supplier.', whyItMatters: 'Distribution equipment and utility components for grid expansion.', ticker: 'HUBB', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['grid equipment'] }),
  node({ id: 'co-powell', label: 'Powell Industries', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Switchgear and electrical houses.', whyItMatters: 'Switchgear backlogs constrain power delivery.', ticker: 'POWL', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['switchgear'] }),
  node({ id: 'co-bloom', label: 'Bloom Energy', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Solid oxide fuel-cell systems.', whyItMatters: 'Potential behind-the-meter data-center power option.', ticker: 'BE', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['fuel cell'] }),
  node({ id: 'co-plug', label: 'Plug Power', type: 'company', parentId: 'cat-power-grid', level: 2, layer: 'Power / Grid', description: 'Hydrogen and fuel-cell systems.', whyItMatters: 'Speculative clean-power infrastructure exposure.', ticker: 'PLUG', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'medium', tags: ['hydrogen'] }),

  node({ id: 'co-modine', label: 'Modine', type: 'company', parentId: 'cat-cooling-water', level: 2, layer: 'Cooling / Water', description: 'Thermal management and data-center cooling products.', whyItMatters: 'Liquid-cooling and coil exposure for dense AI racks.', ticker: 'MOD', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['liquid cooling'] }),
  node({ id: 'co-nvent', label: 'nVent', type: 'company', parentId: 'cat-cooling-water', level: 2, layer: 'Cooling / Water', description: 'Electrical enclosures and liquid-cooling-adjacent systems.', whyItMatters: 'Data-center electrical and thermal infrastructure supplier.', ticker: 'NVT', exchange: 'NYSE', country: 'UK/US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['enclosures', 'cooling'] }),
  node({ id: 'co-xylem', label: 'Xylem', type: 'company', parentId: 'cat-cooling-water', level: 2, layer: 'Cooling / Water', description: 'Water systems and instrumentation supplier.', whyItMatters: 'Water availability and treatment constrain some data-center regions.', ticker: 'XYL', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['water'] }),
  node({ id: 'co-ecolab', label: 'Ecolab', type: 'company', parentId: 'cat-cooling-water', level: 2, layer: 'Cooling / Water', description: 'Industrial water treatment and process services.', whyItMatters: 'Indirect data-center water treatment exposure.', ticker: 'ECL', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'low', purePlayScore: 'low', tags: ['water treatment'] }),

  node({ id: 'mat-copper', label: 'Copper', type: 'material', parentId: 'cat-minerals', level: 2, layer: 'Minerals / Materials', description: 'Refined copper for grid, transformers, busbars, cables, and data-center electrical systems.', whyItMatters: 'Volume bottleneck across AI data centers and power infrastructure.', country: 'Global', bottleneckLevel: 'high', substitutability: 'medium', tags: ['copper', 'transformers', 'grid'] }),
  node({ id: 'co-freeport', label: 'Freeport-McMoRan', type: 'company', parentId: 'mat-copper', level: 3, layer: 'Minerals / Materials', description: 'Large U.S.-listed copper miner.', whyItMatters: 'Closest U.S.-listed copper mining exposure.', ticker: 'FCX', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['copper'] }),
  node({ id: 'co-southern-copper', label: 'Southern Copper', type: 'company', parentId: 'mat-copper', level: 3, layer: 'Minerals / Materials', description: 'Large copper miner with NYSE listing.', whyItMatters: 'High copper purity public equity exposure.', ticker: 'SCCO', exchange: 'NYSE', country: 'Mexico/Peru', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['copper'] }),
  node({ id: 'co-rio', label: 'Rio Tinto', type: 'company', parentId: 'mat-copper', level: 3, layer: 'Minerals / Materials', description: 'Diversified miner with copper and aluminum exposure.', whyItMatters: 'ADR proxy for metals supply.', ticker: 'RIO', exchange: 'NYSE', country: 'UK/Australia', status: 'us_listed_adr', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['copper', 'aluminum'] }),
  node({ id: 'co-bhp', label: 'BHP', type: 'company', parentId: 'mat-copper', level: 3, layer: 'Minerals / Materials', description: 'Diversified miner with copper and nickel exposure.', whyItMatters: 'Large ADR proxy for metals demand.', ticker: 'BHP', exchange: 'NYSE', country: 'Australia', status: 'us_listed_adr', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['copper', 'nickel'] }),
  node({ id: 'mat-rare-earths', label: 'Rare Earths', type: 'mineral', parentId: 'cat-minerals', level: 2, layer: 'Minerals / Materials', description: 'Rare earth oxides and magnets for motors, turbines, fans, and defense-adjacent electronics.', whyItMatters: 'China-heavy refining and magnet supply chain.', country: 'China/US/Australia', bottleneckLevel: 'critical', substitutability: 'low', tags: ['rare earths', 'magnets'] }),
  node({ id: 'co-mp', label: 'MP Materials', type: 'company', parentId: 'mat-rare-earths', level: 3, layer: 'Minerals / Materials', description: 'U.S.-listed rare-earth miner and magnet-chain builder.', whyItMatters: 'Cleanest U.S.-listed rare-earth exposure.', ticker: 'MP', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['rare earths'] }),
  node({ id: 'co-lynas', label: 'Lynas Rare Earths', type: 'company', parentId: 'mat-rare-earths', level: 3, layer: 'Minerals / Materials', description: 'Australian rare-earth producer.', whyItMatters: 'Important non-China rare-earth supplier but non-U.S.-listed in the ranked universe.', country: 'Australia', status: 'non_us_listed', bottleneckLevel: 'critical', purePlayScore: 'high', tags: ['rare earths'] }),
  node({ id: 'mat-silicon', label: 'Silicon / Polysilicon', type: 'material', parentId: 'cat-minerals', level: 2, layer: 'Minerals / Materials', description: 'Polysilicon and wafer feedstock.', whyItMatters: 'Every advanced chip starts with purified silicon wafers.', country: 'Global', bottleneckLevel: 'medium', tags: ['silicon', 'polysilicon'] }),
  node({ id: 'co-wacker', label: 'Wacker Chemie', type: 'company', parentId: 'mat-silicon', level: 3, layer: 'Minerals / Materials', description: 'German polysilicon supplier.', whyItMatters: 'Relevant but non-U.S.-listed polysilicon exposure.', country: 'Germany', status: 'non_us_listed', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['polysilicon'] }),
  node({ id: 'co-rec-silicon', label: 'REC Silicon', type: 'company', parentId: 'mat-silicon', level: 3, layer: 'Minerals / Materials', description: 'Polysilicon company with Norway listing.', whyItMatters: 'Relevant silicon supply-chain watch item.', country: 'Norway/US', status: 'non_us_listed', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['polysilicon'] }),
  ...['Gallium', 'Germanium', 'Tungsten', 'Cobalt', 'Nickel', 'Lithium', 'Graphite', 'High-purity quartz', 'Helium', 'Neon', 'Fluorspar'].map((label, index) =>
    node({
      id: `mat-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label,
      type: label.includes('quartz') || label === 'Fluorspar' ? 'material' : 'mineral',
      parentId: 'cat-minerals',
      level: 2,
      layer: 'Minerals / Materials',
      description: `${label} is a root input for chips, power electronics, batteries, optics, process gases, or data-center infrastructure.`,
      whyItMatters: 'Root dependency with limited substitution and uneven public-company exposure.',
      country: index < 3 ? 'China-heavy' : 'Global',
      bottleneckLevel: ['Gallium', 'Germanium', 'High-purity quartz'].includes(label) ? 'critical' : 'high',
      substitutability: ['Gallium', 'Germanium', 'High-purity quartz'].includes(label) ? 'none' : 'low',
      tags: [label.toLowerCase(), 'root input'],
      notes: 'Sample node. CSV adapters preserve the deeper research files for future import.',
    }),
  ),

  node({ id: 'co-linde', label: 'Linde', type: 'company', parentId: 'cat-chemicals-gases', level: 2, layer: 'Chemicals / Gases', description: 'Industrial and electronic gases supplier.', whyItMatters: 'Merchant gas exposure for fabs, noble gases, and helium chains.', ticker: 'LIN', exchange: 'NYSE', country: 'UK/US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['industrial gases'] }),
  node({ id: 'co-air-products', label: 'Air Products', type: 'company', parentId: 'cat-chemicals-gases', level: 2, layer: 'Chemicals / Gases', description: 'Industrial gas supplier.', whyItMatters: 'Semiconductor and industrial gases exposure.', ticker: 'APD', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['industrial gases'] }),
  node({ id: 'co-entegris', label: 'Entegris', type: 'company', parentId: 'cat-chemicals-gases', level: 2, layer: 'Chemicals / Gases', description: 'Specialty materials, filters, and process chemicals.', whyItMatters: 'Semiconductor specialty chemical and handling pure-play.', ticker: 'ENTG', exchange: 'NASDAQ', country: 'US', status: 'us_listed_public', bottleneckLevel: 'high', purePlayScore: 'high', tags: ['chemicals', 'filters'] }),
  node({ id: 'risk-export-controls', label: 'Export Controls', type: 'policy', parentId: 'cat-policy', level: 2, layer: 'Policy / Geopolitics', description: 'Controls on AI chips, lithography, and critical minerals.', whyItMatters: 'Can rapidly alter supply, demand, and company addressable markets.', country: 'US/China/EU/Japan', bottleneckLevel: 'critical', tags: ['export controls', 'geopolitics'] }),
  node({ id: 'risk-grid-permits', label: 'Grid Permits', type: 'policy', parentId: 'cat-policy', level: 2, layer: 'Policy / Geopolitics', description: 'PUC, ISO/RTO, local, environmental, and land-use approvals.', whyItMatters: 'Can delay data-center and generation projects for years.', country: 'US', bottleneckLevel: 'critical', tags: ['permitting', 'grid'] }),
  node({ id: 'co-kkr', label: 'KKR', type: 'company', parentId: 'cat-finance', level: 2, layer: 'Finance', description: 'Alternative asset manager with infrastructure capital exposure.', whyItMatters: 'Project finance is a capex enabler for data centers and power.', ticker: 'KKR', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'low', tags: ['project finance'] }),
  node({ id: 'co-blackstone', label: 'Blackstone', type: 'company', parentId: 'cat-finance', level: 2, layer: 'Finance', description: 'Alternative asset manager with data-center and infrastructure exposure.', whyItMatters: 'Large-scale capital allocator for AI infrastructure.', ticker: 'BX', exchange: 'NYSE', country: 'US', status: 'us_listed_public', bottleneckLevel: 'medium', purePlayScore: 'medium', tags: ['data center finance'] }),
  node({ id: 'risk-specialized-labor', label: 'Specialized Trades', type: 'risk', parentId: 'cat-labor', level: 2, layer: 'Labor / Talent', description: 'Electrical, mechanical, controls, fab, and grid labor.', whyItMatters: 'Physical buildout cannot scale faster than available specialized labor.', country: 'US/Global', bottleneckLevel: 'high', tags: ['labor', 'construction'] }),
];

const treeEdges = nodes
  .filter((item) => item.parentId)
  .map((item) => edge(item.parentId!, item.id, 'contains', item.bottleneckLevel));

const dependencyEdges: SupplyChainEdge[] = [
  edge('co-nvidia', 'co-tsmc', 'requires_foundry', 'critical'),
  edge('co-nvidia', 'co-micron', 'requires_memory', 'critical'),
  edge('co-nvidia', 'co-sk-hynix', 'requires_memory', 'critical'),
  edge('co-nvidia', 'co-amkor', 'requires_packaging', 'high'),
  edge('co-tsmc', 'co-asml', 'requires_equipment', 'critical'),
  edge('co-tsmc', 'co-amat', 'requires_equipment', 'high'),
  edge('co-tsmc', 'co-lam', 'requires_equipment', 'high'),
  edge('co-tsmc', 'co-kla', 'requires_equipment', 'high'),
  edge('co-asml', 'mat-high-purity-quartz', 'requires_material', 'critical'),
  edge('co-asml', 'mat-neon', 'requires_gas', 'high'),
  edge('co-vertiv', 'co-eaton', 'complements', 'medium'),
  edge('co-equinix', 'co-vertiv', 'requires_power_and_cooling', 'high'),
  edge('co-dlr', 'co-eaton', 'requires_power_distribution', 'high'),
  edge('co-gev', 'mat-copper', 'requires_material', 'high'),
  edge('co-hubbell', 'mat-copper', 'requires_material', 'high'),
  edge('co-constellation', 'risk-grid-permits', 'requires_approval', 'high'),
  edge('co-mp', 'risk-export-controls', 'exposed_to', 'high'),
  edge('mat-gallium', 'risk-export-controls', 'exposed_to', 'critical'),
  edge('mat-germanium', 'risk-export-controls', 'exposed_to', 'critical'),
];

export const sampleSources: Source[] = [
  {
    id: 'SRC_SAMPLE_RESEARCH',
    title: 'Curated sample data for AI Supply Chain Explorer',
    publisher: 'ai-supply-chain-map',
    url: 'https://github.com/BosssyPanda/ai-supply-chain-map',
    dateAccessed: '2026-05-04',
    reliabilityScore: 'medium',
  },
];

export const sampleData: SupplyChainData = {
  nodes,
  edges: [...treeEdges, ...dependencyEdges],
  sources: sampleSources,
};
