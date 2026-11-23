# CARD: run 2 operating card (read this every round; LOOP.md / BOARD.md only when told below)

**Mission (Rob):** an NVIDIA pitch that is a *show*, not a PowerPoint: standout animation and graphics; it follows the *meaning* of what
we say (no trigger words; parts get skipped); answers board questions from our data (ESG strongest); financials correct and simple enough
for three students to defend; easy to run on the day. Pitch: Wed 25 Nov. Run 1's results: `loop/MORNING.md`.
Scores after run 1: Show 6.2 · Follow 6.5 · Money 7 · Answers 6 · Fallback 7 · Org 7.

## Budget: Rob is on the $20 plan, running Sonnet. Usage is the scarce resource, not time
- Run 1 got ~80 minutes of real work because parallel subagents burned the allowance in 17 minutes. Don't repeat that.
- **At most ONE subagent at a time**, only for (a) one blind review near the end, (b) an independent recompute of a number you changed. Never in parallel. Brief it in ≤ 10 lines (paths + claim). Never for searching or reading.
- Read with `grep -n` and line ranges. Never `cat`/Read a file over ~150 lines whole. Pipe command output through `| tail -20`.
- Images are expensive: only for visual changes, **≤ 2 per round**, downscaled (1280×720 or smaller). Don't re-score unchanged slides.
- `bash loop/check.sh --quick` while working; the full gate once per round, before the commit.
- Web searches: **≤ 8 in the whole run**. Live API (Rob's money): fresh `loop/eval-spend.json`, **cap $1.50 for the run**; prefer fake-caller tests; Haiku for evals.
- STATE.md entries ≤ 4 lines. Update BOARD.md scores only in the wrap-up.
- Do not fight the usage pause: at 95% of the 5-hour limit the Stop hook pauses the session and wakes it when the window resets. When you wake, re-read this card and carry on. Keep every commit state green so a pause or stop costs nothing.

## One round (25–40 min, exactly ONE slice)
1. `bash loop/clock.sh`; read the top open item of `loop/NEXT.md`; `tail -15 loop/STATE.md`.
2. Do that one slice. Small enough to finish and commit this round.
3. Check by the cheapest evidence that proves it (test, number, eval, or ≤ 2 stills if visual). A score only rises with evidence in STATE.md.
4. Keep it only if it's better and the gate is green; otherwise `git restore` it and log "tried, failed, why". Failing twice → move to the next item.
5. Commit `RUN2-<id>: what`. Append to STATE.md. Mark the item done/partial in NEXT.md. End your turn (the hook sends you back in).

## Hard rules (same as LOOP.md)
Only this worktree/branch; never push, reset, rebase. Never touch `data/bloomberg-raw`, `app/.env`, `app/ai-spend.json`; never print a key.
The AI never invents numbers: never weaken `checkSlide`, the digit refusal, the unverified-data rule or any test. Don't change any `say:` text,
speaker order or the claims on slides: that is Rob's (put it in `loop/NEEDS_ROB.md`). No paid services, no big installs, no `playwright install`.
Headless browser one at a time, closed afterwards. The stage must always build and pass the gate and run on an 8GB M2. Never ask Rob: pick the
safe default, write it in NEEDS_ROB.md, carry on.

## Wrap-up (last 25 min, or when the hook tells you to; minimal tokens, no new features, no screenshots)
1. `bash loop/check.sh` green; commit anything green; `git restore` anything not.
2. Update the scores table in `loop/BOARD.md` (only with evidence you have).
3. Write `loop/MORNING-2.md` (≤ 1 page, for Rob): what changed since MORNING.md; score table before → after; **3 things to open first** (paths);
   what needs his decision; how to merge (`git merge loop/2026-11-22` from the main folder). Be honest about what is weak, untested, or unfinished,
   including time lost to the usage limit and API spend.
4. `git tag loop-final-2`; then `touch loop/STOP` and stop.
