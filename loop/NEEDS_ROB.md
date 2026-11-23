# NEEDS_ROB: decisions and questions (the loop never waits on these; it picks the default and carries on)

Format: `- [ ] <question>. **Default used:** <what the loop did>. (ticket)`. Rob ticks them off in the morning.

- [ ] Which WACC is the headline: Bloomberg's 19.3% (conservative, sourced, base now $167.50) or our 12% (the model's older default, base $323.72)? **Default used:** unchanged (19.3%); loop builds both as a switch and shows both in the spreadsheet. (PV-M1)
- [ ] Pitch-morning price: set `priceOverride` in `data/model/assumptions.json` and rerun `npm run data`. Loop does nothing. (PV-O1 writes the steps)
- [ ] Free Finnhub key for the live ticker (finnhub.io, free tier). **Default used:** ticker not drawn when no key. (PV-T1)
- [ ] Five [VERIFY] figures on Rob's slides: after the loop's sourcing attempt, which remaining ones do we cut or reword? (PV-M6)
- [ ] Second-device operator (CLAUDE.md principle 3) vs. the current "this laptop only" sockets: who is the operator on the day, and is a USB clicker + same-laptop keys enough? **Default used:** unchanged. (PV-F6)
- [ ] Team still owes: rewrite `say` and cues in your own words (docs/script/spine.yaml). **The loop does not touch `say`.** Beat 15 wording ("1.4 percent" vs "1.1 percent a year on average") is yours to fix.

## Added by the loop, 22 Nov (most important first)
- [ ] **Beat 14 is wrong:** NVIDIA was **#5** on Glassdoor's 2023 list, not #1 (Gainsight was; CNBC 11 Jan 2023). **Default used:** untouched (your words). Leave the ✂ off, or cut the bullet and the sentence.
- [ ] **Valuation title "the shares are worth more" isn't true of the bear case** ($31.40 vs $135.46), and `say` "even our bear case" sounds as if it is. **Default used:** untouched; the chart now draws the price line and colours the bear bar amber. Suggested: "Base case above today's price, bear case far below".
- [ ] **"Our base case uses analysts' forecasts":** only FY28 does; FY29–32 is our straight line. Say "analysts' forecast for next year, then we slow it down".
- [ ] **The equal average of our three cases is $128, below the price.** A prepared answer says so plainly. Be ready.
- [ ] **Beat 9:** "AMD's latest chip, 288 against 192" is dated per our own notes (MI450; B300 has 288). Name the chips: MI355X v B200.
- [ ] **Beat 15:** say "1.1 percent a year on average". **Governance `say`:** "The founder resigned last week" will be 13 days old, and beat 1 has three founders.
- [ ] **Peers:** "the forecasts haven't fallen" has no data behind it (no estimate history exported). Export ANR/HP or cut it.
- [ ] **Renewables title** "now run on renewable energy" is certificate matching; grid-based emissions are rising. Suggested: "NVIDIA matches its own energy use with renewables". The bank answer already says this.
- [ ] **Security's giant "0" is an unverified claim.** Find Google's report or cut it. All five [VERIFY] figures are still unverified: tonight's search was cut off. Networking is nearly done: Bloomberg FA p.175 prints $31,376m for FY26.
- [ ] **Follow meaning is now ON by default** (cue words take over by themselves if Claude is unreachable). **Off-script slides go up by themselves after 1.5 s unless blocked**, as your last session left it; CLAUDE.md principle 3 says a human approves. Tick "Ask before off-script slides" if you want that.
- [ ] **Share price:** 20 Nov quote. Update on the morning (RUNBOOK).
- [ ] Bloomberg: export beta, risk-free and equity risk premium (no CAPM check is possible without them) and the unit for water.
- [ ] Open the workbook once in Excel or Numbers: it has only been opened in LibreOffice.
- [ ] The **fallback deck adds about 31 MB** to the repo.

## Run 2: follow accuracy
True holdout: 89.0% right, 23 words late, 2.17 false moves per run (target 90 / 15 / 1.5). Improving it needs live eval runs, about $1 per pass. The $1.50 run cap is gone ($1.13 spent). Raise the cap in `app/scripts/follow-eval.ts` if you want another attempt. Cue words remain the safety net.

## Run 2: DCF bridge
`data/clean/model_dcf_bridge.json` is ready (stacked bars, Bear/Base/Bull: cash flow years 1-6, value after year 6, net cash; adds up to model_valuation, tested). It is not on any slide. To show it, add a stackedBar chart with datasetKey model_dcf_bridge to a valuation slide or the Q&A bank (your call: it changes what you say). Check: Base and Bull revenue paths in `model_revenue_paths` are identical, so Bull differs only by margin or other inputs: confirm that is what you mean.

## Run 2: Networking figure
Slide "connections" now shows Networking FY26 as the verified $31.4bn (Bloomberg FA p.175: $31,376m), previously "$31bn" from research notes. Same sentence, more exact number; `say:` text untouched. If you say "31 billion" aloud, that still matches.

## Run 2: remaining [VERIFY] figures (2 of 8 searches used; I could not open the primary pages, so these stay UNVERIFIED in the app)
- **Supply commitments $279bn:** a search summary points to NVIDIA's 10-Q for the quarter to 26 Jul 2026 (https://investor.nvidia.com/files/doc_financials/2027/NVDA-2027-Q2-10Q-Final-including-exhibits.pdf) and says $279bn, which includes about $99bn equity investments and $25bn equity commitments (so "supply" alone may overstate it). Open the PDF, find the commitments note, and check the wording before you say "supply commitments".
- **Security "0 humans":** the Google GTIG report (https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold) describes activity from late Aug to early Oct 2026 with no human intervention, not events of 16-17 Nov as the slide source says. Anthropic's own case (Nov 2025) was 80-90% AI with humans choosing targets. Reword the source date, or cut "0".
- **CUDA ~$0.5bn a year, 90% of AI training, 80% of AI chip spending:** not searched. Cut or reword to "most"/"the large majority" unless you can source them.

## Added by the loop (02:40): new optional slide `dcf-bridge` (Panshul), your call
R5 asked for the DCF bridge in the spine, so I wrote the slide and its `say:` (after `valuation`, ✂ optional so it can be cut). Words and cues are mine: edit freely. It says base = $73 five-year cash + $92 after FY32 + $2.5 net cash (all looked up from `model_dcf_bridge`). Also fixed the bridge labels ("years 1-6" was wrong: it is FY28–FY32). `state.test.ts` lists the optional slides; I added `dcf-bridge` there.

## Added by the loop (02:45): `reverse-dcf` slide and new prepared answers
New optional Panshul slide `reverse-dcf` (price needs 32.1% a year, base 35.5%, at a lower discount rate much less): text is mine. P/E against peers: the existing `peers` slide already charts it; its title ("The cheapest of the five…") is yours and is the triumphant kind: the honest version is in the new `pe-peers` answer ("…only matters if profits last"). Bank: new `pe-peers`, `student-model`; `bubble` now also matches "1999"; `priced-in` matches "reverse DCF" and gained the discount-rate caveat.
