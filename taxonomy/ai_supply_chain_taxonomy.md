# AI supply-chain taxonomy

The full hierarchy from end-user demand (L0) down to root inputs (L5). This document is the human-readable form of `data/nodes.csv`. When the two disagree, the CSV wins.

Every node has a stable ID such as `L3_GPU` or `L5_GALLIUM`. Use those IDs when wiring dependencies in `data/edges.csv` and when assigning companies in `companies_public_us_listed.csv`.

---

## L0 — AI Ecosystem (`L0_AI_ECOSYSTEM`)

The visible end-state: AI applications and the demand they create for compute, data, and physical infrastructure.

---

## L1 — Major supply-chain domains

| ID | Name | One-line role |
|---|---|---|
| `L1_APPLICATIONS` | AI applications & end-user demand | Where the dollars enter the system. |
| `L1_MODELS` | Foundation models & model developers | The "product" that turns compute into usable AI. |
| `L1_TRAIN_INFER_PLATFORMS` | Training & inference platforms | Software stack and managed services that run the models. |
| `L1_HYPERSCALERS` | Cloud hyperscalers | AWS, Azure, GCP, OCI — the dominant compute landlords. |
| `L1_NEOCLOUDS` | GPU cloud / "neocloud" providers | CoreWeave, Nebius, Lambda, etc. |
| `L1_COMPUTE` | AI accelerators & processors | GPUs, TPUs, custom ASICs, CPUs. |
| `L1_SEMI_DESIGN` | Semiconductor design | Fabless designers and IDMs. |
| `L1_SEMI_IP` | Semiconductor IP | Arm, RISC-V vendors. |
| `L1_EDA` | EDA software | Synopsys, Cadence. |
| `L1_FAB` | Wafer fabrication & foundries | TSMC, Samsung, Intel Foundry, GlobalFoundries. |
| `L1_PACKAGING` | Advanced packaging | CoWoS, FOPLP, hybrid bonding. |
| `L1_MEMORY` | DRAM, HBM, NAND | Micron, SK hynix, Samsung, Kioxia. |
| `L1_NETWORKING` | Networking chips, switches, routers | Arista, Cisco, Broadcom, Marvell. |
| `L1_OPTICAL` | Optical interconnects | Coherent, Lumentum, Fabrinet, Astera Labs. |
| `L1_SERVERS` | Servers, OEM/ODM | Dell, HPE, SMCI, Quanta, Foxconn. |
| `L1_STORAGE` | Storage systems | WDC, STX, Pure Storage, NetApp. |
| `L1_DC_OPS` | Data-center operators | Equinix, Digital Realty, hyperscaler-owned. |
| `L1_DC_REIT` | Data-center REITs | EQIX, DLR, Iron Mountain. |
| `L1_DC_CONSTRUCTION` | DC construction & engineering | Quanta, MasTec, EMCOR, Comfort Systems. |
| `L1_DC_POWER_INTERNAL` | Power infra inside the DC | Switchgear, busways, PDUs. |
| `L1_UPS` | UPS systems | Vertiv, Eaton, Schneider. |
| `L1_GRID_EQUIPMENT` | Transformers, switchgear (grid-side) | GE Vernova, Eaton, Hubbell, Hammond. |
| `L1_GENSETS` | Backup generators | Cummins, Caterpillar, Generac. |
| `L1_COOLING` | Cooling & thermal management | Vertiv, Trane, Johnson Controls, Modine. |
| `L1_LIQUID_COOLING` | Liquid cooling | Vertiv, Boyd, CoolIT (private), Asetek (foreign). |
| `L1_IMMERSION` | Immersion cooling | Mostly private / nascent. |
| `L1_WATER` | Water supply & treatment | Xylem, Veralto, A.O. Smith, Roper-adjacent. |
| `L1_GRID_INTERCONNECT` | Grid interconnection | Utilities, ISO/RTO permitting. |
| `L1_GENERATION` | Electricity generation | IPPs, utilities, IPP-fleet operators. |
| `L1_NUCLEAR` | Nuclear power | CEG, VST (existing), OKLO, SMR, BWXT (new builds / SMRs). |
| `L1_GAS_POWER` | Natural-gas power | VST, NRG, NEE-adjacent, gas turbine OEMs. |
| `L1_RENEWABLES` | Solar / wind | NEE, FSLR, AES, BEPC, etc. |
| `L1_STORAGE_ESS` | Energy storage | TSLA (Megapack), STEM, FLNC, EOSE, etc. |
| `L1_T_AND_D` | Transmission & distribution equipment | Eaton, Hubbell, GE Vernova, Powell. |
| `L1_FUEL` | Fuel supply chains | Uranium, natural gas, diesel. |
| `L1_SEMI_EQUIP` | Semiconductor manufacturing equipment | AMAT, LRCX, KLA, ASML (ADR), TEL (foreign). |
| `L1_LITHO` | Lithography | ASML (ADR), Canon (foreign), Nikon (foreign). |
| `L1_DEPOSITION` | Deposition (CVD/PVD/ALD) | AMAT, LRCX, ASMI (foreign). |
| `L1_ETCH` | Etch | LRCX, AMAT, TEL (foreign). |
| `L1_METROLOGY` | Metrology & inspection | KLA, Onto, Camtek, Nova. |
| `L1_WAFER_CLEAN` | Wafer cleaning | LRCX, ACMR, TEL (foreign), SCREEN (foreign). |
| `L1_ION_IMPLANT` | Ion implantation | AMAT, Axcelis. |
| `L1_CMP` | CMP / polishing | AMAT, Ebara (foreign). |
| `L1_SPECIALTY_CHEM` | Specialty chemicals | Entegris, Linde, Air Products, DuPont. |
| `L1_PHOTORESIST` | Photoresists | JSR, TOK, Shin-Etsu, Fujifilm — all foreign. |
| `L1_INDUSTRIAL_GAS` | Industrial gases | Linde, Air Products, Air Liquide (foreign). |
| `L1_CLEANROOM` | Cleanroom systems | Largely private; Daikin / Camfil indirect. |
| `L1_MINERALS` | Critical minerals & raw materials | All of L5 lives downstream of this domain. |
| `L1_MINING` | Mining | FCX, SCCO, BHP (ADR), RIO (ADR), VALE (ADR). |
| `L1_REFINING` | Refining & processing | Same set; downstream chemistry. |
| `L1_RARE_EARTHS` | Rare earths | MP Materials, Energy Fuels (UUUU). |
| `L1_COPPER` | Copper | FCX, SCCO, TECK (ADR), ERO. |
| `L1_ALUMINUM` | Aluminum | AA, KALU, CENX. |
| `L1_SI_POLYSI` | Silicon / polysilicon | Wacker (foreign), Hemlock (private), GCL (foreign). |
| `L1_GALLIUM` | Gallium | Mostly Chinese refiners; weak U.S.-listed proxies. |
| `L1_GERMANIUM` | Germanium | Same — Chinese-dominant; weak proxies. |
| `L1_TUNGSTEN` | Tungsten | Almonty (ATC.TO; not U.S.-listed common), some pending. |
| `L1_COBALT` | Cobalt | Glencore (foreign), JRVR proxies; low investable purity. |
| `L1_NICKEL` | Nickel | VALE, BHP, NILSY (sanctioned/foreign). |
| `L1_LITHIUM` | Lithium | ALB, SQM (ADR), LAC, LTHM (now ALB-merged). |
| `L1_GRAPHITE` | Graphite | NMG, GPHOF; few clean public names. |
| `L1_FLUORSPAR` | Fluorspar / fluorine chain | Largely private / state. |
| `L1_HELIUM` | Helium | RNGR (gas extraction), Air Products (LIN), some private. |
| `L1_NOBLE_GASES` | Neon, argon, krypton, xenon | Linde, Air Products dominate the merchant market. |
| `L1_QUARTZ` | High-purity quartz | Sibelco (private), The Quartz Corp (private), Covia (private). |
| `L1_LOGISTICS` | Logistics & shipping | UPS, FDX, GXO, ZIM (ADR), MAERSK-B (foreign). |
| `L1_REAL_ESTATE` | Real estate / land acquisition | DC REITs and adjacent landowners. |
| `L1_PERMITTING` | Permits, environmental review, local politics | Not a company layer — a process layer. |
| `L1_CYBERSEC` | Cybersecurity & physical security | CRWD, PANW, FTNT, ZS (cyber), ALLE (physical), ADT. |
| `L1_DATA_LICENSING` | Data sourcing, licensing, labeling | Mostly private (Scale AI, Surge, Labelbox). |
| `L1_SYNTHETIC_DATA` | Synthetic data & data pipelines | Mostly private; SNOW / DDOG / MDB peripheral. |
| `L1_AI_SOFTWARE_STACK` | AI software stack & developer tools | Largely private; PLTR, MDB, DDOG, SNOW peripheral. |
| `L1_MLOPS` | MLOps & observability | DDOG, NEWR, S, SPLK-equivalents; mostly private. |
| `L1_GOVERNANCE` | Model safety, evaluation, governance | Mostly private / nonprofit / public-sector. |
| `L1_FINANCE` | Capex, debt, leases, project finance | KKR, BX, ARES (alts); BAC, JPM (lenders). |
| `L1_POLICY` | Government policy, export controls, subsidies | Not investable; framing layer. |
| `L1_LABOR` | Specialized talent | Not directly investable; framing layer. |

