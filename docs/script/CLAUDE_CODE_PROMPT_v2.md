# Spec for Claude Code: final pitch build (finance rebuild + slides that move as we speak)

Replaces `CLAUDE_CODE_PROMPT_motion.md` (never run). Pitch is **Wednesday 25 Nov 2026**. **Hard limit: 9 minutes.**
How to use: open Claude Code in `nvda-live-pitch` and say: *"Read @docs/script/CLAUDE_CODE_PROMPT_v2.md and build it. Be ambitious. Start with section 0."*

---

## Why this matters (context you can't get from the repo)
We present to a sceptical, ESG-focused investment board. Three goals:
1. **The screen follows our voices.** Whenever someone looks up, the screen shows exactly what we're saying: the number we just said, the bullet we're reading, the step of the DCF we're explaining. Lots of movement is good, as long as each move lands on what is being said. **More slides that flow faster are welcome**, if each one is focused and easy to follow.
2. **Credibility.** Our numbers are not ours. They come from Bloomberg, Google Finance, Damodaran (NYU) and NVIDIA's own filings. The deck makes that obvious, and the script says it out loud.
3. **No confusion between our two downside cases.** A board member who mixes them up, or finds one mislabelled, stops trusting the rest.

Read first: `CLAUDE.md`, `docs/PROGRESS.md`, `docs/script/spine.yaml` (its header explains cues and zooms), `app/shared/schema.ts`, `app/server/state.ts`, `app/server/director.ts`, `app/server/cues.ts`, `app/scripts/model.ts`, `data/model/assumptions.json`, `data/model/valuation.csv`, `docs/qa-bank/answers.yaml`, `app/src/Stage.tsx`, `Chart.tsx`, `CoreArray.tsx`, `styles.css`.

## 0. Safety first (before any edit)
- Commit the current state and tag it `pre-v2-backup`. Write `./restore-pre-v2.sh`: it restores that exact deck and rebuilds `app/dist`, with no network or `npm install` needed. **Run it once to prove it works**, then return to the new work.
- Add a deny rule for `Read(./app/.env)` and `Read(./.env)` in `.claude/settings.json`. Never print or edit `.env`.
- Add a motion kill-switch: `?motion=off` on the stage URL, plus an operator toggle and hotkey. Off = today's behaviour. It survives refresh.
- Don't change the valuation maths in `model.ts` beyond the inputs and exports below. If a number changes for any other reason, stop and tell me.

## 1. Content changes

### 1a. Share price and discount rates
- Set `priceOverride` in `assumptions.json` to **152.85**, asOf 2026-11-24, "why": "Team input, 24 Nov 2026; confirm and update on pitch morning".
- **The three rates we use: 10.55% (US semiconductor industry average, Damodaran, Jan 2026), 14.45% (Google Finance, 24 Nov 2026) and 15.4% (Bloomberg WACC, Q3 2026).**
  - Add 15.4% to the model's sensitivity rates.
  - Add it to `research_market.json` as "WACC, Bloomberg Q3 2026", with source "Bloomberg WACC, Q3 2026" and `verified: true` (confirmed by the team).
- **Nothing above 15.4% appears anywhere the board can see or hear.** That means slides, `say` text, the Q&A bank and generated answers. Remove 19.3% and 16.42% from all of those. Leave the raw values in `assumptions.json` and `valuation.csv` notes for our own reference. Make the Q&A generator's data allow-list skip any discount rate above 15.4%.
- Run `npm run data`. Report every headline figure before and after: base, bull, bear, stress, base at each of the three rates, and implied growth.

### 1b. Finance section rebuilt around the DCF (Panshul)
Keep `last-quarter`, `beats`, `guidance`, `returns` and `peers` as they are, unless you trim them for time (1h). Replace `valuation` with this sequence. Think of it as one continuous camera move over one surface: every slide morphs into the next (section 2), and every element builds in time with the words.

