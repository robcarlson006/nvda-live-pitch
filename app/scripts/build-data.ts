/**
 * Raw Bloomberg PDFs (data/bloomberg-raw) → clean datasets (data/clean/*.json).
 * Every dataset carries its source and the Bloomberg export date. Run: npm run data
 */
import fs from 'node:fs';
import path from 'node:path';
import { Dataset } from '../shared/schema.ts';
import { parseReport, pdfText, pick, type Report, type Row } from './fa-parse.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const RAW = path.join(ROOT, 'data/bloomberg-raw');
const CLEAN = path.join(ROOT, 'data/clean');

type Loaded = Report & { file: string; asOf: string };
function load(file: string): Loaded {
  const text = pdfText(path.join(RAW, file));
  const d = text.match(/Bloomberg ®\s+(\d{2})\/(\d{2})\/(\d{4})/);
  return { ...parseReport(text), file, asOf: d ? `${d[3]}-${d[1]}-${d[2]}` : 'unknown' };
}

export const nvdaA = load('nvda_fa_annual_FY1998-FY2026.pdf');
export const nvdaQ = load('nvda_fa_quarterly_FY24Q3-FY27Q3.pdf');
export const peers = {
  AMD: load('peer_amd_fa_annual_FY2014-FY2025.pdf'),
  Intel: load('peer_intc_fa_annual_FY2015-FY2025.pdf'),
  Broadcom: load('peer_avgo_fa_annual_FY2016-FY2025.pdf'),
  TSMC: load('peer_tsmc_2330TT_fa_annual_FY2015-FY2025_USD.pdf'),
};

const src = (r: Loaded, template: string) => `Bloomberg FA (${template}), ${r.ticker}, ${r.periodicity.toLowerCase()}`;
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `FY${String(from + i).padStart(2, '0')}`);
const series = (row: Row, x: string[], scale = 1) => x.map((p) => (row.values[p] == null ? null : round(row.values[p] * scale)));
const round = (v: number) => Math.round(v * 1000) / 1000;
const bn = 1 / 1000; // Bloomberg FA reports USD millions

const out: Dataset[] = [];
function add(d: Omit<Dataset, 'placeholder'>) {
  out.push(Dataset.parse({ ...d, placeholder: false }));
}

// ---------- NVIDIA: the long story ----------
{
  const r = nvdaA;
  const x = range(0, 26);
  const rev = pick(r, { template: 'Adj Highlights', label: 'Revenue, Adj' });
  add({ key: 'nvda_revenue_annual', title: 'NVIDIA annual revenue', unit: 'USD bn', source: src(r, 'Adj Highlights') + ', fiscal years end late January', asOf: r.asOf, x, series: { Revenue: series(rev, x, bn) } });

  const cons = pick(r, { template: 'Earnings', section: 'Revenue', label: 'Consensus Estimate' });
  const xf = range(20, 28);
  add({
    key: 'nvda_revenue_forecast', title: 'NVIDIA revenue: actual and analyst consensus', unit: 'USD bn', source: src(r, 'Earnings') + '. FY27–FY28 are consensus estimates', asOf: r.asOf, x: xf,
    series: { Actual: series(rev, xf, bn).map((v, i) => (i <= 6 ? v : null)), 'Consensus estimate': series(cons, xf, bn).map((v, i) => (i >= 6 ? v : null)) },
  });

  const xm = range(15, 26);
  const m = (label: string) => pick(r, { template: 'Profitability', section: 'Margins', label });
  add({ key: 'nvda_margins_annual', title: 'NVIDIA margins', unit: '%', source: src(r, 'Profitability'), asOf: r.asOf, x: xm, series: { 'Gross margin': series(m('Gross Margin'), xm), 'Operating margin': series(m('Operating Margin'), xm) } });

  const fcf = pick(r, { template: 'Adj Highlights', label: 'Free Cash Flow' });
  add({ key: 'nvda_fcf_annual', title: 'NVIDIA free cash flow', unit: 'USD bn', source: src(r, 'Adj Highlights'), asOf: r.asOf, x: xm, series: { 'Free cash flow': series(fcf, xm, bn) } });

  const pe = pick(r, { template: 'Multiples', section: '', label: 'P/E' });
  add({ key: 'nvda_pe_history', title: 'NVIDIA price/earnings at each fiscal year end', unit: 'x', source: src(r, 'Multiples'), asOf: r.asOf, x: xm, series: { 'P/E': series(pe, xm) } });

  const xs = range(14, 26);
  const seg = (s: string) => pick(r, { template: 'By Segment', section: s, label: 'Revenue by End User' });
  add({
    key: 'nvda_segments_annual', title: 'NVIDIA revenue by market', unit: 'USD bn', source: src(r, 'PGEO By Segment'), asOf: r.asOf, x: xs,
    series: { 'Data Center': series(seg('Data Center'), xs, bn), Gaming: series(seg('Gaming'), xs, bn), 'Pro Visualization': series(seg('Professional Visualization'), xs, bn), Automotive: series(seg('Automotive'), xs, bn), 'OEM & Other': series(seg('OEM & Other'), xs, bn) },
  });

  // ESG: the Environmental template has the complete FY12–FY26 run.
  const xe = range(14, 26);
  const env = (section: string | RegExp, label: string) => pick(r, { template: 'Environmental', section, label });
  add({
    key: 'nvda_emissions', title: 'NVIDIA greenhouse gas emissions', unit: "'000 t CO2e", source: src(r, 'ESG Environmental') + ". Scope 2 is market-based", asOf: r.asOf, x: xe,
    series: { 'Scope 1': series(env('Based', 'GHG Scope 1'), xe), 'Scope 2 (market-based)': series(env('Based', 'GHG Scope 2 Market-Based'), xe), 'Scope 3': series(env('Based', 'GHG Scope 3'), xe) },
  });
  const energy = series(env('Energy', 'Total Energy Consumption'), xe);
  const renew = series(env('Energy', 'Renewable Energy Use'), xe);
  add({ key: 'nvda_energy', title: 'NVIDIA energy use', unit: "'000 MWh", source: src(r, 'ESG Environmental'), asOf: r.asOf, x: xe, series: { 'Total energy': energy, 'Renewable energy': renew } });
  add({
    key: 'nvda_renewable_share', title: 'Share of NVIDIA energy from renewables', unit: '%', source: src(r, 'ESG Environmental') + '. Share = renewable ÷ total energy', asOf: r.asOf, x: xe,
    series: { Renewable: xe.map((_, i) => (energy[i] && renew[i] != null ? round((renew[i]! / energy[i]!) * 100) : null)) },
  });
}

