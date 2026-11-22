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

Each row changes one thing; two misses together are worse. **Say so first.**

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

*V valuation.csv · S model_sensitivity · I model_implied_growth · P peers_pe · G nvda_segments · A AUDIT.md · M MODEL.md · D loop/audit/dcf.py. New price: recheck every comparison.*
