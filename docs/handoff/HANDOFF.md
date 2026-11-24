# Handoff: v2 final-pitch build (paused 24 Nov 2026, evening)

Pitch: **Wed 25 Nov 2026, 9:00 hard limit.** The full spec is [`docs/script/CLAUDE_CODE_PROMPT_v2.md`](../script/CLAUDE_CODE_PROMPT_v2.md).
Branch: **`v2-final-pitch`**. Backup of the old deck: git tag **`pre-v2-backup`**.

## How to continue (new Claude account or new computer)
1. `git clone https://github.com/robcarlson006/nvda-live-pitch.git && cd nvda-live-pitch && git checkout v2-final-pitch`
2. Copy over two things git does not carry: **`app/.env`** (Deepgram + Anthropic keys) and **`app/public/media/`** (the WSJ clip).
3. `cd app && npm ci`
4. Open Claude Code in the repo root and say:
   *"Read @docs/handoff/HANDOFF.md and @docs/script/CLAUDE_CODE_PROMPT_v2.md. Continue the build from 'Next steps' below. Finances first, animations after. Stop at each section-4 checkpoint with the evidence it asks for."*

## Done so far
**Section 0 (safety)**
- Tag `pre-v2-backup` = the deck before v2. `./restore-pre-v2.sh` puts it back and rebuilds `app/dist` offline (tested once). The script is committed after the tag, so it is only on this branch.
- `.claude/settings.json` denies Read of `./app/.env` and `./.env`.
- Motion kill-switch: `motion` in server state (survives refresh, syncs stage ↔ operator). Operator checkbox "Motion (m)", key **m**, and `?motion=off` on the stage URL (`?motion=on` clears it). It sets a `motion`/`no-motion` class on `.stage` and does nothing else yet, because the camera engine isn't built.

**1a: price and rates (data done)**
- `assumptions.json`: price **152.85** (team input, 24 Nov); `bloombergWacc` 15.4 (Q3 2026); `discountRates` [10.55, 14.45, 15.4]; `position` 3; 19.3 and 16.42 moved to `referenceOnly`; stress case renamed **"If AI ended for good"**; bear relabelled "rivals take share and spending pauses for a year".
- `research_market`: price 152.85; trailing P/E re-priced to 152.85 ÷ 9.31 = **16.42x** (it was 17.73x at $165.05); Damodaran 10.55% and "WACC, Bloomberg Q3 2026" 15.4% (with `seriesVerified`); Stock Analysis and the 19.3% rate removed.
- `model.ts` throws if any sensitivity rate is above 15.4%.

**Headline figures, before → after** (valuation maths unchanged; only figures that depend on the price moved)
| Figure | Before ($165.05) | After ($152.85) |
|---|---|---|
| Base / Bull | $391.38 / $434.36 | same |
| Bear (rivals take share) | $101.56 | same (−33.6% vs price) |
| If AI ended for good | $64.41 | same (−57.9%; costs a 3% position 1.74%) |
| Base at 10.55% / 14.45% | $391.38 / $248.69 | same |
| Base at 15.4% | not computed (19.3% gave $167.50) | **$227.68** |
| Implied growth (reverse DCF) | 13.43%/yr | **11.47%/yr** (base case 35.55%) |
| NVIDIA forward P/E | 17.12x | 15.86x |
The base case is **above today's price at all three rates**, so the deck can say so.

**1b: new model exports (in `data/clean/`, all sourced and dated)**
`model_dcf_inputs` (with `seriesSources` per input), `model_fcf_forecast` (actual FY20–26, then forecast FY28–32), `model_dcf_bridge` (USD tn, one series per rate), `model_three_rates` (value per share, EV, price, upside), `model_downside` (both cases: value, change, cost to the portfolio), `model_path_bear` and `model_path_ai_ended` (each against the base case, one per slide).

**1b: renderer and schema (additive; tsc clean, 70/70 tests pass)**
- `ChartSpec`: type `waterfall` (+ `totals`), `exclude`, `refLine: {series}` (price line), `muted`.
- New layout **`inputs`** with `groups: [{tag, items}]`; step `{item: [g, i]}`. In spine YAML, groups come first and each item can have `{text, cue}`. The item being said turns green and other groups dim.
- Effect `dark` (the cores fade out) for "If AI ended for good".
- Chart zoom now finds stacked, waterfall and gap points.
- `pdfText(file, {plain:true})` falls back to macOS PDFKit (`app/scripts/pdf-text.swift`) when `pdftotext` is missing. **This Mac has no poppler**, so `npm run data` fails at `build-data.ts`. Run `npx tsx scripts/research-data.ts && npx tsx scripts/model.ts` instead. The Bloomberg files it would rebuild haven't changed.

## Next steps
1. **Finish 1a in the text.** `spine.yaml` and `answers.yaml` tokens now point at the new labels and 15.4%, but the spoken **`say` text still has the old numbers** (165, 249 at Google Finance, 19.3%, "seventeen and three quarters"), and the `valuation` slide still exists. Remove 19.3/16.42 from all `say` text and Q&A; the `discount-rate` answer still cites Stock Analysis in its `sources`. Make the Q&A allow-list (`usable()` in `app/server/ai.ts`) skip any rate above 15.4%. `docs/qa-bank/QA_PREP.md` is team-only prep, not shown to the board.
2. **1b slides:** replace `valuation` with dcf-inputs (layout `inputs`, 4 groups: Bloomberg / Google Finance / Damodaran (NYU) / Our two choices) → fcf → dcf-bridge (waterfall, `model_dcf_bridge`, series `"10.55%"`, totals [Enterprise value, Equity value]; the per-share value against the price goes in the text) → three-rates (`model_three_rates`, `refLine: {series: Share price today}`) → reverse-dcf → bear-case (`model_path_bear`) → ai-ended (`model_path_ai_ended`, `muted`, effect `dark`, "costs the portfolio under 2%"). Credibility line and wording are in spec 1b.
3. **Tests:** the bridge adds up at each rate; no rate above 15.4% in slides, `say` or Q&A; bear vs "If AI ended for good" labels never swapped; then **checkpoint 1** (numbers + 1920x1080 screenshots of the finance slides).
4. Then spec 1c–1i (space race, people 3.7% vs 13.2%, TSMC exclude, trims, word count ≤1,300, fallback PDF), then section 2 (camera, morphs) and section 3.
