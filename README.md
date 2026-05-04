# ai-supply-chain-map

A research repository that maps the **full AI supply chain** — from end-user AI applications down to root physical inputs (minerals, materials, equipment, power, water, permits) — and separately maps the **U.S.-listed public investable universe** that gives exposure to each layer.

> This is a personal research project. It is **not** investment advice. Nothing here is a buy/sell recommendation or price target. Treat it as a research scaffold to challenge, edit, and extend.

---

## What this project is

Two closely related but distinct artifacts live side-by-side in this repo:

1. **A physical / industrial supply-chain map** — accurate to reality, including private firms, state-owned firms, and non-U.S.-listed companies where they dominate a bottleneck. This map is the truth of how AI infrastructure actually gets built.
2. **A U.S.-listed public investable map** — a much narrower view restricted to companies an ordinary U.S. brokerage account can buy: NYSE / Nasdaq / NYSE American common shares and U.S.-listed ADRs. ETFs are kept in a separate optional bucket.

We deliberately keep these two maps separate because forcing the physical chain into only U.S.-listed names would falsify the picture of where real bottlenecks sit (e.g. EUV optics from Zeiss, photoresists from JSR / TOK / Shin-Etsu, gallium from Chinese refiners — none cleanly investable as U.S.-listed pure plays).

A third bucket — `data/watchlist_private_spac_ipo.csv` — tracks **future public names**: pre-IPO companies, recent SPACs, and announced SPAC targets that are likely to become investable.

---

## Why some important companies are excluded from the investable rankings

Important ≠ investable. A company can dominate a node and still be excluded from the ranked U.S.-listed table because:

