# Reference Image Analysis

## Global Interpretation

The seven attached images are the canonical visual direction for Option 2. They define the desired report language, layout rhythm, and component family. They do not define real metrics, financial values, dates, company counts, percentages, employee counts, or company-specific factual claims.

Implementation should reuse the concepts, not the screenshot data.

Shared patterns across the references:

- Light top navigation with active underline.
- Large editorial page title.
- Short explanatory subtitle.
- Search in the header.
- Last-updated metadata in the header when backed by data.
- Stat cards near the hero area.
- Large main content column plus right-side insight rail.
- Thin borders, subtle shadows, white/off-white surfaces.
- Dense tables with compact badges.
- Blue accent for links, active states, and selected states.
- Risk/confidence colors used semantically and sparingly.

## Image #1 - Company Detail / Dossier

Page type:

- Company dossier page for `/companies/:id`.

Layout pattern:

- Top nav with active Companies tab.
- Back link to companies.
- Company identity header with logo area, name, ticker badge, and watch icon.
- Metric strip below the hero.
- Main report sections on the left.
- Right-side at-a-glance rail with metadata, risks, peers, exposure summary, confidence/sources, and last-updated card.
- Lower supply-chain position diagram.

Components implied:

- `PageShell`.
- `TopNav`.
- `DossierSection`.
- `MetricStrip`.
- `StatCard`.
- `InsightPanel`.
- `RiskBadge`.
- `CompanyMiniCard`.
- `ConfidenceIndicator`.
- `SourceLink`.
- `ReportTable`.

Visual details that matter:

- Company identity gets editorial prominence.
- Metric strip is horizontal, calm, and segmented.
- Right rail is persistent and structured.
- Risks are plain text bullets with semantic iconography.
- Sources and confidence are visible, not hidden.
- Supply-chain position is diagrammatic but not a full graph canvas.

Placeholder-only data:

- Market cap, revenue, margins, free cash flow, dates, employees, peers' market caps, exposure percentages, and any visible financial statement values.

Reusable implementation concept:

- Build a dossier template that can render available CSV-backed company fields, relationship data, risks, peers, source IDs, and honest data-pending states.

## Image #2 - Overview / Homepage

Page type:

- Overview report page for `/`.

Layout pattern:

- Top nav with active Overview tab.
- Hero title and subtitle on the left.
- Stat-card row on the right.
- "How to read this report" link.
- Main "at a glance" stage flow.
- Notable companies table below.
- Right-side focus panel with key companies, quote/insight, and topic link.

Components implied:

- `HeroSection`.
- `StatCard`.
- `StageFlow`.
- `InsightPanel`.
- `ReportTable`.
- `CompanyMiniCard`.
- `SourceLink`.

Visual details that matter:

- The page explains before it visualizes.
- The stage flow is readable and narrative.
- The selected stage gets a restrained blue border.
- Table rows use logos/icons, stage badges, exposure dots, bottleneck risk, and key strength.
- Right rail provides interpretation.

Placeholder-only data:

- Critical bottleneck count, company count, confidence percentage, last-updated text, and table values.

Reusable implementation concept:

- Use current CSV data and stage groupings to create a report-oriented overview that links into companies, bottlenecks, supply-chain map, and sources.

## Image #3 - Supply Chain Map

Page type:

- Supply-chain map page for `/supply-chain`.

Layout pattern:

- Top nav with active Supply Chain tab.
- Editorial page title and subtitle above the graph.
- Large light graph canvas with controls.
- Center root node with stage clusters arranged around it.
- Branches use restrained semantic colors.
- Minimap and expand controls are visually secondary.

Components implied:

- `HeroSection`.
- Graph report wrapper.
- Graph toolbar controls.
- Semantic graph node styles.
- Light React Flow controls.
- Optional minimap.

Visual details that matter:

- The graph lives inside a light report frame.
- Graph controls are quiet and compact.
- Nodes are clean, readable, and softly colored.
- The graph supports comprehension rather than spectacle.
- The page title explains what the user is seeing before the graph starts.

Placeholder-only data:

- Node labels shown in the screenshot are conceptual examples. Existing repo taxonomy and adapted stage groups should determine actual labels.

Reusable implementation concept:

- Preserve React Flow, ELK layout, focus modes, and filters while restyling the graph as a light report exhibit.

## Image #4 - Materials

Page type:

- Materials report page for `/materials`.

Layout pattern:

- Top nav with active Materials tab.
- Hero title and explanatory subtitle.
- Stat-card row.
- Main materials stack flow with five category cards.
- Right-side focus panel explaining why materials matter.
- Key companies to watch.
- Quote/insight panel.
- Notable companies table.

