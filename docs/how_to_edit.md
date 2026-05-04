# How to edit this repo

This is a CSV-first research repo. The Mermaid diagrams and the markdown taxonomy are downstream views of the CSV truth. Edit CSVs first; refresh diagrams second.

---

## The mental model

```
data/*.csv          ← source of truth
taxonomy/*.mmd      ← diagrams, hand-curated views
taxonomy/*.md       ← human-readable summaries
docs/*.md           ← rules, conventions, notes
scripts/validate_data.py  ← validates the source of truth
```

---

## Common edits and where they go

### 1. Add a new node to the taxonomy

Example: adding "Hybrid bonding equipment" as an L3 under packaging.

1. Open `data/nodes.csv`.
2. Append a row:
   ```
   L3_HYBRID_BONDING_EQUIP,L2_HYBRID_BONDING,3,Hybrid bonding equipment,equipment,"Tools that perform copper-to-copper hybrid bonding for advanced packaging.",...,medium,medium,medium,medium,...
   ```
3. If it depends on other nodes, add edges to `data/edges.csv`.
4. Run the validator.
5. Optionally add the new node to `taxonomy/ai_supply_chain_tree.mmd`.

### 2. Add a U.S.-listed company

Example: adding `MOD` (Modine) to liquid cooling.

1. Open `data/companies_public_us_listed.csv`.
2. Append:
   ```
   COMP_MOD,Modine Manufacturing,MOD,NYSE,US,L1_LIQUID_COOLING,equipment supplier (CDUs / coils),3,Liquid cooling for data centers,medium,...,medium,medium,SRC_MOD_10K
   ```
3. Make sure `category_node_id` exists in `nodes.csv`.
4. Make sure `source_id` exists in `data/sources.csv`. If not, add the source first.
5. Run validator.

### 3. Demote a U.S.-listed name (e.g. it gets acquired or de-listed)

If the company gets acquired and de-lists:

- Move the row from `companies_public_us_listed.csv` to `companies_non_investable_bottlenecks.csv` with `listing_status="acquired"`.
- Add an entry in `docs/update_log.md` describing the date and event.

### 4. Promote a watchlist name to public

When a SPAC closes or an IPO completes:

- Add a row to `companies_public_us_listed.csv` with the new ticker.
- Mark the watchlist row's `current_status="now_public"`. Keep it for historical context.
- Add an entry in `docs/update_log.md`.

### 5. Add a mineral or material

1. Open `data/minerals_to_ai_inputs.csv` and append.
2. If you have specific suppliers, add rows in `data/mineral_supplier_mapping.csv`.
3. Cross-link to the relevant `L5_*` node in `nodes.csv` if it doesn't already exist.

### 6. Update sources

Sources are a row-keyed table. Always add the source first, then reference its `source_id` in claims.

### 7. Mark uncertainty

Two ways:

- Lower the `confidence` field on the relevant row.
- Add a structured open question in `data/open_questions.csv`.

Both are acceptable; for material uncertainty, do both.

---

## CSV editing tips

- Use any spreadsheet (Excel, Numbers, LibreOffice) or a text editor.
- Keep UTF-8 encoding.
- Quote any field containing a comma or newline with double quotes.
- Don't reorder columns.
- Don't add extra columns without updating `scripts/validate_data.py` and the relevant section of `CLAUDE.md`.

---

## Validating

```bash
cd ai-supply-chain-map
python3 scripts/validate_data.py
```

Exit code 0 means clean. Non-zero means at least one check failed; the script prints a report.

---

## Updating Mermaid diagrams

Edit `.mmd` files directly. They are intentionally hand-curated, not auto-generated, so the maintainer can choose what to include vs. omit for readability.

Validate the diagrams render at https://mermaid.live or with the Mermaid CLI (`mmdc`).

Style conventions live in `docs/visual_design_guide.md`.

---

## Recommended edit workflow

1. Pull / sync the repo.
2. Make CSV edits.
3. Run `python3 scripts/validate_data.py`.
4. Refresh the Mermaid diagram(s) if structurally affected.
5. Add an entry in `docs/update_log.md`.
6. Commit with a message that describes the *change*, not just the file.

```
git add data/companies_public_us_listed.csv docs/update_log.md
git commit -m "Add MOD (Modine) to L1_LIQUID_COOLING; bumps CDU coverage to 3 names"
```
