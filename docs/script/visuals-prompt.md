# Prompt for a new Claude Code session: build the visuals

Copy everything below the line into a new session. Start it in `~/Developer/nvidia-pitch-loop` (the working copy with the latest data and tooling). The script is at `~/Documents/Nvidia stock pitch/docs/script/pitch-script-v4.md`, and a copy of it and its PDF is in `~/Developer/nvidia-pitch-loop/docs/script/`, so the session can read it from either place. If you edit the script later, re-copy it into the loop folder.

---

You are building the visuals for a live stock pitch. Read this whole brief, then read the files it names before you write any code.

## The goal

Three University of Stirling students pitch NVIDIA (NVDA) to a sceptical, ESG-focused board on Wednesday 25 November 2026. The pitch is about 9 minutes. A web app builds the slideshow live while they speak: titles, charts, big numbers and lines assemble on screen in time with the words, like a loop pedal building a song. The app itself is the proof of the thesis, so it must look stunning and never glitch.

Your job: make the stage view (`/stage`) look and feel extraordinary, with a ton of cool, well-made animation, and make every slide flow into the next. Quality and reliability beat feature count. A crash in front of the board ends the pitch.

## Read these first

1. `CLAUDE.md` in the project (the rules below come from it).
2. **The script, read in full before anything else:** `docs/script/pitch-script-v4.md` in the project (a copy is also at `/Users/robmcarlson/Documents/Nvidia stock pitch/docs/script/pitch-script-v4.md`; a PDF version sits beside it). Every line starting with ▸ is a screen cue you must build. Spoken text is everything else. This is the source of truth for slide order, timing and wording. If the two copies differ, the one in the Documents folder is newer. The same folder also holds `visuals-prompt.md` (this brief) and the older drafts v1 to v3, which you can ignore.
3. `docs/PROGRESS.md` and `docs/script/spine.yaml`: what already exists. `spine.yaml` still has the OLD running order and old numbers. Update it to match v4.
4. `app/` (Vite + React + TypeScript; Express/Fastify + WebSocket backend), `data/clean/` and `app/scripts/` (data builders), and the existing `/stage` and `/operator` routes.
5. Run the existing tests and the app first, so you know what works today.

If the project in front of you lacks the data tooling, the other copy is `~/Documents/Nvidia stock pitch` (older). The loop worktree `~/Developer/nvidia-pitch-loop` is newer. Check `git status` and `git log` in both, say which you are using, and do not clobber uncommitted work.

## Hard rules (do not break)

1. **Never invent numbers.** Every figure and chart comes from `data/clean/` by key. The model chooses what to show, never types data. If a slide needs a number that isn't in the data, add it through the data scripts with a source and date, or show an honest "data missing" state. Never hard-code a chart value in a component.
2. **Every number shows its source** (small, tasteful footnote on the slide).
3. **The main pitch only looks live.** The spine is scripted. Each slide is tied to cue phrases; when speech-to-text hears one, its elements build. Only Q&A is truly generated.
4. **A human is always in control.** Operator panel on a second device: manual next/back, trigger any single element, pause listening, approve/reject generated slides, one-key switch to the backup deck.
5. **Always have a fallback.** Manual advance must work with no network, no mic and no AI. Every build step must be triggerable by a key press as well as a cue phrase.
6. **Do not claim the AI runs exclusively on NVIDIA hardware.** The closing says "none of it happens without NVIDIA", about the industry.
7. Ask before adding paid services. Keep secrets in `app/.env`.

## Design direction

- Dark, cinematic, projector-friendly. NVIDIA green (`#76B900`) as the accent, used sparingly. Big type, generous space, high contrast: it must read from the back of a lecture hall on a poor projector.
- Use the `design-taste-frontend` skill to set the visual language BEFORE building slides: type scale, colour tokens, spacing, easing curves, motion principles. Also use `frontend-design` and `dataviz` where they help, and `ui-ux-pro-max` for chart choices. Write the result down as a short design-system file (`app/src/stage/design.md` plus CSS variables / tokens in code) so every slide stays consistent.
- Motion: Framer Motion for element builds, ECharts (or Recharts) with animated draw-in for charts. Build in "beats": each ▸ cue is one beat that eases in, with 300–700 ms of motion, then holds. Use staggered builds, number count-ups, line draws, bars that grow one at a time, masked text reveals, soft glows, subtle parallax or particle fields in the background, and smooth cross-slide transitions (shared elements that morph between slides where the data connects, e.g. the revenue line continuing from FY16 to FY26, the $64 stress-case bar returning large and alone).
- One persistent small element: the live NVDA ticker in a corner ("Market closed, last close" when US markets are shut). Optional; it must fail silently.
- Nothing may jitter, reflow or flash. Fix sizes, preload fonts and data, respect `prefers-reduced-motion` only on the operator view, never on stage. Hit 60 fps on a mid-range laptop: profile it.
- Accessibility basics: sufficient contrast, no information carried by colour alone.

## The slides to build (from the script's ▸ cues)

Build each as a component driven by data keys and a list of beats. For each, wire the cue phrases from the spoken text.