Components implied:

- `HeroSection`.
- `StatCard`.
- `StageFlow`.
- `ChapterCard`.
- `InsightPanel`.
- `CompanyMiniCard`.
- `ReportTable`.
- `RiskBadge`.
- `SourceLink`.

Visual details that matter:

- Materials are treated as foundational layers, not just table filters.
- The stack flow uses numbered cards and arrows.
- Selected material category gets a stronger blue border.
- Right rail explains the "why."
- Table is compact and sourceable.

Placeholder-only data:

- Critical material counts, mapped company counts, confidence percentages, dates, and company rows.

Reusable implementation concept:

- Derive a materials report from `minerals_to_ai_inputs.csv`, `mineral_supplier_mapping.csv`, material/mineral nodes, company mappings, and sources.

## Image #5 - Bottlenecks

Page type:

- Bottlenecks report page for `/bottlenecks`.

Layout pattern:

- Top nav with active Bottlenecks tab.
- Hero title and subtitle explaining capacity constraints, supply concentration, and infrastructure dependencies.
- Stat-card row.
- Bottleneck map at a glance.
- Major bottleneck theme cards.
- Notable bottlenecks table.
- Right rail with "why these bottlenecks matter," exposed companies, and quote panel.

Components implied:

- `HeroSection`.
- `StatCard`.
- `ChapterCard`.
- `RiskBadge`.
- `ReportTable`.
- `InsightPanel`.
- `CompanyMiniCard`.
- `SourceLink`.

Visual details that matter:

- Severity is visible but not alarmist.
- Risk scale moves from higher risk to lower risk.
- Theme cards explain dependency chains.
- Right rail connects bottlenecks to company exposure without advice language.

Placeholder-only data:

- Bottleneck counts, high-risk category counts, confidence percentages, dates, specific lead-time claims, and table rows unless backed by repo sources.

Reusable implementation concept:

- Build a bottleneck chapter from `bottleneckLevel`, risk fields, edge criticality, non-investable bottleneck rows, company mappings, and sources.

## Image #6 - Names To Watch

Page type:

- Watchlist page for `/watchlist`.

Layout pattern:

- Top nav with active Names to Watch tab.
- Large editorial title and watchlist description.
- Stat-card row.
- "At a glance" category cards.
- Upcoming listings card row.
- Companies worth following table.
- Right rail with focus, key themes, qualification criteria, and quote/author card.

Components implied:

- `HeroSection`.
- `StatCard`.
- `ChapterCard`.
- `CompanyMiniCard`.
- `ReportTable`.
- `InsightPanel`.
- `StatusBadge`.
- `SourceLink`.

Visual details that matter:

- Watchlist is framed as research monitoring, not trading signals.
- Cards distinguish IPO pipeline, private names, and emerging suppliers.
- Qualification criteria are explicit.
- Right rail clarifies inclusion rules.

Placeholder-only data:

- Counts, dates, names, timing/catalyst text, and quote attribution unless present in repo data.

Reusable implementation concept:

- Use `data/watchlist_private_spac_ipo.csv` as the primary source, with careful language around public-path signals and confidence.

## Image #7 - Companies

Page type:

- Company universe page for `/companies`.

Layout pattern:

- Top nav with active Companies tab.
- Editorial hero title and explanatory subtitle.
- Stat-card row.
- Main left column with filters, featured companies, and all-companies table.
- Right rail with "why these companies matter," key groups, and spotlight card.

Components implied:

- `HeroSection`.
- `StatCard`.
- `FilterBar`.
- `CompanyMiniCard`.
- `ReportTable`.
- `InsightPanel`.
- `RiskBadge`.
- `StatusBadge`.
- `SourceLink`.

Visual details that matter:

- Filters are horizontal and compact.
- Featured companies are cards inside a report section.
- Table is dense and scannable.
- Right rail explains taxonomy and grouping.
- Spotlight uses real visual media only if supported by sources/assets; do not use random stock-like imagery.

Placeholder-only data:

- Mapped company counts, U.S.-listed counts, critical bottleneck counts, confidence percentage, group counts, pagination totals, and spotlight content.

Reusable implementation concept:

- Refactor the existing company table into a report table while preserving search, filters, sorting, and row navigation.

## Implementation Guardrails From Images

- Keep light mode as the default target.
- Keep the top nav consistent across pages.
- Use the same page shell rhythm across all report chapters.
- Treat right rails as first-class report modules.
- Preserve table density.
- Build semantic badges and status indicators.
- Use real source-backed data or honest pending states only.
- Avoid copying any screenshot metric, date, quote, or financial value.
