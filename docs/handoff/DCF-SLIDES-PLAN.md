# Plan: every DCF output on stage, plus moving "AI is already delivering results"

Written 24 Nov 2026, night before the pitch. Builds on Panshul's `panshul/design-polish` (PR #2):
the scene framework (`app/src/scenes/`), count-up figures + green highlighter (`Figures.tsx`), red ring
on the chart highlight, chapter rail and section cards (`Effects.tsx`).

## 1. The 16 metrics: where each one lands

Today's DCF chapter is `dcf-inputs → fcf → dcf-worksheet → dcf-bridge → three-rates → reverse-dcf`.
Ten of the sixteen are already in the data; six need a new number or a new place on screen.

| # | Metric | Value (base, 10.55%) | Data today | Slide it lands on |
|---|---|---|---|---|
| 1 | Implied share price | $391.38 | `model_three_rates` | `dcf-bridge` (exists) + **`dcf-summary`** hero |
| 2 | Current share price, with date | $152.85, 24 Nov 2026 | `model_dcf_inputs` (date only in source) | `dcf-inputs` (add the date to the text) + `dcf-summary` |
| 3 | Upside / downside % | +156% | `model_three_rates` "Above reference price" | `three-rates` (exists, in table) + **`dcf-summary`** meter |
| 4 | WACC | 10.55% (also 14.45%, 15.4%) | `model_dcf_inputs` | `dcf-inputs`, `three-rates` (exist) |
| 5 | Terminal growth rate | 3% | `model_dcf_inputs` | `dcf-inputs` (exists) |
| 6 | Forecast period | FY28–FY32, five years | **missing as a field** | **`dcf-drivers`** |
| 7 | Revenue growth (CAGR) | ≈35.5% FY27→FY32 | **missing** (only inside reverse-DCF) | **`dcf-drivers`** |
| 8 | EBIT margin | 60.38% FY26 operating margin | `nvda_margins_annual` | **`dcf-drivers`** (next to the 45.25% FCF margin we actually use) |
| 9 | Unlevered FCF each year | $330bn → $874bn | `model_fcf_forecast`, `model_dcf_detail` | `fcf` (exists) |
| 10 | PV of FCFs | $2.29tn | `model_dcf_bridge` | `dcf-worksheet` (exists), `dcf-bridge` |
| 11 | PV of terminal value | $7.08tn | `model_dcf_bridge` | `dcf-bridge` (exists) |
| 12 | Enterprise value | $9.37tn | `model_dcf_bridge` | `dcf-bridge` (exists) |
| 13 | Net debt | −$59.6bn (net cash) | `model_dcf_inputs` "Net cash" | `dcf-bridge`: relabel the step "Net debt: none, $59.6bn net cash" |
| 14 | Equity value | $9.43tn | `model_dcf_bridge` | `dcf-bridge` (exists) |
| 15 | Diluted shares outstanding | **not in data** (we use 24.1bn basic, Bloomberg DES) | **missing** | `dcf-inputs`, `dcf-bridge` divide step |
| 16 | Terminal value as % of EV | 75.6% | **missing** (in Excel "DCF" sheet only) | **`dcf-bridge`** ring + `dcf-summary` |

## 2. New running order for Panshul's DCF chapter

```
dcf-inputs → dcf-drivers (NEW) → fcf → dcf-worksheet → dcf-bridge → three-rates → dcf-summary (NEW) → reverse-dcf → bear-case → ai-ended
```

Chapter rail in `Effects.tsx` becomes: Inputs · Drivers · Cash flow · Discounting · Value · Three rates · Summary · Priced in.

Time cost: about +35 s for Panshul (two short slides, ~45 words each). Panshul is at 2.9 min today, so the
whole pitch stays around 8.4 min before transitions. Cut `dcf-worksheet`'s spoken line to one sentence to win back ~8 s.

## 3. Slide by slide: visuals and animation

All new visuals are **scenes** (right-hand column, keyed by slide id in `scenes/index.tsx`, step on each point said),
so they get the same build-with-the-speaker behaviour as Panshul's scenes. Every figure is a `{{dataset | series | x}}`
lookup so it counts up and gets the green highlighter.

