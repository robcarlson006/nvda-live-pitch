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
- Web searches: **≤ 8 in the whole run**. Live API (Rob's money, billed apart from his $20 plan): **hard cap $2.50 for this whole run** (about $1.13 is already spent: read `loop/eval-spend.json`). Rob wants the API saved for practice and the pitch itself, so: cache first (item R0), fake-caller tests, dev evals only from the cache, ONE holdout run at the very end, at most 3 live Q&A drills. Don't build a `claude -p` caller to dodge the API: it burns the subscription allowance faster and measures a different path. Haiku for evals.
- STATE.md entries ≤ 4 lines. Update BOARD.md scores only in the wrap-up.
- Do not fight the usage pause: at 95% of the 5-hour limit the Stop hook pauses the session and wakes it when the window resets. When you wake, re-read this card and carry on. Keep every commit state green so a pause or stop costs nothing.

## Done means done (Rob's rewrite after the queue emptied in 22 minutes)
- An item is DONE only when its **done-when** line is met, with evidence in STATE.md. PARTIAL-and-move-on is allowed only after **two reverted attempts** on that item, and you say why in one line.
- A dataset, test or stub alone is not done: the thing must be visible and working on the stage.
- If the queue is empty, don't stop and don't invent busywork: generate the next item from evidence (see "Keep improving all night"). Stop only at the deadline, the usage limit, or `loop/STOP`.
- STATE.md times come from `date +%H:%M`, never guessed. Use commit times as the truth.

## The wow bar (Rob: "super cool animations", "truly react to what we say, in the moment, and build on the spot")
- The board should *see the speakers' voice build the deck*. A visible change must follow the words that cause it within ~1 s for elements and ~4 s for slide changes. Anticipation counts: a pre-glow just before a reveal makes it feel predicted, not triggered.
- One signature idea, executed hard: the core field plus the loop pedal (layers stacking as the pitch goes). No stock fades or slide-ins; one easing family; build order = speaking order; every movement marks a point.
- Theatrical opening and close; calm and plain through the middle and ESG (bad news shown without triumphant motion). Never flash above 3 Hz; the `m` key kills motion.
- Honest by construction: numbers are looked up, words come only from slide content, nothing is invented from the transcript.

## Verifying motion cheaply
A still can't show motion. Use the **filmstrip** (item R1): 6 frames over ~1.5 s tiled into ONE image. It counts as one of your 2 images per round. Judge: is the build order clear, how many things move at once (≤ 3), does the motion explain something.

## Demo ready by morning (this outranks polish)
Rob meets his team tomorrow morning and must be able to **speak and watch the deck react**, from `./start.sh` in this worktree, with his real mic (Deepgram, Chrome fallback). So:
- Priority is *felt reaction*: R2, R3 and R4 (listening, anticipation) come before the charts and the DCF bridge.
- Never leave the stage worse than you found it: the gate is green at every commit and at wrap-up, and `./start.sh` works.
- Before wrap-up, smoke-test through the real server with the typed-speech box standing in for the mic: three paraphrased beats, one skipped slide, one board question. Fix what breaks.
- Write `loop/DEMO.md` (≤ 1 page, plain words) **before** MORNING-2.md: the launch commands; starting the mic and choosing Deepgram; three lines to say to watch it react (take them from our `say:` text); how to skip a section and see it cope; how to ask a board question; the keys; what is slow or weak; what to do if it misbehaves (fallback deck).

## Keep improving all night (Rob: "improving all night, self-improving")
- Improvement is measured, not felt: every kept change has a number, a test, or a before/after filmstrip behind it. A change with no evidence of being better is reverted.
- Same slice, new loop: when R-items close, item **C** in NEXT.md takes over: pick the weakest measured thing, fix it, prove it. Every 4th round is a retro that writes `loop/LESSONS-run2.md` and may tune CARD.md/NEXT.md (never the hook, settings, check.sh or a gate; never weaken a test).
- The money must stand up: DCF, reverse DCF and P/E vs peers each need reasoning written down in DEFEND.md (item M1) so three students can defend every number. Reverse DCF and Peers may be workbook appendix sheets now (Rob asked), each simple (≤ 15 formulas).
- Animations should be visibly better every hour; compare the same slide's filmstrip before and after.

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
3. Write `loop/DEMO.md` first (see "Demo ready by morning"), then `loop/MORNING-2.md` (≤ 1 page, for Rob): what changed since MORNING.md; score table before → after; **3 things to open first** (paths);
   what needs his decision; how to merge (`git merge loop/2026-11-22` from the main folder). Be honest about what is weak, untested, or unfinished,
   including time lost to the usage limit and API spend.
4. `git tag loop-final-2`; then `touch loop/STOP` and stop.

## Added at retro 2
- `npm run build` before any shoot/filmstrip (they serve the built client). After adding a slide or answer: `npm run fallback`. `python3` is an empty alias here: use /opt/homebrew/bin/python3.
