# Morning, Rob

**The account hit its usage limit from about 20:30 to 23:00, so this is roughly 80 minutes of work, not four hours.** Everything below is on `loop/2026-11-22`; nothing was pushed. Gate: PASS (67 tests, was 53).

## Open these three first
1. `./start.sh` in `~/Developer/nvidia-pitch-loop`, then click through with →. The cores now fly from picture to picture; watch the finale.
2. `loop/NEEDS_ROB.md`, bottom section: **14 decisions, some are things we'd say that are wrong** (Glassdoor #1, "even our bear case", "the shares are worth more").
3. `data/model/NVDA_DCF.xlsx`, with `docs/financials/DEFEND.md` next to it.

## What changed
- **No trigger words:** the follower existed but nothing called it. It now runs the deck, with cue words as the safety net. On by default.
- **Stage:** new WebGL engine, pictures built from our data, loop strip, question mode, finale with measured figures, bigger text.
- **Money:** every model output and 315 dataset values re-checked independently; live-formula workbook, reconciled on every gate run.
- **Q&A:** 22 prepared answers (was 10). **Fallback deck** (54 pages, works offline) and **runbook** exist.

## Scores
| | Before | After | Who scored it |
|---|---|---|---|
| Show | ~4.5 | 6.2 | blind reviewer, from stills; the fixes after it are unscored |
| Follow | 0 (not connected) | 6.5 | me, from the blind test set |
| Money | 5 | 7 | blind "first-year student" |
| Answers | 5 | 6 | me |
| Fallback | 4 | 7 | me |
| Organisation | 5 | 7 | me; nobody else has tried the runbook |

## What is weak or untested. Please read
- **Never tested with a real microphone or voice tonight.** The follower was tested with text and real Claude calls.
- **It is slow:** about 21 words (8 seconds) after a new subject starts; my target was 12. Use the clicker for CUDA, the reveal and the last line.
- **Blind test: right slide on 89.6% of 164 beats** (target 90%), and 3.2 moves a run were flagged false (target 1; some are the deck touching both halves of a merged sentence). One run raced through four slides. I fixed that and tested the fix, but **did not re-run the blind set afterwards** (budget). On my own full run-through since: 25 of 27, no false moves.
- **Live answers took 4–6 s** in four tries (target 3 s). Figures held up, but one title claimed something its data didn't show. **Read before pressing A.** Web research wasn't drilled tonight.
- Off-script slides go up by themselves after 1.5 s unless blocked. Your call (NEEDS_ROB).
- **The [VERIFY] figures are still unverified**, including the giant "0" on the security slide. The search was cut off.
- Frame times: 95% within 16.8 ms on all 31 slides, worst single frame 83 ms, but measured headless on this M2 8 GB Mac, where the 4x throttle doesn't slow the graphics chip. Check once on the projector.
- Charts still use the old drawing, so they look plainer than the rest. Not started: time-pressure helper, ticker, panic key. DCF bridge animation not started.

## Merge or ignore
Main folder: `git merge loop/2026-11-22` (adds about 31 MB, mostly the fallback deck). To ignore it, don't merge. API spend tonight: $2.47 of $3, on its own file.