- It is **private** (e.g. OpenAI, Anthropic, xAI, Databricks, Stripe, SpaceX, ByteDance).
- It is **state-owned** or quasi-state (e.g. CNNC, Sinopec, China Northern Rare Earth).
- It is **listed only outside the U.S.** with no U.S. ADR (e.g. Tokyo Electron 8035.T, Disco 6146.T, SK hynix 000660.KS, ZEISS-related entities, Mercedes-Benz, Renesas).
- It is a **division of a conglomerate** with no clean pure-play exposure (e.g. Samsung's HBM business is a fraction of 005930.KS; not U.S.-listed).
- It is investable only via **an ETF wrapper**, not a single ticker.

These names live in `data/companies_non_investable_bottlenecks.csv` and are flagged so you understand the *real* dependency, even if you cannot buy the stock directly.

---

## Repository layout

```
ai-supply-chain-map/
├── README.md                                  ← you are here
├── CLAUDE.md                                  ← instructions for Claude/AI assistants editing this repo
├── taxonomy/
│   ├── ai_supply_chain_taxonomy.md           ← the human-readable hierarchy
│   ├── ai_supply_chain_tree.mmd              ← Mermaid: full tree, structure-focused
│   ├── ai_supply_chain_dependency_graph.mmd  ← Mermaid: dependency flows
│   ├── ai_supply_chain_investable_map.mmd    ← Mermaid: U.S.-listed only, with tickers
│   └── methodology.md                        ← scoring rules, ranking criteria, pure-play definitions
├── data/
│   ├── categories.csv                        ← top-level supply-chain domains
│   ├── nodes.csv                             ← every node L0–L5
│   ├── edges.csv                             ← node-to-node dependency relationships
│   ├── companies_public_us_listed.csv        ← THE ranked investable table
│   ├── companies_non_investable_bottlenecks.csv ← important but not buyable
│   ├── watchlist_private_spac_ipo.csv        ← future public names to watch
│   ├── minerals_to_ai_inputs.csv             ← mineral → component mapping
│   ├── mineral_supplier_mapping.csv          ← mineral → supplier mapping
│   ├── sources.csv                           ← every claim should have a source
│   └── open_questions.csv                    ← unresolved research questions
├── docs/
│   ├── how_to_edit.md
│   ├── assumptions_and_boundaries.md
│   ├── visual_design_guide.md
│   ├── investor_research_notes.md
│   └── update_log.md
└── scripts/
    └── validate_data.py
```

---

## How the taxonomy is organized

| Level | Meaning | Example |
|------|---------|---------|
| L0 | The AI ecosystem itself | `L0_AI_ECOSYSTEM` |
| L1 | Major supply-chain domains | `L1_COMPUTE`, `L1_POWER`, `L1_MINERALS` |
| L2 | Subdomains | `L2_AI_ACCELERATORS`, `L2_LITHOGRAPHY`, `L2_GRID_EQUIPMENT` |
| L3 | Components / services | `L3_GPU`, `L3_EUV_SCANNER`, `L3_TRANSFORMER` |
| L4 | Inputs to produce / operate the L3 thing | `L4_HBM`, `L4_PHOTORESIST`, `L4_GRAIN_ORIENTED_STEEL` |
| L5 | Root inputs and bottlenecks | `L5_GALLIUM`, `L5_NEON_GAS`, `L5_HIGH_PURITY_QUARTZ`, `L5_COPPER` |

Every row in `nodes.csv` carries a stable ID using this prefix scheme.

---

## How to edit the data

Most edits should happen in **CSV files**, not in the Mermaid diagrams. The diagrams are downstream views of the CSV truth. See `docs/how_to_edit.md`.

Quick rules:

- **Add a node** → add a row in `data/nodes.csv` with a new stable ID. If it has dependencies, add edges in `data/edges.csv`.
- **Add a company** → decide if it qualifies as U.S.-listed under the rules. If yes, add to `companies_public_us_listed.csv`. If no, add to `companies_non_investable_bottlenecks.csv` or `watchlist_private_spac_ipo.csv`.
- **Add a claim** → add a source row in `sources.csv` first, then reference its `source_id`.
- **Mark uncertainty** → either lower the `confidence` field on the row or add an entry in `data/open_questions.csv`.
- **Update Mermaid diagrams** → only after the underlying CSV is correct.

---

## How to update Mermaid diagrams

The `.mmd` files are hand-curated views (not auto-generated yet). When you change `nodes.csv` or `companies_public_us_listed.csv`, manually mirror the change in the relevant diagram. See `docs/visual_design_guide.md` for the styling conventions.

> **Future improvement (open):** a small generator script that emits the three `.mmd` files from CSVs. Tracked in `data/open_questions.csv`.

---

## How an LLM (Claude / ChatGPT) should make changes

Read `CLAUDE.md`. The short version:

1. Never invent companies. Only add tickers you can verify.
2. Never put a private company in `companies_public_us_listed.csv`.
3. Never put a non-U.S.-listed ordinary share in `companies_public_us_listed.csv` — only U.S.-listed ADRs qualify.
4. Always preserve CSV column schemas exactly.
5. Always cite. If you can't cite, lower the confidence and log an open question.
6. Never produce buy / sell / target-price recommendations.
7. After edits, run `python3 scripts/validate_data.py`.

---

## Validation

```bash
python3 scripts/validate_data.py
```

The script checks:

- All required CSVs exist.
- Required columns are present.
- All `node_id`s are unique.
- All `parent_node_id` references resolve.
- All edge endpoints resolve.
- Every company links to a valid node.
- No duplicate `rank_within_node` for the same node.
- No private or non-ADR foreign companies snuck into the U.S.-listed file.
- All `source_id` references resolve.

---

## What is uncertain or intentionally excluded

- **Power demand at the data center level by company** — disclosed inconsistently; treated as best-effort.
- **Exact share of HBM3e shipments by Micron / SK hynix / Samsung** — moves quarter-to-quarter; we describe ranges, not snapshots.
- **Critical-mineral supplier dependencies** — many are private or state-owned, so the investable rankings are deliberately sparse.
- **Photoresists, EUV optics, ion sources, slurry, certain specialty chemicals** — dominated by Japanese and German firms with no U.S.-listed pure-play; flagged as non-investable bottlenecks.
- **AI-application layer rankings** — most "frontier" model labs are private; we cover them via the major cloud customers and indirect proxies.
- **Software / MLOps layer** — fast-moving; we list the public infrastructure-adjacent names but don't try to rank every developer-tool startup.

See `docs/assumptions_and_boundaries.md` and `data/open_questions.csv` for the full list of caveats.

---

## License & disclaimer

Research notes only. Not financial advice. The author is not your advisor. Sources and confidence are documented per row; verify before relying on anything here. Use at your own risk.
