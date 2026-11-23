# BOARD: scores and tickets

Status: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked (say why). Update after every iteration.
Priority: **P0** must land tonight · **P1** should · **P2** if time.

## Scores (0–10, honest, evidence-backed; `?` until PV-0 measures it). Target ≥ 8 each.
| Track | Baseline | Now | What the score means |
|---|---|---|---|
| SHOW (animation/graphics) | ~4.5 (mine) | 5.9 (blind, 7 slides incl. 2 new; run 1 said 6.2 on others: lower taken) | mean RUBRIC score over all spine slides + finale |
| FOLLOW (no trigger words) | 0 (not wired in) | 6.5 (unchanged: dev a-full 26/27, p50 17 words; holdout half 88.9%, p50 20, 1.83 false/run, targets missed) | follow-eval: right slide, in time, no false jumps (dev and holdout) |
| MONEY (financials) | 5 | 7.5 (student defended 7 of 7 questions; reverse DCF + peers sheets reconcile) | model audited, spreadsheet live-formula and reconciled, defensible in plain English |
| ANSWER (Q&A) | 5 | 6.5 (10 more paraphrase tests, 2 new valuation answers; live path still not drilled) | bank-eval + hostile-question drills: honest, sourced, fast, ESG-strong |
| FALLBACK (reliability) | 4 | 7 | every failure drill degrades gracefully; static fallback deck exists |
| ORG (organisation) | 5 | 7 (no outside reader yet) | someone new could run the pitch from docs/RUNBOOK.md alone |


## Tonight's order (about 3.5 h of BUILD ≈ 8–10 iterations: do slices, not whole tickets)
Rough sequence; re-plan each hour in STATE.md and drop P0 slices that can't finish rather than leaving them half-done:
1. PV-0 (0a, 0b, 0d first; 0c as soon as 0b is done) · 2. SHOW: weakest slide · 3. PV-M1 audit · 4. PV-M2 core five + PV-M3 reconcile
5. PV-F2 dev corpus → PV-F3 harden · 6. SHOW · 7. PV-Q1/Q2 · 8. PV-M5 student test + PV-M4 DEFEND.md · 9. PV-S2 finale ·
10. SHOW · 11. PV-H1 fallback deck · 12. PV-O1 runbook. In the last 30 minutes: wrap-up only.

---
## PV-0 · Eyes and measuring (P0, do first, ≤ 40 min)
- [x] **0a** Run `bash loop/check.sh --baseline`; it records the test count. Fix anything red *without weakening tests*.
- [x] **0b** Shoot harness: `app/scripts/shoot.ts` (+ `npm run shoot`) starts an **isolated** server (`PORT=5199`, own
  `state.json`, never 5173), drives installed Chrome headless via `playwright-core` (`channel:'chrome'`, free, no browser
  download), 1920×1080. For every spine slide it saves `loop/shots/<run>/<id>-{a,b,c}.png` (early build, mid-build,
  fully built) by sending `goto`/`next` over the WebSocket, and `perf.json`: frame-time p50/p95/max per slide, both
  unthrottled and with 4× CPU throttle (proxy for the M2 8GB under load). Also screenshots for Q&A bank slides.
  If playwright can't drive Chrome, try the Claude in Chrome / built-in browser tools; note what worked.
- [x] **0c** Follow-eval harness: `app/scripts/follow-eval.ts` (+ `npm run follow-eval`). Replays a transcript the way
  Deepgram delivers it (interim then final chunks, ~3–6 words, with timing) through the real `Director` + `accept()` +
  state logic, with a real API call on the **Haiku director model**, budget file `loop/eval-spend.json` ($3 cap).
  Also a deterministic mode with a fake caller for unit tests. Reports per scenario: slide accuracy, words-late
  (how many words after the true change the deck moved), false jumps, tangent precision, p50/p95 call latency.
  Corpora in `rehearsal/evals/dev/*.json` (you may tune against these) and `rehearsal/evals/holdout/*.json`
  (**generate these once, via a fresh subagent that has not seen director.ts**; never tune against them, only report).
