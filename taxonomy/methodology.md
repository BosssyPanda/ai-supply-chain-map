# Methodology

Rules for how this repo defines nodes, ranks companies, and scores confidence. Apply consistently. When you change a rule, update this file and `docs/update_log.md`.

---

## 1. Defining a supply-chain node

A node is included in `nodes.csv` if **at least one** of the following is true:

1. It corresponds to a distinct physical input, component, or service that AI infrastructure cannot be built without.
2. It corresponds to a software / IP / service layer with no easy substitute (e.g. EDA, semiconductor IP, hyperscaler clouds).
3. It corresponds to a regulatory / policy / labor constraint that materially gates supply (e.g. permitting, export controls, specialized fab labor).

A node is **not** included if:

- It exists generically in industry but has no AI-specific bottleneck (e.g. generic office furniture).
- It is fully fungible with many other inputs and not currently constrained (e.g. ordinary structural concrete — included only at L5 with `bottleneck_level=low`).

---

## 2. Deciding when to stop drilling down

Stop adding deeper levels when one of the following is true:

- The next level would be either commodity (interchangeable) or so obvious it adds no information.
- The next level is purely chemistry / physics rather than a supply chain (e.g. "the silicon atom").
- We have reached a recognizable raw input that maps cleanly to mining / refining / generation companies.

Heuristic: L5 = "the thing the USGS or DOE writes a report about."

---

## 3. Ranking the top 3 U.S.-listed public companies per node

For each leaf node where it makes sense, the top 3 U.S.-listed names are picked using a weighted combination of:

| Factor | Weight (rough) | Meaning |
|---|---|---|
| Pure-play exposure | 35% | What % of revenue / earnings comes from this node? |
| Bottleneck centrality | 25% | If this company stopped shipping tomorrow, how badly would the chain choke? |
| Quality of moat at this node | 15% | IP, technology lead, switching costs, scale. |
| Capacity / market share at this node | 15% | Are they #1, #2, or marginal? |
| Liquidity & investability | 10% | Float, average daily volume, easy to borrow. |

This is a research scoring rubric, not a quantitative model. Reasonable people will rank differently. The goal is to **always** be willing to defend why each company is in the top 3 in `why_top_3`.

Hard constraints:

- **No private company** can appear, regardless of importance.
- **No non-U.S.-listed ordinary share** can appear. Only U.S.-listed ADRs qualify (e.g. `TSM`, `ASML`, `ARM`, `SQM`, `BHP`, `RIO`, `VALE`, `TECK`).
- **If the node has no clean public pure-play**, leave the slot empty and mark `"No clean U.S.-listed public pure play identified"` in the `notes` column. Do not pad.
- **If the node only has 1 or 2 viable names**, list 1 or 2. Do not stretch to 3.

---

## 4. Pure-play exposure score

| Score | Meaning |
|---|---|
| `high` | >70% of revenue or operating profit from products/services tied to this node. |
| `medium` | 30–70%. |
| `low` | <30%, but the company is still a meaningful supplier. |

Examples:

- `NVDA` at `L3_GPU`: **high** (data-center GPU is now most of revenue).
- `MSFT` at `L1_HYPERSCALERS`: **medium** (Azure is large but consumer + Office dilute exposure).
- `CMI` at `L2_BACKUP_GENERATION`: **medium** (gensets are a meaningful but not dominant share of total).
- `LIN` at `L1_INDUSTRIAL_GAS`: **high** (it is the business).
- `SO` at `L1_NUCLEAR`: **low** (utility with nuclear assets; nuclear is one slice).

---

## 5. Bottleneck severity scale

| Level | Meaning |
|---|---|
| `severe` | Effective monopoly or near-monopoly; loss of supply halts AI infra builds. |
| `high` | 1–3 firms control most of supply; substitution is multi-year. |
| `medium` | Several suppliers; substitution is months-to-quarters. |
| `low` | Commodity-like, many suppliers, no near-term constraint. |

Examples:

- EUV scanners (ASML): **severe**.
- HBM3e (SK hynix / Samsung / Micron): **severe** (3 suppliers; multi-year capacity adds).
- Gas turbines for new gas generation (GE Vernova / Siemens-foreign / Mitsubishi-foreign): **severe** (multi-year backlog).
- Large-power transformers: **severe** to **high** (long lead times, foreign-dominated).
- Liquid cooling distribution units: **medium** (rapidly scaling, more entrants).
- Generic switchgear: **medium**.
- Concrete and steel rebar: **low** (regional, fungible).

---

## 6. Substitutability

| Score | Meaning |
|---|---|
| `none` | No drop-in substitute in any reasonable horizon (e.g. EUV optics). |
| `low` | Partial substitute exists but capacity is tiny relative to demand. |
| `medium` | Substitute exists but is more expensive / lower-performance / requires re-qualification. |
| `high` | Many fungible alternatives. |

---

## 7. Confidence scale

`high` / `medium` / `low`. Apply to every row in `nodes.csv`, `companies_*.csv`, and `minerals_*.csv`.

Rules of thumb:

- **`high`** — multiple primary sources (10-K, 10-Q, government statistics, USGS / DOE / IEA report), or unambiguous public knowledge.
- **`medium`** — one good source, or multiple secondary sources that agree.
- **`low`** — single secondary source, industry rumor, or analyst estimate without primary confirmation.

If a row is `low` confidence, prefer creating a paired row in `data/open_questions.csv` describing what would upgrade it.

---

## 8. Handling ADRs

ADRs are accepted in `companies_public_us_listed.csv` only if:

1. The ADR trades on NYSE, Nasdaq, or NYSE American (i.e. Level II or Level III sponsored ADR).
2. There is meaningful liquidity (loose threshold: avg daily volume > 100k shares, market cap > ~$1B). Below that, document but do not rank.
3. OTC-listed unsponsored ADRs (e.g. `ABBNY`, `SBGSY`, `SIEGY`, `RNLSY`) **do not qualify** for ranked entries; they may appear in `companies_non_investable_bottlenecks.csv` with the OTC ticker noted.

Examples that qualify: `TSM`, `ASML`, `ARM`, `BHP`, `RIO`, `VALE`, `TECK`, `SQM`, `NVMI` (Nova).

Examples that do **not** qualify (OTC pink / unsponsored at last check): `ABBNY` (ABB), `SBGSY` (Schneider Electric), `SIEGY` (Siemens), `HXGBY` (Hexagon), `MTSFY` (Mitsubishi).

> Always re-verify the listing tier before adding. ADR sponsorship can change.

---

## 9. Handling private companies

Private companies never enter `companies_public_us_listed.csv`. They are routed to:

- `companies_non_investable_bottlenecks.csv` if they dominate a bottleneck and have no near-term public path.
- `watchlist_private_spac_ipo.csv` if they have a credible public path (S-1 filed, SPAC announced, direct listing rumored in named outlet).

When a watchlist company actually goes public:

1. Add a row in `companies_public_us_listed.csv`.
2. Mark the watchlist row's `current_status` as `now_public` and leave it for historical context.

---

## 10. Handling non-U.S.-listed leaders

Many true bottleneck firms are listed only on Tokyo, KOSPI, Taipei, Frankfurt, Amsterdam, or Hong Kong:

- Tokyo Electron (8035.T)
- Disco (6146.T)
- SCREEN Holdings (7735.T)
- SK hynix (000660.KS)
- Samsung Electronics (005930.KS)
- Renesas (6723.T)
- TSMC (also U.S.-listed as `TSM` ADR — qualifies)
- ASML (also U.S.-listed as `ASML` ADR — qualifies)
- Mediatek (2454.TW)
- Hon Hai / Foxconn (2317.TW)
- Largan (3008.TW)
- ZEISS group (private subsidiaries)
- Carl Zeiss SMT (subsidiary of ZEISS group; supplier to ASML — strategic stake)
- Hitachi Energy (subsidiary of Hitachi 6501.T)

These go to `companies_non_investable_bottlenecks.csv` with their actual local ticker noted in `notes` for cross-reference.

---

## 11. Handling SPAC / IPO watchlist names

The watchlist file (`data/watchlist_private_spac_ipo.csv`) is for names with a *credible* path to U.S. listing. Inclusion requires at least one of:

- An S-1 or F-1 filed with the SEC.
- A named SPAC sponsor and a target announcement.
- A direct-listing rumor reported by Reuters, Bloomberg, FT, WSJ, or comparable outlet.
- A publicly stated CEO/founder intent in a primary interview.

Pure speculation ("they should IPO eventually") does not qualify — track it informally in `notes` of the related node instead.

---

## 12. Separating "important supply-chain company" from "good investment"

This is the central methodological discipline of the project.

- A company that is structurally important to the supply chain may still be a **bad** investment (regulated returns, no operating leverage, declining margins, hostile customer concentration, leveraged balance sheet, geopolitical risk).
- A company that is a great investment may be **less central** to the AI supply chain than headlines suggest (indirect / second-derivative exposure).

`pure_play_score` and `bottleneck_exposure` measure structural importance. They do **not** measure investment quality.

This repo never prescribes investment quality. That is the human's judgment to make.

---

## 13. Separating proven bottlenecks from speculative bottlenecks

| Type | Treatment |
|---|---|
| **Proven** — currently constrained, with public evidence (e.g. EUV, HBM3e capacity, large transformers, gas turbines, grid interconnect queues). | Mark `bottleneck_level` `high` or `severe`. Reference primary source. |
| **Emerging** — early signs of constraint (liquid cooling at scale, advanced packaging beyond CoWoS-S, certain rare-earth magnets). | Mark `bottleneck_level` `medium`. Lower `confidence`. Add `open_questions.csv` row. |
| **Speculative** — could be a bottleneck if certain scenarios play out (some critical-mineral export-control scenarios, water rights in specific regions). | Mark `bottleneck_level` `low` or `medium` with explicit speculative framing in `notes`. |

Do not call something a "severe bottleneck" without a sourced argument.

---

## 14. Edge / dependency types

In `data/edges.csv` use these `relationship_type` values:

| Type | Meaning |
|---|---|
| `requires_input` | Target node is a physical / chemical input to source. |
| `requires_equipment` | Target node is equipment used by source. |
| `requires_service` | Target node is a service or process step. |
| `requires_software` | Target is software / IP / EDA / model required by source. |
| `requires_power` | Target is electric power. |
| `requires_water` | Target is water supply / cooling water. |
| `requires_permit` | Target is a regulatory or political dependency. |
| `requires_labor` | Target is specialized labor. |
| `requires_capital` | Target is finance / capex. |
| `competes_with` | Source and target are partial substitutes. |
| `complements` | Source and target are co-bought / co-deployed. |

Criticality of each edge: `severe` / `high` / `medium` / `low`.

---

## 15. When the methodology must change

If the AI infrastructure landscape changes in a way that breaks an assumption (e.g. EUV becomes multi-vendor; HBM gains a 4th major supplier; a new packaging tech displaces CoWoS), update this file and add an entry in `docs/update_log.md`.
