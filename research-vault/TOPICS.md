# Research queue (human-owned; the loop takes the next unfinished line)
# Format: - ID [model] topic-tag: what to find. [luna] = quick sweep (cheap model), [terra] = careful research (mid model).
# Aim per item: 10–25 facts with verbatim quotes, 2–5 board Q&As, follow-up ideas in state/NEW_TOPICS.md.

- T001 [terra] energy-ai: AI/data-centre electricity demand (IEA, LBNL, utilities): totals, growth, share of world power; GPU performance-per-watt gains across NVIDIA generations (Hopper → Blackwell → Rubin) from NVIDIA and independent sources
- T002 [terra] emissions: NVIDIA Scope 1, 2, 3 emissions, targets (SBTi status), renewable electricity share, supplier engagement targets; latest sustainability report and CDP score
- T003 [terra] water: NVIDIA and TSMC water use and recycling; data-centre water use per AI workload; Ecolab/NVIDIA cooling work
- T004 [terra] esg-environment: inference energy per query (text, image, video) — best available measurements and their uncertainty; efficiency arguments vs rebound effect (Jevons)
- T005 [terra] esg-social: NVIDIA employees, turnover, diversity data, pay equity, Glassdoor/Fortune rankings, labour issues in the supply chain (conflict minerals, RBA audits, Modern Slavery statement)
- T006 [terra] governance: board composition, independence, CEO situation in Nov 2026 (resignation, investigation, reinstatement — exact dated facts from NVIDIA releases and major press), dual roles, auditor, executive pay, shareholder votes
- T007 [terra] customers: revenue mix by customer type (hyperscalers vs AI clouds, industrial, enterprise, sovereign), customer concentration (direct and indirect), named largest customers' capex plans 2026–2027
- T008 [terra] sovereign-ai: sovereign AI deals (UK, EU, Middle East, India, Japan), sizes and dates; government and public research compute (Isambard-AI, AIRR)
- T009 [terra] guidance: latest quarter (Q3 FY27) results and Q4 guidance: revenue, gross margin, opex, segment growth, CFO commentary quotes
- T010 [terra] segments: Data Center compute vs networking, Gaming, Pro Visualization, Automotive/robotics; growth rates and shares over the last 8 quarters
- T011 [terra] competition: AMD (MI-series), Intel (Gaudi), custom ASICs (Google TPU, Amazon Trainium, Microsoft Maia, Meta MTIA), Broadcom/Marvell custom silicon; market-share estimates with sources
- T012 [terra] software-cuda: CUDA ecosystem size (developers, libraries), switching costs evidence, ROCm/OneAPI/Triton/open alternatives, NVIDIA AI Enterprise and software revenue
- T013 [terra] networking: NVLink, InfiniBand vs Ethernet (Spectrum-X), networking revenue, Mellanox history; competition from Broadcom/Arista
- T014 [terra] supply-chain: TSMC dependence, CoWoS packaging capacity, HBM suppliers (SK hynix, Samsung, Micron), Arizona fabs, lead times, inventory and purchase commitments
- T015 [terra] china-export: US export controls timeline (A100/H100/H20 etc.), China revenue share history, licence fees, Chinese competitors (Huawei Ascend), smuggling enforcement
- T016 [terra] regulation: antitrust probes (US DOJ/FTC, EU, China SAMR, UK CMA), Arm deal history, AI regulation (EU AI Act) relevant to NVIDIA
- T017 [terra] risks: 10-K risk factors summarised with quotes; litigation; geopolitical (Taiwan) scenarios; key-person risk
- T018 [terra] bear-case: the strongest published bear arguments (AI capex bubble, depreciation of GPUs, circular financing, margin compression, customer in-sourcing) with who said it and data behind them
- T019 [terra] bull-case: strongest published bull arguments (Rubin roadmap, inference demand, physical AI/robotics, sovereign AI, software attach) with sources
- T020 [terra] ai-demand: hyperscaler capex (Microsoft, Alphabet, Amazon, Meta, Oracle) 2024–2027 from their own filings/calls; AI revenue they report; token/inference volume growth
- T021 [terra] valuation: P/E, EV/EBITDA, PEG, FCF yield for NVDA and peers from public sources (dated); NVDA historical valuation ranges; analyst price targets range and ratings count
- T022 [terra] analysts: consensus revenue/EPS for FY27–FY29 from public sources; recent upgrades/downgrades with dates and reasons
- T023 [terra] shareholder-returns: buybacks, dividends, authorisations, share count trend, SBC dilution
- T024 [terra] financials: gross/operating/net margins, FCF, cash, debt, R&D spend and intensity, capex, inventory — last 8 quarters and 5 years
- T025 [terra] products: Blackwell, Blackwell Ultra, Rubin, Rubin Ultra, Grace, DGX/HGX/GB200 NVL72 — launch dates, performance claims, prices where public
- T026 [luna] history: founding (1993, Denny's), first GPU, CUDA 2006, AlexNet 2012, key acquisitions, market-cap milestones with dates
- T027 [luna] management: Jensen Huang, Colette Kress and other officers — tenure, background (public professional facts only)
- T028 [terra] uk: NVIDIA in the UK — investments, Nscale, Isambard-AI, UK AI Opportunities plan, UK tax/legal items, UK jobs
- T029 [terra] macro: interest rates, US 10-year yield, equity risk premium sources, semiconductor cycle history (2000, 2008, 2022 drawdowns) and NVDA drawdowns
- T030 [terra] market: NVDA share price history, 52-week range, market cap vs peers, index weights (S&P 500, MSCI World, FTSE All-World)
- T031 [terra] esg-environment: ESG ratings for NVIDIA from MSCI, Sustainalytics, ISS, CDP, Bloomberg — values, dates, methodology caveats; comparison with peers
- T032 [terra] energy-ai: data-centre grid constraints, nuclear/renewable PPAs by hyperscalers, examples of AI used for climate/energy savings (with measured results only)
- T033 [luna] other: NVIDIA in healthcare, drug discovery, weather/climate (Earth-2), robotics, automotive partners — named deals and dates
- T034 [terra] dcf: published DCF/fair-value estimates for NVDA from reputable public sources (Morningstar, etc.), their key assumptions (WACC, growth, margins), to compare with ours in ../data/clean/model_*.json
- T035 [terra] peers: AMD, Broadcom, TSMC, Intel latest annual revenue, growth, margins, AI revenue, guidance (from their filings/releases)