- [x] **0d** Baseline all six scores into the table above.

## FOLLOW: no trigger words (CLAUDE.md principle 2 is "looks live"; Rob now wants it *actually* following)
- [x] **PV-F2 (P0)** Scenario corpus (dev + holdout), each a realistic talk-through of the spine as *spoken from memory*:
  (a) paraphrase everything in own words; (b) skip ✂ beats; (c) skip a whole section when "time is short";
  (d) go back to an earlier slide; (e) merge two beats into one sentence; (f) swap two beats; (g) fast talker
  (190 wpm) and long pauses; (h) fillers, false starts, jokes, greetings; (i) ASR garbling in Deepgram's style
  (numbers as words, "cooda" for CUDA, dropped names); (j) a tangent that belongs to no slide; (k) UK/US accent variants;
  (l) a different presenter taking over mid-slide. Use `say` as ground truth for what each beat is about.
- [~] **PV-F3 (P0)** Harden from the failures: director prompt, `accept()` thresholds/voting, windowing, latency.
  Targets on **holdout**: right slide ≥ 90% of beats, false jumps ≤ 1 per run, median lateness ≤ 12 words, p95 director
  latency ≤ 2.5 s. Never at the cost of the cue-word fallback or manual keys. Record before/after.
- [~] **PV-F5 (P0)** Failure drills as tests (fake caller/socket): API timeout, 429, malformed JSON, schema-violating
  verdict, Deepgram drop mid-sentence, both engines down, spend cap hit, `spine.yaml` broken mid-show, two operators
  clicking at once. Each: deck stays usable, operator panel says plainly what happened, no crash, no stuck state.
- [ ] **PV-F4 (P1)** Time-pressure assist (suggest only, never auto-skip): operator panel shows time left vs. the plan
  and which ✂/optional slides to drop to finish on time; the director already tolerates skips: prove it in F2(b,c).
- [ ] **PV-F6 (P2)** Operator-on-a-second-device is in CLAUDE.md but sockets accept only this laptop (security choice).
  Don't change; see NEEDS_ROB.md.

## MONEY: financials (simple enough for three students to build, explain, defend)
- [x] **PV-M1 (P0)** Audit. Independently recompute (Python, from `data/clean/*.json` + assumptions.json, not from
  model.ts) every number that reaches a financial slide or the model output; reconcile each slide figure to its
  dataset; list every discrepancy in `docs/financials/AUDIT.md`. Known ones to resolve: beat 15 "fibre 1.4%" vs chart average
  1.1%; beat 16 forward P/E 22.7x (research) vs 14.1x (Bloomberg) vs what Panshul will say; WACC 12% in docs vs 19.3%
  Bloomberg in model; terminal-value share of EV; FY27 base-year treatment. Mechanical fixes: fix. Judgement calls
  (e.g. which WACC is the headline): **build both as a switch, don't change the headline**, ask in NEEDS_ROB.md.
