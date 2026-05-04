# Visual design guide

How to make the diagrams and the repo look polished and readable. Style is a tool for clarity; do not over-decorate.

---

## Color scheme by supply-chain layer

Use these Mermaid `classDef` colors consistently across all three diagrams. Background colors are pastel; text stays dark for contrast.

| Layer | Class name | Hex (fill) | Hex (border) | Tone |
|---|---|---|---|---|
| Applications & demand | `applications` | `#fde2e4` | `#c14953` | warm pink |
| Models & training | `models` | `#fff1c1` | `#b07d00` | warm gold |
| Cloud & platforms | `cloud` | `#dbe7ff` | `#1d4ed8` | blue |
| Compute / chips | `compute` | `#caf0f8` | `#0277bd` | cyan |
| Memory | `memory` | `#bde0fe` | `#0353a4` | navy-ish |
| Networking & optical | `networking` | `#d3f9d8` | `#2b8a3e` | green |
| Data center & cooling | `datacenter` | `#e2eafc` | `#3a86ff` | soft blue |
| Power & grid | `power` | `#ffe5b4` | `#d97706` | orange |
| Semi equipment & EDA | `equipment` | `#e0c3fc` | `#5a189a` | purple |
| Specialty chemicals & gases | `chemicals` | `#cffafe` | `#0e7490` | teal |
| Minerals & root inputs | `minerals` | `#f1d3b3` | `#7c2d12` | brown |
| Policy / labor / finance | `policyfinance` | `#e9ecef` | `#495057` | gray |

In Mermaid:

```
classDef compute fill:#caf0f8,stroke:#0277bd,stroke-width:1px,color:#000;
classDef power fill:#ffe5b4,stroke:#d97706,stroke-width:1px,color:#000;
%% etc.
```

Apply with:

```
class L1_COMPUTE,L2_AI_ACCELERATORS,L3_GPU compute;
class L1_GENERATION,L2_NUCLEAR,L2_GAS power;
```

---

## Naming rules

- **Node IDs** are stable and machine-readable: `L{level}_{ALL_CAPS_SHORTHAND}`. Never include spaces or punctuation other than `_`.
- **Display labels** in diagrams use human-readable text in quotes:
  ```
  L3_GPU["L3 · GPU"]
  L2_NUCLEAR["L2 · Nuclear power"]
  ```
- **Company nodes** in the investable map use `<TICKER>` notation:
  ```
  COMP_NVDA["NVDA — NVIDIA"]
  ```
- **Bottleneck nodes** can use a small marker prefix (e.g. ⚠) or a dedicated `bottleneck` class — not both. Pick one and apply consistently.

---

## Keeping diagrams readable

The full taxonomy has ~80 L1 domains and many more L2–L5 nodes. **Do not put it all in one diagram.** Use these splitting rules:

1. **Tree diagram (`ai_supply_chain_tree.mmd`)**: structure-only. Shows L0 → L1 → L2 with selected L3 highlights. Suppress most L4/L5 except headline bottlenecks (gallium, neon, HBM, EUV, transformers).
2. **Dependency graph (`ai_supply_chain_dependency_graph.mmd`)**: cross-cutting flows. Shows arrows from applications → models → compute → chips → fab → equipment → minerals, and a parallel chain for data center → power → grid → fuel. Don't include every edge in `edges.csv` — pick the ones that tell the story.
3. **Investable map (`ai_supply_chain_investable_map.mmd`)**: U.S.-listed companies grouped by layer, with tickers. Do not duplicate the full physical map; show only what's investable.

If a diagram exceeds ~120 nodes or ~200 edges, split it.

---

## Suggested Mermaid styling

Use a consistent header on every `.mmd` file:

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#f8fafc",
    "primaryBorderColor": "#334155",
    "primaryTextColor": "#0f172a",
    "lineColor": "#475569",
    "fontSize": "14px"
  }
}}%%
flowchart TB
```

For dependency / flow diagrams:

```
flowchart LR
```

For trees:

```
flowchart TB
```

Use `subgraph` to group an L1 cluster:

```
subgraph SG_COMPUTE ["Compute & Chips"]
  L1_COMPUTE
  L2_AI_ACCELERATORS
  L3_GPU
end
```

---

## Edge styling

- Use solid arrows for `requires_*` dependencies.
- Use dotted arrows (`-.->`) for "competes_with" or "complements".
- Label severity on the most important edges using `|severe|` syntax sparingly (don't label every edge or it becomes noise):
  ```
  L3_GPU -->|severe| L4_HBM
  L4_HBM -->|severe| L2_LITHO
  ```

---

## Avoiding chart clutter

Rules of thumb:

- If you can drop a node and the diagram still tells the same story, drop it.
- Don't include every L5 mineral in a single tree diagram. Pick the 6–10 most consequential.
- Don't include every U.S.-listed name in the investable map. Pick the top 1–3 per node.
- Cross-layer edges (e.g. `L3_GPU` → `L1_POWER`) are usually clutter — they're true but they're true *for everything*. Capture them in the dependency graph, not the tree.

---

## Presentation-ready exports (optional)

For slides:

```bash
# Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# render a diagram to a clean SVG
mmdc -i taxonomy/ai_supply_chain_tree.mmd \
     -o taxonomy/ai_supply_chain_tree.svg \
     -t neutral -b transparent
```

To render to PNG with high resolution:

```bash
mmdc -i taxonomy/ai_supply_chain_investable_map.mmd \
     -o build/ai_supply_chain_investable_map.png \
     -t neutral -b white -w 2400 -H 1600
```

Keep a `build/` directory out of version control if you generate PNGs frequently.

---

## Repo presentation

- Keep top-level `README.md` punchy, with a clear contents map.
- Open with the *value proposition* (full physical map vs. investable map) before the layout.
- Use tables liberally for comparisons.
- Avoid emoji clutter; use one unicode marker per concept (e.g. `⚠` for bottleneck callouts) and stick with it.
