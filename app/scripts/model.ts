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
  const pv = fcf.map((f, k) => f / (1 + w) ** i.t[k]);
  const tv = (fcf.at(-1)! * (1 + g)) / (w - g);
  const pvTv = tv / (1 + w) ** i.t.at(-1)!;
  const ev = pv.reduce((a, b) => a + b, 0) + pvTv;
  return { fcf, pv, tv, pvTv, ev, equity: ev + i.netCash, perShare: (ev + i.netCash) / i.shares };
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
  const des = pdfText(path.join(ROOT, 'data/bloomberg-raw/nvda_des_2026-11-20.pdf'));
  const waccPdf = pdfText(path.join(ROOT, 'data/bloomberg-raw/nvda_wacc_2026-11-20.pdf'));
  const num = (text: string, re: RegExp) => {
    const m = text.match(re);
    if (!m) throw new Error(`Snapshot value not found: ${re}`);
    return Number(m[1].replace(/,/g, ''));
  };
  const valuationDate = '2026-11-20';
  const desPrice = num(des, /Last Px\s+USD\/([\d.]+)/);
  const price: number = A.priceOverride.value ?? desPrice;
  const shares = num(des, /Curr Shares Out\s+([\d.]+)B/); // bn
  const mktCap = num(des, /~ Mkt Cap\s+([\d,.]+)B/);
  const ev = num(des, /Curr EV\s+([\d,.]+)B/);
  const netCash = mktCap - ev; // USD bn; DES EV = market cap + debt − cash
  const eps27 = num(des, /Est EPS\s+([\d.]+)/);
  const bbgWacc = num(waccPdf, /WACC\s+([\d.]+)%/);

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
    if (s.fy28 === 'flat') return grow(rev27, [0, ...s.growth!]);
    const g28 = (rev28 / rev27 - 1) * 100;
    return grow(rev27, [g28, ...[1, 2, 3, 4].map((k) => g28 + ((g - g28) * k) / 4)]);
  };
  const results = Object.fromEntries(
    Object.entries(A.scenarios).map(([name, s]: [string, any]) => {
      const p = scenarioPath(s);
      const margin = baseMargin + s.marginShift / 100;
      return [name, { label: s.label, path: p, margin, ...dcf({ path: p, margin, wacc, g, netCash, shares, t }) }];
    }),
  ) as Record<string, { label: string; path: number[]; margin: number } & ReturnType<typeof dcf>>;

  const waccs = [10, 12, 14, 16, bbgWacc];
  const gs = [2, 3, 4];
  const sens = gs.map((gg) => waccs.map((w) => r2(dcf({ path: results.base.path, margin: baseMargin, wacc: w, g: gg, netCash, shares, t }).perShare)));
  const implied = impliedGrowth({ rev27, margin: baseMargin, wacc, g, netCash, shares, t }, price);
  const baseCagr = ((results.base.path.at(-1)! / rev27) ** (1 / 5) - 1) * 100;

  const peerPe = read('peers_pe');
  const peerFwd = peerPe.series['Forward P/E'].filter((_, i) => peerPe.x[i] !== 'NVIDIA').map(Number).sort((a, b) => a - b);
  const peerMedian = (peerFwd[1] + peerFwd[2]) / 2;
  const peerValue = peerMedian * eps27;

  // ---------- datasets for slides ----------
  const source = 'Team valuation model (data/model/assumptions.json) on Bloomberg FA, DES and consensus data';
  const write = (d: Omit<Dataset, 'placeholder' | 'asOf'>) => fs.writeFileSync(path.join(CLEAN, `${d.key}.json`), JSON.stringify(Dataset.parse({ ...d, asOf: valuationDate, placeholder: false }), null, 2) + '\n');
  write({
    key: 'model_valuation', title: 'What one NVIDIA share is worth', unit: 'USD', source: `${source}. WACC ${wacc}%, terminal growth ${g}%`,
    x: ['Share price today', 'Bear case', 'Base case', 'Bull case', 'Peer P/E check'],
    series: { 'Value per share': [price, results.bear.perShare, results.base.perShare, results.bull.perShare, peerValue].map(r2) },
  });
  const cases = ['bear', 'base', 'bull'] as const;
  const perShare = (f: (r: (typeof results)[string]) => number) => cases.map((n) => r2(f(results[n]) / shares));
  write({
    key: 'model_dcf_bridge', title: 'Where the value per share comes from', unit: 'USD', source: `${source}. Each part is a present value divided by ${shares}bn shares`,
    x: ['Bear case', 'Base case', 'Bull case'],
    series: {
      'Cash flow FY28 to FY32': perShare((r) => r.pv.reduce((a: number, b: number) => a + b, 0)),
      'Everything after FY32': perShare((r) => r.pvTv),
      'Net cash': perShare(() => netCash),
    },
  });
  write({
    key: 'model_revenue_paths', title: 'Revenue paths in the model', unit: 'USD bn', source: `${source}. FY27 = consensus`,
    x: ['FY26', 'FY27', ...years],
    series: Object.fromEntries(['bear', 'base', 'bull'].map((n) => [results[n].label.split(':')[0], [revA.series.Revenue.at(-1)!, rev27, ...results[n].path].map(r2)])),
  });
  write({
    key: 'model_sensitivity', title: 'Base-case value per share by discount rate', unit: 'USD', source: `${source}. ${bbgWacc}% = Bloomberg WACC`,
    x: waccs.map((w) => `${w}%`),
    series: Object.fromEntries(gs.map((gg, i) => [`Terminal growth ${gg}%`, sens[i]])),
  });
  write({
    key: 'model_implied_growth', title: 'Yearly revenue growth FY28–FY32', unit: '%', source: `${source}. Reverse DCF at $${price}`,
    x: ['Priced in today', 'Base case (consensus, then slowing)'],
    series: { 'Growth per year': [r2(implied), r2(baseCagr)] },
  });

  // ---------- CSV for Excel ----------
  const L: (string | number)[][] = [];
  L.push(['NVIDIA valuation model', `valuation date ${valuationDate}`]);
  L.push([]);
  L.push(['INPUT', 'VALUE', 'SOURCE']);
  L.push(['Share price (USD)', price, A.priceOverride.value ? 'Team override (assumptions.json)' : 'Bloomberg DES 20 Nov 2026']);
  L.push(['Shares outstanding (bn)', shares, 'Bloomberg DES']);
  L.push(['Net cash (USD bn)', r2(netCash), 'Bloomberg DES: market cap minus enterprise value']);
  L.push(['FY26 revenue (USD bn)', revA.series.Revenue.at(-1)!, 'Bloomberg FA']);
  L.push(['FY27 revenue consensus (USD bn)', rev27, 'Bloomberg FA consensus']);
  L.push(['FY28 revenue consensus (USD bn)', rev28, 'Bloomberg FA consensus']);
  L.push(['Base FCF margin (%)', r2(baseMargin * 100), `Average of ${marginYears.join(', ')} (Bloomberg FA)`]);
  L.push(['WACC (%)', wacc, A.wacc.value === 'bloomberg' ? 'Bloomberg WACC screen, 20 Nov 2026' : `Team assumption. Bloomberg WACC = ${bbgWacc}%`]);
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
    L.push(['Years from valuation date', ...t.map((v) => Math.round(v * 1e4) / 1e4)]);
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
}

if (process.argv[1] === import.meta.filename) main();