---

## L2–L5: drilling down

The CSV `data/nodes.csv` carries the full L2-L5 hierarchy. The most consequential drill-downs are summarized below.

### Compute → Chips → Foundry → Equipment → Inputs

```
L0_AI_ECOSYSTEM
└─ L1_COMPUTE
   ├─ L2_AI_ACCELERATORS
   │  ├─ L3_GPU                    (NVDA, AMD)
   │  ├─ L3_HYPERSCALER_ASIC       (Trainium / Inferentia / TPU / MTIA — most via AVGO, MRVL design partners)
   │  ├─ L3_AI_STARTUP_ASIC        (Cerebras, Groq, SambaNova — private)
   │  └─ L3_FPGA                   (AMD/Xilinx, Lattice, Achronix-private)
   ├─ L2_CPU                       (INTC, AMD)
   └─ L2_DPU                       (NVDA via Mellanox, AMD via Pensando)

Each of those L3 nodes depends on:

   L1_FAB
   ├─ L2_LEADING_EDGE_FOUNDRY      (TSM, INTC Foundry, Samsung-foreign)
   │  ├─ L3_5NM_AND_BELOW
   │  ├─ L3_3NM_AND_BELOW
   │  └─ L3_2NM_AND_BELOW
   └─ L2_SPECIALTY_FOUNDRY         (TSM specialty, GFS, UMC-foreign)

   L1_PACKAGING
   ├─ L2_COWOS                     (TSM-dominant; ASE Group via ASX-ADR is non-U.S.-listed)
   ├─ L2_FOPLP
   └─ L2_HYBRID_BONDING

   L1_MEMORY
   ├─ L2_HBM                       (MU U.S.-listed; SK hynix and Samsung non-U.S.-listed)
   ├─ L2_DRAM                      (MU; SK hynix, Samsung foreign)
   └─ L2_NAND                      (MU; Samsung, Kioxia foreign; WDC-spinoff dynamics)

Each of those depends on:

   L1_SEMI_EQUIP
   ├─ L2_LITHO                     (ASML for EUV/DUV; Canon, Nikon foreign)
   │  ├─ L3_EUV_SCANNER            (ASML monopoly)
   │  ├─ L3_DUV_IMMERSION          (ASML, Canon, Nikon)
   │  └─ L3_NANOIMPRINT             (Canon — foreign)
   ├─ L2_DEPOSITION                (AMAT, LRCX, ASMI foreign)
   ├─ L2_ETCH                      (LRCX, AMAT, TEL foreign)
   ├─ L2_CMP                       (AMAT, Ebara foreign)
   ├─ L2_METROLOGY                 (KLAC, ONTO, CAMT, Nova-NVMI ADR)
   ├─ L2_ION_IMPLANT               (AMAT, ACLS)
   ├─ L2_WAFER_CLEAN               (LRCX, ACMR; SCREEN, TEL foreign)
   ├─ L2_TEST_EQUIP                (TER, Cohu, Advantest foreign)
   ├─ L2_DICING_GRINDING           (Disco 6146.T — foreign monopoly)
   └─ L2_PHOTOMASKS                (PLAB; Toppan/DNP foreign)

   L1_SPECIALTY_CHEM
   ├─ L2_PHOTORESIST               (JSR, TOK, Shin-Etsu — all foreign; bottleneck)
   ├─ L2_CMP_SLURRY                (CCMP-now-Entegris-merged-into-ENTG; DuPont; Cabot)
   ├─ L2_HIGH_PURITY_CHEMICALS     (ENTG, LIN, APD)
   └─ L2_PRECURSORS_ALD            (ENTG, foreign chemicals firms)

   L1_INDUSTRIAL_GAS
   ├─ L2_BULK_GASES                (LIN, APD)
   ├─ L2_NEON                      (Iceblick + Cryoin historically Ukraine-based; merchant via LIN, APD)
   ├─ L2_HELIUM                    (LIN, APD; some private E&P)
   ├─ L2_KRYPTON_XENON             (LIN, APD)
   └─ L2_FLUORINATED                (HF, NF3, WF6 — LIN, APD, ENTG)

Root inputs (L5 — examples):
   L5_GALLIUM, L5_GERMANIUM, L5_NEON, L5_HELIUM, L5_HIGH_PURITY_QUARTZ,
   L5_PHOTORESIST_FEEDSTOCK, L5_TUNGSTEN, L5_COPPER (for wiring), L5_COBALT,
   L5_TANTALUM, L5_RARE_EARTHS_MAGNETS, L5_HAFNIUM, L5_ZIRCONIUM
```

