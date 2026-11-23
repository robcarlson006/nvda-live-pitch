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
