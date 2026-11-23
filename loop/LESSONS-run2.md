# Lessons, run 2 (retro after R0–R4)
1. **Read the cache before spending.** Reading cached verdicts showed Claude itself names a new slide ~19 words in; a "look sooner" trigger would have cost money and done nothing. Analysis of cached/offline data first, live runs last.
2. **Money rule held:** $2.01 of $2.50 by R3; a full holdout (~$1.1) no longer fits, so only half was run. Plan live spends against the cap *before* the first one, not after.
3. **Reverted attempt counts:** early-move attempt 1 (no guards) cost accuracy; guards from the evidence (optional slides, built slide, two in a row) fixed it. Cheap guards beat threshold tuning.
4. **Tooling traps (cost ~15 min):** `python3` is an empty alias here (use /opt/homebrew/bin/python3); the shoot/filmstrip server serves the BUILT client (`npm run build` first); scratch scripts outside the repo need `.mts`.
5. **Images:** filmstrips at 1280x720 are enough; limit to the final frame set, not each tuning step (R4 used 5).

# Retro 2 (after R5–C21)
1. **Blind review pays for itself:** one 7-still review found two fixable faults (clipped label, unlabelled stacks) in minutes; fix the lowest-scoring slide each round, not the one I like.
2. **Stale artefacts are silent risks:** the fallback PDF was a run old and lacked every new slide. After adding any slide or answer, regenerate it (`npm run fallback`) in the same round.
3. **Tests that list things (optional slides, bank asks) are the cheap net:** they caught my new slides' cues colliding and `P/E` tokenising to "p e" before any live run.
4. **No live spend was needed for 8 rounds:** offline analysis, fake callers and the smoke test (~1 cent) covered everything except follow accuracy; keep API for the pitch.
5. Process tweak: CARD "Verifying motion" now also says: build the client (`npm run build`) before any filmstrip/shoot.
