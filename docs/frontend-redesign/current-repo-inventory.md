# Current Repo Inventory

## Current App Framework

- Project folder: `ai-supply-chain-map`.
- App framework: Vite + React 18 + TypeScript.
- Entry point: `src/main.tsx`.
- Router: `src/router.tsx` with `react-router-dom`.
- Vite config: `vite.config.ts`, server host `127.0.0.1`, port `5173`.
- TypeScript config: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.

## Package Manager And Scripts

- Package manager: npm, confirmed by `package-lock.json`.
- Install state during Step 1 review: `node_modules` exists.
- Install command not run during Step 1 review because dependencies were already present and no new dependencies were introduced.
- Build script: `npm run build` exists and runs `tsc -b && vite build`.
- Test script: `npm run test` exists and runs `vitest run`.
- Dev script: `npm run dev` exists and runs `vite`.
- Preview script: `npm run preview` exists and runs `vite preview`.
- Lint script: Unknown — not found in current repo inspection.

## Main Dependencies

- React: `react`, `react-dom`.
- Routing: `react-router-dom`.
- Graph: `@xyflow/react`.
- Layout: `elkjs`.
- CSV parsing: `papaparse`.
- Icons: `lucide-react`.
- Styling utilities: `clsx`, `tailwind-merge`.
- Test framework: `vitest`.

## Current Routing Structure

Routes are defined in `src/router.tsx` under `AppShell`.

- `/`: `Overview`.
- `/overview`: redirects to `/`.
- `/supply-chain`: `SupplyChain`.
- `/companies`: `Companies`.
- `/companies/:id`: `CompanyPage`.
- `/watchlist`: `Watchlist`.
- `/comparisons`: `Comparisons`.
- `/alerts`: `Alerts`.

Routes not currently present but needed for Option 2:

- `/materials`.
- `/bottlenecks`.
- `/sources`.

## Current Pages

- `src/pages/Overview.tsx`: dark dashboard landing page with stats, bottleneck links, and watchlist names.
- `src/pages/SupplyChain.tsx`: graph explorer page with search, filters, stat strip, React Flow graph, legend, and detail panel.
- `src/pages/Companies.tsx`: searchable/sortable company table with filters and inline badge helpers.
- `src/pages/CompanyPage.tsx`: company detail route with back links, `CompanyDetail`, and right-side peer panels.
- `src/pages/Watchlist.tsx`: private/SPAC/IPO watchlist card grid.
- `src/pages/Comparisons.tsx`: static default comparison cards for selected companies.
- `src/pages/Alerts.tsx`: placeholder "Research Alerts" coming-soon panel.

## Current Layout Components

- `src/components/layout/AppShell.tsx`: dark full-height shell with sidebar and outlet.
- `src/components/layout/Sidebar.tsx`: desktop-only left sidebar navigation, view links for graph modes, and research disclaimer.

The current shell conflicts with Option 2, which requires a light top-nav report shell.

## Current Shared UI Components

Current shared components are practical but not a complete design system:

- `src/components/search/SearchBar.tsx`.
- `src/components/filters/FilterPanel.tsx`.
- `src/components/legend/Legend.tsx`.
- `src/components/details/DetailPanel.tsx`.
- `src/components/details/CompanyDetail.tsx`.
- `src/components/details/CategoryDetail.tsx`.
- `src/components/details/MaterialDetail.tsx`.
- `src/lib/cn.ts`.

shadcn/ui: Unknown — not found in current repo inspection.

## Current Graph Implementation

Graph implementation uses React Flow and ELK:

- Graph container: `src/components/graph/SupplyChainGraph.tsx`.
- Custom node renderer: `src/components/graph/SupplyChainNode.tsx`.
- Custom edge renderer: `src/components/graph/SupplyChainEdge.tsx`.
- Layout helper: `src/lib/layout.ts`.
- Focus graph logic: `src/lib/focusGraph.ts`.
- Stage grouping: `src/lib/stages.ts`.
- Filters: `src/lib/filters.ts`.
- Search: `src/lib/search.ts`.

Current graph features:

- React Flow provider, controls, optional minimap, background grid.
- Custom node and edge types.
- ELK auto-layout with top-down and left-right modes.
- Focus mode, upstream mode, downstream mode.
- Supplier depth controls.
- URL query support for `focus` and `view`.
- App-only stage groupings over CSV data.

Option 2 should preserve graph functionality but make the graph a secondary report chapter, not the whole product.

## Current Data Files And Data Sources

Primary research data lives in `data/`:

- `data/categories.csv`.
- `data/nodes.csv`.
- `data/edges.csv`.
- `data/companies_public_us_listed.csv`.
- `data/companies_non_investable_bottlenecks.csv`.
- `data/watchlist_private_spac_ipo.csv`.
- `data/minerals_to_ai_inputs.csv`.
- `data/mineral_supplier_mapping.csv`.
- `data/sources.csv`.
- `data/open_questions.csv`.

