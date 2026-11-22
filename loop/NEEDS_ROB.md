# NEEDS_ROB: decisions and questions (the loop never waits on these; it picks the default and carries on)

Format: `- [ ] <question>. **Default used:** <what the loop did>. (ticket)`. Rob ticks them off in the morning.

- [ ] Which WACC is the headline: Bloomberg's 19.3% (conservative, sourced, base now $167.50) or our 12% (the model's older default, base $323.72)? **Default used:** unchanged (19.3%); loop builds both as a switch and shows both in the spreadsheet. (PV-M1)
- [ ] Pitch-morning price: set `priceOverride` in `data/model/assumptions.json` and rerun `npm run data`. Loop does nothing. (PV-O1 writes the steps)
- [ ] Free Finnhub key for the live ticker (finnhub.io, free tier). **Default used:** ticker not drawn when no key. (PV-T1)
- [ ] Five [VERIFY] figures on Rob's slides: after the loop's sourcing attempt, which remaining ones do we cut or reword? (PV-M6)
- [ ] Second-device operator (CLAUDE.md principle 3) vs. the current "this laptop only" sockets: who is the operator on the day, and is a USB clicker + same-laptop keys enough? **Default used:** unchanged. (PV-F6)
- [ ] Team still owes: rewrite `say` and cues in your own words (docs/script/spine.yaml). **The loop does not touch `say`.** Beat 15 wording ("1.4 percent" vs "1.1 percent a year on average") is yours to fix.