// ---------- NVIDIA: the last three years, quarter by quarter ----------
{
  const r = nvdaQ;
  const x = ['FY24 Q3', 'FY24 Q4', 'FY25 Q1', 'FY25 Q2', 'FY25 Q3', 'FY25 Q4', 'FY26 Q1', 'FY26 Q2', 'FY26 Q3', 'FY26 Q4', 'FY27 Q1', 'FY27 Q2', 'FY27 Q3'];
  const e = (section: string, label: string) => pick(r, { template: 'Earnings', section, label });
  add({ key: 'nvda_revenue_quarterly', title: 'NVIDIA quarterly revenue vs consensus', unit: 'USD bn', source: src(r, 'Earnings') + '. FY27 Q3 is preliminary', asOf: r.asOf, x, series: { Revenue: series(e('Revenue', 'Comparable Actual'), x, bn), Consensus: series(e('Revenue', 'Consensus Estimate'), x, bn) } });
  add({ key: 'nvda_eps_quarterly', title: 'NVIDIA earnings per share vs consensus', unit: 'USD', source: src(r, 'Earnings') + '. Adjusted (comparable) EPS', asOf: r.asOf, x, series: { EPS: series(e('Earnings Per Share', 'Comparable Actual'), x), Consensus: series(e('Earnings Per Share', 'Consensus Estimate'), x) } });
  add({ key: 'nvda_revenue_surprise', title: 'How far revenue beat consensus', unit: '%', source: src(r, 'Earnings'), asOf: r.asOf, x, series: { 'Revenue surprise': series(e('Revenue', 'Revenue Surprise %'), x) } });
  const dc = pick(r, { template: 'By Segment', section: 'Data Center', label: 'Revenue by End User' });
  const xd = ['FY24 Q1', 'FY24 Q2', 'FY24 Q3', 'FY24 Q4', 'FY25 Q1', 'FY25 Q2', 'FY25 Q3', 'FY25 Q4', 'FY26 Q1', 'FY26 Q2', 'FY26 Q3', 'FY26 Q4', 'FY27 Q1', 'FY27 Q2', 'FY27 Q3'];
  add({ key: 'nvda_datacenter_quarterly', title: 'NVIDIA Data Center revenue by quarter', unit: 'USD bn', source: src(r, 'PGEO By Segment'), asOf: r.asOf, x: xd, series: { 'Data Center': series(dc, xd, bn) } });
}

