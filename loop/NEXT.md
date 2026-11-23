# NEXT: run 2 queue (top to bottom; one slice per round; value per token, from MORNING.md)

Skip list tonight (don't start): live ticker, second-device operator, spreadsheet appendix sheets, new fonts/theme work, rewriting anything we *say*.

- [~] **N1 · PARTIAL (holdout measured: 89.0% right, 23 late, 2.17 false/run; no fix, eval budget spent) · FOLLOW (the headline feature).** Run 1 holdout (before the last fix, not re-run): 89.6% right of 164 beats, 21 words late (p50),
  3.2 flagged false moves/run, one run raced through 4 slides (fixed, untested on holdout). Round 1: run the holdout ONCE to get the true
  number. Then fix only the top failure patterns (read ≤ 30 lines of failures). Targets: ≥ 90% right, ≤ 1.5 false moves/run, p50 lateness
  ≤ 15 words. Re-run holdout once at the end. Never tune on holdout; use dev. Keep cue words as the safety net.
- [~] **N2 · PARTIAL (chart features already exist, WebGL port skipped; DCF bridge dataset + test done, not on a slide) · SHOW: charts + money.** Charts still use the old drawing and look plainer than the rest. Move chart slides onto the WebGL engine:
  draw-in, spotlight the highlighted series and dim the rest, direct labels, source line, bars from zero. Then Panshul's **DCF bridge**
  (revenue → FCF → PV → value per share vs the price line, bear/base/bull; all values from `data/clean/model_*.json`). ≤ 2 stills a round,
  1280×720. Calm on ESG slides; no triumphant motion on bad news. Perf must not regress (p95 frame ≤ 17 ms on the existing perf run).
- [~] **N3 · PARTIAL (claim check + tests done; skeleton-at-once latency not done) · ANSWER latency + honesty.** Live answers took 4–6 s (target: something visible by 3 s). Show the question-distilling animation and
  the title/skeleton immediately while Claude works. Also: a title once claimed something its data didn't show. Add a code check (and a test) that
  a generated title/claim must be supported by the looked-up values (direction, comparison, "more/less than"), else fall back to a neutral title.
  Fake-caller tests first; ≤ 6 live questions (budgeted).
- [ ] **N4 · FACTS.** Networking $31bn: Bloomberg FA p.175 prints $31,376m for FY26 → record it as verified (source + page). For the other [VERIFY]
  figures (CUDA spend ~$0.5bn/yr, supply commitments $279bn, 90%/80% AI-chip share, security "0") use ≤ 6 searches total, primary sources only,
  quote ≤ 15 words with publisher + URL + date. Can't source → leave unverified, list "cut or reword" in NEEDS_ROB.md.
- [ ] **N5 · TIME PRESSURE + PANIC (we may run out of time and skip parts).** Operator panel: time left vs plan, and which ✂ beats to drop to
  finish on time (suggest only, never auto-skip). One-key panic → standby/fallback, working with AI and mic dead. Deterministic tests.
- [ ] **N6 · LAST: one blind review.** One subagent, sonnet, re-scores 6 stills (new chart slide, DCF bridge, finale, one ESG slide, valuation,
  a Q&A slide) with RUBRIC.md; take its number if lower. Spawn it only if ≥ 45 minutes remain.
