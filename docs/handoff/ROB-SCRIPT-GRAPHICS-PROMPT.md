# Prompt for Rob's Claude Code: keep the script in step with the new stage graphics

Paste everything below the line into Claude Code in Rob's checkout of `nvda-live-pitch`.

---

You are helping Rob, who owns the pitch script (`docs/script/spine.yaml` and the teleprompter). Panshul and two Claude Code sessions have rebuilt the stage graphics on branch `panshul/design-polish` (PR #2: https://github.com/robcarlson006/nvda-live-pitch/pull/2). The graphics read the script, so script edits can now break or improve them. Your job is to keep `spine.yaml` compatible with them, and to make the few script changes that make them land better.

## Ground rules
1. Start with `git fetch origin && git checkout main && git pull`. Then make a new branch `rob/script-for-graphics` from `origin/panshul/design-polish`, or from `main` if PR #2 has been merged. The graphics code is only on that branch until the PR merges.
2. Edit only `docs/script/spine.yaml` and the script docs in `docs/script/`. Do not edit anything in `app/src/` (Stage.tsx, Chart.tsx, Effects.tsx, Figures.tsx, styles.css, scenes/*). If a graphic needs a code change, write it up in `docs/script/GRAPHICS-NOTES.md` for Panshul instead.
3. Never let the AI invent numbers. Figures stay as `{{dataset | series | x}}` lookups, exactly as now.
4. When done: `npm --prefix app run typecheck && npm --prefix app test && npm --prefix app run build`. Then load the stage (`npm --prefix app run dev`, open `/stage` and `/operator`) and step through every slide you changed. Push your branch and open a PR to main. Do not merge, force-push or delete branches.

## How the graphics hook into the script
Every graphic is keyed by **slide id**. If you rename an id, its graphic silently disappears, so keep these ids unless you also tell Panshul:
`founding, first-gpu, wall-street, four-layers, chips, software, connections, supply, if-it-pops, already-doing, handoff, last-quarter, returns, dcf-inputs, fcf, dcf-worksheet, dcf-bridge, three-rates, reverse-dcf, bear-case, space-race, open-ai, beyond-hyperscalers, recommendation, close`.

Graphics follow the script in two different ways. Check which kind a slide uses before you edit it.

### A. Graphics that follow the point's position (keep the number and order of points)
These scenes build one step per point, in order. Changing a point's wording is fine. Adding, removing or reordering points makes the animation land on the wrong words. If you must change the count, list it in GRAPHICS-NOTES.md so the scene can be updated.

| Slide | Points it expects, in order | What the picture does on each |
|---|---|---|
| founding | 1 "every PC", 2 "video games" | Napkin sketch: 3D cube in a PC screen, then a game controller |
| first-gpu | 1 Xbox (2000), 2 Forbes (2007), 3 "could have stopped" | A track runs through the years; it ends with a path heading off the edge |
| wall-street | 1 chips for gamers, 2 "stock halved", 3 "revenue stalled" | A pixel skyscraper; its top breaks off on point 2; it fades behind the chart on point 3 |
| four-layers | 1 the four layers, 2 "all of them, at once" | Four slabs stack up, then lock together |
| handoff | 1 "governments keep building", 2 hand-off to the numbers | The same stack returns; buyers feed it; a beam rises to the numbers section |
| if-it-pops | 1 "stock falls", 2 "hardware and software", 3 "cut first" | Bubble pops; the green block survives, shows two halves, the grey blocks are cut |
| returns | 1 cash returned, 2 buybacks authorised, 3 "excess" cash policy | Coins go to buybacks and dividends, then a reserve, then a steady stream |
| space-race | 1 Sputnik 1957, 2 Moon 1969, 3 Earth observation, 4 "AI is a race" | Sputnik orbits, Moon landing, satellites, then Space vs AI race side by side |
| recommendation | 1 three percent, 2 all three rates, 3 bear case, 4 "we would add" | A 10×10 portfolio grid: 3 squares lit, markers above today's price, red outline, room to add |
| close | 1 the four best, 2 "a buy" | The four layers light up under an AI city; the rebuilt Wall Street tower lights green |

Hard-coded on purpose, so keep the slides consistent with them:
- space-race shows **1957**, **1969** and **AlexNet, 2012** (from the alexnet slide). Keep those years if you reword the slide.
- recommendation draws a **3%** position inside a **10%** single-stock limit. If the position size or limit changes, tell Panshul.

### B. Graphics that read the point's words (wording matters; order doesn't)
These follow edits automatically, as long as the words keep the pattern.

- **already-doing ("AI is already delivering results").** The 2×2 board has Science, Healthcare, Farming and Data centres. When a point mentions a panel, the camera zooms into it for about 3 seconds. Matching is by keyword:
  - Science: *nobel / protein / chemistry*
  - Healthcare: *drug / trial / medicine* and *breast / cancer / screen / Sweden*
  - Farming: *Deere / spray / weed / farm / crop*
  - Data centres: *Ecolab / cool / water*

  **Change to make:** today's three points only mention Science and Healthcare, so Farming and Data centres never zoom. The schema allows at most four points. Suggested restructure, each point naming one industry: (1) Nobel/proteins, (2) the lung drug and the Sweden screening combined in one point, (3) John Deere's See & Spray, which runs on NVIDIA GPUs and sprays only the weeds, (4) Ecolab, which worked with NVIDIA engineers on liquid cooling for AI chips. Give each a cue phrase and update `say` to match. Sources: Deere is #20 in `docs/research/ai-breakthroughs-50.md`; Ecolab is in the `ecolab-water` answer in `docs/qa-bank/answers.yaml` (Ecolab releases of 2 Jul and 16 Nov 2026). Don't put numbers in these two points unless they come from a dataset, and don't claim NVIDIA involvement for any other example. Don't add new figures for Sweden or the lung drug; the existing `{{research_facts | …}}` lookups stay.
- **open-ai.** Every point written as **`Label: Name, Name and Name`** becomes a cluster of companies around NVIDIA, labelled with the text before the colon. The point with no colon (the "more choice" point) closes a ring round them all; keep that one last. Up to 4 groups and 5 names per group. Anything after ", which" or ", pending" is dropped from the picture, so keep "pending approval" wording there for Hugging Face. Never say "bought".
- **beyond-hyperscalers.** Hyperscalers are always shown. Every point written as **`Label: detail`** adds a buyer type with its own stream from NVIDIA (max 2 more). The concentration point must mention **customer** and a **% figure** from a lookup (as now: "Three direct customers still made up {{…}} of …"). It draws an amber ring filled to that %, and the text before "made up" becomes the ring's caption. Keep that phrasing. This is also where to answer "NVIDIA depends on a few customers": a governments/sovereign point in `Label: detail` form (e.g. "Governments: …") would add a third buyer stream. Only add it with a sourced fact.

## Other things that changed on stage, and what they mean for the script
- **Section openers.** A full-screen card ("Numbers." for Panshul, "Future." for Mi'kael) plays for about 1.9 s before `last-quarter` and before `space-race`, when moving forward. Panshul's and Mi'kael's first line will land about 2 s later than before, so pause briefly after the hand-off, or start with a line that doesn't need the slide.
- **Slide transitions** now take about 0.4 s for the old slide to leave, then the new one builds. Cues fire as before. Re-time `docs/script/TIMING.md` only if a rehearsal shows it matters.
- **Chapter trackers** (top right) follow the slide ids: Chips → Software → Connections → Supply, and Inputs → Cash flow → Discounting → Value → Three rates → Priced in across the DCF slides. If you reorder, merge or cut those slides, tell Panshul.
- **Figures count up and get a green highlighter.** A figure is highlighted if it has a currency sign, a unit (%, x, bn, tn, m, k, pp) or decimals. Plain whole numbers and years stay plain. Write important figures with their unit (from the lookup) and put the figure you want the room to remember in its own point, near the start.
- **Red hand-drawn ring.** It circles each chart's `highlight`, and follows every `{ zoom: … }` step. Choose `highlight` and zoom targets as "the bar we want them to look at".
- **Line-chart zooms now let go** once the next point is said (this fixed the cut-off bear-case chart). If you want a line chart to stay zoomed, the zoom must be its last step.
- **The bear case** says "only" in `say` but not on the slide. If you want it on screen, add "only" before the portfolio-loss lookup in the third point's text.
- **Static backup deck.** `fallback/spine.pdf` and `app/public/fallback/slide-*.jpg` are pictures of the old slides. After your script changes, ask Panshul whether to rebuild them (`fallback/build.py`) so the backup matches.

## Deliverable
1. The `spine.yaml` edits above (at least the already-doing restructure), with cues and `say` text that match, and `TIMING.md` updated if the timing moves.
2. `docs/script/GRAPHICS-NOTES.md`: any change you made that affects category A, any id renamed, and anything you think a graphic gets wrong about what you're saying.
3. A PR to main with the checks passing, and a short list of the slides you stepped through on `/stage`.