### 3a. `dcf-inputs` (edit, no new visual)
- Reference price line → "Share price: {{…Share price}} at the close on 24 Nov 2026" (date in text is allowed).
  **Update the date and price on pitch morning** (assumptions.json `priceOverride`, then `npm run data`).
- Shares line → diluted count (see decision D1).
- Add one chip at the top of the Bloomberg group: "Forecast: FY28 to FY32, five years".

### 3b. NEW `dcf-drivers`: "Our base case in three numbers" — scene `DcfDrivers`
Layout `split`, three points, the scene builds one beat per point:
1. **Forecast period** — a five-segment timeline FY28…FY32 slides in under a "today" marker; FY27 is greyed ("current year, not counted").
2. **Revenue CAGR** — five green revenue bars grow left to right on that timeline; an arc draws over them and the
   CAGR label counts up to {{model_dcf_inputs | Revenue CAGR, FY27–32 | value}}.
3. **Margins** — a single "$1 of sales" bar splits: 60c operating profit (EBIT margin, FY26), then 45c free cash
   (the margin the DCF uses). Says honestly that the model runs on the FCF margin; EBIT is shown for context.

### 3c. `fcf` (no change) — unlevered FCF per year
Already a stacked bar with zooms on FY26 and FY32. Label the series "Free cash flow (unlevered)" only after D2.

### 3d. `dcf-worksheet` → discounting animation — scene `Discounting`
Keep the table, add the scene: each year's FCF bar appears as a ghost outline, then **shrinks to its present value**
(discount factor shown as a little "× 0.89 … × 0.59" tag), so the board *sees* time value. Ends by sliding the five
PV bars together into one stack labelled "PV of FCFs {{model_dcf_bridge | 10.55% | PV of FY28–32 cash flow}}".

### 3e. `dcf-bridge` (edit) — waterfall + terminal-value ring
- Keep the waterfall and its zooms (PV of FCFs → PV of TV → EV → net cash → equity value).
- Rename the net-cash point "Net debt: none. NVIDIA holds {{…Net cash}} net cash" so "net debt" is explicitly answered.
- New point after "everything after": "{{model_dcf_bridge | 10.55% | Terminal value share of EV}} of the value comes after FY32".
  Reuse the amber %-ring from Panshul's `Demand` scene (it already draws a ring filled to a % read from the point),
  so the ring fills to 75.6% over the waterfall. This is the honest "how much rests on the far future" moment —
  a sceptical board respects it.
- Divide step uses diluted shares (D1).

### 3f. `three-rates` (no change) — upside already in the table.

### 3g. NEW `dcf-summary`: "The DCF on one page" — scene `DcfSummary`
The slide the board can photograph. A 4-tile dashboard that assembles as Panshul speaks (4 points → 4 tiles):
1. **Assumptions** tile: WACC 10.55% · terminal growth 3% · forecast FY28–FY32 · CAGR · EBIT margin
2. **Cash flows** tile: FCF sparkline FY28–FY32 · PV of FCFs · PV of TV · TV % of EV (mini ring)
3. **Bridge** tile: EV − net debt = equity value ÷ diluted shares
4. **Answer** tile (big): implied $391.38 vs $152.85 (24 Nov 2026) → **+156%** upside meter, needle sweeps,
   with the 14.45% and 15.4% values as small ticks on the same meter (all three still above the price).
Tiles use the `CoreArray` green-square texture as their fill-in so it matches the GPU-die look.

### 3h. Static fallback
After the spine changes, rebuild `fallback/spine.pdf` and `app/public/fallback/slide-*.jpg` (`fallback/build.py`)
so the backup deck has the two new slides.

## 4. Move "AI is already delivering results" after the space race

New order at the start of Mi'kael's section:

```
… ai-ended → [section card "Future."] → space-race → already-doing → governance → open-ai → …
```

Why it flows: space-race ends on "AI is a race now. What useful tools will it leave behind?" — `already-doing`
answers it immediately ("It's already leaving them…").

Changes:
- Move the `already-doing` block in `spine.yaml` below `space-race`; **speaker → Mi'kael**; new opening cue
  that follows the space-race line (e.g. "already leaving tools behind", "already delivering results").