1. **"Where our numbers come from": the DCF inputs, shown and highlighted right before the DCF.** This is the credibility moment, so give it the most polish.
   - Every input the model uses, grouped by source:
     - **Bloomberg:** FY26 revenue, FY27 and FY28 revenue consensus, free-cash-flow margin (FY24–26 average), shares outstanding, net cash, WACC 15.4% (Q3 2026).
     - **Google Finance:** share price ($152.85), WACC 14.45%.
     - **Damodaran (NYU), Jan 2026:** US semiconductor industry average WACC 10.55%.
     - **Our two choices**, labelled honestly as ours: terminal growth 3%, and growth fading in a straight line to 3% by FY32.
   - Each source has a small text tag (no logos). The camera visits one source group at a time as Panshul names it. Each key input gets a green highlight as it's said, and the camera pulls out to show the whole set before the DCF starts.
2. **Free cash flow.** History from `nvda_fcf_annual`, then the base-case forecast FY28–FY32. Zoom onto FY26 actual, then FY32, as they're said.
3. **The DCF bridge (10.55%).** A waterfall that builds step by step: present value of FY28–32 free cash flow → present value of terminal value → **enterprise value** → plus net cash = equity value → ÷ shares = **intrinsic value per share**. It ends with intrinsic value beside today's price. The camera follows each step, then pulls out to the whole bridge.
4. **Three rates, side by side.** Base-case intrinsic value at 10.55%, 14.45% and 15.4% as three bars next to each other, with a line at today's price, then enterprise value at each rate. Zoom to each bar as its rate is named, then pull out to show all three. Display rates exactly as in the data; speakers may round in speech.
5. **What the price assumes (reverse DCF), one fast slide.** Today's price implies X% revenue growth a year, against Y% in the consensus-based base case (`model_implied_growth`, recomputed at $152.85). Zoom on the gap.
6. **Two downside cases: two separate slides, never merged.**
   - **Bear case: "Rivals take share and spending pauses for a year"** (FY28 +10%, FY29 −5%, then recovery). Its own slide, its own title, its own colour treatment.
   - **"If AI ended for good"** (today's stress case): revenue flat, then down 20%, then no real growth ever again, margins 10 points lower. Harsher than anything in NVIDIA's history. It gets its own slide, with a visibly different treatment (for example the cores going dark).
   - Rename the stress case to "If AI ended for good" everywhere: dataset label, slides, Q&A, operator panel.
   - The spoken script must name each case in plain words every time ("our bear case, where rivals take share", "if AI ended for good"). Never just "the bear case" for the second one, or "downside" for both.
   - Frame "If AI ended for good" positively: even then a share is still worth something, not zero, and our 3% position means it costs the portfolio under 2%. That hands over to Mi'kael (1c).
   - Add a test that no slide or Q&A answer uses one case's label with the other case's number.

**How we describe the 10.55% rate.**
- Wording: *"We didn't invent a discount rate. We used the US chip-industry average, and checked it against Google Finance's and Bloomberg's own rates for NVIDIA."*
- Then show the result at all three. If the base case is above today's price at all three rates (check in code after the price update), say so. If it isn't, don't claim it, and tell me.
- Supporting points, all true: revenue comes from analyst consensus, not our own forecast; the margin is NVIDIA's actual three-year average; growth fades to 3% by FY32.
- Don't call 10.55% "conservative" in any other sense.

**Credibility line in Panshul's script** (draft, near the inputs slide): *"None of these numbers are ours. They come from Bloomberg, Google Finance and NVIDIA's own filings, and every figure on screen shows its source."*

**New data from the model.** Add exports to `model.ts` (new files in `data/clean/`, same shape, with source and asOf), so no figure is typed:
- `model_dcf_inputs`, with per-series sources (`seriesSources`).
- `model_fcf_forecast`
- `model_dcf_bridge`: x = bridge steps; series = the three rates.
- Add a `waterfall` chart type to `ChartSpec` (additive), drawn in the core-stack style.
- Tests: the bridge adds up (EV + net cash = equity; equity ÷ shares = per-share value matching the sensitivity value at each rate).

### 1c. Why AI won't stop: the space race (Mi'kael's opening)
Panshul ends on "If AI ended for good". Mi'kael picks it up: *it won't end, because it's a race, like the space race.*
- **Space race only. No nuclear or Manhattan Project comparison.**
- The pattern: Sputnik (1957) → the Moon landing (1969). When a technology decides national leadership, governments don't stop. AI is that race now, the US is the most competitive player, and it runs on NVIDIA.
- **The ESG angle:** the space race also gave us Earth-observation satellites that now track climate, deforestation and emissions. AI can be the same kind of race: one whose by-products help the planet.
- Visual: a timeline the camera travels along as each moment is named, ending on "AI, now", with the core array lighting each era.
- Years in titles are fine. Any other figure or factual claim (satellite programmes, government AI spending, policy) must come from `research_policy.json` or `docs/research/*`. A new fact goes in a curated dataset with its source, and `verified: false` unless the source is in the repo. Keep it factual and non-partisan.
- Rewrite the end of Panshul's section and the start of Mi'kael's so they connect.

### 1d. People slide (3.7%)
- Title it clearly as **staff turnover**: "Only 3.7% of staff left last year", NVIDIA's staff turnover rate (Bloomberg).
- Comparison: tech-industry turnover of about 13.2% (sector attrition rate, 2022, SEMI / Tom's Hardware industry reporting). Put it in `research_people.json` with its source and `verified: false`.
- Show the two as bars. The camera zooms on NVIDIA's bar, then pulls out to show the gap. Only show the comparison if NVIDIA is below the benchmark (it is), checked in code.
- Spoken line (draft): *"NVIDIA keeps its people more than three times better than the tech-industry average."* If the multiple is shown on screen, compute it from the data.
- Note in the dataset whether Bloomberg's figure is total or voluntary turnover.
- Keep Glassdoor, Fortune and TIME. Cut "weak spot: less social data" from `say` (the `social-score` answer covers it).

### 1e. TSMC
- Keep TSMC where it helps NVIDIA (the `supply` slide stays).
- On `emissions-peers`, remove the TSMC bar, its zoom step and the TSMC caveat. Add an additive `exclude: [..]` to `ChartSpec`.
- Keep the `scope3` and `cleaner-than-peers` Q&A answers honest about supply-chain emissions.

### 1f. Trim negatives that aren't essential (keep essential ones, with rebuttals)
- `wall-street`: keep the underdog arc. Cut the activist-fund clause and the unverified CUDA-spend bullet.
- `chips`: cut "AMD has more memory on paper".
- `if-it-pops`: cut the "$64 stress case" bullet. Keep the survival argument.
- `open-ai`: cut "money going round in a circle" from `say` (the `circular` answer covers it).
- `recommendation`: replace the Google Finance line with the three-rate summary, and reword the sizing line to "If AI ended for good".
- `governance`: keep, unchanged.
- "AI isn't a fad": unchanged. The industries slide is on hold.

### 1g. Q&A bank
- Keep `discount-rate` as the full answer, now on 10.55%, 14.45% and 15.4% only. Update its numbers for the new price and add the bridge chart.
- Rename the stress case to "If AI ended for good" everywhere, and make sure no answer blurs it with the bear case.

### 1h. Nine minutes, hard limit
- At 150 words a minute, the whole spoken script must be **about 1,300 words or fewer**.
- Fit the new content by tightening words, not by dropping the ideas. Use more, faster slides with fewer words each. Every element still lands on its words.
- Cut `optional: true` slides first, then trim long `say` lines.
- Mark every line you write or trim with `# DRAFT say`, so we can put it in our own words.
- Give me a table: slide | old words | new words | what changed. Then the final count, the estimated time and the time per speaker.
- If it can't fit without losing something important, stop and show me the options rather than cutting it.

### 1i. Backup deck
- Export the finished spine as a static PDF in `fallback/`: one page per fully built slide, sources included.
- The operator panic button shows the static slides.
- Check the PDF opens and every figure matches the live deck.

## 2. Slides that move as we speak (applies to every slide, new ones included)

### Rules
1. **The move matches the words.** Every move starts on its cue (the existing cue system, never loosened). It lands on exactly the thing being said, eases over about 0.9 to 1.3 seconds with a cinematic slow-in and slow-out (no bounce), then holds or travels to the next target.
2. **Plenty of motion, one focus at a time.** Up to about 5 moves on dense slides (inputs, bridge, three rates). Fewer on short ones. No move in the first second of a slide.
3. **Legible.** Up to about 2.2x on a chart point. A gentle 1.08 to 1.15x lean-in for bullets and headline numbers. The target stays fully on screen. Never crop the source line. Text stays sharp when magnified.
4. **Spotlight, not clutter.** In focus = bright, everything else dims (extend `.past`). No blur.
5. **Theme.** Pure black, silicon-grey cores, NVIDIA green only where cores are computing, Archivo, stepped text reveals. The camera is smooth; the reveals stay stepped. No new colours, cards, gradients or glows.
6. **Projector-safe.** Animate only transform and opacity, at 60 fps at 1920x1080 (measure it).

### Camera engine
One shared virtual camera replaces the per-slide `drift`, with a slow ambient drift only while idle. Targets, added to the `Step` union as `focus` variants (additive; today's `{ zoom: x }` / `{ zoom: all }` keep working):
- `point` (chart x, optional series): a ring plus the exact value label.
- `range`
- `bullet`
- `stat`
- `group` (a source block on the inputs slide)
- `step` (one waterfall step)
- `wide`

Parallax: `CoreArray` moves slightly slower than the foreground. Validate targets at load with readable errors. An error boundary shows the plain static slide on any failure. `director.ts` tells the operator what's next.

### Transitions (Magic Move, done better)
Morph what persists between consecutive slides instead of cutting:
- The same chart or dataset morphs.
- Numbers roll from old to new value, or cores migrate between figures.
- Shared title words slide into place (FLIP).
- Everything else exits with a stepped wipe in the camera's direction.

The finance run (inputs → FCF → bridge → three rates → reverse DCF → bear → If AI ended for good) and the hand-over into the space race must feel continuous. List the morph pairs first. If the next cue fires mid-transition, speech wins: cancel cleanly, never stall. Bundled locally, works offline. Say which mechanism you chose and why.

### Signature visuals using the core array
Ideas, and add your own:
- cores assemble into a chip die
- the 249,000-of-250,000 failed chips go dark
- the DCF bridge as stacks of cores
- the three rate bars lighting up against the price line
- the cores going dark for "If AI ended for good"
- the space-race timeline lighting era by era

No real person's likeness drawn by the cores, and no logos.

### Authoring
For every slide, add focus steps with cues taken from its `say` (2–5 distinctive words, numbers as words **and** digits, no apostrophes, 3+ alternatives). When a number is spoken, focus on exactly that data point. Finish with a table: slide | move | cue phrase | why it helps.

## 3. How we'll know it's done (show evidence, not "done")
- `npm test` and `npm run typecheck` pass. New tests:
  - old zoom items still behave the same
  - focus validation
  - the bridge adds up at each rate
  - no discount rate above 15.4% in any slide, `say` text or Q&A answer
  - bear vs "If AI ended for good" labels never swapped
  - the people benchmark only shows when NVIDIA is below it
  - TSMC is excluded from the emissions chart
- A rehearsal run with `scripts/deepgram-run.ts` takes **every slide** live and fully built by speech, **in 9:00 or less**. Report the fire rate and latency for each focus step, and fix misfires with cues, not looser matching.
- **Screenshots** at 1920x1080: the inputs slide (wide and mid-highlight), the bridge, three rates, both downside slides, people, space race. Check them against this spec and fix anything clipped, unreadable or off-theme.
- Frame times, `npm run build`, `./start.sh` working offline, the restore script tested, the fallback PDF checked. Do not add a "built live" reveal or finale slide.
- Before/after headline figures (1a) and the word-count table (1h).
- `docs/PROGRESS.md` and the `spine.yaml` header updated, plus a one-page "how to rehearse" (keys, kill-switch, restore, fallback).
- Then a fresh reviewer subagent checks the diff against this spec and reports only gaps that affect correctness or the pitch, skipping style.

## 4. Order and check-ins
1. Section 0. Then a plan of 20 lines max (mechanism, signature moments, new datasets, risks), and carry on.
2. Data and finance slides (1a, 1b). **Stop** with the before/after numbers and screenshots.
3. The remaining content (1c–1i). **Stop** with the word-count table.
4. Camera, transitions and authoring (section 2). **Stop** with screenshots and which keys to press.
5. Hardening and checks (section 3).

Keep each check-in to about 5 lines.