// ---------- Peers ----------
// Forward = the fiscal year ending around Dec 2026/Jan 2027: NVIDIA FY27, the others FY26.
export const companies: [string, Loaded, string][] = [['NVIDIA', nvdaA, 'FY27'], ...Object.entries(peers).map(([n, r]) => [n, r, 'FY26'] as [string, Loaded, string])];
{
  const x = companies.map(([n]) => n);
  const val = (label: string, at: (fwd: string) => string) => companies.map(([, r, fwd]) => {
    const v = pick(r, { template: 'Multiples', section: '', label }).values[at(fwd)];
    return v == null ? null : round(v);
  });
  const peerSrc = 'Bloomberg FA (Multiples, Earnings, Profitability) for NVDA, AMD, INTC, AVGO, 2330 TT (USD)';
  add({ key: 'peers_pe', title: 'Price/earnings: today and on this year’s expected earnings', unit: 'x', source: peerSrc + '. Forward = fiscal year ending around Dec 2026/Jan 2027', asOf: nvdaA.asOf, x, series: { 'Current P/E': val('P/E', () => 'Current'), 'Forward P/E': val('P/E', (f) => f) } });
  add({ key: 'peers_ev_ebitda', title: 'Enterprise value / EBITDA, forward', unit: 'x', source: peerSrc, asOf: nvdaA.asOf, x, series: { 'EV/EBITDA': val('EV/EBITDA', (f) => f) } });

  const rows = companies.map(([, r, fwd]) => {
    const eps = pick(r, { template: 'Earnings', section: 'Earnings Per Share', label: 'Consensus Estimate' }).values;
    const next = `FY${Number(fwd.slice(2)) + 1}`;
    const g = eps[fwd] && eps[next] ? (eps[next] / eps[fwd] - 1) * 100 : null; // next year's expected EPS growth
    const fpe = pick(r, { template: 'Multiples', section: '', label: 'P/E' }).values[fwd];
    const om = pick(r, { template: 'Profitability', section: 'Margins', label: 'Operating Margin' }).values[fwd];
    return { g: g == null ? null : round(g), peg: g && g > 0 && fpe ? round(fpe / g) : null, om: om == null ? null : round(om) };
  });
  add({ key: 'peers_growth', title: 'Expected EPS growth next year (consensus)', unit: '%', source: peerSrc + '. Growth from this fiscal year to next', asOf: nvdaA.asOf, x, series: { 'EPS growth': rows.map((r) => r.g) } });
  add({ key: 'peers_peg', title: 'PEG: forward P/E divided by expected EPS growth', unit: 'x', source: peerSrc + '. Lower = cheaper for the growth', asOf: nvdaA.asOf, x, series: { PEG: rows.map((r) => r.peg) } });
  add({ key: 'peers_operating_margin', title: 'Operating margin, this fiscal year (consensus)', unit: '%', source: peerSrc, asOf: nvdaA.asOf, x, series: { 'Operating margin': rows.map((r) => r.om) } });

  const ghg = companies.map(([, r]) => {
    const s1 = pick(r, { template: 'Environmental', label: 'GHG Scope 1' }).values;
    const s2 = pick(r, { template: 'Environmental', label: /^GHG Scope 2 Market-/ }).values; // label wraps differently per company
    const rev = pick(r, { template: 'Adj Highlights', label: 'Revenue, Adj' }).values;
    const y = r === nvdaA ? 'FY26' : 'FY25';
    return s1[y] != null && s2[y] != null && rev[y] ? round(((s1[y] + s2[y]) * 1000) / (rev[y] / 1000)) : null; // tonnes per $1bn... see unit
  });
  add({ key: 'peers_emissions_intensity', title: "Carbon per $1m of sales, from each company's own buildings and power (Scope 1 + 2)", unit: 'tonnes CO2', source: 'Bloomberg FA (ESG Environmental, Adj Highlights), latest fiscal year: NVIDIA FY26, others FY25', asOf: nvdaA.asOf, x, series: { 'Emissions intensity': ghg.map((v) => (v == null ? null : round(v / 1000))) } });
}

// ---------- Data centre: NVIDIA vs AMD (beat 9) ----------
// Latest full year for each: NVIDIA FY26 (to Jan 2026) and AMD FY25 (to Dec 2025), so they cover almost the same twelve months.
{
  const nv = pick(nvdaA, { template: 'By Segment', section: 'Data Center', label: 'Revenue by End User' }).values.FY26;
  const amd = pick(peers.AMD, { template: 'By Segment', section: 'Data Center', label: 'Revenue' }).values.FY25;
  add({
    key: 'peers_datacenter_revenue', title: 'Data centre revenue, latest full year', unit: 'USD bn',
    units: { 'Multiple of AMD': 'x' },
    source: 'Bloomberg FA (PGEO By Segment) for NVDA US (FY26, to Jan 2026) and AMD US (FY25, to Dec 2025)', asOf: nvdaA.asOf,
    x: ['NVIDIA', 'AMD'],
    series: { 'Data centre revenue': [round(nv * bn), round(amd * bn)], 'Multiple of AMD': [round(nv / amd), 1] },
  });
}

// ---------- write ----------
fs.mkdirSync(CLEAN, { recursive: true });
// model_* come from model.ts and research_* are curated by hand from docs/research: keep both.
for (const f of fs.readdirSync(CLEAN)) if (f.endsWith('.json') && !f.startsWith('model_') && !f.startsWith('research_')) fs.rmSync(path.join(CLEAN, f));
for (const d of out) fs.writeFileSync(path.join(CLEAN, `${d.key}.json`), JSON.stringify(d, null, 2) + '\n');
console.log(`Wrote ${out.length} datasets to data/clean/`);
for (const d of out) console.log(`  ${d.key.padEnd(28)} ${d.x[0]}…${d.x.at(-1)}  ${Object.keys(d.series).join(', ')}`);
