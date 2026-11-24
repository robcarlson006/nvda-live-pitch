/**
 * NVIDIA valuation model. Deliberately simple enough for three students to explain line by line.
 *   1. Five-year DCF on free cash flow (FY28–FY32), three scenarios.
 *   2. Sensitivity: value per share across discount rates × terminal growth.
 *   3. Reverse DCF: the growth rate today's share price already assumes.
 *   4. Cross-check: peer median forward P/E × NVIDIA's expected EPS.
 * Data inputs come from Bloomberg (data/clean + DES/WACC PDFs). Choices live in data/model/assumptions.json.
 * Run: npm run data   Output: data/clean/model_*.json (for slides) and data/model/valuation.csv (for Excel).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Dataset } from '../shared/schema.ts';
import { pdfText } from './fa-parse.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CLEAN = path.join(ROOT, 'data/clean');
const MODEL = path.join(ROOT, 'data/model');
const read = (key: string): Dataset => JSON.parse(fs.readFileSync(path.join(CLEAN, `${key}.json`), 'utf8'));
const r2 = (v: number) => Math.round(v * 100) / 100;

// ---------- pure maths (tested in model.test.ts) ----------
export type Inputs = { rev27: number; path: number[]; margin: number; wacc: number; g: number; netCash: number; shares: number; t: number[] };

/** Discounted value per share. path = revenue for FY28..FY32 (USD bn); t = years from valuation date to each year end. */
export function dcf(i: Omit<Inputs, 'rev27'>) {
  const w = i.wacc / 100;
  const g = i.g / 100;
  const fcf = i.path.map((r) => r * i.margin);
  const discount = i.t.map((years) => 1 / (1 + w) ** years);
  const pv = fcf.map((f, k) => f * discount[k]);
  const tv = (fcf.at(-1)! * (1 + g)) / (w - g);
  const pvTv = tv * discount.at(-1)!;
  const ev = pv.reduce((a, b) => a + b, 0) + pvTv;
  return { fcf, discount, pv, tv, pvTv, ev, equity: ev + i.netCash, perShare: (ev + i.netCash) / i.shares };
}

export const grow = (start: number, rates: number[]) => rates.reduce<number[]>((acc, g) => [...acc, (acc.at(-1) ?? start) * (1 + g / 100)], []);

