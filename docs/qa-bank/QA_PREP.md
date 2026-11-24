# Q&A prep: devil's advocate review and the answers (24 Nov 2026, pitch is tomorrow)

> **UPDATE (24 Nov, evening): Part 5 replaces the valuation numbers in Parts 1–4.** Parts 1–4 were written at Bloomberg's 19.3% rate and the $164.39 price (bear $31, −81%). The deck now uses **10.55%** (US semiconductor average, Damodaran; team decision 24 Nov, after first trying Google Finance's 14.45%), price **$165.05**, base **$391**, a realistic bear **$102** and a stress case **$64**. Where Parts 1–4 and Part 5 disagree, Part 5 is right.

How to use: Part 1 is what a sharp board member will attack in the pitch itself. Part 2 is the Democrats / data-centre question in full. Part 3 is the question bank. Part 4 is the fix list for tonight.

Marks: **[DATA]** = in our files. **[WEB]** = from web research on 24 Nov, not read in the primary source, check before quoting. **[VERIFY]** = unproven. Where we do not know, the answer is "we don't have that, and here's how we'd find out". Never bluff.

---

## Part 1. Critique of the pitch (v4 script), worst first

1. **DONE 24 Nov: the "generated live" closing line is replaced** with "Built live by software that follows our voices, from our own script and data" (spine, v4 script, visuals prompt). Original problem: "Every visual you saw was generated live" was not true as stated. The main pitch is a script that builds when it hears cue words; only Q&A is generated on the spot. A sceptical ESG board punishes overclaiming harder than anything. If an operator, a lecturer, or the code gives it away, the whole pitch is "greenwashing, but for AI". Say: *"Built live by software that follows our voices, from a script and data we wrote and checked."* Prepared answer `live-or-scripted` is in the bank.
2. **DONE 24 Nov: recommendation added.** Buy, 3% of the portfolio to start, 10% hard limit on any one stock, sell if cloud companies cut spending plans. New slide `recommendation` in the spine (Mi'kael, before the reveal) and in the prepared answers. Time horizon: three to five years.
3. **The valuation oversells.** "Today's price is the low end of our range" only holds if you accept our 10.55% rate. On Bloomberg's 19.3%, base is $167.50 against $164.39: about +2%. Bull is $186 (+13%), bear is $31 (−81%). At the rate we call the headline the bet wins 13% and loses 81%. Our own three cases average about $128 (below the price). Expect: "You picked the second rate after you saw the first gave no upside." Honest answer in Part 3, V1.
4. **The "reasons it won't stop" answer a different question from the bear case.** Maths, proteins and cancer screening are not revenue; hyperscalers stop buying when returns, financing or power run out. And "no government can afford to stop" is the exact claim a Democratic Congress now challenges. Fix in Part 2.
5. **"Neither can stop" can hurt NVIDIA.** China builds its own chips (Huawei) and NVIDIA's guidance already assumes no China data-centre sales. The race argument supports AI spending, not NVIDIA's share of it.
6. **Concentration is nowhere in the deck.** Data Center is about 90% of sales. Two direct customers were 22% and 14% of FY26 revenue [WEB, 10-K]. The five biggest clouds are reportedly 40–50% [WEB, secondary]. Prepared answer `customers`.
7. **Circular financing and chip lifespan are not in the deck.** NVIDIA invests in customers; chips last 3–6 years. These are the two strongest bubble arguments and we are silent on both. Prepared answers `circular`, `depreciation`.
8. **"All the electricity NVIDIA uses is renewable."** It is certificate matching. Market-based Scope 2 is 0.57 kt; location-based is about 309 kt [DATA, AUDIT #9]. Say "matches all its electricity with renewable energy".
9. **The emissions chart flatters NVIDIA.** It has no factories; TSMC's emissions sit in NVIDIA's Scope 3. Scope 3 rose from 3.6 to 10.7 million tonnes (FY24 to FY26) [DATA]. Reported Scope 3 does not include customers' electricity use of the GPUs NVIDIA sells (AUDIT #10). The ESG board will find this. Say it first.
10. **The closing line can be turned against us.** "None of it happens without NVIDIA" is fine about the industry. It is not safe about the AI that built our slides: Anthropic runs on Google TPUs and Amazon Trainium as well as NVIDIA (research notes). Never claim it of our own demo.
11. **Governance slide is a legal minefield.** Stick to NVIDIA's 8-K: reinstated 23 Nov, unanimous, new national-security committee, search for a compliance chief, investigation continues. No comment on private life or the espionage allegation beyond "reported, under investigation". "Ten of eleven independent" is [VERIFY].
12. **Moat share is falling.** 68% of AI chip supply (Epoch, Q4 2025) is down from about 87% of accelerator dollars in 2024; JPMorgan counts NVIDIA at only 28% of announced post-2026 frontier-lab power [DATA, research notes]. Use the trend, do not hide it.
13. **We have no ESG data folder.** `data/esg/` is empty. Water, efficiency per watt, and the Bloomberg ESG score are not in clean data. The board is ESG-focused. Biggest content gap for tomorrow (see fix list).
14. **Unverified figures still on slides:** CUDA ~$0.5bn a year, networking $31bn, supply commitments $279bn, ~90% of AI training, ~80% of AI chip spend, "zero humans", OpenAI "eighty years", Sacks quote wording.
15. **The price is stale.** Script says $164.39; model file says $163.66. Set one price on the morning and rerun `npm run data`.

---

## Part 2. "Democrats are taking power and want to stop data-centre building. Data centres are most of NVIDIA's revenue. What happens?"

**What is true right now** (24 Nov 2026) [WEB, check headlines before you speak]
- Democrats won both the House and the Senate on 3 Nov (NPR, OPB). Divided government: President Trump has said he will veto Democratic bills.
- Some incoming House Democrats and a Sanders / Ocasio-Cortez bill call for a national moratorium on new AI data centres (Planetizen, Barchart). Moderate Democrats and most lawmakers of both parties have so far rejected a blanket freeze.
- The real squeeze is local and about electricity bills: New York reportedly imposed a state moratorium in July, roughly 127 other jurisdictions have local ones, about 75 US projects worth about $130bn were blocked or delayed in Q1 2026, and Texas's grid operator paused new data-centre connections while it audits its queue (Network World, Data Center Watch, Utility Dive). Goldman expects delays in Georgia and Texas. Analysts expect "more expensive and harder", not a collapse (CEPA, Newmarket). Evidence that data centres raised bills is real but small: a Dallas Fed estimate of about 7% on wholesale prices, disputed by FactCheck.org.

**The answer to say (about 40 seconds)**
"That's the best question you could ask, and it is our bear case's mechanism, so let me be exact. Three points. First, a federal moratorium has to get past a President who has said he'll veto, so it can't become law before 2029 on today's facts. The pressure that is real is local and about electricity bills, and it is already slowing projects: seventy-five US projects, about 130 billion dollars, blocked or delayed in the first quarter. Second, that hits when and where chips are installed, not whether they're wanted. A third of NVIDIA's revenue comes from outside the US, and projects get relocated or built with their own power. Third, if we're wrong, the model has the answer: take 20% off FY28 sales and our base case falls to about 97 dollars at Bloomberg's rate; if spending actually stalls, 31. We show that on the slide. What would change our mind is cloud-company capex guidance being cut."

**Backup numbers [DATA]:** FY27 sales (year to Jan 2027) are already 115.8bn in the latest quarter alone, so the policy risk lands on FY28 onwards. Base $167.50; FY28 sales 20% lower: $97.17 (sheet) or $134.50 (later growth unchanged); bear $31.40 (−81%); break-even chance of bear is 23.5%.

**Concede:** we cannot tell you the odds. Delay is likelier than a stop; a delay still hurts a stock priced for 38% a year growth. Also concede: this is exactly the "no government can afford to stop" claim. Say it the right way: *"The race argument is about Washington and Beijing. The moratorium fight is about county boards and electricity bills. Both can be true: chips still get bought, but they get installed later and more expensively."*

**If they push:** "Wouldn't your ESG board want this?" Reply: "A moratorium is a legitimate response to a real cost, and we're not saying it's wrong. We're saying what it does to the numbers. The more efficient the chip, the more AI per unit of power, which is the only lever under a power cap." Flag: we hold no performance-per-watt data, so say "NVIDIA says", not a number.

**Never say:** "It won't happen." "Policy doesn't matter." Any invented percentage of NVIDIA revenue that is "US new-build".

---

## Part 3. Question bank (shortest honest answer, then backup)

### A. Politics, regulation, power

**A1. China and export controls?** China was 9.1% of FY26 revenue, down from about a fifth; NVIDIA's guidance assumes no China data-centre compute sales; Beijing is steering buyers to Huawei [DATA]. So the loss is mostly in the numbers already. The new risk is a Chinese rival (Huawei is rack-for-rack competitive on raw compute but uses about four times the power) selling abroad. Prepared: `china-export`.
**A2. Can the grid even power this?** No, not everywhere: grid access, not land, is the bottleneck [WEB]. Developers are building on-site gas. That is a real brake on growth and a reason our base case fades growth, not a reason spending stops. Concede it is the least modelled risk (our model has no power constraint).
**A3. Electricity prices and the public backlash?** Evidence is mixed: a Dallas Fed estimate of about 7% on wholesale prices; FactCheck.org says the link is more complicated [WEB]. Backlash is real (71% oppose local data centres in one survey [WEB]). Likely outcome: data centres pay for their own grid upgrades. That raises cost, not demand destruction.
**A4. Tariffs, Section 232, Taiwan?** Taiwan: TSMC makes about 90% of the most advanced chips; same exposure for AMD and Broadcom; we have not priced a conflict [DATA]. `taiwan` is prepared. Don't speculate on tariffs beyond the H200 25% arrangement in the notes.
**A5. Antitrust: is CUDA a monopoly?** Regulators have looked at it (research notes, section on CUDA investigations). We hold no ruling to cite. Honest answer: it is a risk to margins we have not modelled; the response is "the moat is software developers, which a regulator cannot easily split".
**A6. What if Trump / the US government takes a stake or taxes China sales?** The 15% revenue share on China sales (2025) already exists [DATA, notes]. We don't forecast policy; we show scenarios.

### B. Demand and the bubble

**B1. Is it a bubble?** It could be. Our test: cheapest of five peers on this year's profits (about 14x), and our bear case is $31, shown first. Difference from 2000: buyers are very profitable companies and US data-centre vacancy is about 1–3% [DATA, notes]. Similarity: capex is now above operating cash flow for the biggest buyers and debt is funding about a third of it [DATA, notes]. Prepared: `bubble`.
**B2. Circular financing?** NVIDIA backs customers and customers buy NVIDIA: the Lucent pattern [DATA, notes]. We do not hold NVIDIA's investments or credit commitments in our dataset, so we can't size it. It is the first filing item we would read. Prepared: `circular`.
**B3. Customers pay with borrowed money?** The notes say debt was 9% of hyperscaler capex in FY24 and 32% by mid-2026, with bonds above $223bn in 2026 and over $1tn of off-balance-sheet leases [DATA, notes]. That is the mechanism by which an AI pause would arrive. It is why the bear case exists.
**B4. GPUs wear out in 3–6 years; fibre lasted decades.** True. Cuts both ways: bad for an overbuild, good for repeat sales. Prepared: `depreciation`.
**B5. Who are the customers, and what if one pulls out?** See `customers`. Two direct customers were 22% and 14% of FY26 revenue [WEB]. A pause by two or three giants is the bear case.
**B6. What if AI gets more efficient (DeepSeek moment)?** Cheaper AI can mean more use, but it can also mean fewer chips per answer. We have no proof either way. This is a thing to watch, and part of why growth fades in our model.
**B7. Where is the revenue? Brookings says AI needs $3.7tn a year by 2032 to earn 10%.** Fair. We cannot show that revenue exists. Today's evidence: FY27 consensus is $422bn and the last quarter beat by $6.5bn [DATA]. The gap between spend and AI revenue is the whole debate.
**B8. Beat expectations 13 quarters in a row. Isn't that priced in?** Revenue did; EPS missed in FY26 Q1 ($0.81 v $0.93) [DATA]. Never say "every number beat".

### C. Competition and moat

**C1. Google TPUs, Amazon Trainium, Broadcom?** Custom chips are cheaper per job (reports of 40–65% lower TCO) but cover about 15–20% of hyperscaler workloads; custom systems were 13.9% of server spend in Q1 2026 [DATA, notes]. NVIDIA is 28% of the announced post-2026 frontier-lab power [DATA]. We named Google ourselves. Prepared: `competition`.
**C2. AI is now translating CUDA code.** Anthropic says its newest model cut porting to AMD chips from months to days (Tom's Hardware, 16 Nov, one-sided) [DATA]. If true it erodes the moat. It is the thing to watch.
**C3. AMD has more memory and is cheaper.** On paper, yes: 288GB vs 192GB [DATA]. But data-centre revenue is 11.6x AMD's. Customers buy the software and the whole rack.
**C4. Why is share falling if the moat is so strong?** From about 87% of accelerator dollars (2024) to about 75–81% (2026) [DATA, notes]. A falling share on a market growing this fast still means rising sales. That is our base case.
**C5. Huawei?** Huawei makes over 75% of China's AI chips, with 7nm yields near 40% and no EUV access [DATA, notes]. It matters in China, where NVIDIA already has nothing in the numbers.

### D. Valuation and our own model

**D1. You picked 10.55% after seeing 19.3% gave no upside.** We show both. 19.3% is Bloomberg's number for NVDA; 10.55% is the 66-company US semiconductor average (Damodaran, Jan 2026). *Say it plainly:* "At Bloomberg's rate the share is about fairly priced, not cheap. We're not hiding that." 12% would give $323.72; base meets the price at 22.6%.
**D2. 19.3% is absurd; it implies a beta near 3.** Agree it is high; Bloomberg's page hides the CAPM inputs so we can't rebuild it. That is why we show the range.
**D3. Your three cases average $128, below the price.** Yes ($128.21), at equal odds. Break-even is a 23.5% chance of bear: $32 to gain, $104 to lose. If you think an AI pause is likelier than about one in four, don't buy.
**D4. Why does base growth fade in a straight line?** Our rule, not a forecast. Only FY28 is analysts' consensus (6.7% of value). With FY29–31 growth 30% lower, base is $135.70: no upside.
**D5. Why 45% free-cash-flow margin?** FY24–26 average. Last twelve months are 41.1% ($152.38) and year to date 38.8% ($143.81). Breakeven margin is 36.5%.
**D6. The P/E of 14 vs 22.7?** Bloomberg says 14.1x; the research note says 22.7x and we can't rebuild it. Say "about 14". If someone says 22.7: still cheaper than AMD, Intel and Broadcom, dearer than TSMC.
**D7. 60% operating margin. Can that last?** It is 4x AMD's 29% (consensus) [DATA]. It is the first thing a rival or a customer squeezes; our bear takes 10 points off the cash margin.
**D8. What's already priced in?** At Bloomberg's rate the price already needs about 38% sales growth a year for five years (about $2tn by FY32); our base needs 35.5% [DATA]. So "the market expects too little" is not our claim at that rate.
**D9. Why now?** Share price is near its 52-week low after the CEO news; since the 23 Nov reinstatement it has jumped (model has $163.66 vs $135.46 on 20 Nov). Say: "We're not trying to time it; the point is the range."
**D10. Semis are cyclical; NVIDIA has fallen 50%+ before.** Yes: more than half in 2008 [DATA]; also a very large fall in 2022 [VERIFY, general knowledge]. Our bear shows a worse outcome, not a milder one.
**D11. You're students. Why trust the model?** Everything rebuilds to the cent (37 of 37 outputs), 315 of 315 cleaned figures match the Bloomberg PDFs, and every assumption is a visible number in a spreadsheet they can change.
**D12. Why leave out buybacks and stock pay?** Share count is held flat; stock-based pay would dilute, so our value is slightly generous.

### E. ESG (strongest area to prepare)

**E1. "AI is an environmental disaster and you used it for a slideshow."** Concede first: the footprint is real and rising. NVIDIA's own energy use went from 594 GWh (FY24) to 1,053 GWh (FY26) [DATA]. We have no measured figure for this presentation. The test is whether the work is worth the energy. Prepared: `wasteful`. Do not pretend the energy of one slideshow is tiny with a made-up number.
**E2. What about Scope 3?** Up from 3.6 million tonnes (FY24) to 10.7 million (FY26) [DATA]. About 87% is making the chips, mainly at TSMC. It does not include customers' use of the GPUs (AUDIT #10). Prepared: `scope3`.
**E3. So the real footprint of your product is much bigger?** Yes. Use-phase electricity of sold GPUs is outside NVIDIA's reported Scope 3. We cannot give a figure. Ask the company.
**E4. "Renewable" is just certificates.** Right. Market-based Scope 2 is 0.57 kt; location-based is about 309 kt (up from 228 kt) [DATA, AUDIT]. Say "matched with renewable energy".
**E5. Water?** Withdrawal was 382.6, 409.8 and 451.3 (FY24–FY26) in Bloomberg's data; unit to confirm on the terminal [DATA, AUDIT #1]. The prepared `water` answer wrongly says we have no figure. Fix before use (see fix list).
**E6. Emissions per dollar flatters NVIDIA vs TSMC and Intel.** Yes: NVIDIA owns no factories. NVIDIA's manufacturing emissions are in its Scope 3. Prepared: `cleaner-than-peers`.
**E7. Bloomberg ESG score?** Methodology changed in FY22, so do not chart before and after as one line [DATA]. No score is in clean data. Say what you know, no more.
**E8. Military and surveillance use of the chips?** We have no data on end use. NVIDIA cannot control resale; US export controls, the 15% China revenue share, and the new National Security and Export Control Committee are the levers [DATA]. Do not overreach.
**E9. Chip supply chain, minerals, labour?** Not in our data. Answer: "We haven't audited that; here is what we'd ask the company." (Conflict minerals, water at fabs, Taiwan energy.)
**E10. Is it investable for an ESG fund?** We can't answer for a specific fund's screen. Our view: strong on own operations, weak on supply-chain emissions, open on governance.
**E11. Governance: is the CEO a risk?** Huang resigned 12 Nov, was reinstated unanimously on 23 Nov; the independent investigation continues; new National Security and Export Control Committee; search for a Chief Compliance Officer [DATA, 8-K]. Key-person risk is real. Interim CEO and an independent chair (Harvey Jones) existed in between. Prepared: `governance`. Do not discuss private life or the espionage reports beyond "reported and under investigation".
**E12. Pay and board independence?** Not in our data. "Ten of eleven independent" is [VERIFY]. Say what we can verify.
**E13. Jobs?** AI takes over tasks, not people (writers 40% faster, support 14% more resolved) [DATA]. Tellers grew after ATMs. Also say what we cannot: net employment effects are uncertain.
**E14. AI safety and misuse (cyberattacks)?** We raised it ourselves in an earlier draft: AI agents attacking, AI defending. Nobody can prove which side benefits more. This is not an NVIDIA-specific risk.

### F. The demo itself

**F1. Was it live?** See `live-or-scripted`. Do not say "everything was generated live".
**F2. What if the AI invented a number?** It can't: figures are looked up from our datasets by key; a slide with an unlisted number is refused; a person approves anything generated [DATA, principles 1 and 3].
**F3. Which chips did your AI run on?** "We don't know, and it's not only NVIDIA." The claim is about the industry.
**F4. Does the audio go to the cloud?** Yes (Deepgram, with Chrome as backup). No recording is stored beyond rehearsal logs. [VERIFY with Rob before saying "no recording".]
**F5. What if it had crashed?** Manual advance through the same deck, pre-built answers for expected questions, backup PDF.

### G. Left-field, still likely

**G1. Would you buy it yourselves?** Answer honestly with your own view and say you're students, not advisers. Do not say you hold it unless true.
**G2. What's the single biggest risk?** An AI-spending pause: it's our bear case, and it is the only thing that matters for the price.
**G3. What would make you change your mind?** (1) Cloud-company capex guidance cut. (2) Customer financing starts failing. (3) A hyperscaler shifts most new spend to its own chips. (4) A credible ruling or law on data-centre construction. (5) The Huang investigation reaches a finding.
**G4. Why not buy AMD, or the clouds instead?** AMD's data-centre sales are a twelfth of NVIDIA's; the clouds are the customers, so they carry the spending risk and the capex bill. Not our pitch, but honest.
**G5. What did you get wrong?** Say two things: our headline rate gives no upside, and we have not sized circular financing. A team that admits two flaws is believed on the rest.

---

## Our position (decided 24 Nov: BUY, 3% starting position, 10% single-stock limit)

Say it the same way every time:
"Our recommendation is to buy, starting with three percent of the portfolio, well inside our ten percent limit on any single stock. On Bloomberg's rate the price is about fair; on an industry rate it is worth far more. We would sell if cloud companies cut their spending plans."

**Why 3% is easy to defend** [DATA]
- Bear case $31.40 is 81% below $164.39, so a full bear-case fall costs 3% x 81% = about 2.4 points of the portfolio. At the 10% limit it would cost about 8 points.
- Break-even on our three cases is a 23.5% chance of the bear case: $32 to gain, $104 to lose per share. A small position is how you hold a view when you can't rule that out.
- The base case at Bloomberg's rate is only +2%, so the buy rests on the rate argument and on P/E (about 14x, cheapest of five peers), not on a big base-case gain. Say so.

**Questions this invites**
- *"Why 3% and not 10%?"* Because we can't rule out the bear case, and the other 7% of room is for adding if the evidence improves.
- *"Why buy if base is only +2%?"* At Bloomberg's rate it is fair, not cheap. At the industry rate (10.55%) it is $391. We think the truth is between, and we size for the bad end.
- *"What's the time horizon?"* Three to five years, matching our five-year model. We are not trading the next quarter.
- *"When would you add?"* Up to the 10% limit, only if cloud spending plans rise again and the investigation into the CEO closes.
- *"When would you sell?"* Cloud companies cut spending plans; customer financing starts failing; a big customer moves most new spend to its own chips.
- *"Is that financial advice?"* It's a student pitch, not advice to anyone; the position size is for a fictional portfolio. (Check the brief: say this only if it is one.)

## Fix list before tomorrow (in order)

1. ~~Change the closing line~~ done. Time horizon decided (three to five years). Add rule decided.
2. Add one sentence to Panshul's end: "At Bloomberg's rate the price is about fair; the upside is in the rate."
3. Mi'kael: "matches its electricity with renewables", and add one line on Scope 3 (3.6 to 10.7 million tonnes).
4. Fix the `water` prepared answer (data exists: 382.6, 409.8, 451.3) before it is spoken.
5. Verify the 10-K figures (22%, 14%, 31%, China 9.1%) and the Network World figures. They are amber on the operator panel until you do.
6. Verify "Ten of eleven independent", the Sacks quote, "eighty years", the five VERIFY figures, or cut them.
7. Set the pitch-morning price in `data/model/assumptions.json` and run `npm run data`.
8. Rehearse the Democrats answer aloud twice. Time it: 40 seconds.

---

## Part 5. Answers built on the Q3 FY27 earnings call (17 Nov) and Google Finance (24 Nov)

**Marks:** **[CALL]** = said on NVIDIA's Q3 FY27 earnings call, 17 Nov 2026 (transcript pasted from Google Finance; timestamps in brackets). Not yet checked against the 10-Q or press release, so say "on the earnings call", never "in the filing". **[GF]** = Google Finance NVDA page, 24 Nov. **[MODEL]** = our model, `npm run data`. Risks from the call are deliberately NOT on the slides; they live here and in the prepared answers `circular`, `competition`, `governance`, `china-export`, `democrats-datacentres`, `margins`, `buybacks`, `analyst-targets`, `discount-rate`.

**The numbers now [MODEL, price $165.05]**

| Discount rate | Base | Realistic bear | Stress |
|---|---|---|---|
| **10.55% (sector average, our headline)** | **$391** | **$102** | **$64** |
| 14.45% (Google Finance) | $249 | $67 | $43 |
| 16.42% (Stock Analysis) | $208 | $57 | $38 |
| 19.3% (Bloomberg) | $167.50 | $47 | $31 |

At 10.55%: base +137%, bear −38%, stress −61%. Break-even chance of the bear case (versus base) is about 79%. A full realistic-bear fall on a 3% position costs about 1.2 points; the stress case about 1.8. The price today needs only 13.4% yearly sales growth to FY32; our base has 35.5%. At Bloomberg's 19.3% the price is about fair.

### The 10.55% headline: the argument, and where it is weak
**Say:** "We use the average for American semiconductor companies, 10.55%, and we think NVIDIA deserves no more: it holds more cash than debt, its operating margin is about 66% against 29% at AMD, and it leads its market. We know other estimates are higher, Google Finance has 14.45% and Bloomberg 19.3%, so we show all three on the slide."
**The weak spot, so prepare for it:** Google Finance gives NVIDIA a **beta of 2.21**, so the market treats it as *riskier* than average, not less. A beta that high is the reason its cost of equity is 15%. Do not claim it is "less volatile". The honest claim is: *"a strong balance sheet and margins argue for a lower rate than its share-price volatility suggests; the truth is somewhere in the range, and we show the range."*
**Also true, and a board member can say it:** at 10.55% our base ($391) is above *every* analyst target (highest $350, average $233). The gap is the rate; at 14.45% our base is $249, near their average. The `analysts` slide says so. Concede it before they do.
**Prepared answers:** `discount-rate`, `less-risky`, `analyst-targets`.

### Why not 14.45% or 19.3%? (the biggest question)
(Older wording, written when 14.45% was the headline; swap the numbers: our rate is now 10.55%.)
"Google Finance computes 14.45% for NVIDIA specifically: cost of equity 15%, beta 2.21 [GF]. Other published estimates run from about 10.5% to 17.2%, and Bloomberg's 19.3% is at the top, so we use the middle and show both ends on the slide. At 19.3% our base case is about 167 dollars, which is the price: fair, not cheap. We aren't hiding it. The honest summary is that the buy depends on the rate, and we think the middle of the range is a fair rate for a company this volatile."
- **If they say you picked the rate to get a buy:** "We showed 19.3% first, and at that rate it is fair value. We'd rather you saw the whole range."
- **If they say 14.45% is just one website:** "Yes. That's why we show the range of independent estimates, not one number. Stock Analysis gets 16.4%; our base case is still about 208 dollars at that rate."
- **Weak spot:** the page's own inputs add up to about 14.9%, not 14.45%. Say "about fourteen and a half". Check the page before the pitch.

### The Street [GF]
"Forty-four analysts cover it: thirty-four say buy, nine hold, one sells. Their average twelve-month target is 233 dollars; ours is about 249. We are in the same place, not above it. The lowest target is 130 dollars, and our realistic bear case, 67, is harsher than any of them." **Concede:** analysts' targets are not independent evidence of value and have been wrong at turning points.

### Customer financing and circularity [CALL]
"The exposure is large and we're not going to dismiss it. NVIDIA reported guarantees of about 118 billion dollars, purchase commitments of 390 billion, and 32 billion of commitments to neocloud customers, who rent out its chips [Kress, prepared remarks 16:06–18:32]. What management said when an analyst asked was that a guarantee only starts once the customer has raised the debt and equity to build [Kress, replying to Rasgon, 38:24]. If that's right, it limits the risk but doesn't remove it: the customers still need to raise money, which is exactly the mechanism in our stress case. We haven't read the 10-Q. It's the first thing we'd check, and why our position is 3%."
- **Don't say:** "It isn't circular." Management said "Is it new? No. Did we change anything? No." about the wording; that is not proof of low risk.

### Margins and pricing power [CALL]
"Gross margin was 74.8% last quarter. Management guided to 71–72% this quarter and said that's the bottom, then 72–73% next year [Kress, 21:09 and 24:32; replying to Arcuri, 32:06]. An analyst asked directly about custom chips squeezing pricing and the answer on long-term pricing was that it is 'something for the future' [32:54–33:45]. So margins are guided up from here, but pricing power over several years is unproven. Our realistic bear takes the cash margin from 45% to 38.8%, NVIDIA's own year-to-date level; the stress case takes ten points off." FY23 gross margin was 56.9% [DATA]: it has been lower.

### Leadership and governance [CALL]
"The board chair, Harvey Jones, opened the call and said the board accepted Jensen Huang's resignation on 12 November and appointed Colette Kress as interim CEO [2:04–3:48]. They set up a National Security and Export Control Oversight Committee and hired Heidrick & Struggles for the search [2:55]. On the call they declined to take questions about the circumstances or the investigation [2:55]. We then know the board reversed course on 23 November [DATA, 8-K]. Key-person risk is real, and we say so." Do not add detail beyond that. Mark: things moved after the call, so say "as of the call".

### 2028 slowdown, policy and data-centre building [CALL]
"An analyst asked exactly this: whether there has to be a big slowdown in 2028 after the change in government [Reitzes, 40:11]. Management didn't give a number. They said the customers' demand for agentic AI continues into 2028 and that data-centre communities need to see the jobs and benefits [Kress, 41:00–42:33]. Separately the company raised its fiscal 2028 revenue outlook to about 75% growth, from 70%, and cited a cloud industry backlog of 2.5 trillion dollars [prepared remarks, 5:55 and 7:17]. That is management's view and companies are optimists. Our answer is the model: a pause is our stress case, 43 dollars at 14.45%, and we size the position so that costs under 2.5 points of the portfolio."

### China and export controls [CALL]
"Licensed Hopper sales to China were 2.4 billion dollars last quarter. NVIDIA says it is no longer shipping them and its guidance includes none [14:47–16:06]. It also said new export controls came out that week and it is still studying them, but that demand far exceeds supply [23:25, 26:42]. So China is out of the outlook; the risk is what new controls do to everything else."

### Buybacks [CALL]
"NVIDIA returned 28 billion dollars last quarter, 22 in buybacks and 6 in dividends, and added 150 billion to the buyback programme, which leaves 227 billion to use by the end of fiscal 2028 [22:15–23:25, 45:52]. Management said the first call on cash is helping suppliers expand capacity, then some customer financing; buybacks come as part of what's left [Kress, 46:50]. Our model doesn't count buybacks, so they are upside we haven't priced. They also support the share price in a pause; they don't prevent it."

### Concentration [CALL]
"Frontier labs, meaning the AI model companies, are about 15% of Data Center revenue this year [7:17]. Hyperscale was 60 billion dollars of the 108 billion Data Center total in the quarter [5:55]. So more than half of Data Center sales are the big clouds." (60/107.6 = 56%.) [CALL, DATA]

**Never say:** "management guarantees…", any figure from the call as if it came from the filing, anything on insider trading (not in our material; not on slides).

*Sources used 24 Nov 2026: NPR / OPB on the midterm result; Planetizen, Barchart, TechCrunch, CEPA on the moratorium push; FactCheck.org on electricity prices; Network World, Utility Dive, Data Center Watch, Embold Research on local opposition and delays; NVIDIA 10-K FY26 on customers; Morgan Stanley / Yahoo Finance on capex. All [WEB]: read the pages before quoting.*
