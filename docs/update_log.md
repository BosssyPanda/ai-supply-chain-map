# Update log

Newest entries on top. Every meaningful change to data, taxonomy, or methodology should land here.

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
