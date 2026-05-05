# Option 2 Visual Contract

## Product Goal

AI Supply Chain Explorer is a research-only product that explains the infrastructure behind AI: models, cloud platforms, chips, semiconductor manufacturing, data centers, networking, power, cooling, materials, minerals, bottlenecks, companies, and sources.

The frontend redesign must turn the current explorer into a high-end interactive research report. It should help a reader understand how the AI infrastructure stack works, where constraints sit, which organizations are mapped to each layer, and how confident the research is.

The product must not become financial advice. Do not introduce buy, sell, hold, price-target, overweight, underweight, valuation, or recommendation language. Allowed language includes "mapped exposure," "supply-chain role," "bottleneck relevance," "confidence," "sources," and "research-only."

## Step 1 Boundary

This document is a visual contract and implementation handoff only. It does not authorize Step 1 UI changes.

Step 1 must not:

- Redesign pages.
- Replace layout components.
- Change routes.
- Change data models.
- Change styling.
- Refactor components.
- Hardcode reference-image values.

Step 2 must begin by replacing the design-system foundation and app shell. It must not start by lightly recoloring the existing dark dashboard.

## Target User Experience

- The app should feel like a premium intelligence report that happens to be interactive.
- The first impression should be calm, editorial, and explanatory, not operational or speculative.
- The user should be able to scan the report, follow narrative sections, inspect tables, open dossiers, and verify sources.
- Graph interactions remain useful, but the graph should support the report narrative rather than dominate the whole experience.
- Company, material, bottleneck, and source views should feel like chapters in one coherent report.

## Visual Direction

The target direction is "Option 2 - Editorial Intelligence Report UI."

The desired feel:

- Light mode first.
- Polished, quiet, presentation-friendly.
- Editorial hierarchy with large serif-like page titles, concise section labels, and dense but readable tables.
- Premium report rhythm: hero statement, stat cards, chapter panels, tables, and right-side insight rails.
- Restrained blue accent, soft borders, subtle shadows, and white/off-white surfaces.
- Data-forward, but not dashboard-first.

The design should be closer to Stripe, Apple, or a premium research deck than to a trading terminal, crypto dashboard, or generic SaaS landing page.

## What The Reference Images Mean

The seven reference images are the canonical visual target for Step 2 and later redesign work. The final implementation should match or exceed their quality.

Use the images for:

- Page hierarchy and spacing.
- Top navigation structure.
- Editorial hero treatment.
- Stat-card rhythm.
- Report-section framing.
- Right-side insight panels.
- Table density and row rhythm.
- Badge treatment and risk/confidence colors.
- Company dossier structure.
- Materials, bottlenecks, and watchlist chapter patterns.
- Page-to-page consistency.

## What The Reference Images Do Not Mean

The reference images are not a data source.

Do not copy or hardcode:

- Screenshot numbers.
- Screenshot dates.
- Screenshot company counts.
- Screenshot percentages.
- Screenshot financial values.
- Screenshot market-cap values.
- Screenshot employee counts.
- Screenshot company-specific claims unless they already exist in the repo data with sources.

Any metric in the redesigned app must come from the current CSV-backed data layer, a documented derived calculation, or an intentionally empty/data-pending state.

## Light Mode Requirements

Light mode is the primary theme and must be implemented first.

Requirements:

- App background should be near-white, not pure gray dashboard chrome.
- Page surfaces should use white or subtly tinted surfaces with thin borders.
- Text hierarchy should use deep navy/ink for primary copy and muted blue-gray for supporting copy.
- Accent should be restrained blue, used for active nav, links, selected states, and focus affordances.
- Risk colors should be controlled and semantic, not neon.
- Shadows should be subtle and used to separate panels, not to create glow effects.
- Tables should remain crisp, dense, and report-like.

## Dark Mode Requirements

Dark mode is optional and secondary. If implemented in Step 2, it must be restrained.

Requirements:

- No neon crypto dashboard aesthetic.
- No glowing radial backgrounds.
- No terminal-panel styling.
- Dark mode should feel like a premium report in low-light mode, not a separate product.
- Preserve the same structure, spacing, and component hierarchy as light mode.

## Typography Direction

