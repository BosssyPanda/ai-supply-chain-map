# Route Preservation Map

## Route Principles

- Preserve existing routes and user workflows unless Step 2 explicitly adds a new route.
- Add `/materials`, `/bottlenecks`, and `/sources` as report chapters.
- Do not remove graph, search, filtering, company navigation, source references, or no-financial-advice boundaries.
- Do not use screenshot values as route data.

## `/`

- Current state: `Overview` page. Dark dashboard landing page with sample stats, top bottleneck category links, and watchlist names.
- Future Option 2 role: editorial overview/homepage explaining the AI supply chain as a report.
- Most relevant reference image: Image #2.
- Likely components needed later: `PageShell`, `TopNav`, `HeroSection`, `StatCard`, `StageFlow`, `InsightPanel`, `ReportTable`, `SourceLink`.
- Data/functionality to preserve: CSV-backed counts where real, links to supply-chain graph, companies, bottlenecks, and sources.
- Old-design residue risks: "Research Dashboard" wording, dark cards, glow styling, graph-first call to action, fake-looking stat cards.

## `/overview`

- Current state: redirect to `/`.
- Future Option 2 role: preserve redirect to `/`.
- Most relevant reference image: Image #2.
- Likely components needed later: none beyond router preservation.
- Data/functionality to preserve: redirect behavior.
- Old-design residue risks: none if kept as redirect.

## `/supply-chain`

- Current state: graph explorer with filters, stat strip, React Flow graph, detail panel, search, focus modes, query params.
- Future Option 2 role: "The AI Supply Chain, Mapped" report chapter with graph as an interactive support surface.
- Most relevant reference image: Image #3.
- Likely components needed later: `PageShell`, `TopNav`, `HeroSection`, graph wrapper, `InsightPanel`, `FilterBar`, `StageFlow`, `SourceLink`.
- Data/functionality to preserve: React Flow graph, ELK layout, focus behavior, `focus` query param, `view` query param, search selection, filters, detail panel content.
- Old-design residue risks: graph canvas dominating the page, dark canvas styling, neon node colors, toolbar density, minimap/control styling, operational language.

## `/companies`

- Current state: searchable/sortable company universe table with filters and row navigation to `/companies/:id`.
- Future Option 2 role: company universe report with hero, stat cards, featured companies, filters, dense table, and right rail.
- Most relevant reference image: Image #7.
- Likely components needed later: `HeroSection`, `StatCard`, `FilterBar`, `CompanyMiniCard`, `ReportTable`, `RiskBadge`, `StatusBadge`, `InsightPanel`.
- Data/functionality to preserve: search, filters, sorting, table row navigation, company/listing/bottleneck/confidence fields, no-financial-advice copy.
- Old-design residue risks: dark table, inline badges, dashboard filter panel, overly technical column density without report framing.

## `/companies/:id`

- Current state: company detail page using `CompanyDetail`, upstream/downstream mapping, source links, peers, and graph focus link.
- Future Option 2 role: company dossier page with editorial header, metric strip, report sections, supply-chain position, at-a-glance rail, risks, peers, confidence, and sources.
- Most relevant reference image: Image #1.
- Likely components needed later: `DossierSection`, `MetricStrip`, `InsightPanel`, `CompanyMiniCard`, `RiskBadge`, `ConfidenceIndicator`, `SourceLink`, `ReportTable`.
- Data/functionality to preserve: route param lookup, not-found state, back to companies, graph focus link, upstream/downstream relationships, peers, sources, company fields.
- Old-design residue risks: dark nested panels, ticker tile treatment, fallback/demo financial values, too much detail panel styling reused on full dossier page.

## `/watchlist`

- Current state: private/SPAC/IPO watchlist grid from nodes with watchlist/private status.
- Future Option 2 role: "Names to Watch" report chapter for upcoming IPOs, SPAC/de-SPAC candidates, and private companies worth tracking.
- Most relevant reference image: Image #6.
- Likely components needed later: `HeroSection`, `StatCard`, `ChapterCard`, `CompanyMiniCard`, `ReportTable`, `InsightPanel`, `StatusBadge`, `SourceLink`.
- Data/functionality to preserve: watchlist/private filtering, links where a company detail exists, separation from public ranked companies.
- Old-design residue risks: dark card grid, "Private / SPAC / IPO Watchlist" naming mismatch, badge colors not aligned with report tokens.

## `/comparisons`

- Current state: static comparison cards for selected default companies with research-only copy.
- Future Option 2 role: research comparison surface for side-by-side company, stage, material, or bottleneck comparisons.
- Most relevant reference image: Image #1 for dossier metrics and Image #7 for table rhythm.
- Likely components needed later: `PageShell`, `HeroSection`, `ReportTable`, `MetricStrip`, `FilterBar`, `ConfidenceIndicator`, `SourceLink`.
- Data/functionality to preserve: no buy/sell/price-target language, comparison of structural fields, default comparisons until interactive selection exists.
- Old-design residue risks: dark cards, overly sparse page, comparison language drifting toward investment advice.

## `/alerts`

- Current state: coming-soon research alerts placeholder.
- Future Option 2 role: research monitoring chapter for export-control changes, listing-status changes, capacity updates, source updates, and bottleneck shifts.
- Most relevant reference image: Image #5 for bottleneck monitoring and Image #6 for watchlist catalysts.
- Likely components needed later: `HeroSection`, `ChapterCard`, `ReportTable`, `StatusBadge`, `InsightPanel`, `SourceLink`.
- Data/functionality to preserve: research-only framing and monitored topics already named in the placeholder.
- Old-design residue risks: single dark placeholder card, alert language that could imply trading signals.

## `/materials`

- Current state: route does not exist.
- Future Option 2 role: "The Materials Behind AI" report chapter explaining critical materials, categories, mapped companies, and material bottlenecks.
- Most relevant reference image: Image #4.
- Likely components needed later: `HeroSection`, `StatCard`, `StageFlow`, `InsightPanel`, `ReportTable`, `CompanyMiniCard`, `RiskBadge`, `SourceLink`.
- Data/functionality to preserve: mineral/material nodes from `data/minerals_to_ai_inputs.csv`, `data/mineral_supplier_mapping.csv`, and adapted graph nodes.
- Old-design residue risks: trying to reuse graph filters as page structure, treating material stats from screenshots as real.

## `/bottlenecks`

- Current state: route does not exist.
- Future Option 2 role: "Critical Bottlenecks in the AI Supply Chain" report chapter focused on chokepoints, severity, exposed companies, themes, and sources.
- Most relevant reference image: Image #5.
- Likely components needed later: `HeroSection`, `StatCard`, `ChapterCard`, `RiskBadge`, `ReportTable`, `InsightPanel`, `CompanyMiniCard`, `SourceLink`.
- Data/functionality to preserve: bottleneck severity fields, risks, non-investable bottleneck companies, graph criticality, confidence/source fields.
- Old-design residue risks: neon risk cards, operational alert language, fake severity counts copied from images.

## `/sources`

- Current state: route does not exist.
- Future Option 2 role: source, methodology, confidence, and update-history chapter.
- Most relevant reference image: Image #2 for "View sources" links and Image #1 for confidence/source rail.
- Likely components needed later: `HeroSection`, `ReportTable`, `SourceLink`, `ConfidenceIndicator`, `StatusBadge`, `InsightPanel`.
- Data/functionality to preserve: `data/sources.csv`, row reliability/confidence, source publisher, URL, date accessed, source IDs, methodology docs links.
- Old-design residue risks: treating sources as footer-only instead of first-class research infrastructure.
