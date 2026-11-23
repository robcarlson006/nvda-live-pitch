> **STALE FIGURES (23 Nov 2026):** the numbers below were written at the 20 Nov Bloomberg price ($135.46). At today's $163.66 base is +2% (not +24%), the price already needs 38.1% yearly growth (not 32.1%), and the bear case is 81% below. Value-per-share answers are unchanged. Re-read before quoting; the spreadsheet is current.

# Numbers audit (PV-M1), 22 Nov 2026

**Verdict**
1. The arithmetic is right: all 37 model outputs rebuild to the cent, and 315 of 315 clean values match the Bloomberg PDFs.
2. The claims are not all right: 6 are wrong on stage, and the valuation slide oversells. Base, bull and bear average **$128.21, below the $135.46 price**.
3. The base case is not "analysts' forecasts": only FY28 is consensus, **6.7% of EV**. The rest is our own fade to $1.93tn of FY32 revenue.

## Discrepancies (M = mechanical fix, J = judgement call; `say` is never edited here)

| # | Discrepancy | Where | Severity | Fix | Recommended action |
|---|---|---|---|---|---|
| 1 | "Water is not in the Bloomberg data" is **false**: withdrawal 382.6 / 409.8 / 451.3 (FY24–26), FA pp. 234, 244 | qa `water` | Wrong on stage | M | Add `nvda_water`, rewrite; confirm unit ('000 m³) on the terminal |
| 2 | Glassdoor 2023 #1 was Gainsight; NVIDIA was #5 ([CNBC](https://www.cnbc.com/2023/01/11/the-10-best-us-places-to-work-in-2023-according-to-glassdoor.html), [Gainsight](https://www.gainsight.com/press/release/gainsight-earns-1-spot-on-glassdoors-best-places-to-work-list-for-2023/)) | beat 14 ✂ | Wrong on stage | M + `say` | Cut the line |
| 3 | "Even our bear case…" implies it clears the price; $31.40 is **77% below** | `valuation` say | Wrong on stage | J | "Our bear case is $31, far below today" |
| 4 | Says fibre 1.4%, bar shows 1.1%. 1.39% is the 2000 *peak*; every bar is an *average* | beat 15 say | Wrong on stage | J | "1.1 percent a year on average" |
| 5 | "The founder resigned last week": 13 days before the pitch, and he is one of three founders | `governance` say | Wrong on stage | J | "Co-founder… on 12 November" |
| 6 | "AMD's latest chip… 288 against 192": our notes say MI450 launched by Q3 2026, and NVIDIA's B300 also has 288 GB | beat 9 say | Wrong on stage | J | Name them: MI355X v B200 |
| 7 | "The shares are worth more" is false for bear | `valuation` title | Misleading | J | Retitle |
| 8 | "Uses analysts' forecasts": FY29–32 growth (55/38/20/3%) is ours | `valuation` say | Misleading | J | "…for next year, then we slow it" |
| 9 | "Run on renewable energy" is certificate **matching** (market-based Scope 2 0.57 kt; location-based **308.9 kt**, up from 228.4). "100%" is of total energy yet includes 46 GWh of fuel; Scope 1 is 9.8 kt | `renewables`, qa `energy` | Misleading | M + `say` | "matches its energy with renewables" |
| 10 | Reported Scope 3 categories already sum to the 10.7 Mt total: **use of sold GPUs is not in it**, which is why 87% is "making the chips" | `scope3`, qa ×2 | Misleading | M | State the exclusion |
| 11 | "Own operations: 10k t" is Scope 1 only; 319 kt with location-based Scope 2 | qa `scope3` | Misleading | M | Show Scope 2 |
| 12 | "Forecasts haven't fallen", "since the CEO resigned": no estimate or price history exported. $243 (6 Oct) was already $211 by 25 Oct | `peers` | Misleading | J | Export ANR/HP or cut |
| 13 | 19.3% is "cautious" only as a rate; the growth path is not. No beta or premium on the PDF; uses the 25 Oct cap (re-weighted: 19.23%) | `valuation` | Misleading | J | Keep; add CAPM cross-check |
| 14 | FCF margin 45.25% v 41.1% last 12 months (also 41.1% after stock pay) and 38.8% FY27 to date. Consensus FY28 is 46.4% | model | Misleading | J | Offer 41% as a switch |
| 15 | $297 peer bar is tallest; driven by AMD 53x, Intel 35x. TSMC alone: $173 | `valuation` chart | Misleading | J | Drop or caveat |
| 16 | "Lowest rate shown: $424.45" does not say it is 10% | qa `discount-rate` | Misleading | M | Show 12% ($323.72) |
| 17 | Bear case is an AI pause, not a governance failure | qa `governance` | Misleading | J | Reword |
| 18 | "Share price today" is 12:52 on 20 Nov | `valuation` | Misleading by 25th | M | Set `priceOverride` |
| 19 | Networking "unverified": FA p.175 prints **$31,376m** | beat 11 | Cosmetic | M | Verify it |
| 20 | P/E 14.07x (slide), 14.05–14.06x (DES); 22.7x is research notes only | beat 16 | Cosmetic | – | Say "about 14" |
| 21 | Broadcom's year ended 31 Oct 2026, not ~Jan 2027 | `peers` | Cosmetic | M | Relabel |
| 22 | 12% WACC and "Mi'kael must own" are stale | PROGRESS Risks | Cosmetic | M | Update |
| 23 | "For a decade": 8 years (FY07–14) | beat 7 ✂ say | Cosmetic | J | "most of a decade" |
| 24 | Sensitivity keeps the fade ending at 3%; consistent is $158.96 / $177.15 at 2% / 4% | `model_sensitivity` | Cosmetic | J | Note it |
| 25 | CSV prints 1.2 years (model 1.196): rebuild gives $167.41 | valuation.csv | Cosmetic | M | Four decimals |

**Checked and fine:** thirteen quarters (13 of 13, revenue only; **EPS missed in FY26 Q1, $0.81 v $0.93**); cheapest of the five (also on EV/EBITDA and next-year P/E); twelve times AMD (11.65x); lowest emissions intensity (location-based too, but the gap to AMD falls from 26x to 2.4x); EPS, price and shares all post-split.

## The model
- **Terminal value:** 55.5% of EV (base, bull), 45.8% (bear). Low only because 19.3% crushes it.
- **FY27:** no FY27 cash is counted. Net cash is the 25 Oct balance, so Nov–Jan FCF ($61–70bn) is lost: +$2.44 to +$2.80. End-year discounting; mid-year adds $6.77. Diluted shares take $0.60. Net: **conservative by about $9**, internally consistent.
- **Simple enough for first-years? Yes.** Hard to defend: why growth fades in a straight line from 72.6% to 3%.

| Attack (base $167.50) | Value | Attack | Value |
|---|---|---|---|
| Growth 72.6/**40/20/10**/3 | **$127.86** | FY28 consensus 20% too high | $134.50 |
| Growth 72.6/20/10/5/3 | $101.14 | Margin 38.8% / −10pp | $143.81 / $131.03 |
| FY29–31 growth 30% lower | $135.70 | WACC 12% / 22% | $323.72 / $140.62 |

Break-even: FY29–31 growth 30% lower, WACC 22.6%, margin 36.5%, or a 23.5% chance of bear over base. The price implies 32.1% growth v our 35.6%, so "the market expects far less" is not available at 19.3%.

## Reconciliation

| Check | Checked | OK | Wrong or unsupported |
|---|---|---|---|
| Model outputs v rebuild | 37 | 37 | 0 |
| Slide figures / chart endpoints | 48 / 58 | 48 / 58 | 0 (6 still tagged unverified) |
| Spoken numbers and claims | 60 | 49 | 4 contradict data, 7 have no dataset |
| Clean values v raw PDFs | 315 | 315 | 0 (self-test: nudged values fail 305 of 315) |

Research figures were checked against the notes and datasets only, not primary sources (except row 2).
**Rerun:** `/usr/bin/python3 loop/audit/dcf.py` and `/usr/bin/python3 loop/audit/reconcile.py [--mutate]` (needs poppler, PyYAML; this shell's `python3` alias is empty).
