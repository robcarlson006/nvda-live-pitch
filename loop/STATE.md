# STATE: loop log (append-only; newest at the bottom)

Format and rules: see loop/LOOP.md. Keep entries short and evidence-based.

## 0 · (armed) · setup
Loop armed from `loop/arm.sh`. Nothing done yet. First job: PV-0 (eyes and measuring).

**Note:** the account's 5-hour usage limit stopped the loop from about 20:30 to 23:00, so about 2.5 of the 3.5 build hours were lost. Entries were written together at the end from commits and log files. Times are commit times.

## 1 · 20:18 · PV-0 · KEPT
What: the branch I was given didn't typecheck: `director.ts` existed but nothing called it. Wired it in (`server/follow.ts`), operator controls, 9 failure-drill tests, shoot harness, follow-eval (virtual clock, real API). Evidence: `check.sh` PASS, 53 → 62 tests; `loop/shots/baseline`. New dev-only packages: `playwright-core`, `exceljs`. Baseline perf: p95 16.7 ms.
## 2 · 20:24 · PV-M1/M2/M3 · KEPT
What: subagents audited the numbers (37/37 model outputs and 315/315 clean values match) and built the workbook and reconcile gate. Evidence: `docs/financials/AUDIT.md`, `xlsx-check` PASS incl. six tamper tests. 
## 3 · 20:27 · PV-F2 · KEPT
Holdout written by a subagent that never saw the director (12 scenarios); 7 dev scenarios. Dev baseline: 81.7% right, 15 words late (p50), 0.86 false moves/run.
## 4 · 23:03 · SHOW · KEPT
What: WebGL engine (cores fly from one arrangement to the next), scenes looked up from data (249 of 250 tiles, 90% waffle, Cisco vs NVIDIA bars, four layers), icons per point, loop strip, question mode, finale with measured session figures. Old canvas takes over if WebGL fails. Evidence: `loop/shots/s1`, `s2`, `s3`.
## 5 · 23:08–23:21 · PV-F3 · KEPT (two tries reverted)
Tried: looking every 4 words → worse (dev false jumps up): undone. Tried: jumping on word overlap alone → no faster and broke 2 safety tests: `git restore`d. Kept: votes over the last four verdicts, word-evidence as a second opinion, garble hints, one sentence can't run the deck forward. 
## 6 · 23:15 · PV-F holdout · REVIEW
Holdout (before the run-forward fix; not re-run: cost): **89.6% right of 164 beats, 21 words late (p50; target 12), 3.2 moves/run flagged as false (target 1), p95 latency 2.0 s, 2/2 tangents, 5 false tangents.** Some flagged moves are the deck touching both halves of a merged sentence, but not all: one run went forward four slides (fixed in 5). `loop/eval-holdout.log`.
## 7 · 23:17 · reviews · REVIEW
Blind visual review: **6.2/10** (from stills). DCF student test: arithmetic PASS, defence **FAIL until DEFEND was corrected** (20% lower sales gives $97.17 in the sheet, not $134.50), 7/10. I re-ran both cases in Python, they agree, DEFEND fixed. Fixed from the visual review: error boundary, engine guard, font timeout, pixel cap, no wave on ESG slides, the clipped 14.1x. Not fixed: hero "0" from an unverified fact, claims in titles (Rob's).
## 8 · 23:20–23:30 · PV-Q1, PV-H1, PV-O1 · KEPT
22 prepared answers, 14 paraphrases and 15 off-topic questions as tests (written by me, so not a blind test). Found by looking: the new water chart was empty (Bloomberg splits the row); fixed, and a test now checks every chart has data. Fallback deck 54 pages. Final dev a-full: 25/27, 20 words late, 0 false moves.
Not done: live hostile-question drills (Q2 second half), PV-M6 sourcing (subagent died on the usage limit), PV-F4, PV-T1, PV-H2 panic key. API spend: $2.42 of $3 (a few cents may be missing: two evals shared the file).
## 9 · 23:25 · PV-Q2 live drill, end-to-end smoke · KEPT
What: real server, real Claude, text in place of the microphone. Followed three paraphrased beats including a skipped slide. Four off-bank questions: slide ready in 3.8, 3.8, 5.2 and 6.0 s (target was first element in 3 s, so missed). "Doubling" was refused and corrected by the app. No figure was typed by the model. Two faults: a free-cash-flow question matched the emissions-vs-peers answer (fixed); and Claude titled an Intel answer "looks cheaper on some measures" when none shown says so (**not fixable by rule: read before pressing A**). Spend: $2.47 of $3.
## 10 · 23:35 · wrap-up · DONE
Looking at the fallback pictures caught two false statements before they could be shown: the finale's "30 slides, 3 minutes" was the generator's own session (now hidden there), and my "The AI cannot type a number" answer ignored web research (reworded). Gate PASS, 67 tests. Checklist: shoot + perf done (`loop/shots/final-perf`), dev eval done on a-full, e-merge, f-swap, h-fillers, j-tangent, **holdout not re-run after the last follower fixes** (about $1.10; $0.53 left). 

## run 2 · Mon 01:16 · armed
Deadline 05:45, pause at 95% usage. Queue: loop/NEXT.md. Rules: loop/CARD.md.
## run 2 · 1 · 01:30 · N1 holdout baseline · MEASURED
True holdout (post run-1 fixes): **89.0% right of 164 beats, 23 words late (p50), 2.17 false moves/run** (1.5/run excluding e-merged-beats, where touching both halves of a merged sentence is expected), 2 of 2 tangents (4 false), p95 1.9 s. 24 network errors (aborted/connection) inflate misses. Spend $1.13 of $1.50: no more holdout, dev subsets only. `loop/eval-holdout.log` not overwritten; raw in eval results.json.
Not fixed this round: the false moves are mostly the model going one slide early or mixing chips/four-layers/software and last-quarter/beats/segments. Any fix needs live Haiku to check, and $0.37 is left (a dev run costs about $0.9). Untested changes could break the follower, so I left it alone. Eval cap lowered to $1.50 to match CARD.md.
## run 2 · 2 · 01:55 · N2 (part) · KEPT
Chart check: source line, bars from zero, dimmed other series and direct labels already exist in the ECharts chart, so a WebGL port is not worth the usage tonight (not done). Added the **DCF bridge dataset** `model_dcf_bridge` (per share: cash flow years 1-6 + value after year 6 + net cash = bear $31.4 / base $167.5 / bull $185.7), made by `model.ts` from the model, plus a test that it adds up to `model_valuation`. Gate PASS, 68 tests. No slide uses it yet: a new slide changes what we say, so it is Rob's call (NEEDS_ROB). Also noticed: bear/base/bull revenue paths in `model_revenue_paths` are identical for base and bull: check that is intended.
## run 2 · 3 · 02:20 · N3 (honesty half) · KEPT
`unsupportedClaim` in `ai.ts`: a generated title/bullet that says grew/fell (line: last vs first in range), highest/lowest (highlight vs the series), or makes a comparison we can't check (cheaper, higher than, more/less…) is replaced by the dataset's own title (title) or dropped (bullet). Rule is strict on purpose: some good titles will become plain. Fake data test covers each case incl. the Intel "cheaper" title; gate PASS, 69 tests. Not done: the show-skeleton-at-once latency change (needs live timing, no budget); no live questions run, $0 spent this round.
## run 2 · 4a · 02:45 · N4 Networking · KEPT
Checked the PDF myself: Bloomberg FA annual p.175 prints Networking 31,376.00 for the year to 25 Jan 2026. Moved it to the verified set (`research_facts`, 31.4, source + page). The "connections" slide now points at it, so it will print $31.4bn not $31bn (same words, only the token key changed); the unverified-slide test now uses "supply". Gate PASS.
## run 2 · 4b · 02:55 · N4 other figures · PARTIAL
2 searches (6 left). Found pointers for supply commitments (10-Q, $279bn, but includes equity investments) and the GTIG "no human" report (dates don't match the slide's 16-17 Nov). Primary pages not opened (download denied), so nothing moved to verified; details in NEEDS_ROB.
## run 2 · 5 · 03:20 · N5 time pressure + panic · KEPT
`shared/pace.ts`: speaking time per slide = words of `say:` at 150 wpm; time left vs script left (9 min aim); when behind, suggests the longest ✂ slides still ahead (never the one on now, never auto-skips). Shown in the operator timer during a rehearsal/run ("Time left vs script"). Panic: **Esc or P**, or the button, sends autoCue off + standby: plain local messages, so no AI/mic/network needed. 4 new tests (npm test now includes `shared/`). Gate PASS. Not seen in a browser (no stills this round); the 9:00 target and 150 wpm are my guesses, in `pace.ts`.
## run 2 · 6 · 01:45 · N6 blind review (1 sonnet subagent, 6 stills 1280x720) · MEASURED
**5.7/10 average** (revenue-long 5, last-quarter 7, valuation 5, scope3 6, close 6, qa-energy 5), lower than run 1's 6.2: take 5.7. Top faults: (1) source lines, axis labels, bar value labels about 10-12 px grey, unreadable at 10 m; (2) crowded or unlabelled chart ends (qa-energy dashed renewable line has no label; scope3 end label near the edge); (3) wasted layout (dead gap above revenue-long, early bars invisible, close half empty, valuation's off-palette orange and long headline). Stills in `loop/shots/r2`. A stray copy of the shoot output is in `/Users/robmcarlson/Developer/loop/` (the `--out ../loop/...` path resolves outside the worktree; use `--out loop/shots/x`): Rob may delete that folder.
