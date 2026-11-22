# The valuation spreadsheet: `data/model/NVDA_DCF.xlsx`

**Open it** in Excel, Numbers or Google Sheets. No macros, nothing hidden. Every answer is a live formula.

**Change an input.** Go to `Inputs` and change any **blue** number; black numbers are formulas, so leave them alone.
- `B6`: scenario shown on the DCF sheet (1 bear, 2 base, 3 bull).
- `B7`: discount rate (1 = Bloomberg's, our headline; 2 = the 12% our first model used).
- `B10`: share price. On pitch morning, change it here **and** in `assumptions.json` (below), so slides and sheet agree.

**The five sheets**
| Sheet | What it is for |
|---|---|
| Start here | The answer in one sentence, how to use the file, what would change our mind |
| Inputs | Every assumption with its unit, source and date |
| DCF | Growth → revenue → cash → today's money → value per share, then all three scenarios together |
| Sensitivity | Base-case value per share for other discount rates and long-run growth rates |
| Checks | TRUE/FALSE. Top block: matches the slides (turns FALSE if you change an input; that is fine). Bottom block: the sums hold (must stay TRUE) |

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
- The peer P/E check and the reverse DCF are on the slides, not in this file.