/** The constant yearly revenue growth (FY28–FY32, %) at which the DCF equals the share price. */
export function impliedGrowth(i: Omit<Inputs, 'path'>, price: number): number {
  let lo = -50;
  let hi = 200;
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2;
    const v = dcf({ ...i, path: grow(i.rev27, Array(5).fill(mid)) }).perShare;
    if (v > price) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

// ---------- inputs from Bloomberg ----------
function main() {
  const A = JSON.parse(fs.readFileSync(path.join(MODEL, 'assumptions.json'), 'utf8'));
  const des = pdfText(path.join(ROOT, 'data/bloomberg-raw/nvda_des_2026-11-20.pdf'), { plain: true });
  const waccPdf = pdfText(path.join(ROOT, 'data/bloomberg-raw/nvda_wacc_2026-11-20.pdf'), { plain: true });
  const num = (text: string, re: RegExp) => {
    const m = text.match(re);
    if (!m) throw new Error(`Snapshot value not found: ${re}`);
    return Number(m[1].replace(/,/g, ''));
  };
  const valuationDate = '2026-11-20';
  const desPrice = num(des, /Last Px\s+USD\/([\d.]+)/);
  const price: number = A.priceOverride.value ?? desPrice;
  const basicShares = num(des, /Curr Shares Out\s+([\d.]+)B/); // bn, basic (reference only)
  // Diluted shares: basic shares plus the employee options and stock awards that will become shares. Bloomberg FA
  // quarterly, "Diluted Weighted Avg Shares", fiscal Q3 FY27 (quarter to 25 Oct 2026). The value per share uses this.
  const faQ = pdfText(path.join(ROOT, 'data/bloomberg-raw/nvda_fa_quarterly_FY24Q3-FY27Q3.pdf'), { plain: true });
  // Each "Diluted Weighted Avg" row belongs to the nearest column header above it; use the page whose header has Q3 FY27.
  let shares = NaN;
  for (const m of faQ.matchAll(/Diluted Weighted Avg\s+((?:[\d,]+\.\d+[ \t]+)*[\d,]+\.\d+)/g)) {
    const headAt = faQ.lastIndexOf('Original:', m.index);
    const head = faQ.slice(faQ.lastIndexOf('\n', headAt) + 1, faQ.indexOf('\n', headAt));
    const col = (head.match(/(Original|Restated|Preliminary):\d{4} Q\d/g) ?? []).indexOf('Preliminary:2027 Q3');
    if (col >= 0) { shares = Number(m[1].trim().split(/\s+/)[col].replace(/,/g, '')) / 1000; break; } // millions → bn; first = income statement
  }
  if (!Number.isFinite(shares)) throw new Error('Diluted shares not found in the Bloomberg FA quarterly export');
  if (shares < basicShares || shares > basicShares * 1.03) throw new Error(`Diluted shares ${shares}bn look wrong against basic ${basicShares}bn`);
  const mktCap = num(des, /~ Mkt Cap\s+([\d,.]+)B/);
  const ev = num(des, /Curr EV\s+([\d,.]+)B/);
  const netCash = mktCap - ev; // USD bn; DES EV = market cap + debt − cash
  const eps27 = num(des, /Est EPS\s+([\d.]+)/);
  const bbgScreen = num(waccPdf, /WACC\s+([\d.]+)%/); // 20 Nov screen: reference only, never shown
  const bbgWacc: number = A.bloombergWacc?.value ?? bbgScreen; // Bloomberg WACC, Q3 2026 (team-confirmed)

  const fc = read('nvda_revenue_forecast');
  const at = (s: string, x: string) => fc.series[s][fc.x.indexOf(x)]!;
  const rev27 = at('Consensus estimate', 'FY27');
  const rev28 = at('Consensus estimate', 'FY28');
  const revA = read('nvda_revenue_annual');
  const fcfA = read('nvda_fcf_annual');
  const marginYears: string[] = A.fcfMarginYears.value;
  const baseMargin = marginYears.map((y) => fcfA.series['Free cash flow'][fcfA.x.indexOf(y)]! / revA.series.Revenue[revA.x.indexOf(y)]!).reduce((a, b) => a + b) / marginYears.length;

  const years = ['FY28', 'FY29', 'FY30', 'FY31', 'FY32'];
  const t = years.map((y) => (Date.UTC(2000 + Number(y.slice(2)), 0, 31) - Date.parse(valuationDate)) / (365.25 * 864e5));
  const wacc: number = A.wacc.value === 'bloomberg' ? bbgWacc : A.wacc.value;
  const g: number = A.terminalGrowth.value;

  const scenarioPath = (s: { fy28: string; growth?: number[] }) => {
    if (s.fy28 === 'custom') {
      if (s.growth?.length !== 5) throw new Error('A custom scenario needs five yearly growth rates (FY28–FY32).');
      return grow(rev27, s.growth);
    }
    if (s.fy28 === 'flat') return grow(rev27, [0, ...s.growth!]);
    const g28 = (rev28 / rev27 - 1) * 100;
    return grow(rev27, [g28, ...[1, 2, 3, 4].map((k) => g28 + ((g - g28) * k) / 4)]);
  };
  const results = Object.fromEntries(
    Object.entries(A.scenarios).map(([name, s]: [string, any]) => {
      const p = scenarioPath(s);
      // marginOverride = an absolute free-cash-flow margin in % (must be sourced in `why`); otherwise a shift on the base margin
      const margin = s.marginOverride != null ? s.marginOverride / 100 : baseMargin + s.marginShift / 100;
      return [name, { label: s.label, path: p, margin, ...dcf({ path: p, margin, wacc, g, netCash, shares, t }) }];
    }),
  ) as Record<string, { label: string; path: number[]; margin: number } & ReturnType<typeof dcf>>;

  // The three rates the pitch shows: Damodaran US semiconductor average 10.55%, Google Finance 14.45%, Bloomberg 15.4% (assumptions.json)
  const waccs = [...new Set([...(A.discountRates.value as number[]), wacc])].sort((a, b) => a - b);
  const MAX_SHOWN = 15.4; // nothing above this reaches the board
  if (waccs.some((w) => w > MAX_SHOWN)) throw new Error(`A discount rate above ${MAX_SHOWN}% would reach the slides: ${waccs}`);
  const gs = [2, 3, 4];
  const sens = gs.map((gg) => waccs.map((w) => r2(dcf({ path: results.base.path, margin: baseMargin, wacc: w, g: gg, netCash, shares, t }).perShare)));
  const implied = impliedGrowth({ rev27, margin: baseMargin, wacc, g, netCash, shares, t }, price);
  const baseCagr = ((results.base.path.at(-1)! / rev27) ** (1 / 5) - 1) * 100;

  const peerPe = read('peers_pe');
  const peerFwd = peerPe.series['Forward P/E'].filter((_, i) => peerPe.x[i] !== 'NVIDIA').map(Number).sort((a, b) => a - b);
  const peerMedian = (peerFwd[1] + peerFwd[2]) / 2;
  const peerValue = peerMedian * eps27;

  // NVIDIA's forward P/E moves with the share price, but the Bloomberg export is from 20 Nov. When the team sets a newer price,
  // re-price NVIDIA's forward P/E (price ÷ consensus FY27 EPS) so the peers slide matches the valuation slide. The other
  // companies stay at Bloomberg's 20 Nov prices. build-data.ts rewrites this file from Bloomberg first, so this is repeatable.
  if (A.priceOverride.value != null) {
    const i = peerPe.x.indexOf('NVIDIA');
    const repriced: Dataset = {
      ...peerPe,
      series: { ...peerPe.series, 'Forward P/E': peerPe.series['Forward P/E'].map((v, k) => (k === i ? r2(price / eps27) : v)) },
      source: `${peerPe.source.replace(/\. NVIDIA forward P\/E re-priced.*$/, '')}. NVIDIA forward P/E re-priced at $${price} (${A.priceOverride.why.split('.')[0]}) over consensus FY27 EPS $${eps27}; the other companies stay at Bloomberg's 20 Nov prices`,
    };
    fs.writeFileSync(path.join(CLEAN, 'peers_pe.json'), JSON.stringify(Dataset.parse(repriced), null, 2) + '\n');
  }

  // ---------- datasets for slides ----------
  const source = 'Team valuation model (data/model/assumptions.json) on Bloomberg FA, DES and consensus data';
  // The datasets are dated with the share price they use (the override date, else the Bloomberg snapshot).
  const asOf: string = A.priceOverride.value != null ? (A.priceOverride.asOf ?? valuationDate) : valuationDate;
  const write = (d: Omit<Dataset, 'placeholder' | 'asOf'>, date = asOf) => fs.writeFileSync(path.join(CLEAN, `${d.key}.json`), JSON.stringify(Dataset.parse({ ...d, asOf: date, placeholder: false }), null, 2) + '\n');
  write({
    key: 'model_valuation', title: 'What one NVIDIA share is worth', unit: 'USD', source: `${source}. WACC ${wacc}%, terminal growth ${g}%. Share price $${price}`,
    x: ['Share price today', 'If AI ended for good', 'Bear case', 'Base case', 'Bull case', 'Peer P/E check'],
    series: { 'Value per share': [price, results.stress.perShare, results.bear.perShare, results.base.perShare, results.bull.perShare, peerValue].map(r2) },
  });
  write({
    key: 'model_revenue_paths', title: 'Revenue paths in the model', unit: 'USD bn', source: `${source}. FY27 = consensus`,
    x: ['FY26', 'FY27', ...years],
    series: Object.fromEntries(['stress', 'bear', 'base', 'bull'].map((n) => [results[n].label.split(':')[0], [revA.series.Revenue.at(-1)!, rev27, ...results[n].path].map(r2)])),
  });
  // Our values against the sell-side targets (Google Finance, 24 Nov 2026). Targets come from research_market; our values from the model above.
  const mkt = read('research_market');
  const mfact = (k: string) => mkt.series[k][0]!;
  write({
    key: 'model_vs_analysts', title: 'Our values against analysts’ 12-month price targets', unit: 'USD',
    source: `${source}. Analyst targets: ${mkt.seriesSources?.['Analyst target, average'] ?? mkt.source}. Share price $${price}`,
    x: ['Our bear case', 'Lowest target', 'Price today', 'Average target', 'Our base case', 'Highest target'],
    series: { 'Value per share': [results.bear.perShare, mfact('Analyst target, lowest'), price, mfact('Analyst target, average'), results.base.perShare, mfact('Analyst target, highest')].map(r2) },
  });
  write({
    key: 'model_sensitivity', title: 'Base-case value per share by discount rate', unit: 'USD', source: `${source}. ${wacc}% = Damodaran US semiconductor average (Jan 2026); 14.45% = Google Finance (24 Nov 2026); ${bbgWacc}% = Bloomberg WACC (Q3 2026)`,
    x: waccs.map((w) => `${w}%`),
    series: Object.fromEntries(gs.map((gg, i) => [`Terminal growth ${gg}%`, sens[i]])),
  });
  write({
    key: 'model_implied_growth', title: 'Yearly revenue growth FY28–FY32', unit: '%', source: `${source}. Reverse DCF at $${price}`,
    x: ['Priced in today', 'Base case (consensus, then slowing)'],
    series: { 'Growth per year': [r2(implied), r2(baseCagr)] },
  });

  // ---------- the DCF, step by step (finance section) ----------
  const fact = (k: string) => mkt.series[k][0]!;
  const gfWacc = fact('WACC, Google Finance');
  const damo = fact('WACC, US semiconductor industry average (Damodaran)');
  if (Math.abs(gfWacc - 14.45) > 1e-9 || Math.abs(damo - wacc) > 1e-9 || Math.abs(fact('WACC, Bloomberg Q3 2026') - bbgWacc) > 1e-9)
    throw new Error('research_market discount rates do not match assumptions.json');
  if (Math.abs(fact('Share price') - price) > 1e-9) throw new Error(`research_market share price ${fact('Share price')} ≠ assumptions.json price ${price}`);
  const BBG = 'Bloomberg FA and DES, NVDA US Equity, 20 Nov 2026';
  const marg = read('nvda_margins_annual');
  const opMargin26 = marg.series['Operating margin'][marg.x.indexOf('FY26')]!;
  const inputs: Record<string, { v: number; unit: string; src: string }> = {
    'FY26 revenue': { v: revA.series.Revenue.at(-1)!, unit: 'USD bn', src: 'Bloomberg FA, NVDA annual, 20 Nov 2026' },
    'FY27 revenue, analyst consensus': { v: rev27, unit: 'USD bn', src: 'Bloomberg consensus (FA/DES), 20 Nov 2026' },
    'FY28 revenue, analyst consensus': { v: rev28, unit: 'USD bn', src: 'Bloomberg consensus (FA/DES), 20 Nov 2026' },
    'Free-cash-flow margin, FY24–26 average': { v: r2(baseMargin * 100), unit: '%', src: `Bloomberg FA: free cash flow ÷ revenue, average of ${marginYears.join(', ')}` },
    'Diluted shares': { v: Math.round(shares * 1000) / 1000, unit: 'bn', src: 'Bloomberg FA quarterly, diluted weighted average shares, Q3 FY27 (quarter to 25 Oct 2026); DES shows 24.1bn basic' },
    'Net cash': { v: r2(netCash), unit: 'USD bn', src: 'Bloomberg DES, 20 Nov 2026: market cap minus enterprise value' },
    'WACC, Bloomberg': { v: bbgWacc, unit: '%', src: 'Bloomberg WACC, Q3 2026' },
    'Share price': { v: price, unit: 'USD', src: mkt.seriesSources?.['Share price'] ?? 'Google Finance, 24 Nov 2026' },
    'WACC, Google Finance': { v: gfWacc, unit: '%', src: 'Google Finance, NVDA, 24 Nov 2026' },
    'WACC, US semiconductor industry average': { v: damo, unit: '%', src: 'Damodaran (NYU), US semiconductor industry average, January 2026' },
    'Terminal growth (our choice)': { v: g, unit: '%', src: 'Our choice: long-run growth after FY32, about nominal world GDP growth' },
    'Growth fades in a straight line to terminal growth by (our choice)': { v: 2032, unit: 'year', src: 'Our choice: growth after FY28 consensus fades in a straight line to 3% by FY32' },
  };
  write({
    key: 'model_dcf_inputs', title: 'Every input to our DCF, and where it comes from', unit: '',
    units: Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, v.unit])),
    source: `${BBG}; Google Finance, 24 Nov 2026; Damodaran (NYU), January 2026; our two choices in data/model/assumptions.json`,
    seriesSources: Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, v.src])),
    x: ['value'],
    series: Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, [v.v]])),
  });
  // The DCF on one page: the headline outputs the board expects, all at the 10.55% headline rate.
  const hb = results.base;
  const tnS = (v: number) => Math.round(v * 10) / 1e4; // USD bn → USD tn, 4 decimals (shown as 2)
  const summary: Record<string, { v: number; unit: string; src: string }> = {
    'Forecast period': { v: years.length, unit: 'years', src: 'Team model: FY28 to FY32; FY27, the current year, is not counted' },
    'Revenue CAGR, FY27–32': { v: r2(baseCagr), unit: '%', src: 'Team model: base-case revenue, FY27 consensus to FY32, compound yearly growth' },
    'EBIT margin, FY26': { v: opMargin26, unit: '%', src: 'Bloomberg FA (Profitability), operating margin, FY26' },
    'Free-cash-flow margin': { v: r2(baseMargin * 100), unit: '%', src: `Bloomberg FA: average of ${marginYears.join(', ')}; the margin the DCF uses` },
    'PV of FCFs': { v: tnS(hb.pv.reduce((a, c) => a + c, 0)), unit: 'USD tn', src: `${source}, ${wacc}% WACC` },
    'PV of terminal value': { v: tnS(hb.pvTv), unit: 'USD tn', src: `${source}, ${wacc}% WACC, ${g}% terminal growth` },
    'Terminal value share of EV': { v: r2((hb.pvTv / hb.ev) * 100), unit: '%', src: `${source}: PV of terminal value ÷ enterprise value` },
    'Enterprise value': { v: tnS(hb.ev), unit: 'USD tn', src: `${source}, ${wacc}% WACC` },
    'Net debt': { v: r2(-netCash), unit: 'USD bn', src: 'Bloomberg DES, 20 Nov 2026: enterprise value minus market cap (negative = net cash)' },
    'Equity value': { v: tnS(hb.equity), unit: 'USD tn', src: `${source}: enterprise value + net cash` },
    'Diluted shares': { v: Math.round(shares * 1000) / 1000, unit: 'bn', src: 'Bloomberg FA quarterly, diluted weighted average shares, Q3 FY27' },
    'Implied share price': { v: r2(hb.perShare), unit: 'USD', src: `${source}: equity value ÷ diluted shares` },
    'Share price': { v: price, unit: 'USD', src: inputs['Share price'].src },
    'Upside': { v: r2((hb.perShare / price - 1) * 100), unit: '%', src: `${source}: implied price ÷ share price − 1` },
  };
  write({
    key: 'model_dcf_summary', title: 'The DCF on one page (base case, 10.55% WACC)', unit: '',
    units: Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, v.unit])),
    source: `${source}. Base case at ${wacc}% WACC, ${g}% terminal growth; share price $${price}`,
    seriesSources: Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, v.src])),
    x: ['value'],
    series: Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, [v.v]])),
  });
  const histYears = fcfA.x.filter((y) => Number(y.slice(2)) >= 20);
  write({
    key: 'model_fcf_forecast', title: 'Free cash flow: actual, then our base case', unit: 'USD bn',
    source: `Actual: Bloomberg FA (nvda_fcf_annual). Forecast: ${source}; consensus revenue × ${r2(baseMargin * 100)}% average margin. FY27, the current year, is not discounted`,
    x: [...histYears, ...years],
    series: {
      Actual: [...histYears.map((y) => fcfA.series['Free cash flow'][fcfA.x.indexOf(y)]), ...years.map(() => null)],
      'Base-case forecast': [...histYears.map(() => null), ...results.base.fcf.map(r2)],
    },
  });
  const base = results.base;
  write({
    key: 'model_dcf_detail', title: 'Base-case cash flows, USD billions', unit: '',
    source: `${source}. Base case using ${wacc}% WACC; revenue and cash flow in USD billions`,
    x: ['Revenue', 'Free cash flow', 'Discount factor', 'Present value of cash flow'],
    series: Object.fromEntries(years.map((year, k) => [
      year, [r2(base.path[k]), r2(base.fcf[k]), Number(base.discount[k].toFixed(4)), r2(base.pv[k])],
    ])),
  }, valuationDate);
  // Bridge at each of the three rates, in USD tn: PV of FY28–32 cash flow + PV of terminal value = EV; + net cash = equity.
  const tn = (v: number) => Math.round(v * 10) / 1e4; // USD bn → USD tn, 3 decimals
  const bridgeAt = waccs.map((w) => dcf({ path: results.base.path, margin: baseMargin, wacc: w, g, netCash, shares, t }));
  const rateName = (w: number) => `${w}%`;
  write({
    key: 'model_dcf_bridge', title: 'From cash flow to value per share (base case)', unit: 'USD tn',
    units: { 'Value per share': 'USD' },
    source: `${source}. Base case; terminal growth ${g}%; net cash $${r2(netCash)}bn; ${Math.round(shares * 1000) / 1000}bn diluted shares. Rates: ${waccs.map(rateName).join(', ')}`,
    x: ['PV of FY28–32 cash flow', 'PV of terminal value', 'Enterprise value', 'Net cash', 'Equity value'],
    series: Object.fromEntries(waccs.map((w, k) => {
      const b = bridgeAt[k];
      return [rateName(w), [tn(b.pv.reduce((a, c) => a + c, 0)), tn(b.pvTv), tn(b.ev), tn(netCash), tn(b.equity)]];
    })),
  });
  write({
    key: 'model_three_rates', title: 'Base-case value per share at three discount rates', unit: 'USD',
    units: { 'Enterprise value': 'USD tn', 'Above reference price': '%', 'Terminal value share of EV': '%' },
    source: `${source}. ${wacc}%: Damodaran US semiconductor average (Jan 2026); ${gfWacc}%: Google Finance (24 Nov 2026); ${bbgWacc}%: Bloomberg WACC (Q3 2026). Share price $${price}`,
    seriesSources: { 'Value per share': `${source}. Share price $${price}` },
    x: [`${damo}% industry (Damodaran)`, `${gfWacc}% Google Finance`, `${bbgWacc}% Bloomberg`],
    series: {
      'Value per share': [damo, gfWacc, bbgWacc].map((w) => r2(bridgeAt[waccs.indexOf(w)].perShare)),
      'Enterprise value': [damo, gfWacc, bbgWacc].map((w) => Math.round(bridgeAt[waccs.indexOf(w)].ev / 10) / 100),
      'Share price today': [price, price, price],
      // Per cent above the dated reference price (a %, not dollars: the old name 'Upside to today' was formatted as USD).
      'Above reference price': [damo, gfWacc, bbgWacc].map((w) => r2((bridgeAt[waccs.indexOf(w)].perShare / price - 1) * 100)),
      // How much of enterprise value comes from the years after FY32 (the terminal value).
      'Terminal value share of EV': [damo, gfWacc, bbgWacc].map((w) => r2((bridgeAt[waccs.indexOf(w)].pvTv / bridgeAt[waccs.indexOf(w)].ev) * 100)),
    },
  });
  // Bridge from the round-one target (team-reported, not in this repo) to today's base case, in two steps:
  // today's inputs at round one's rate, then the move to today's rate. Order matters: rate first gives a different split.
  if (A.priorTarget?.value != null) {
    const pt: { value: number; wacc: number } = A.priorTarget;
    const atOldRate = r2(dcf({ path: results.base.path, margin: baseMargin, wacc: pt.wacc, g, netCash, shares, t }).perShare);
    const now = r2(results.base.perShare);
    write({
      key: 'model_target_bridge', title: "From our round-one target to today's base case", unit: 'USD',
      units: { 'Discount rate': '%' },
      source: `Round-one target $${pt.value} at ${pt.wacc}% (team-reported, docs/PROGRESS.md; round-one model not in repo); ${source}, base case at ${wacc}%`,
      verified: false,
      x: ['Round-one target', 'Updated inputs, same rate', 'Discount rate change', 'Base case today'],
      series: {
        'Value per share': [pt.value, r2(atOldRate - pt.value), r2(now - atOldRate), now],
        'Discount rate': [pt.wacc, pt.wacc, wacc, wacc],
      },
    });
  }
  // A 3% position: what each downside case would cost the whole portfolio.
  const pos: number = A.position.value;
  write({
    key: 'model_downside', title: 'The two downside cases', unit: 'USD',
    units: { 'Change from today': '%', 'Cost to the portfolio': '%', 'Position size': '%' },
    source: `${source}. Share price $${price}; a ${pos}% position`,
    x: ['Bear case', 'If AI ended for good'],
    series: {
      'Value per share': [results.bear.perShare, results.stress.perShare].map(r2),
      'Change from today': [results.bear.perShare, results.stress.perShare].map((v) => r2((v / price - 1) * 100)),
      'Cost to the portfolio': [results.bear.perShare, results.stress.perShare].map((v) => r2(Math.max(0, (1 - v / price) * pos))),
      'Position size': [pos, pos],
    },
  });
  // Revenue paths for each downside case against the base case (one chart per case, never merged).
  for (const [key, n, title] of [['model_path_bear', 'bear', 'Bear case: rivals take share, a year of paused spending'], ['model_path_ai_ended', 'stress', 'If AI ended for good: revenue']] as const) {
    write({
      key, title, unit: 'USD bn', source: `${source}. FY26 actual, FY27 consensus`,
      x: ['FY26', 'FY27', ...years],
      series: { 'Base case': [revA.series.Revenue.at(-1)!, rev27, ...results.base.path].map(r2), [n === 'bear' ? 'Bear case' : 'If AI ended for good']: [revA.series.Revenue.at(-1)!, rev27, ...results[n].path].map(r2) },
    });
  }

  // ---------- CSV for Excel ----------
  const L: (string | number)[][] = [];
  L.push(['NVIDIA valuation model', `valuation date ${valuationDate}`]);
  L.push([]);
  L.push(['INPUT', 'VALUE', 'SOURCE']);
  L.push(['Share price (USD)', price, A.priceOverride.value ? `Team override (assumptions.json): ${A.priceOverride.why.split('.')[0]}` : 'Bloomberg DES 20 Nov 2026']);
  L.push(['Diluted shares (bn)', Math.round(shares * 1000) / 1000, 'Bloomberg FA quarterly, diluted weighted average, Q3 FY27']);
  L.push(['Basic shares outstanding (bn, reference only)', basicShares, 'Bloomberg DES']);
  L.push(['Net cash (USD bn)', r2(netCash), 'Bloomberg DES: market cap minus enterprise value']);
  L.push(['FY26 revenue (USD bn)', revA.series.Revenue.at(-1)!, 'Bloomberg FA']);
  L.push(['FY27 revenue consensus (USD bn)', rev27, 'Bloomberg FA consensus']);
  L.push(['FY28 revenue consensus (USD bn)', rev28, 'Bloomberg FA consensus']);
  L.push(['Base FCF margin (%)', r2(baseMargin * 100), `Average of ${marginYears.join(', ')} (Bloomberg FA)`]);
  L.push(['WACC (%)', wacc, A.wacc.value === 'bloomberg' ? 'Bloomberg WACC' : `Headline rate: ${A.wacc.why.split('. ')[0]}`]);
  L.push(['WACC, Google Finance (%)', 14.45, 'Google Finance, 24 Nov 2026']);
  L.push(['WACC, Bloomberg (%)', bbgWacc, 'Bloomberg WACC, Q3 2026 (team-confirmed)']);
  L.push(['NOTE (reference only, not shown)', `Bloomberg WACC screen 20 Nov 2026 = ${bbgScreen}%; Stock Analysis 23 Nov 2026 = ${A.referenceOnly?.['Stock Analysis WACC, 23 Nov 2026 (%)'] ?? 16.42}%`]);
  L.push(['Terminal growth (%)', g, 'Team assumption']);
  L.push(['FY27 EPS consensus (USD)', eps27, 'Bloomberg DES']);
  for (const [n, r] of Object.entries(results)) {
    L.push([]);
    L.push([`SCENARIO: ${r.label}`]);
    L.push(['', ...years]);
    L.push(['Revenue (USD bn)', ...r.path.map(r2)]);
    L.push(['Growth (%)', ...r.path.map((v, k) => r2((v / (k ? r.path[k - 1] : rev27) - 1) * 100))]);
    L.push(['FCF margin (%)', ...years.map(() => r2(r.margin * 100))]);
    L.push(['Free cash flow (USD bn)', ...r.fcf.map(r2)]);
    L.push(['Years from valuation date', ...t.map(r2)]);
    L.push(['Present value (USD bn)', ...r.pv.map(r2)]);
    L.push(['Terminal value at FY32 (USD bn)', r2(r.tv)]);
    L.push(['PV of terminal value (USD bn)', r2(r.pvTv)]);
    L.push(['Enterprise value (USD bn)', r2(r.ev)]);
    L.push(['+ Net cash = equity value (USD bn)', r2(r.equity)]);
    L.push([`Value per share (USD) [${n}]`, r2(r.perShare)]);
  }
  L.push([]);
  L.push(['SENSITIVITY: base value per share', ...waccs.map((w) => `WACC ${w}%`)]);
  gs.forEach((gg, i) => L.push([`Terminal growth ${gg}%`, ...sens[i]]));
  L.push([]);
  L.push(['REVERSE DCF', 'Growth per year FY28-FY32 priced in at today’s price (%)', r2(implied)]);
  L.push(['', 'Base case growth per year FY28-FY32 (%)', r2(baseCagr)]);
  L.push([]);
  L.push(['PEER CHECK', 'Median peer forward P/E', r2(peerMedian), 'x FY27 EPS', eps27, '= USD', r2(peerValue)]);
  const csv = L.map((row) => row.map((c) => (typeof c === 'string' && /[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
  fs.writeFileSync(path.join(MODEL, 'valuation.csv'), csv + '\n');

  console.log(`\nPrice $${price} | net cash $${r2(netCash)}bn | shares ${shares}bn | base FCF margin ${r2(baseMargin * 100)}% | WACC ${wacc}% | g ${g}%`);
  for (const r of Object.values(results)) console.log(`  ${r.label.padEnd(44)} $${r2(r.perShare)}  (${r2((r.perShare / price - 1) * 100)}%)`);
  console.log(`  Peer forward P/E ${r2(peerMedian)}x × EPS $${eps27} = $${r2(peerValue)}`);
  console.log(`  Reverse DCF: price implies ${r2(implied)}%/yr FY28–FY32 vs base ${r2(baseCagr)}%/yr`);
  console.log(`  Sensitivity (rows g=${gs}; cols WACC=${waccs}):`, sens);
  for (const [k, w] of waccs.entries()) console.log(`  At ${w}%: EV $${r2(bridgeAt[k].ev)}bn, equity $${r2(bridgeAt[k].equity)}bn, $${r2(bridgeAt[k].perShare)}/share (${bridgeAt[k].perShare > price ? 'ABOVE' : 'BELOW'} $${price})`);
}

if (process.argv[1] === import.meta.filename) main();
