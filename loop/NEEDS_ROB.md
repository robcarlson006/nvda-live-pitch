# NEEDS_ROB: decisions and questions (the loop never waits on these; it picks the default and carries on)

Format: `- [ ] <question>. **Default used:** <what the loop did>. (ticket)`. Rob ticks them off in the morning.

- [x] Which WACC is the headline? **Decided 24 Nov by the team: 10.55% (US semiconductor average), with Google Finance's 14.45% and Bloomberg's 19.3% shown beside it.** Base $391.38 at $165.05. NVIDIA's beta is 2.21, so the "less risky than average" argument needs care. (PV-M1)
- [ ] Pitch-morning price: set `priceOverride` in `data/model/assumptions.json` and rerun `npm run data`. Loop does nothing. (PV-O1 writes the steps)
- [ ] Free Finnhub key for the live ticker (finnhub.io, free tier). **Default used:** ticker not drawn when no key. (PV-T1)
- [ ] Five [VERIFY] figures on Rob's slides: after the loop's sourcing attempt, which remaining ones do we cut or reword? (PV-M6)
- [ ] Second-device operator (CLAUDE.md principle 3) vs. the current "this laptop only" sockets: who is the operator on the day, and is a USB clicker + same-laptop keys enough? **Default used:** unchanged. (PV-F6)
- [ ] Team still owes: rewrite `say` and cues in your own words (docs/script/spine.yaml). **The loop does not touch `say`.** Beat 15 wording ("1.4 percent" vs "1.1 percent a year on average") is yours to fix.
