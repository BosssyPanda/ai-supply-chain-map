# CLAUDE.md — instructions for AI assistants editing this repo

This file is read by Claude Code, ChatGPT, and other AI assistants when they work on this repository. Follow these rules.

## Identity of this repo

This is a research scaffold mapping the AI supply chain (physical + investable). It is **not** an investment advisory product. Treat all output here as research notes for the human owner, not as recommendations.

## Hard rules (do not violate)

1. **Preserve CSV schemas exactly.** The column order and column names in every CSV under `data/` are part of the contract. The validator (`scripts/validate_data.py`) will fail if you reorder, rename, drop, or add columns without updating the validator and the docs.

2. **Do not hallucinate companies.** If you cannot verify a ticker on NYSE / Nasdaq / NYSE American, do not add it to `companies_public_us_listed.csv`. When in doubt, route to `companies_non_investable_bottlenecks.csv` or `watchlist_private_spac_ipo.csv`.

3. **Do not put private companies in the public-company file.** OpenAI, Anthropic, xAI, Databricks, SpaceX, ByteDance, Stripe, Cerebras (private as of last update), Groq, etc. all go to `watchlist_private_spac_ipo.csv` if they are plausibly heading public, or `companies_non_investable_bottlenecks.csv` if they are not.

4. **Do not put non-U.S.-listed ordinary shares in the public-company file.** ASML, TSM, ARM are valid because they have U.S.-listed ADRs (`ASML`, `TSM`, `ARM`). Tokyo Electron (8035.T), Disco (6146.T), SK hynix (000660.KS), ZEISS group, BE Semiconductor (BESI.AS), ASMI (ASM.AS), Mercedes-Benz, Renesas — these are **not** valid for the U.S.-listed file. They go to `companies_non_investable_bottlenecks.csv`.

5. **Keep non-investable bottlenecks separate.** Do not merge for convenience. The whole point of this repo is that real bottlenecks ≠ investable bottlenecks.

6. **Cite claims.** Every company assignment, every "X is a bottleneck" claim, every market-share figure should reference a `source_id` that exists in `data/sources.csv`. If you cannot cite, lower the `confidence` value and add a line to `data/open_questions.csv`.

7. **Use stable IDs.** Node IDs follow `L{level}_{ALL_CAPS_SHORTHAND}`, e.g. `L3_GPU`, `L4_HBM`, `L5_GALLIUM`. Do not renumber existing IDs. New IDs append.

8. **Validate after every meaningful edit.** Run `python3 scripts/validate_data.py` and resolve any failures before declaring the edit complete.

9. **Edit CSVs before Mermaid.** The `.mmd` files are downstream of the CSVs. Update `nodes.csv` / `companies_public_us_listed.csv` first, then mirror into the diagram(s). Never have the diagram describe a node that does not exist in `nodes.csv`.

10. **Never make buy / sell / hold / price-target recommendations.** Phrases to avoid: "you should buy", "I recommend", "this is undervalued", "target price", "overweight", "underweight". Allowed phrasing: "exposure to", "central to", "bottleneck-adjacent", "high pure-play score", "low pure-play score".

## Soft rules (default behavior unless the human says otherwise)

- **Prefer additions over deletions.** If a fact looks wrong, add a contradicting row with a different `source_id` and lower the `confidence` of the original; let the human reconcile.
- **Mark uncertainty explicitly** in the `confidence` column (`high` / `medium` / `low`) and in `notes`. Do not paper over uncertainty.
- **For ranking changes** (`rank_within_node` 1/2/3), explain in `why_top_3` what changed. Never silently re-rank.
- **For the watchlist file**, prefer concrete public-path signals (S-1 filed, SPAC announced, direct-listing rumored in named outlet) over vague speculation. If purely speculative, mark `confidence=low`.
- **Geographic granularity.** Where supply-chain risk is geographic (e.g. gallium → China refiners, neon → Ukraine + Russia historically, EUV optics → Germany, advanced foundry → Taiwan), capture the geography in `notes`.

## CSV editing conventions

- Use UTF-8.
- Never embed commas inside an unquoted field; quote with double quotes if needed.
- Keep `node_id`, `company_id`, `source_id`, `mineral_id`, `supplier_id`, `question_id` unique within their respective files.
- Boolean-ish fields (`investable_under_project_rules`, etc.) use the values `yes` / `no` / `partial`.
- Confidence: `high`, `medium`, `low`.
- Bottleneck level: `severe`, `high`, `medium`, `low`.
- Time horizon: `short` (0–2y), `medium` (2–5y), `long` (5+y).
- Pure-play score: `high` (>70% revenue from this node), `medium` (30–70%), `low` (<30%).

## When you don't know something

Don't guess. Add a row to `data/open_questions.csv` and lower confidence on the related node or company. Better an honest gap than a fabricated entry.

## Models and changes that should require explicit human approval

- Adding or removing a top-level domain (L1).
- Changing the schema of a CSV.
- Adding more than ~5 rows to `companies_public_us_listed.csv` in a single edit.
- Promoting a watchlist entry into the U.S.-listed file (i.e. a SPAC closing, an IPO completing).
- Touching `methodology.md` ranking rules.

When in doubt, propose a diff and let the human accept it.

## What "done" means after an edit

- The CSVs validate (`python3 scripts/validate_data.py` exits 0).
- New claims are sourced (or open questions are logged).
- The Mermaid diagrams still parse (a quick `mmdc` check is nice but not required offline).
- `docs/update_log.md` has a one-line entry describing the change and the date.