- Rob's section now goes `if-it-pops → handoff`; the handoff `say` needs no change.
- Do Panshul's requested restructure at the same time (4 points, one per panel so all four zoom):
  Nobel/proteins · lung drug + Sweden screening · John Deere See & Spray · Ecolab liquid cooling.
- Scene id and keywords unchanged, so `AiIndustries` keeps working. Same for the "Future." section card,
  which stays keyed to `space-race`.
- Update `TIMING.md`: ~25 s moves from Rob (3.1 → ~2.7 min) to Mi'kael (1.8 → ~2.2 min).
- Regenerate Deepgram keyterms (`npm run keyterms` or the script used in 073cec1) for new cue words: Deere, Ecolab.

## 5. Build order (each step demo-able on its own)

1. **Branch:** `rob/dcf-slides` from `origin/panshul/design-polish`; merge `rob/test-early-cues` into it and resolve
   `spine.yaml` conflicts (your earliest-cue test vs Panshul's rewording). Tell Panshul so he stops editing `spine.yaml`/`Effects.tsx` tonight or works on top of this.
2. **Data (`app/scripts/model.ts`)**: add `Diluted shares`, `Revenue CAGR, FY27–32`, `Forecast first year/last year`,
   and per-rate `Terminal value share of EV` to the clean datasets; `npm run data`; extend `data.test.ts` to check
   CAGR = (FY32/FY27)^(1/5)−1 and TV% = PV TV ÷ EV.
3. **Move `already-doing`** + 4-point restructure (quick win, script-only).
4. **`dcf-bridge` edits** (net debt wording, TV % ring) — reuses existing ring.
5. **`dcf-drivers` scene**.
6. **`dcf-summary` scene**.
7. **`Discounting` scene** on `dcf-worksheet` (most optional; cut first if time runs out).
8. Chapter rail labels, `TIMING.md`, keyterms, fallback rebuild.
9. Checks: `npm --prefix app run typecheck && npm --prefix app test && npm --prefix app run build`, then step through
   every changed slide on `/stage` + `/operator` (motion on and reduced-motion), screenshot each.

## 6. Decisions and risks

**Resolved 24 Nov, late (see PROGRESS.md):** D1 → diluted shares, 24.186bn, now in the model (base $389.99);
D2 → say "free cash flow" on screen and keep the unlevered explanation for Q&A; price mismatch → fixed, the
spreadsheet and app both use $152.85 and the three rates 10.55 / 14.45 / 15.4. The new slides read
`model_dcf_summary` (forecast period, CAGR, EBIT margin, PV of FCFs, PV of TV, TV % of EV, EV, net debt,
equity value, diluted shares, implied price, price, upside). The original notes follow.

- **D1 Diluted shares.** We only have Bloomberg DES 24.1bn (basic). Diluted needs the FA diluted weighted-average share
  count from `data/bloomberg-raw/nvda_fa_annual_FY1998-FY2026.pdf`. Switching to diluted lowers value per share by
  about $0.60 (AUDIT.md) and every typed number in `say` text ("391 dollars", "249", "228", "2.3 trillion") must be
  re-checked. Recommendation: switch to diluted — it is what the board will ask for.
- **D2 "Unlevered".** Our FCF is Bloomberg free cash flow (operating cash flow − capex). With net cash and almost no
  interest it is close to unlevered FCF, but we should say "free cash flow" on screen and only call it unlevered if
  someone asks, with that explanation.
- **D3 EBITDA vs EBIT.** We have EBIT (operating) margin for NVIDIA, not EBITDA. Show EBIT.
- **Price mismatch (fix before the pitch).** The app uses **$152.85**; the Excel `NVDA_DCF_final.xlsx` still shows
  **$165.05** on the Start-here and DCF sheets (137% upside there vs 156% in the app), and Start-here quotes the
  19.3% WACC we no longer show. If the board sees the spreadsheet, the numbers must match.
- **Merge risk.** Panshul's branch is unmerged and still moving; building on it tonight means coordinating so we don't both edit `spine.yaml`.
