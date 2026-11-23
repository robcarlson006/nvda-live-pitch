# Kickoff prompt (paste into Claude Code, opened in the *worktree* that `loop/arm.sh` printed)

---
It's the overnight loop for our NVIDIA stock pitch. You're running until the deadline in `loop/ACTIVE` (about midnight tonight); a Stop hook keeps you going until then, and I won't be here to answer questions.

**What I want, in my words:** this is a stock pitch on NVIDIA and I want it to be a show, not a regular PowerPoint: really cool animations and graphics. What makes it special is that Deepgram feeds what we say into Claude and the presentation reacts and builds itself live. We have a rough script, but I don't want trigger words: we won't read from paper and if time runs short we'll skip parts, so it has to follow the *meaning* of what we say, however we say it. It must also react to board questions, answer them, build graphics, use our data (and research the web if it has to). The financials must be right, and the DCF and everything else must be simple enough for three university students to build and defend; the financials get built in a spreadsheet (live formulas, core five sheets, nothing fancy: if three first-year students couldn't rebuild it from scratch, it's too complicated). We need an effective organisation system. I want to blow them away. Improve it over and over.

**Start now:**
1. Read `loop/LOOP.md` (your operating manual) in full, then `loop/BOARD.md`, `loop/RUBRIC.md`, `loop/NEEDS_ROB.md`, `CLAUDE.md`, and `docs/PROGRESS.md`.
2. Run `bash loop/clock.sh`, then follow "Tonight's order" in BOARD.md. Begin with ticket **PV-0** (build your eyes: screenshot/perf harness and the follow-eval) before improving anything. Then work the board by the rules in LOOP.md: P0 first, a SHOW iteration at least every third iteration, evidence for every score, an independent subagent review every third iteration.
3. Hard rules to remember: work only on this branch; never push; never touch `data/bloomberg-raw`, `app/.env`, or `ai-spend.json`; never let the AI invent numbers; don't rewrite our `say:` script text; $3 eval budget; the stage must always build and pass `bash loop/check.sh`; it has to run on an 8GB M2.
4. Anything I need to decide goes in `loop/NEEDS_ROB.md`: pick a sensible default and keep going.
5. In the last ~30 minutes follow the wrap-up checklist in LOOP.md and finish with `loop/MORNING.md`.

Note: near my usage limit the Stop hook pauses you by itself and wakes you at 23:00 with a longer deadline; when that happens re-read your files and carry on. Keep every commit state clean so a pause costs nothing.

Don't recap the plan back to me; just start.
---
