> **SUPERSEDED (24 Nov 2026):** the headline discount rate is now **10.55%** (Damodaran US semiconductor average) at a **$165.05** price; Google Finance has 14.45% (beta 2.21) and Bloomberg 19.3%. Base $391.38, realistic bear $101.56, stress $64.41 (the old "AI pause" bear). The "Why 19.3%?" answer is now "Why not 19.3%?": see `docs/qa-bank/QA_PREP.md` Part 5 and the prepared answer `discount-rate`. Everything below is at 19.3%.
>
> **STALE FIGURES (23 Nov 2026):** the numbers below were written at the 20 Nov Bloomberg price ($135.46). At today's $163.66 base is +2% (not +24%), the price already needs 38.1% yearly growth (not 32.1%), and the bear case is 81% below. Value-per-share answers are unchanged. Re-read before quoting; the spreadsheet is current.

# Defend the valuation (Panshul, Mi'kael)

**The answer in one breath.** "Our base case is **$167.50** against **$135.46** on 20 November; our bear case is **$31.40**, 77% below. At Bloomberg's discount rate, today's price already needs sales to grow **32.1%** a year for five years; base needs **35.5%**. If you think an AI pause is likelier than about one in four (**23.5%**), our numbers say don't buy." [V, I, A]

| Assumption | In one sentence | Why | If it's wrong (base $167.50) |
|---|---|---|---|
| FY28 sales $728.6bn | Year to January 2028, up 72.6% | Analysts' average | 20% lower: **$97.17** if later growth starts from the lower number (what the sheet does), **$134.50** if later growth stays the same [A]. About 8% lower is break-even in the sheet |
| Then 55, 38, 20, 3% | Growth slows in a straight line | Our rule, not a forecast | 40, 20, 10, 3%: **$127.86** [A] |
| 45.25% cash | $45 of every $100 sold is left as cash | FY24–26 average | 38.8%: **$143.81** [A] |
| 19.3% discount rate | $119.30 next year is worth $100 today | Bloomberg's figure | 12%: $323.72 [S]; 22%: **$140.62** [A] |
| 3% terminal growth | Growth for ever after FY32 | Our judgement | 2%: $161.37; 4%: $174.44 [S]. Typing 2% or 4% in the sheet also moves the fade: $158.96 / $177.15 |
| EV-to-equity bridge | $3,977bn + $59.6bn net cash, ÷ 24.1bn shares | Bloomberg | Missing quarter: +$2.44 to +$2.80 [A] |
| Bull | Base sales, 5 points more cash | Software, networking | $185.74 [V] |
| Bear | Sales 0, −20, 0, 3, 3%; 10 points less cash | AI spending pauses | $31.40 [V] |
| Share count 24.1bn | One share is a 24.1-billionth of the company | Bloomberg DES, 20 Nov | Each 1% more shares lowers the value by 1% (about $1.68). We ignore new shares paid to staff, so ours is a little generous [D] |
| Reverse DCF: **32.1%** | The price needs sales to grow 32.1% a year, FY28–FY32 | Same DCF run backwards, appendix sheet *Reverse DCF* | At 25% a year a share is worth $107.71; 30%: $126.72; 35%: $148.59; 40%: $173.63 [S2]. At a 12% discount rate the price needs only 13.1% [D] |
| P/E cross-check | NVIDIA is on 14.1x (Bloomberg’s 14.07; price ÷ EPS in the Peers sheet gives 14.05) this year's profit; the four peers' middle is 30.9x | Bloomberg multiples, appendix sheet *Peers* | At that middle multiple a share is $297.49; at TSMC's, the cheapest peer, $173.33; our DCF base is $167.50 [S2]. If profits fall short, the low multiple is a trap, not a bargain |


Each row changes one thing; two misses together are worse. **Say so first.**

## The reverse DCF in four sentences (appendix sheet "Reverse DCF")

1. **What it asks.** Not "what is a share worth?" but "what sales growth does $135.46 already pay for?", using the same margin (45.25%), discount rate (19.3%), long-run growth (3%), net cash and share count as the DCF.
2. **The answer.** 32.1% a year for five years (the sheet shows 32.0%: its straight-line read-off sits 0.08 points under the exact answer; say "about 32%"): sales from $422bn (FY27) to $1,697bn (FY32), 4.0 times. Our base case is 35.5%, to $1,932bn, 4.6 times: 3.5 points a year more than the price needs, and that gap is the whole of our upside.
3. **How the sheet finds it.** It values a share at six growth rates (20% to 45%) and draws a straight line between the two that bracket the price. Fifteen formulas, within 0.1 point of the exact answer; the gate recomputes it independently with the model's own maths.
4. **Say it straight.** The 32.1% rests on Bloomberg's 19.3% discount rate. At 16% the price needs 24.1%; at 12%, 13.1%; at 10%, 6.5%. So "the market expects 32%" is not a claim we can make; "at our discount rate the price needs 32%" is.

