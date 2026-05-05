# Step 2 Implementation Brief

## Objective

Step 2 should start the actual frontend redesign by creating the design-system foundation and app shell needed for the Option 2 editorial report UI.

Do not start Step 2 from a vague visual polish pass. Start from reusable report primitives, semantic tokens, and route-level page patterns.

Step 2 must not begin by restyling individual old cards, badges, or graph controls in place. First establish the semantic theme, report shell, navigation, typography scale, table primitives, badge primitives, and right-rail primitives. Page conversion should follow those foundations.

## Primary Outcome

After Step 2, the app should have:

- A light-first semantic theme system.
- Optional restrained dark mode support.
- A new report-oriented app shell with top navigation.
- Reusable report components that can replace page-local dark dashboard patterns.
- Badge, table, typography, and right-rail rules implemented in code.
- No copied screenshot metrics or fake image data.

## Design System Foundation

Create semantic tokens before page redesign work.

Required semantic tokens:

- `background`.
- `foreground`.
- `surface`.
- `surface-elevated`.
- `surface-muted`.
- `border`.
- `border-strong`.
- `muted`.
- `muted-foreground`.
- `accent`.
- `accent-soft`.
- `critical`.
- `high`.
- `medium`.
- `low`.
- `verified`.
- `partial`.
- `pending`.

Implementation guidance:

- Prefer CSS variables exposed through Tailwind theme extensions or a small token layer.
- Keep token names semantic, not color-specific.
- Map badges and status components to tokens, not hardcoded class strings.
- Light mode must be complete first.
- Dark mode must reuse the same component structure and avoid neon/glow styling.
- Remove dependency on `night`, `electric`, and `shadow-glow*` as primary UI language before claiming the Option 2 shell is complete.

## App Shell

Replace the current sidebar-first shell with a report shell.

Build:

- `PageShell`: page container, max-width rhythm, optional right rail, consistent vertical spacing.
- `TopNav`: brand, route tabs, active underline, search area, utility actions, update metadata slot.
- `ThemeToggle`: icon-based toggle if dark mode is implemented.
- `SearchBar`: shared report search pattern that can support global search later.

Preserve:

- Existing routes.
- Existing `Outlet` rendering.
- Existing search behavior where page-local search already exists.
- Existing no-financial-advice framing.

Do not preserve:

- Left-sidebar-first navigation as the primary layout.
- Dark radial background as the primary app background.
- Glow shadows as a major visual language.

## Reusable Report Components

Create or refactor toward these components:

- `HeroSection`: title, subtitle, optional help/source link, optional stat-card region.
- `StatCard`: icon, label, data-derived value, short context, optional link.
- `StageFlow`: horizontal or responsive flow of supply-chain/material stages.
- `InsightPanel`: right-rail or inline explanatory panel.
- `ChapterCard`: compact report card for themes, stages, and watchlist categories.
- `ReportTable`: dense table wrapper with consistent header, row, badge, empty-state, and link styling.
- `CompanyMiniCard`: company preview card for featured companies, key companies, peers, and watchlist names.
- `RiskBadge`: semantic severity badge for critical/high/medium/low.
- `StatusBadge`: semantic status badge for listing/source/research state.
- `SourceLink`: consistent link treatment for source records.
- `ConfidenceIndicator`: visual confidence state tied to `high`, `medium`, `low`.
- `DossierSection`: company detail/dossier content section.
- `MetricStrip`: horizontal metric summary row with data-pending handling.
- `FilterBar`: compact horizontal search/select/filter controls.

## Typography Rules

- Page titles should use an editorial display style.
- UI labels, tables, and controls should remain readable and compact.
- Section labels may use small uppercase treatment with restrained tracking.
- Avoid viewport-based font scaling.
- Avoid negative letter spacing.
- Do not use hero-scale type inside compact cards or right rails.

## Badge Rules

- Use badges only for research semantics.
- Severity badges: `critical`, `high`, `medium`, `low`.
- Confidence badges: `high`, `medium`, `low`.
- Source status badges: `verified`, `partial`, `pending`.
- Listing/status badges: public, ADR, private, state-owned, non-U.S.-listed, watchlist.
- Do not introduce decorative pill clutter.
- Do not encode financial advice or investment recommendations.

## Table Rules

- Tables must be dense and scannable.
- Preserve sorting and filtering where currently implemented.
- Preserve row navigation from `/companies` to `/companies/:id`.
- Use real data or explicit pending states.
- Do not display screenshot totals unless derived from current data.
- Use consistent empty-state copy that preserves research uncertainty.

## Route-Level Step 2 Targets

Recommended Step 2 build order:

1. Implement tokens, base theme, and shell primitives.
2. Replace `AppShell`/`Sidebar` with `PageShell`/`TopNav`.
3. Create shared report components without changing data models.
4. Convert `/` overview to the new shell using current data.
5. Convert `/companies` table/filter patterns enough to prove the report system.
6. Keep `/supply-chain` graph functional and only wrap it in the new report shell if time allows.

Do not start `/materials`, `/bottlenecks`, or `/sources` until the shell and shared components exist, unless Step 2 explicitly scopes those pages.

## Data And Functionality Rules

- Keep CSV-backed data as the source of truth.
- Keep `src/data/loaders.ts` data-loading behavior.
- Do not change CSV schemas in Step 2.
- Do not promote `sampleData.ts` values into visible report metrics.
- Preserve `scripts/validate_data.py`.
- Preserve graph focus behavior, query params, filters, and company route navigation.
- Preserve research-only disclaimers.
- Preserve "unknown" and "data pending" states instead of inventing values to fill visual gaps.

## Graph Guidance

The graph should become a report exhibit.

When restyling the graph:

- Keep React Flow and ELK.
- Use light canvas styling.
- Use semantic stage colors.
- Keep controls compact and secondary.
- Keep minimap optional and visually quiet.
- Avoid neon lines, glow shadows, and dark cockpit styling.

## Acceptance Criteria

Step 2 is ready for review when:

- Light theme tokens are implemented and used by shell/report components.
- The app has a top-nav report shell.
- At least one primary page proves the new editorial hierarchy using live repo data.
- Shared components exist for stat cards, report sections, tables, badges, and right rails.
- No screenshot values are hardcoded.
- No route/data functionality is removed.
- CSV validation still passes.
- Build/test status is honestly reported.

## Validation Expectations For Step 2

Run:

- `python3 scripts/validate_data.py`.
- `npm run build`.
- `npm run test`.

If `npm run build` or `npm run test` hangs again, diagnose separately before claiming implementation success. The Step 1 inspection recorded both as attempted but inconclusive in the current environment.

## Explicit Non-Goals For Step 2 Unless Requested

- No financial recommendation features.
- No valuation pages.
- No price targets.
- No screenshot metric hardcoding.
- No CSV schema changes.
- No wholesale graph rewrite.
- No unrelated data cleanup.