### Data center → Power → Grid → Generation → Fuel

```
L1_DC_OPS
└─ L2_HYPERSCALE_DC
   ├─ L3_BUILDING_SHELL           (PWR, MTZ, EME, FIX construction)
   ├─ L3_INTERIOR_FITOUT          (FIX, IESC)
   ├─ L3_POWER_DISTRIBUTION       (VRT, ETN)
   ├─ L3_COOLING_SYSTEMS          (VRT, TT, JCI, MOD)
   └─ L3_NETWORKING_BACKBONE      (ANET, CSCO, LITE, COHR)

L1_DC_POWER_INTERNAL
├─ L2_UPS                          (VRT, ETN)
├─ L2_BUSWAY_PDU                   (VRT, ETN, HUBB)
└─ L2_BACKUP_GENERATION            (CMI, CAT, GNRC)

L1_GRID_INTERCONNECT  ← regulatory + utility-driven; multi-year queue
└─ L2_INTERCONNECTION_QUEUE        (PJM, ERCOT, MISO, CAISO, etc.; not directly investable)

L1_GENERATION
├─ L2_NUCLEAR                      (CEG, VST, BWXT, OKLO, SMR, LEU, CCJ ADR)
│  └─ L3_FUEL_CYCLE                (LEU, CCJ ADR, UEC, UUUU)
│     ├─ L4_URANIUM_MINING         (CCJ ADR, UEC, DNN)
│     ├─ L4_CONVERSION_ENRICHMENT  (LEU)
│     └─ L4_FUEL_FABRICATION       (BWXT, CCJ ADR, plus state-owned globally)
├─ L2_GAS                          (VST, NRG, IPPs)
│  └─ L3_GAS_TURBINE_OEM           (GE Vernova, Siemens-foreign, Mitsubishi-foreign)
├─ L2_RENEWABLES                   (NEE, FSLR, AES, BEPC)
└─ L2_HYDRO_GEO                    (BEP, NEE)

L1_T_AND_D
├─ L2_TRANSFORMER                  (HUBB, ETN, GEV; Hitachi/Hyosung foreign dominate large units)
├─ L2_SWITCHGEAR                   (ETN, ABBN-ADR, SU.PA-foreign, POWL)
├─ L2_SUBSTATION_INTEGRATION       (PWR, MTZ, primoris-PRIM)
└─ L2_HV_CABLE                     (Prysmian-foreign, Nexans-foreign; few U.S. listed)

L5 inputs:
  L5_GRAIN_ORIENTED_STEEL (transformer cores; bottleneck — AKS / CLF U.S. supply limited),
  L5_COPPER (windings, cables, busbars),
  L5_ALUMINUM (cables, structural),
  L5_RARE_EARTHS_MAGNETS (wind turbines, motors),
  L5_URANIUM, L5_NATURAL_GAS, L5_DIESEL_FUEL, L5_LITHIUM (BESS), L5_NICKEL, L5_COBALT.
```

