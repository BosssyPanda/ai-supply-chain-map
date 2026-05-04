# Assumptions and boundaries

What we assume, what we exclude, and where the uncertainty lives. Read this before using anything in the repo as if it were definitive.

---

## What this repo IS

- A research scaffold that maps how AI infrastructure actually gets built.
- A separate, narrower view of which U.S.-listed public companies give exposure to each layer.
- A growing set of source-backed claims with explicit confidence levels.
- A starting point for further research, not the end of it.

## What this repo is NOT

- Not investment advice.
- Not a price-target list.
- Not a real-time market-share tracker.
- Not exhaustive — many smaller players are deliberately omitted.
- Not balanced for valuation. Bottleneck centrality and pure-play exposure are about *structure*, not whether a stock is cheap or expensive.

---

## Universe assumptions

| Assumption | Implication |
|---|---|
| Investable = U.S.-listed common share or qualifying U.S.-listed ADR. | Excludes Tokyo Electron, SK hynix, Samsung, Disco, ZEISS, Mercedes-Benz, etc. |
| ADR must be Level II or III on a major U.S. exchange. | Excludes OTC pink unsponsored ADRs (`ABBNY`, `SBGSY`, `SIEGY`, etc.). |
| ETFs are out of the ranked tables. | Tracked only in optional sections / notes. |
| Index inclusion is not required. | Microcaps included if they are best-in-class for a node, with a confidence flag. |
| Liquidity is preferred but not strictly required. | Microcaps marked with notes. |

---

## Methodological assumptions

- **HBM is treated as a severe bottleneck** based on multi-quarter sold-out commentary from suppliers and customers. If supply outpaces demand for >2 quarters, downgrade to `high`.
- **EUV (ASML) is treated as a monopoly bottleneck** for leading-edge logic and DRAM. Canon's nanoimprint and Nikon's DUV efforts are tracked but not treated as substitutes for EUV.
- **CoWoS-S / CoWoS-L (TSMC)** is treated as the dominant 2.5D advanced packaging today. ASE / Amkor (`AMKR`) are gaining adjacent packaging share but CoWoS proper sits inside TSMC.
- **Power and grid interconnection** are treated as severe near-term constraints in PJM, ERCOT-North, and Virginia / NoVA, based on public ISO interconnection-queue reports.
- **Large-power transformer lead times of 2–4 years** are treated as a high bottleneck.

If the underlying data shifts, update the relevant rows and downgrade / upgrade severity.

---

## Geographic and political assumptions

- **China-controlled refining** of gallium, germanium, rare earths, graphite, and tungsten is treated as a severe geopolitical risk that conditions the bottleneck level. If China relaxes export controls broadly, severity drops; if it tightens further, severity rises.
- **Taiwan concentration** of leading-edge logic and CoWoS packaging is treated as a structural risk but not currently disrupting supply.
- **U.S. policy support** (CHIPS Act, IRA, advanced manufacturing tax credits) is treated as a tailwind for U.S. capacity additions but is not a guarantee of project completion.
- **Permitting and grid interconnection in the U.S.** are treated as material constraints, multi-year in many regions.

---

## Companies treated as out of scope

- Pure-play AI media / advertising companies (e.g. ad-tech, social-media platforms even if they buy a lot of GPUs). They are buyers of compute, not part of the supply chain.
- Application-layer SaaS that *uses* AI but does not make AI infra (e.g. CRM, HRIS, vertical SaaS layered over LLM APIs). Out of scope.
- Generic IT services firms with no clear AI-infra concentration.
- Pre-revenue concepts with no working product or supplier relationship.

---

## Data freshness caveats

- **Quarterly data ages quickly.** Market shares, capacity, and customer concentrations change. Treat all numerical claims here as snapshot-in-time at the row's source date.
- **Project announcements vs. operating capacity differ.** "Announced X GW of new capacity" is not the same as "online and selling power."
- **Capacity vs. demand.** Severe-bottleneck status reflects current supply/demand balance, not theoretical future capacity.

---

## Excluded for clarity (but acknowledged as relevant)

- **Internal / captive supply chains** at hyperscalers (e.g. Google's Iowa wind PPAs, Amazon's nuclear PPA with Talen, Meta's land acquisitions). These are tracked in `notes` only because they don't have buyable equity proxies cleanly.
- **Real-estate transactions and JVs** (e.g. Stargate, hyperscaler JVs with KKR / Blackstone). Tracked in notes.
- **Specific PPAs and offtake agreements**. Tracked in notes only.
- **Sanctioned entities** (e.g. SMIC, certain Russian metal producers). Excluded from investable rankings even when they have ADRs that became delisted or restricted.

---

## Things I deliberately don't try to solve here

- **Predict the next bottleneck.** This is a map of what is, not a forecast of what will be. Speculative future bottlenecks live in `data/open_questions.csv` and are flagged.
- **Rank "best" stock per node.** This is a structural map. Investment quality requires a valuation overlay this repo does not maintain.
- **Cover non-AI semiconductors.** Out of scope unless directly AI-infrastructure-critical.
- **Cover the consumer side of AI.** Phones, AI PCs, AI smart-glasses, etc. — out of scope except where they share supply-chain inputs (e.g. they share HBM with data centers? Not really; consumer DRAM is a different node).

---

## When you find I'm wrong

Open `data/open_questions.csv` and add a row. Or just edit the row in question, lower the confidence, cite a counter-source, and let the diff speak. The repo prefers visible disagreement over fake certainty.
