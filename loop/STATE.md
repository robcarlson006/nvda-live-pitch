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