### Minerals → Refiners → Components

See `data/minerals_to_ai_inputs.csv` and `data/mineral_supplier_mapping.csv` for the full mapping. Highlights:

- **Gallium** → GaN HEMTs, RF, some power semis, 5G/AI infra. China refines >90% globally; export controls active. No clean U.S.-listed pure-play; weakly proxied by 5N Plus (VNP.TO, not U.S.-listed) and via integrated electronics customers.
- **Germanium** → optical fibers, IR optics, high-frequency transistors, solar cells. Same China dominance.
- **High-purity quartz (HPQ)** → silicon wafers (Spruce Pine, NC mine — historically The Quartz Corp + Sibelco, both private).
- **Neon** → ArF excimer lasers (lithography). Historically Ukraine ~50% of semiconductor-grade pre-2022; merchant gas firms have rebuilt supply but it's a fragile chain.
- **Helium** → MRI coil cooling, semiconductor fab, leak detection. LIN, APD; private upstream.
- **Photoresists** → Japanese firms dominate EUV resists (JSR-now-private-via-JIC, TOK, Shin-Etsu, Fujifilm). Not investable as U.S.-listed.
- **Tungsten** → contacts, interconnects in advanced nodes; China-dominant refining.
- **Copper, aluminum, steel** → not exotic but volume bottlenecks for DC + grid build. FCX, SCCO, TECK ADR, AA, NUE, STLD.
- **Grain-oriented electrical steel** → transformer cores. CLF / NUE peripheral; foreign dominance (POSCO, JFE, NSSMC).
- **Rare-earth magnets (NdFeB)** → motors, turbines, some HVAC. MP Materials (MP) is the only U.S. pure play; UUUU adjacent.

---

## What's intentionally not drilled into

- **App-layer software** (ChatGPT, Claude, Gemini, etc.) — captured at L2 only; the layer is mostly private.
- **Datasets and labeling** — captured but kept shallow because the dominant firms are private.
- **Non-AI semiconductors** (analog, MCUs, sensors) — outside scope unless they are AI-infra-critical (e.g. HBM controllers).
- **Software with negligible AI infra exposure** — outside scope.
