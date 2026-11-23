# Lessons, run 2 (retro after R0–R4)
1. **Read the cache before spending.** Reading cached verdicts showed Claude itself names a new slide ~19 words in; a "look sooner" trigger would have cost money and done nothing. Analysis of cached/offline data first, live runs last.
2. **Money rule held:** $2.01 of $2.50 by R3; a full holdout (~$1.1) no longer fits, so only half was run. Plan live spends against the cap *before* the first one, not after.
3. **Reverted attempt counts:** early-move attempt 1 (no guards) cost accuracy; guards from the evidence (optional slides, built slide, two in a row) fixed it. Cheap guards beat threshold tuning.
4. **Tooling traps (cost ~15 min):** `python3` is an empty alias here (use /opt/homebrew/bin/python3); the shoot/filmstrip server serves the BUILT client (`npm run build` first); scratch scripts outside the repo need `.mts`.
5. **Images:** filmstrips at 1280x720 are enough; limit to the final frame set, not each tuning step (R4 used 5).