**Rob: the why**
1. Black screen; one line builds: "NVIDIA: the hardest position in AI to copy."
2. "1993. A Denny's in San Jose." Title builds.
3. Big number: **249,000 of 250,000** (first chip, returned). Then a quick beat for the 1999 GeForce 256 "GPU".
4. "November 2006. CUDA." Line chart builds: revenue FY07 $3.1bn → FY16 $5.0bn (the long flat stretch is the point).
5. 2012 image contest: error rate 15.3% v 26.2%. The same line chart then CONTINUES to FY26 $215.9bn (morph, don't cut).
6. Big number: **20 years** of CUDA, with 1,000+ libraries and 6 million developers beneath.
7. Four lines build: Chips · Software · Networking · Supply (11.6× AMD data-centre sales, 6 million developers, 72 chips in one machine, ~60% of packaging).
8. Two bars: share of AI chip supply Q4 2025, NVIDIA 68% v Google 19%.
9. Clear to one line: "Do the numbers agree?"

**Panshul: the numbers**
10. Revenue FY22 $26.9bn → FY26 $215.9bn, Data Center shaded, drawn slowly.
11. Operating margin bars (NVIDIA 60%, AMD 29% consensus, Intel 15% consensus) and a big number $96.7bn free cash flow.
12. Consensus revenue FY26 $216bn → FY27 $422bn (+96%) → FY28 $729bn (+73%), with a small beat panel: Q3 FY27 revenue $115.8bn v $108.7bn expected, profit per share $2.68 v $2.47. Add a **guidance** slide: Q4 guide $130bn ±3%, FY28 growth outlook ~75% (up from 70%), Vera Rubin nearly $20bn in its first quarter; and a **returns** slide: $28bn handed back in the quarter ($22bn buybacks, $6bn dividends), $227bn buyback authorization left.
13. "What is one share worth?" with the headline discount rate 10.55% (US semiconductor average, Damodaran) and the other estimates beside it: Google Finance 14.45%, Bloomberg 19.3%. Never imply 10.55% is NVIDIA-specific.
14. Valuation bars build one at a time: Stress $64 · Bear $102 · Base $391 · Bull $434 · Peer P/E check $297 · Today $165.05. Read every value from the data (model_valuation); the price comes from priceOverride in data/model/assumptions.json then npm run data, so nothing here may be hard-coded.
15. Reverse DCF number: at 10.55% the price already assumes about 13% a year sales growth to FY32 (our base case: 35.5%); at Google Finance's rate, about 26%.
16. **Analysts** slide: ratings bar (34 buy / 9 hold / 1 sell of 44) and a chart of targets (lowest $130, average $233, highest $350) against price today, our bear case and our base case. The base case sits above every target; the slide says why (the discount rate). Then the bear and stress bars held on screen: Bear $102 (−38%) · Stress $64 (−61%) at 10.55%.

**Mi'kael: why spending won't stop, ESG, the close**
17. The $64 stress-case bar returns alone, large (a callback to slide 16: animate it from where it was).
18. "Reason one: it is discovering things." Then items build one at a time (the last one holds): AI at Olympiad gold level in maths; AlphaEvolve on 50 open problems; 170,000 → 200 million protein structures (2024 Nobel); new antibiotic in 3 days; +20% cancers found and −44% reading work in Swedish screening. Make this beautiful: it is the emotional centre.
19. "Reason two: the AI race." A clean, serious slide (US, China, and the White House AI Action Plan line, attributed). Keep it restrained.
20. "Is AI an environmental disaster?" Own-emissions bar chart, built one bar at a time, LOG scale with a label on every bar: NVIDIA 0.05 · AMD 1.2 · Broadcom 2.8 · Intel 25 · TSMC 109 tonnes CO2 per $1m of sales. The tiny NVIDIA bar is the story; design the log axis so it reads instantly. Own operations only: no suppliers, no Scope 3.
21. "Governance" slide: founder reinstated, independent national-security committee, compliance-officer search.
22. The finale: the screen clears, a pause, then one large line: **"Built live by software that follows our voices, from our own script and data."** Hold it while the last words are spoken, then the NVIDIA logo fades in on black after "Thank you." This is the payoff of the whole pitch, so make the clear-down, pause and reveal land with real weight.

Also build the **Q&A answer slide** template (title → chart → text, element by element, with a visible "source" line) and the **backup deck** (static, instant, no animation dependencies).

## How to work

- Plan first, in small milestones that each run and demo on their own. Show me the plan, then go. Suggested order: (1) design system and one hero slide end to end; (2) data additions the slides need; (3) the remaining slides; (4) transitions and the finale; (5) operator controls for every beat; (6) rehearsal tooling.
- Data work you will need: FY07–FY16 revenue line; AI chip supply share; own-emissions bars on a log scale; margin bars; bear and bull at the 10.55% rate. Add them through `app/scripts/` with `source` and `asOf`, run `npm run data`, and keep `npm test` green.
- **Test it like a show.** Add a "rehearsal" mode that plays the whole spine on a timer matching the script (about 9 minutes), so we can watch it start to finish with no one speaking. Record a screenshot at each beat (use the browser tools) and check for layout breaks, overflow and tiny text at 1920×1080 and 1280×720.
- Add a keyboard map: space = next beat, backspace = back, N/P = next/prev slide, B = switch to backup deck, F = freeze. Show the map on the operator view.
- Keep `docs/PROGRESS.md` updated: what is done, what is next, known risks.
- Commit in small steps on a new branch (do not touch `main`). Do not commit `.env`.

## Definition of done

- `/stage` plays the full 22-slide spine with smooth, consistent animation, driven only by `data/clean/`.
- Every beat can be triggered by a cue phrase, a key press or the operator panel.
- The finale works as described above.
- `npm test` passes, the rehearsal mode runs end to end without console errors, and there is a short `docs/stage-demo.md` describing how to run it and what to check.
- Report back with what you built, what you could not verify, and any numbers that were missing from the data.
