# Changing the share price right before the pitch

> **24 Nov 2026:** the override is now **$165.05** (Google Finance) and `npm run price` / `npm run xlsx` are not in `app/package.json`. Edit `priceOverride.value` in `data/model/assumptions.json` by hand, then run `npm run data` in `app/`. The slide text that is spoken in words (position loss "under two percent / two and a quarter", `say` lines with dollar values) does NOT update itself: re-read the `valuation`, `analysts` and `recommendation` slides after a price change. NVIDIA's forward P/E on the peers slide re-prices automatically.

One number drives everything: the share price. It lives in `data/model/assumptions.json` (`priceOverride.value`). The slides, the charts behind them and the spreadsheet all read it from there.

## The two-minute routine (from the `app/` folder)

Option A, type it:

```bash
npm run price -- 164.39
```

Option B, type it in the spreadsheet: open `data/model/NVDA_DCF.xlsx`, go to **Inputs**, change the blue cell **B10** (Share price), save, close the file, then:

```bash
npm run price
```

Either way the command then: saves the price, rebuilds the data (`npm run data`), rebuilds the spreadsheet (`npm run xlsx`), and runs the spreadsheet checks (`xlsx-check`). It prints PASS when everything agrees. **Restart the app server afterwards** so the slides pick it up.

Typing in B10 on its own changes only the spreadsheet you are looking at, not the slides. Use the command to push it to the slides.

## What moves with the price

| Moves | Does not move |
|---|---|
| "Share price today" bar on the valuation slide, and each case's % v price | Bear, base and bull values per share ($31.40, $167.50, $185.74): they depend on cash flows, not on price |
| The reverse-DCF slide (growth the price already needs) | Bloomberg's rivals' multiples (AMD, Intel, Broadcom, TSMC): 20 Nov |
| NVIDIA's P/E, PEG and EV ÷ EBITDA against rivals (re-struck at the new price) | Revenue, margins, ESG figures |
| The spreadsheet: every sheet | |

## Things to say differently if the price moves a lot

- At **$164.39** the base case ($167.50) is about **2% above** the price. Above about $167.50 the base case says "expensive".
- Panshul's line "level with our base case" and the "fair price" verdict in `docs/script/pitch-script-v1.md` are written for a price near $164.
- The reverse-DCF table only reaches certain prices: if the check "Share price is inside the Reverse DCF table" turns FALSE, widen the blue growth rates on that sheet.

## Last set

$164.39 (team, 23 Nov 2026). Bloomberg's own price in the 20 Nov export was $135.46; set `priceOverride.value` to `null` to go back to it.
