# Graphics notes for Panshul (24 Nov 2026, late night, branch `rob/dcf-slides`)

Rob asked for every DCF output on stage with a visual. That needed some code in `app/src`, so here is what changed in
your area, to save you finding it in a diff.

## New slides and scenes
- **`dcf-drivers`** (after `dcf-inputs`), scene `scenes/DcfDrivers.tsx`. Category A: three points in order.
  1 forecast years light up (FY27 grey, FY28–FY32 green), 2 base-case revenue bars + CAGR arc, 3 "$1 of sales" bar
  split into EBIT margin and FCF margin.
- **`dcf-summary`** (after `three-rates`), scene `scenes/DcfSummary.tsx`. Category A: four points, one tile each:
  Assumptions · Cash flows (FCF outline shrinking to PV, TV-share ring) · From value to one share · The answer
  (implied vs dated price, upside, the three rates on one scale).
- Both share `scenes/dcf.css`. Motion-off rules are at the end of each block.

## Changes to your code
- `Stage.tsx`: scenes now get `datasets` (new optional `SceneProps.datasets`), so they draw real figures with
  `lookup()`. No other change to Stage.
- `Effects.tsx`: the DCF chapter rail is now Inputs · Drivers · Cash flow · Discounting · Value · Three rates ·
  Summary · Priced in.
- `fallback/build.py`: `dcf-summary` gets a label/value grid on the static page (`dcf_summary_grid`).

## Script changes that touch your graphics
- `already-doing` moved after `space-race` (Mi'kael), with the four-point restructure from your prompt: Science,
  Healthcare (drug + Sweden in one point), Farming (Deere), Data centres (Ecolab). All four panels now zoom.
- `dcf-bridge` has two new text points: TV share of EV (after "everything after") and "No net debt" (after the
  net-cash zoom). The zooms are unchanged.
- Value per share now uses 24.186bn diluted shares (base $389.99), and the three rates are 10.55 / 14.45 / 15.4.

## Things I could not check
- The real projector size. I checked at 1600×900 only.
- `dcf-worksheet` has no new scene. The summary's cash-flow tile shows the discounting instead.
