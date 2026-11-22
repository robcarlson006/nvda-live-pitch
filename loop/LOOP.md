# LOOP: overnight improvement loop for the live NVIDIA pitch

Pitch: **Wed 25 Nov 2026**, ~10 min. Rob (why) → Panshul (financials) → Mi'kael (ESG) → Rob (close).
This loop runs from now until the deadline in `loop/ACTIVE` (target: midnight, Sun 22 Nov).

You are one iteration of a loop. **You remember nothing from earlier iterations: everything is in files.**
After any context compaction, re-read this file, then `loop/STATE.md`, then `loop/BOARD.md`.

## Mission (Rob's words, tidied)
A stock pitch to a sceptical, ESG-focused board that is a *show*, not a PowerPoint. The slideshow builds itself live
from what we say (Deepgram → Claude), like a loop pedal: layers stacking up in time with the speech. It must:
1. **SHOW**: have outstanding animations and graphics. Blow the board away.
2. **FOLLOW**: react to the *meaning* of speech, with no trigger words. Presenters talk from memory, paraphrase,
   skip parts when time runs short, go back, ad-lib. The deck must keep up without anyone saying magic phrases.
3. **ANSWER**: build an answer slide (chart + short text) for any board question, from our data; research the web if
   our data has no answer. ESG answers must be the strongest.
4. **MONEY**: have correct financials. The DCF and everything else must be simple enough that three university
   students could build, explain and defend them. Financials are built in a **spreadsheet** (xlsx).
   Simple beats clever: the base DCF is one page, five forecast years, a handful of inputs. Extra sheets and extra
   methods are appendices that must never make the headline harder to explain. Same rule for every other financial slide.
5. **ORGANISED**: be easy to run, rehearse and recover on the day.

**Gates vs scores.** Gates (section "Gates") must pass on every commit: correctness and reliability are never traded
for flash. Scores (BOARD.md) are what you push up. If a gate and a score conflict, the gate wins.

