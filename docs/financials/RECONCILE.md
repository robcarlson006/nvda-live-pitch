# DCF reconciliation: model export, workbook and Bloomberg inputs (24 Nov 2026, late evening)

**Which numbers the board sees.** The stage, the Q&A bank and the offline backup read `data/clean/model_*.json`, written by `app/scripts/model.ts` from `data/model/assumptions.json` and the Bloomberg exports. `data/model/valuation.csv` is the same run printed for Excel. The workbook `data/model/NVDA_DCF.xlsx` is **stale** (built 23 Nov) and must not be quoted until it is rebuilt.

## 1. Model export against the Bloomberg inputs

Re-running `npx tsx scripts/model.ts` on this branch changes nothing in `data/clean` except the two additions listed in section 4.

| Input | Model export | Bloomberg source | Agrees |
|---|---|---|---|
| Shares outstanding | 24.1bn | DES, 20 Nov 2026 (`nvda_des_2026-11-20.pdf`, "Curr Shares Out") | Yes |
| Net cash | $59.6bn | DES: market cap $3,264.6bn − EV $3,205bn | Yes |
| FY27 / FY28 revenue consensus | $422.222bn / $728.636bn | FA consensus, 20 Nov 2026 | Yes |
| FY26 revenue | $215.938bn | FA annual | Yes |
| FCF margin | 45.25% (average FY24–FY26) | FA annual FCF ÷ revenue | Yes |
| Bloomberg WACC | 15.4% (Q3 2026, team-confirmed) | The 20 Nov WACC screen PDF shows 19.3%; the team uses 15.4% | **Team judgement**, recorded in `assumptions.json` |

## 2. Model export against the workbook

| Item | Model export (current) | Workbook (23 Nov) |
|---|---|---|
| Share price | $152.85 (team input, 24 Nov) | $164.39 |
| Rates | 10.55% / 14.45% / 15.4% | 19.3% (Bloomberg screen) or 10.55% |
| Bear case | rivals take share: growth +10/−5/+10/+7/+4%, margin 38.8% → $101.56 | old "AI pause" shape → $31.40 at 19.3% |
| "If AI ended for good" | $64.41 | not in the workbook |
| Base, same inputs at 19.3% | **$167.50** | **$167.50** (EV $3,977.24bn in both) |

The engine reconciles: given the workbook's rate, the current model reproduces the workbook's base value to the cent. Every difference on the slides comes from the price, the rate choice and the new bear shape, not from arithmetic. The rebuild script (`docs/financials/xlsx.ts.txt`) needs LibreOffice, which this Mac lacks, and still encodes the old bear shape. **Before anyone hands the workbook to the board:** port the bear and "If AI ended for good" scenarios into `xlsx.ts`, rebuild on a machine with LibreOffice, then run `xlsx-check`.

## 3. Bridge from the round-one target

The round-one target was **$232 at an 11.1% discount rate** (team-reported in `docs/PROGRESS.md`; the round-one model is not in this repository). With today's inputs:

| Step | Value per share | Change |
|---|---:|---:|
| Round-one target, 11.1% | $232.00 | |
| Today's inputs (Q3 beat, Bloomberg 20 Nov consensus and margin), still at 11.1% | $362.84 | **+$130.84** |
| Move to the 10.55% industry rate | $391.38 | **+$28.54** |

About 82% of the move comes from inputs and 18% from the rate, in this order. If the rate is applied first, the split changes. The inputs step cannot be divided further without the round-one model file. The bridge is in `data/clean/model_target_bridge.json` (marked `verified: false` because $232 and 11.1% are team-reported). The `target-revision` prepared answer shows it as a waterfall. For comparison, the same base case was $323.72 at 12% on 20 Nov: the operating inputs have not changed since that Bloomberg export.

## 4. Changes made on 24 Nov (Claude Code lane)

- `model_three_rates`: the series `Upside to today` was a percentage stored with the dataset unit USD. It is renamed to **`Above reference price`** with unit `%` (156.06% / 62.7% / 48.96%). No other value moved.
- New `model_target_bridge` (section 3).
- The `three-rates` slide is now the **DCF summary table**: rate, value per share, enterprise value, % above the reference price, with "Reference share price: $152.85, as of 2026-11-24" under it.
- The stress slide (`ai-ended`) now says "Stock downside: −57.86%, to $64.41 per share" and "Portfolio loss: 1.74% at a 3% position", matching the bear-case slide. Stock downside and portfolio loss stay separate lines on both.

## 5. Reference price: not verified, not changed

`$152.85` (24 Nov) is a team input. On 24 Nov evening a web check found **no consistent close**: quotes for 24 Nov ranged from $151.05 to $165.05 across Yahoo Finance (two regional pages disagreed), Stock Analysis, Benzinga (13:05 EST, intraday) and Public.com, several captured before the close. Because no named source with a timestamp settled it, the price was left unchanged.

**Pitch morning:** take the 24 Nov close from Nasdaq's NVDA historical data (or the live quote with its time), write it and the source into `priceOverride` in `assumptions.json`, then follow `PRICE.md`: `npx tsx scripts/research-data.ts && npx tsx scripts/model.ts`, re-read the spoken rounded figures (`dcf-bridge`, `three-rates`, `reverse-dcf`, `bear-case`, `ai-ended`, `recommendation`), regenerate the backup, run the tests.