## P/E against peers: which number is which (appendix sheet "Peers")

- **14.1x (Bloomberg, on the slide):** price ÷ this year's expected profit per share ($9.64; the year ends January 2027, so it is nearly known). Peers on the same measure: AMD 53.4x, Intel 35.4x, Broadcom 26.3x, TSMC 18.0x. NVIDIA is cheapest of the five, 54% below the peers' middle (30.9x).
- **22.7x (research notes):** we cannot rebuild it from any file we hold. We do not know which: a higher share price or a different year’s profit would explain it. Not in any number we show. If a board member quotes it, the answer is: at 22.7x NVIDIA would be dearer than TSMC (18.0x) but still cheaper than AMD, Intel and Broadcom. The conclusion "not the dearest of the group" survives; "cheaper than all of them" does not.
- **What the peers imply.** Median multiple: $297.49 a share. That is inflated by AMD and Intel (Intel’s 35x sits on low profits: 15% operating margin). The cautious cross-check is TSMC, $173.33, close to our DCF's $167.50. PEG (P/E per point of growth): NVIDIA 0.20, peers' middle 0.49, which would say $338.51; do not use it, it leans on one year of 72% profit growth.
- **What our data does not say.** Whether NVIDIA deserves a premium or a discount to peers: we have one year of multiples, no history of the gap.

## Hardest questions

1. **Bubble?** It could be: a forward P/E of 14.07 (TSMC: 17.98) is only cheap if profits last. If they don't, our bear says $31.40. [P, V]
2. **Why 19.3%?** It's Bloomberg's; 12% would have flattered us at $323.72, and base meets the price at 22.6%. Its page hides the CAPM inputs so we can't rebuild it, and a high rate doesn't make our growth cautious. [S, A]
3. **Why 3% terminal growth?** Our judgement, and it matters little: even 0% gives $151.01. The bigger bet is the $1.93tn of FY32 sales it starts from, 8.9 times FY26. [D]
4. **Too few customers?** Fair: data centres were $193.7bn of $215.9bn in FY26, and our data doesn't split customers. FY28 sales 20% lower takes base to $97.17 in the sheet ($134.50 if later growth is unchanged): below the price either way. [G, A]
5. **What if AI spending pauses?** Sales stall, fall 20% and barely recover: $31.40, or $54.52 even at 12%. The sizes are our choice and not the worst case: power and regulation limits aren't in it. [V, D, M]
6. **Your three cases average $128, below the price.** Yes, $128.21, at equal odds, which we can't prove or rule out. Between base and bear, break-even is a 23.5% chance of bear, with $32 to gain and $104 to lose. [A, D]
7. **Your base isn't analysts' forecasts.** Correct: only FY28 is (6.7% of the business value directly, though every later year builds on it); FY29–32 is our straight line. With FY29–31 growth 30% lower, base is $135.70: no upside. [A]
8. **Why 45% cash?** It's the FY24–26 average and analysts' FY28 is 46.4%, but the last twelve months, 41.1%, give $152.38 and this year so far, 38.8%, gives $143.81. Base meets the price at 36.5%. [A, D]
9. **Why leave out FY27 Q4 cash?** Simplicity: we use October's net cash, then cash from FY28. Leaving it out costs us $2.44 to $2.80 a share. [A]

## Never say

- "Even the bear case"; "cautious model"; "the market prices in far less growth"
- "Base uses analysts' forecasts" (say "to FY28, then we slow it")
- "22.7x" (say "about 14"); "every number beat" (revenue did; **EPS missed FY26 Q1**, $0.81 v $0.93)
- "Peers say $297" (TSMC alone: $173); "forecasts haven't fallen" (no proof)
- Mi'kael: "Glassdoor's best place" (NVIDIA was fifth); "runs on renewables" ("matches"); "founder resigned last week" (**co-founder, 12 November**); "bear = governance" (it's an AI pause)

*V valuation.csv · S model_sensitivity · S2 the workbook's Reverse DCF / Peers sheets · I model_implied_growth · P peers_pe · G nvda_segments · A AUDIT.md · M MODEL.md · D loop/audit/dcf.py. New price: recheck every comparison.*
