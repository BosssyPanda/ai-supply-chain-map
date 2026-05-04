# Update log

Newest entries on top. Every meaningful change to data, taxonomy, or methodology should land here.

---

## 2026-05-04 — CSV-first focused supplier graph

- Switched the explorer to load the existing CSV research database first, with sample data only as a fallback.
- Replaced the wide root expansion with a compact supply-chain stage spine and focused supplier-depth graph around the selected node.
- Added right-panel ranked research sections for top U.S.-listed companies, IPO/SPAC watchlist mentions, and non-investable bottleneck dependencies.

---

## 2026-05-04 — Interactive explorer app scaffold

- Added React + TypeScript + Vite app around the existing research repo files.
- Added React Flow graph explorer with ELK layout, search, filters, collapsed branch expansion, detail panel, and company routes.
- Added typed sample data and PapaParse CSV adapters for the existing `data/*.csv` files.
- Added app run instructions to `README.md`.
- Preserved existing CSV, docs, taxonomy, Mermaid, and validator files.

---

## 2026-05-04 — Completion and validation pass

- Added missing `data/mineral_supplier_mapping.csv` and `data/open_questions.csv`.
- Added three Mermaid diagrams for the taxonomy tree, dependency graph, and investable map.
- Added `scripts/validate_data.py`.
- Added missing storage source `SRC_WDC_10K`.
- Replaced the stale ranked `JNPR` networking row with `HPE` because HPE closed the Juniper acquisition on 2025-07-02 and JNPR ceased NYSE trading.
- Added `SRC_HPE_JUNIPER_CLOSE` and `SRC_USAR_SPAC_CLOSE` for current listing-status support.

---

## 2026-05-04 — Initial scaffold

- Created repo `ai-supply-chain-map`.
- Drafted full taxonomy markdown (`taxonomy/ai_supply_chain_taxonomy.md`).
- Drafted methodology (`taxonomy/methodology.md`) including ranking rules and severity scales.
- Populated initial `data/categories.csv`, `data/nodes.csv`, `data/edges.csv`.
- Populated initial `data/companies_public_us_listed.csv` (U.S.-listed only).
- Populated initial `data/companies_non_investable_bottlenecks.csv`.
- Populated initial `data/watchlist_private_spac_ipo.csv`.
- Populated initial `data/minerals_to_ai_inputs.csv` and `data/mineral_supplier_mapping.csv`.
- Populated initial `data/sources.csv` and `data/open_questions.csv`.
- Drafted three Mermaid diagrams: tree, dependency graph, investable map.
- Wrote `scripts/validate_data.py`.

Known gaps acknowledged at scaffold time:

- Several bottleneck nodes (gallium, germanium, photoresists, EUV optics, large transformers) have no clean U.S.-listed pure-play; left blank rather than padded.
- HBM market shares are described qualitatively, not quantitatively; see `open_questions.csv`.
- Watchlist file is initialized with publicly-discussed candidates; expect frequent churn.
