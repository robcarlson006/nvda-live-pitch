# Board-question drill (for the 25 Nov run-through)

One person reads a question cold, in their own words. The answerer has **five seconds** to name the bank answer (or say "no prepared answer"), then **thirty seconds** to answer aloud. The operator types the question into the operator chat to check what the bank matches. Mark each: right answer / right slide / within 30 s.

Rules for every answer: direct answer first, then one figure from the slide, then the risk we concede (except where the drill says rebut), then what it means for the 3% position. Never give a figure that is not on a slide or in `QA_PREP.md`.

## A. Same question, unfamiliar wording (does the bank still match?)

| # | Read this | Should reach | Trap |
|---|---|---|---|
| 1 | "Isn't the whole demo a carbon footprint you've just made bigger?" | `wasteful` | No measured energy figure for this presentation exists. Say so |
| 2 | "Who actually buys NVIDIA chips, and how many of them matter?" | `concentration` / `customers` | 36% is **three direct customers** in Q3 FY27, not "hyperscalers" |
| 3 | "What happens if he goes again?" | `huang-departure` | Kress was interim CEO 12–22 Nov; don't speculate on the investigation |
| 4 | "Did the British competition regulator stop them buying Arm?" | `uk-competition` | It didn't stop it: NVIDIA abandoned the deal and the CMA cancelled the inquiry (8 Feb 2022) |
| 5 | "Do they hide their UK taxes?" | `uk-tax` | A published strategy is not tax paid. Offer to check the entity accounts |
| 6 | "Your number went from two-thirty to nearly four hundred. Why should we trust either?" | `target-revision` | $232 is team-reported; most of the move is inputs (+$130.84), less is the rate (+$28.54) |
| 7 | "Is the liquid-cooling thing with Ecolab actually saving water?" | `ecolab-water` | Neither Ecolab release gives a water-saving figure |
| 8 | "Could Washington just ban new data centres?" | `democrats-datacentres` | Bills introduced, in committee. Don't call them Democrat bills: Sanders is an independent |
| 8a | "He said he didn't need a successor, then walked out. Isn't NVIDIA a one-man company?" | `huang-key-person` | **Rebut, don't concede.** Flat organisation; the quarter was delivered without him (beat expectations); one share class, the board can replace any CEO. The market prices the chips and demand |
| 8b | "Isn't all the revenue from a handful of hyperscalers?" | `concentration` | Nearly half of revenue came from outside the hyperscalers last quarter; don't claim a government share (Bloomberg doesn't split it) |
| 8c | "Aren't these data centres draining and contaminating local water?" | `ecolab-water` | Ecolab + NVIDIA on closed-loop liquid cooling; no water-saving figure published yet |
| 8d | "Show us the cash flows behind the DCF." / "What's terminal value as a share of EV?" | `fcf-forecast` / `dcf-bridge` | Both were main-deck slides until the 25 Nov cut; every figure is on the DCF-on-one-page slide too |

## B. Compound questions (answer both halves, in the order asked)

| # | Read this | Reach | Order |
|---|---|---|---|
| 9 | "AI wastes energy *and* you've used it for a slideshow: why should an ESG fund own the supplier?" | `wasteful` then `cleaner-than-peers` | Concede the footprint (Scope 3 rising) → own operations are lowest per $ of sales → we'd ask for energy per useful workload |
| 10 | "If the CEO is a security risk and China is closed, what's left of the bull case?" | `governance` then `china-export` | New independent committee, investigation open → our base case does not need China → recommendation's sell trigger |
| 11 | "What's your discount rate and what if you're wrong about it?" | `discount-rate` | 10.55 / 14.45 / 15.4%, all above the reference price → bear case costs the portfolio 1.01% |
| 12 | "Porter's five forces: which one would kill the thesis?" | `porter-forces` | Buyers: 36% from three direct customers; custom chips are the substitute to watch |
| 13 | "How does NVIDIA rank against AMD as an employer, and does that matter for returns?" | `peer-rankings` | We hold NVIDIA's ranks, **not AMD's**: no head-to-head claim. Turnover 3.7% is the useful link |

## C. Questions with no prepared answer (practise saying so)

| # | Read this | Good response |
|---|---|---|
| 14 | "What's NVIDIA's water use per GPU shipped?" | "We don't have that measure. Bloomberg shows NVIDIA's own withdrawals rising, but we are still confirming the units, so we give no number. Per-GPU would need supply-chain data." (`water` covers the first half) |
| 15 | "Has the Serious Fraud Office ever investigated NVIDIA?" | "We haven't searched the SFO's records, so we won't say no. The policy we can show names the Bribery Act." |
| 16 | "What's the share price right now?" | Read the live ticker on stage, then: "Our model uses a dated reference price; the recommendation holds at all three rates." |
| 17 | "Does NVIDIA pay the UK living wage?" | Evidence gap. Offer to check the Living Wage Foundation register and Companies House filings. |

## After the drill

Log missed matches (no slide, or the wrong slide) in `rehearsal/` and add the phrase that failed to the right answer's `ask:` list. Then run `npm test`: the bank test fails if two answers start matching the same phrase.