## What already exists (don't rebuild it)
Read `CLAUDE.md` (the brief and principles) and `docs/PROGRESS.md` (what is built). In short: Vite+React stage/operator,
Node+WebSocket server holding show state, GPU-die "core array" stage with 4 layouts and 2 effects, 29 sourced datasets,
valuation model (`app/scripts/model.ts`, `data/model/assumptions.json`), scripted spine (`docs/script/spine.yaml`) with
cue matching, Deepgram mic with Chrome fallback, semantic follow-director (`app/server/director.ts`, Haiku),
Q&A bank + live Claude answers + web research, spend cap. **Not built yet:** fallback deck (M7), finale (M8), ticker (M3,
needs a Finnhub key we don't have), the spreadsheet model, any eyes on the visuals (screenshots/perf harness),
any measurement of how well the follow-director handles skipped/paraphrased speech.

## Hard rules (never break; if a task seems to need it, write it to NEEDS_ROB.md and move on)
1. Work **only** in this worktree on branch `loop/*`. Never `git push`, rebase, reset, force, or touch `main`.
   Commit small, often, with `PV-<id>: <what>`. Use `git restore` to undo your own uncommitted mistakes.
2. Never edit `data/bloomberg-raw/`, `app/.env`, or `app/ai-spend.json`. Never print, log or commit a key.
3. **Never let the AI invent numbers.** Every figure on a slide is looked up from `data/clean/` (see CLAUDE.md).
   Never weaken `checkSlide`, the digit refusal, the unverified-data rule, or any test to make something pass.
   New facts need a source + date in a dataset; if you can't source it, don't show it.
4. **Don't rewrite the presenters' words.** Do not change any `say:` text, speaker order, or the claims on Rob's/Panshul's/
   Mi'kael's slides. You may change visuals, layout, effects, icons, chart choices, data bindings, and fix
   errors listed in docs/PROGRESS.md "Risks". Anything about *what we say* goes to NEEDS_ROB.md.
5. Spend: no new paid services. Free dev dependencies are fine (note them in STATE.md). No big installs (the Mac's
   disk is nearly full and it has 8GB RAM: **the stage must run well on an M2 8GB**). Don't run `npx playwright install`.
   API spend for evals/tests: use your own budget file `loop/eval-spend.json`, hard cap **$3** (`Budget` class in
   `server/budget.ts`). Web searches cost ~1¢ each. Log the running total in STATE.md.
6. Keep the stage working at every commit. If the app can't `build` and pass tests, fix or revert before anything else.
7. Don't ask Rob questions: he is asleep or away. Put them in `loop/NEEDS_ROB.md` with your default and carry on.
8. Run browsers headless, one at a time, and close them: RAM is tight.

## Clock and phases
`bash loop/clock.sh` at the start of every iteration and before every commit (exit 0 = BUILD, 3 = WRAPUP, 4 = OVER).
- **BUILD**: improve. Don't start anything you can't finish and commit before WRAPUP.
- **WRAPUP** (last ~30 min): no new features. Run the wrap-up checklist below.
- **OVER**: stop. A Stop hook keeps the session alive until then; when the checklist is done, `touch loop/STOP`.

## One iteration (aim for 10–25 min)
1. `bash loop/clock.sh`. Read the last ~40 lines of `loop/STATE.md`, then `loop/BOARD.md` (scores + tickets).
2. **Pick one slice of one ticket** (rule below). Write one line in STATE.md: what, why, how you'll know it worked.
3. Make the change. Keep it small enough to finish in one iteration.
4. `bash loop/check.sh --quick` while working; `bash loop/check.sh` (full gate) before committing.
   Gate fails twice on the same change → `git restore` it, log "tried, failed, why" in STATE.md, move on.
5. **Look at it.** For anything visual: run the shoot harness, then *open the screenshots with the Read tool* and score
   against `loop/RUBRIC.md`. For follow: run the eval and read the failures. For money: run the reconcile and recompute.
   No score change without an evidence path in STATE.md. "Looks good" without having opened the images doesn't count.
6. Keep the change only if the score went up (or a gate/bug was fixed) and nothing regressed (perf, other slides, tests).
   Otherwise `git restore` and log it.
7. Commit. Append to `loop/STATE.md` (format below). Update `loop/BOARD.md` ticket status and scores. Anything Rob must
   decide → `loop/NEEDS_ROB.md`.
8. **Every 3rd iteration, and after any change that can alter a number on stage:** independent review (below).
9. End your turn. The hook will send you back in.

### Choosing the slice
- First time: PV-0 (eyes and measuring) before anything else, or you're improving blind.
- Then: P0 tickets before P1 before P2, **but** never do 3 iterations in a row without one SHOW iteration. The show is
  the point. Among the open tickets in a priority, work the track with the lowest score (BOARD.md).
- Don't polish what's already ≥ 8/10; find the weakest slide/scenario/question.
- No score improvement in a track for 3 iterations → switch track and note why in STATE.md.

### Independent review (separate agent, hasn't seen your reasoning)
Spawn a fresh `general-purpose` subagent. Give it only: the paths, the claim ("slide X scores N", "the DCF value is V",
"follow accuracy is A"), and the instruction "try to prove this wrong". It re-scores blind (don't tell it your score),
recomputes numbers independently from `data/clean/*.json` (e.g. in Python), and tries to break things (garbled
speech, skipped sections, missing data, network down). Log its verdict in STATE.md. If it disagrees, use the lower score.

## Gates (`bash loop/check.sh` enforces most of these)
typecheck, all tests, production build; test count never drops below baseline; no `.skip/.only` added; bloomberg-raw
untouched; no `say:` line removed or changed in spine.yaml; no keys in the diff; spreadsheet reconciles to the model
(once it exists). Plus, from CLAUDE.md: every live service has a timeout and a fallback; a human can always take over
(Next/Back/Standby/Approve/Reject must keep working).

## STATE.md entry format
```
## <iter#> · <HH:MM> · <ticket> · <KEPT|REVERTED|REVIEW>
What: ... Why: ... Evidence: <path or command output summary> Score: <track> a → b. Gate: pass. Spend so far: $x.xx
```

## Wrap-up checklist (WRAPUP phase)
1. Freeze features. `git status` clean except intended files.
2. Full gate green. Re-run shoot (all slides + perf), follow-eval (dev **and** holdout), spreadsheet reconcile.
3. Update `docs/PROGRESS.md` (what's new, how to run, risks) and `docs/RUNBOOK.md`.
4. Write `loop/MORNING.md`, ≤ 1 page for Rob: what changed; score table before → after; **3 things to open first**
   (with paths); what needs his decision (from NEEDS_ROB.md); how to merge (`git merge loop/<branch>` from the main
   folder) and how to ignore it (just don't merge). Be honest about what is weak or untested.
5. `git tag loop-final`. Make sure `loop/ACTIVE` still exists until the checklist is done, then `touch loop/STOP`.

## Files
`loop/BOARD.md` tickets+scores · `loop/STATE.md` log · `loop/NEEDS_ROB.md` decisions · `loop/RUBRIC.md` visual scoring ·
`loop/check.sh` gate · `loop/clock.sh` clock · `loop/stop-hook.sh` keeps the loop alive · `loop/ACTIVE` deadline (untracked) ·
`loop/shots/` screenshots (untracked) · `loop/eval-spend.json` your API budget (untracked).