Data loading approach:

- `src/data/loaders.ts` imports CSV files as raw strings with Vite `?raw`.
- PapaParse parses CSV rows.
- `adaptResearchCsvsToSupplyChainData()` normalizes CSV rows into `SupplyChainData`.
- `loadExplorerData()` loads CSV-backed data first and falls back to `src/data/sampleData.ts` only if CSV loading fails.

Important risk:

- `src/data/sampleData.ts` contains fallback/demo values, including illustrative financial values. Step 2 must not treat fallback demo values as sourced research data.

## Current Styling And Theme Files

- Tailwind config: `tailwind.config.js`.
- Global CSS: `src/index.css`.
- PostCSS config: `postcss.config.js`.

Current styling system:

- Tailwind CSS utilities.
- Custom `night` color palette.
- Custom `electric` colors.
- Custom glow shadows: `shadow-glowBlue`, `shadow-glowTeal`, `shadow-glowPurple`, `shadow-glowGreen`.
- Global dark `color-scheme`.
- Dark radial-gradient body background.
- React Flow control overrides in `src/index.css`.

Tailwind is used. React Flow is used. shadcn/ui: Unknown — not found in current repo inspection.

## Current Tests

Vitest tests found:

- `src/data/loaders.test.ts`.
- `src/lib/search.test.ts`.
- `src/lib/focusGraph.test.ts`.
- `src/lib/filters.test.ts`.
- `src/lib/researchSelectors.test.ts`.

Playwright:

- Unknown — not found in current repo inspection.

Browser or visual regression tests:

- Unknown — not found in current repo inspection.

## Validation Commands And Results

Command: `python3 scripts/validate_data.py`

- Result: passed.
- Output summary: all validation checks passed.
- Row counts reported:
  - `data/categories.csv`: 78.
  - `data/companies_non_investable_bottlenecks.csv`: 49.
  - `data/companies_public_us_listed.csv`: 155.
  - `data/edges.csv`: 113.
  - `data/mineral_supplier_mapping.csv`: 46.
  - `data/minerals_to_ai_inputs.csv`: 27.
  - `data/nodes.csv`: 142.
  - `data/open_questions.csv`: 28.
  - `data/sources.csv`: 99.
  - `data/watchlist_private_spac_ipo.csv`: 38.
- Likely cause of result: current CSV schemas and references are valid.
- Blocks Step 2: no.

Command: `npm run build`

- Result: unknown. Command was attempted and hung after startup.
- Observed output:
  - `> ai-supply-chain-map@0.2.0 build`
  - `> tsc -b && vite build`
- The process remained active without additional output for more than two minutes and was stopped.
- Step 1 review re-run result: attempted again after documentation fixes; it again produced no additional output after startup for at least 60 seconds and was stopped.
- Likely cause: unknown. It may be a local TypeScript/build process hang or machine/environment issue.
- Blocks Step 2: does not block documentation handoff, but Step 2 should re-run build before claiming implementation success.

Command: `npm run test`

- Result: unknown. Command was attempted and hung after startup.
- Observed output:
  - `> ai-supply-chain-map@0.2.0 test`
  - `> vitest run`
- The process remained active without additional output for more than two minutes and was stopped.
- Step 1 review re-run result: attempted again after documentation fixes; it again produced no additional output after startup for at least 60 seconds and was stopped.
- Likely cause: unknown. It may be a local Vitest process hang or machine/environment issue.
- Blocks Step 2: does not block documentation handoff, but Step 2 should diagnose or re-run tests before claiming implementation success.

Command: lint

- Result: not run.
- Likely cause: no lint script found in `package.json`.
- Blocks Step 2: no, but adding lint is outside Step 1 scope.

Command: package-manager install state

- Result: verified `node_modules` exists.
- Install not run because dependencies are present and Step 1 must not introduce new dependencies.
- Blocks Step 2: no.

## Obvious Technical Risks

- Current UI is dark-first and sidebar-first, while Option 2 is light-first and top-nav-first.
- Current component styling is page-local and utility-heavy; Step 2 needs semantic tokens and reusable report components.
- Existing graph page has many controls and can feel like the whole app; Option 2 needs graph as a supporting report section.
- Inline page helper components in `Companies.tsx` and `CompanyPage.tsx` may need extraction later.
- There are no current route definitions for `/materials`, `/bottlenecks`, or `/sources`.
- Build and test commands were attempted but did not complete in the current environment.
- No browser/visual regression tooling was found.
- Any future screenshot or visual regression workflow must be added deliberately in a later implementation step, not as part of Step 1 documentation cleanup.
