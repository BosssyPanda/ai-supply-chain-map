# Investor research notes

Working notes about the *investable* layer, written from a research-only perspective. None of this is a recommendation. The point is to capture useful structural framing.

---

## Why "important supply-chain company" is not the same as "good investment"

A stock can score `pure_play_score=high` and `bottleneck_exposure=severe` and still be a poor investment because:

- The price already discounts the bottleneck.
- The customer base is too concentrated and pricing power flows the wrong way.
- The capex required to keep the bottleneck creates negative free cash flow for years.
- Geopolitics caps the upside (e.g. forced technology transfer, export controls cutting addressable market).
- Operational execution risks are high (yield issues, customer qualification delays).

This repo measures structural importance. Valuation, execution, and timing are separate problems the repo does not solve.

---

## Layer-by-layer commentary (research only)

### Compute / GPUs / accelerators

- **NVDA** is the structural center of this map. Pure-play exposure is unusually high for a >$2T company. Bottleneck exposure runs through HBM, CoWoS, leading-edge logic, and networking.
- **AMD** is the only credible second source for data-center GPU at scale today. ASIC competition is a different threat vector than AMD GPU competition.
- **AVGO** and **MRVL** are the indirect way to play hyperscaler ASICs (Trainium, Inferentia, MTIA, custom Google work). They are also exposed to the networking layer.
- Pure-AI-ASIC private firms (Cerebras, Groq, SambaNova) are watchlist names; their public-investability is uncertain.

### Foundry & packaging

- **TSM** is the only U.S.-listed pure-play leading-edge foundry exposure. Geographic concentration in Taiwan is the obvious risk; CHIPS Act-funded Arizona ramps slowly.
- **INTC** has a foundry strategy that is real but unproven on AI compute volume. Treat as optionality, not as confirmed leading-edge AI exposure today.
- **Advanced packaging** is largely inside TSMC's CoWoS lines; the only direct U.S.-listed proxy outside TSM is **AMKR**, which is more OSAT than CoWoS-equivalent.

### Memory / HBM

- **MU** is the only U.S.-listed pure-play exposure to HBM3e and DDR5. SK hynix and Samsung dominate global HBM share but are not U.S.-listed.
- DRAM cyclicality remains; HBM is a structural offset but does not eliminate the cycle.

### Semiconductor equipment

- **ASML** (ADR): EUV is functionally a monopoly. Carl Zeiss SMT supplies the optics; ZEISS is private.
- **AMAT, LRCX, KLAC**: U.S. front-end equipment trio. Each has different exposure to logic vs. memory and to leading vs. trailing edge. None are pure-play AI but all benefit from leading-edge capex.
- **ONTO, CAMT, NVMI** (Nova): metrology / inspection adjacent.
- **TER, COHU, ACLS, ICHR, MKSI, ENTG, AEHR**: smaller specialized exposures.
- **Tokyo Electron, Disco, SCREEN** are real bottlenecks but not U.S.-listed.

### Networking / optical

- **ANET**, **CSCO** are the obvious U.S.-listed networking incumbents. ANET is the more AI-data-center-tilted name.
- **AVGO, MRVL** also sit in networking via switch silicon.
- Optical: **COHR, LITE, FN (Fabrinet), AAOI, ALAB (Astera Labs)**. Photonics interconnects are an emerging structural bottleneck.

### Data center operators / REITs

- **EQIX, DLR**: traditional retail and wholesale colocation.
- **IRM**: Iron Mountain has a growing data-center segment but is a hybrid story.
- Hyperscaler self-builds (`MSFT, AMZN, GOOGL, META, ORCL`) are the dominant builders; not pure-play but exposure is real.

### Construction & engineering for data centers

- **PWR, MTZ, DY, EME, FIX, IESC, PRIM**: U.S. specialty contractors with material data-center / grid exposure.
- These are the cleanest "DC build-out picks-and-shovels" plays in the U.S.-listed universe.

### Power generation & utilities

