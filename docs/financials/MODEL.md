# The valuation spreadsheet: `data/model/NVDA_DCF.xlsx`

**Open it** in Excel, Numbers or Google Sheets. No macros, nothing hidden. Every answer is a live formula.

**Change an input.** Go to `Inputs` and change any **blue** number; black numbers are formulas, so leave them alone.
- `B6`: scenario shown on the DCF sheet (1 bear, 2 base, 3 bull).
- `B7`: discount rate (1 = Bloomberg's, our headline; 2 = the 10.55% US-semiconductor average (Damodaran, Jan 2026)).
- `B10`: share price. On pitch morning, change it here **and** in `assumptions.json` (below), so slides and sheet agree.

**The nine sheets**
| Sheet | What it is for |
|---|---|
| Start here | The answer in one sentence, how to use the file, what would change our mind |
| Financials | Simplified financials: FY22–FY26 actuals plus analysts' FY27E/FY28E: sales, growth, Data Center share, margins, operating profit, free cash flow; last four quarters' profit per share v analysts; EV ÷ EBITDA v rivals |
| Inputs | Every assumption with its unit, source and date |
| Simple DCF | The paper version: base case, five whole years (1 to 5), discount factor 1 ÷ (1 + WACC) ^ year. Linked to Inputs. About 3.5% above the detailed DCF because whole years are discounted less than the real dates |
| DCF | The detailed version we quote: exact dates, three scenarios together |
| Sensitivity | Base-case value per share for other discount rates and long-run growth rates |
| Reverse DCF | Appendix. What yearly sales growth the share price already needs (15 formulas) |
| Peers | Appendix. NVIDIA's P/E against AMD, Intel, Broadcom, TSMC (NVIDIA's own P/E now moves with the price on Inputs; 14 formulas) |
| Checks | TRUE/FALSE. Top block: matches the slides. Bottom block: the sums hold (must stay TRUE), including "Simple DCF within 10% of the detailed" |

**Price on 23 Nov 2026 (read this).** `assumptions.json` carries a price override of **$163.66** (Yahoo Finance, intraday 23 Nov 12:51 ET, after the reinstatement jump; the Bloomberg 20 Nov price was $135.46). On pitch morning put that morning's price in `priceOverride.value`, run `npm run data` then `npm run xlsx`. At $163.66: base $167.50 (+2%), bull $185.74 (+13%), bear $31.40 (−81%); the price needs 38.1% yearly sales growth FY28–FY32 against base 35.5%. Market cap and EV on Inputs are still Bloomberg 20 Nov (only their difference, net cash, is used).

**Rebuild it** (throws away changes made in the spreadsheet). In `app/`:
1. Edit `data/model/assumptions.json`, then `npm run data` (updates the slides' numbers).
2. `npm run xlsx` (writes the spreadsheet; needs LibreOffice, which is free).
3. `npx tsx scripts/xlsx-check.ts` (recalculates it, compares it with the slides, flips both switches; must say PASS).

**What it leaves out, so nobody is surprised**
- The rest of FY27: the first cash counted is FY28's. Cash is assumed to arrive at each year end. Both make the value a little lower.
- Share buybacks, new shares and the cost of paying staff in shares. The share count stays where it is today.
- Bull has the same sales as base; only the margin differs. No scenario prices power, water or regulation limits.
- Bloomberg's WACC export gives the cost of equity but not the risk-free rate or beta behind it, so there is no CAPM rebuild.
  That page also uses an older, larger market value than Bloomberg's DES page; with today's it would be 19.23% (see AUDIT.md).
- The reverse DCF table only reaches growth rates from 20% to 45%. If you move the price or the discount rate a lot, it says "outside table"; widen the blue growth rates in its column A.