- [x] **PV-M2 (P0)** The spreadsheet: `data/model/NVDA_DCF.xlsx`, generated by `app/scripts/xlsx.ts` (`npm run xlsx`;
  `exceljs` or similar, free) from assumptions.json + clean data, with **real live formulas** (Rob changes an input in
  Excel/Numbers/Sheets and the answer moves). **Simplicity is the spec: three first-year students must be able to rebuild it
  from a blank sheet in an evening and defend every line.** Build the **core five sheets only**:
  `Start here` (one-sentence answer; colour code: blue = input, black = formula) ·
  `Inputs` (every assumption: value, unit, source, date; WACC shown as Bloomberg's figure next to a simple
  risk-free + beta × ERP cross-check, same sheet, not a second model) ·
  `DCF` (FY28–FY32 on ONE screen: growth → revenue → FCF margin → FCF → discount factor → PV; terminal value; EV; + net cash;
  ÷ shares; value per share vs price; base/bull/bear as three columns or one scenario switch cell) ·
  `Sensitivity` (WACC × terminal growth, one table, plain formulas) ·
  `Checks` (reconciles to the app's model, TRUE/FALSE).
  **Appendix sheets** (`History`, `Reverse DCF`, `Peers`) only after the core five are reviewed and score ≥ 8.
  Rules: no macros, no circular refs, no hidden sheets, no data-tables/array formulas, ≤ ~25 formulas on the DCF sheet, every
  formula explainable in one sentence, no concept beyond CAPM, DCF, terminal growth, EV-to-equity bridge, forward P/E; cached values
  present so it opens right in any viewer. If a feature makes it harder to explain, cut the feature.
- [x] **PV-M3 (P0)** Reconcile gate: `app/scripts/xlsx-check.ts` recalculates the workbook with a free engine (LibreOffice
  *only if already installed*; otherwise a small JS formula engine as a devDependency; don't install big apps) and
  compares every headline output to `data/clean/model_*.json` within $0.01 / 0.01pp. `loop/check.sh` runs it. A
  second, independent recompute (subagent, Python) must agree.
- [x] **PV-M4 (P1)** `docs/financials/DEFEND.md`, one page for Panshul/Mi'kael: each assumption in a sentence, why we chose
  it, what happens to the value if it's wrong (read from the sensitivity table), and the 8 hardest valuation questions
  with plain-English answers that cite our numbers. Bubble, discount rate, terminal growth, customer concentration,
  "why 19.3%", "what if AI capex pauses" (the bear case).
- [x] **PV-M5 (P0) Student test.** After PV-M2 and again after any change to the DCF: spawn a fresh subagent briefed as "a
  first-year finance student who has to present this tomorrow". Give it only the xlsx (or its formulas dumped to text) and
  DEFEND.md. It must explain every row in one plain sentence and answer: "why this growth rate?", "why this discount rate?",
  "what if you're wrong?". Any row it cannot explain, or any jargon it needs, gets simplified or removed. Log the verdict in STATE.md.
- [~] **PV-M6 (P1)** The five **[VERIFY]** figures on Rob's slides (CUDA spend ~$0.5bn/yr; networking revenue $31bn; supply
  commitments $279bn; ~90% AI training / ~80% AI chip spend; "zero humans"). Search for primary sources
  (NVIDIA 10-K/10-Q, earnings call, SEC filings, company reports). Sourced and quoted (≤ 15 words) → record with
  publisher + URL + date in `research-data.ts` and mark verified. Can't source → leave unverified and list in NEEDS_ROB
  as "cut or reword". Never mark verified on a secondary source alone.

## ANSWER: board questions
- [~] **PV-Q1 (P0)** Q&A bank to ~25 answers, ESG first: energy and "you used AI for a slideshow", water/Taiwan, Scope 3
  rising 6.9 → 10.7 Mt, renewables vs total, TSMC dependence, export controls/China, governance, Jevons paradox
  ("efficiency just makes demand grow"), customer concentration, "is this 1999?", "why is your WACC so high".
  Each is a normal slide: passes `checkSlide`, numbers looked up, honest when the data is thin (a thin answer that
  says so beats a confident one that doesn't). Note: *a strong answer to "AI is an environmental disaster" must not
  be spin.* Say what is true, including the bad news.
- [~] **PV-Q2 (P0)** `app/scripts/bank-eval.ts`: 3 paraphrases per bank question + 15 off-topic questions. Right answer
  ≥ 90%, off-topic never matched. Then 10 hostile questions through the live path (budgeted): time to first element
  ≤ 3 s, no invented number, "not in our data" honesty, web-research path used only when needed, always approval-gated.
- [~] **PV-Q3 (P1)** Q&A build animation: the wait *is* part of the show (question distils to keywords, cores light, then
  title → chart → text builds element by element). See SHOW.

## SHOW: the part that blows them away (score against loop/RUBRIC.md; screenshots mandatory)
Do the weakest slide first. Candidate moves (a menu, not a to-do list; pick by rubric, drop what doesn't earn its place):
- **The loop pedal made literal.** Each finished slide leaves a thin "layer" on a strip along the bottom; the strip builds
  as the pitch goes (it is the visible shape of the pitch). The finale plays all layers back together. Layers are from
  real session state, nothing typed.
- **It is listening.** The core field breathes very subtly with mic level, so the board sees the room's voice building
  the show. Optional ghost transcript line (key toggles it off; default off).
- **Charts that perform:** draw-in, then spotlight the highlight and dim the rest; counted-up numbers cascading through
  the cores; direct labels; a callout that appears *when the speaker reaches it*.
- **Financial bridge** for Panshul: animated build of the DCF (revenue → FCF → PV → value/share vs price), and a
  football-field of bear/base/bull with the share-price line. All values from `model_*.json`.
- **ESG visuals, tone matters:** Scope 1/2/3 as a stacked build that doesn't hide Scope 3; renewable share ring;
  performance-per-watt only if the data exists in `data/clean`. No triumphant effects on bad news.
- **Slide transitions** that *mean* something (the field recomputes into the next idea) and stay under ~700 ms.
- [~] **PV-S2 (P0) Finale (M8):** (built: replay + measured figures; the lines appear word by word, not typed by the cores) the closing sequence: recap of every slide actually built that session; the closing lines
  from CLAUDE.md typed out by the cores (don't claim the AI runs only on NVIDIA hardware); session stats *measured* from
  state (slides built, words heard, minutes), never typed. Manual trigger + director trigger. Must not break if the session
  is short or if slides were skipped.
- **PV-S5 (P1) Projector/room safety:** readable at 10 m (key text ≥ ~48px at 1080p), contrast survives a washed-out
  projector, nothing flashes more than 3×/s, meaning never by colour alone, works at 1280×720 and 1920×1080, `m` key
  kills all non-essential motion instantly.
- **PV-S6 (P1) Perf budget:** set from the PV-0 baseline; floor: p95 frame ≤ 40 ms under 4× CPU throttle, no frame > 100 ms,
  zero regression > 10% on any slide. Effects that throw must switch themselves off (existing rule).

## FALLBACK: reliability (M7)
- [x] **PV-H1 (P0)** Static fallback that needs no server, no network, no AI: `fallback/index.html` + PNGs of every spine slide fully
  built and every Q&A bank answer, keyboard navigation, opens by double-click from `file://`; plus
  `fallback/NVDA-pitch-fallback.pdf`. Generated by `npm run fallback` from the shoot harness (so it can't drift from the app).
  Numbers come from the same lookup code as the live stage.
- [ ] **PV-H2 (P1)** Panic path: one key on the operator panel jumps the stage to the standby/fallback behaviour and says
  so; verify it works with the server's AI and mic both dead (drills in F5).
- [ ] **PV-T1 (P2)** Live NVDA ticker (M3). `FINNHUB_API_KEY` is empty. Build it so no key means the ticker simply isn't
  drawn (no error on stage); "Market closed, last close" state; test with a fake feed. Needs Rob's free key: NEEDS_ROB.

## ORG: organisation
- [x] **PV-O1 (P1)** `docs/RUNBOOK.md`: pitch-day checklist: T-60/T-10/start; who does what (three presenters, who
  runs the operator keys, who holds the clicker); laptop prep for an 8GB M2 (quit apps, power, display sleep off, Wi-Fi
  vs phone hotspot); key/credit check; how to reset `ai-spend.json`; what to do when X fails (mic, Wi-Fi, API, projector,
  app crash → relaunch with `./start.sh`, → fallback deck); hotkey card. One page each, printable.
- [~] **PV-O2 (P1)** `docs/INDEX.md` (map of the repo in 25 lines); trim `docs/PROGRESS.md` to current state + changelog;
  consistent names; `npm run` scripts documented (`shoot`, `follow-eval`, `xlsx`, `fallback`, `check`); `.gitignore`
  covers `loop/shots/` etc.