- Page titles should be large, editorial, and high contrast.
- Body text should be readable and restrained.
- Section labels should be small, uppercase or small-caps style where appropriate, with moderate tracking.
- Tables should prioritize legibility over decorative typography.
- Numeric/stat values should be prominent but not dashboard-like.
- Avoid overusing badge text as a visual crutch.

Step 2 may choose exact fonts, but the implementation must support an editorial headline voice and a clean UI text voice.

## Navigation Direction

The future shell should use a top navigation bar, not the current left sidebar.

Navigation requirements:

- Brand at top left.
- Primary route tabs across the top.
- Active route indicated with a restrained blue underline or similar report-style affordance.
- Search on the right side for companies, technologies, materials, and sources.
- Utility actions should be icon-based where appropriate.
- "Last updated" metadata can appear in the header area when backed by real source data.

## Card Direction

Cards should feel like report modules, not floating SaaS marketing cards.

Requirements:

- Thin border, subtle shadow, light surface.
- Tight radius, generally no more than 8px unless a component has a specific reason.
- Clear heading, concise content, and consistent inner spacing.
- Avoid nested cards except for repeated items inside a legitimate panel.
- Stat cards should include an icon, label, value derived from data, short context, and optional link.

## Table Direction

Tables are core research surfaces.

Requirements:

- Dense enough for scanning.
- Clear header row.
- Light row separators.
- Small badges for stage, status, exposure, bottleneck, confidence, and source state.
- Company rows should preserve navigation to company dossiers.
- Empty or missing values should be explicit and research-safe.
- No fake screenshot counts or pagination totals.

## Right-Rail Direction

Right rails should provide interpretation, not random widgets.

Use right rails for:

- Focus explanation.
- Why this matters.
- Key companies or mapped entities.
- Key groups.
- Source/confidence summaries.
- At-a-glance metadata.
- Risks and bottlenecks.
- Related report chapters.

Right rails should be consistent across Overview, Companies, Materials, Bottlenecks, Watchlist, and Company Detail pages.

## Badge And Status Direction

Badges should encode research semantics only.

Use badges for:

- Bottleneck severity: critical, high, medium, low.
- Confidence: high, medium, low.
- Source state: verified, partial, pending.
- Company/listing status when relevant.
- Supply-chain stage.

Avoid using badges as decoration. Badge colors must map to semantic theme tokens.

## Forbidden Visual Patterns

Do not introduce:

- Neon crypto/dashboard styling.
- Terminal panel interface.
- Dark radial-gradient hero backgrounds.
- Electric glow shadows as the main visual language.
- Purple-blue one-note gradients.
- Generic AI SaaS landing-page hero.
- Admin-dashboard chrome.
- Left-sidebar-first app shell.
- Overdecorated badges and pills.
- Fake or hardcoded report metrics from screenshots.
- Buy/sell/price-target language.

## Old Design Residue Risks

The current app has several patterns that could leak into the redesign:

- Dark `night` Tailwind palette and `electric` colors.
- `shadow-glow*` effects.
- Radial dark body background in `src/index.css`.
- Sidebar-first `AppShell` and `Sidebar`.
- Graph-first mental model for `/supply-chain`.
- Dark rounded cards throughout pages and details.
- Dashboard wording such as "Research Dashboard" and "Interactive Explorer."
- Dense controls that look operational rather than editorial.

Step 2 must replace these with semantic report patterns rather than recolor the current UI.

## Final Success Criteria

The future redesign succeeds when:

- The first viewport clearly reads as a premium AI supply-chain research report.
- Light mode matches or exceeds the reference images in polish.
- Routes feel like chapters in one consistent report.
- The graph is still functional but no longer defines the entire experience.
- Tables, dossiers, source links, confidence states, and right rails are reusable patterns.
- All metrics and company facts come from the repo data or honest empty states.
- The no-financial-advice boundary remains visible in language and behavior.
- Old dark-dashboard residue is removed from the primary experience.

## Review Checklist Coverage

This contract is intended to prevent a vague "modernize the UI" task. A valid Step 2 implementation must explicitly preserve data/functionality, replace the dark dashboard shell with a light editorial report system, keep screenshot values out of the codebase, and make the graph a secondary advanced explorer behind a narrative report experience.