- **CEG, VST**: nuclear-heavy IPPs with hyperscaler offtake conversation.
- **NRG**: gas-and-retail; data-center exposure is real but more regional.
- **NEE, AES, BEPC**: renewables-heavy, large but diluted exposure.
- **TLN, OKLO, SMR, BWXT**: nuclear-flavored exposure with widely different profiles. TLN is operating reactors with hyperscaler offtake; OKLO and SMR are pre-revenue / development-stage.
- **CCJ** (ADR), **LEU, UEC, UUUU, DNN**: uranium / fuel-cycle exposure.

### Grid equipment / transformers / switchgear

- **GE Vernova (GEV)**: gas turbines + grid + wind.
- **ETN**: electrical equipment; data-center exposure is rising.
- **HUBB**: T&D components; transformer exposure (medium-power).
- **POWL** (Powell Industries): switchgear / E-houses; high backlog, high pure-play.
- **PRIM, MTZ, PWR**: integration and substation buildout.

### Cooling

- **VRT** is the highest-pure-play U.S.-listed AI-cooling-and-power name.
- **TT, JCI, LII, CARR**: large HVAC names with growing data-center exposure but not pure-play.
- **MOD** (Modine): smaller, more pure-play data-center coil / CDU exposure.
- **Asetek (foreign), CoolIT (private)**: liquid cooling specialists not investable in the U.S. universe.

### Industrial gases & specialty chemicals

- **LIN, APD**: bulk industrial gases including the noble-gas chain (neon, krypton, xenon, helium).
- **ENTG**: specialty materials and process chemicals — closest to a pure-play semiconductor specialty chemical name.
- **MKSI**: vacuum and gas-handling subsystems for fabs.
- Photoresists are entirely a Japanese-firm story (JSR went private via JIC, TOK, Shin-Etsu, Fujifilm) — flagged in non-investable bottlenecks.

### Critical minerals & materials

- **MP**: rare earths (NdPr) — the only U.S.-listed pure-play rare-earth name.
- **FCX, SCCO, TECK** (ADR): copper.
- **AA, KALU, CENX**: aluminum.
- **ALB, SQM** (ADR), **LAC**: lithium.
- **CCJ** (ADR), **UEC, UUUU, DNN, LEU**: uranium / fuel-cycle.
- **Gallium and germanium** have **no** clean U.S.-listed pure-play; flagged as a permanent bottleneck.
- **High-purity quartz** is private (Sibelco, The Quartz Corp) and flagged.

### Logistics & financing

- **UPS, FDX, GXO, EXPD**: logistics general.
- **KKR, BX, ARES, BAM**: alts firms financing data-center and infra capex; a real but indirect exposure.

---

## Cross-cutting structural observations (research only)

1. **The bottleneck stack is asymmetric.** A handful of nodes (EUV, HBM, CoWoS, large-power transformers, grid interconnect, rare-earth-magnet feed) account for most of the supply-side risk. Many other nodes are commodity-like.
2. **Several severe bottlenecks have no clean U.S.-listed proxy.** Gallium, germanium, photoresists, EUV optics. The repo treats this honestly rather than padding the table with weak proxies.
3. **Power is the slowest-moving constraint.** Grid interconnection queues, transformer lead times, gas turbine backlogs all measure in years.
4. **Data-center construction has a labor ceiling.** Specialty trades (electrical, mechanical, controls) are scarce; this is captured in `L1_LABOR`.
5. **Mineral export controls are a recurring tail risk.** Treat each mineral row's `bottleneck_level` as conditional on the current export-control regime.

---

## What I'd want to research next

These items also live in `data/open_questions.csv`:

- More granular HBM3 vs HBM3e vs HBM4 share by quarter (Micron / SK hynix / Samsung).
- Confirmed CoWoS-S vs CoWoS-L split at TSMC, and how much non-NVDA share is real.
- True data-center share of grid interconnection queue capacity (vs. all sources).
- Specific named hyperscaler PPAs with nuclear (Talen / CEG / VST) and how that translates to revenue visibility.
- The list of liquid-cooling CDU vendors and which ones are pulling ahead by hyperscaler design wins.
- A clean, traceable U.S.-listed proxy for gallium and germanium — currently we believe none exists at acceptable purity.
