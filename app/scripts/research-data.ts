/**
 * Curated datasets typed in from docs/research/notebooklm-research.md (NotebookLM export, 21 Nov 2026).
 * These are the non-Bloomberg figures in Rob's opening. Each figure keeps its publisher + date.
 * `verified: false` = the script marks it [VERIFY]: find a primary source before the pitch.
 * Run: npx tsx scripts/research-data.ts  (writes data/clean/research_*.json; npm run data keeps them)
 */
import fs from 'node:fs';
import path from 'node:path';
import { Dataset } from '../shared/schema.ts';

const CLEAN = path.resolve(import.meta.dirname, '../../data/clean');
const AS_OF = '2026-11-21';
const VIA = 'via NotebookLM research, 21 Nov 2026';

type Fact = { value: number; unit: string; source: string };
/** `meta` overrides the dataset-level source and date for facts that do not come from the NotebookLM research notes. */
function facts(key: string, title: string, verified: boolean, f: Record<string, Fact>, meta?: { source: string; asOf: string }): Dataset {
  return Dataset.parse({
    key, title, unit: '', units: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.unit])),
    source: meta?.source ?? `Research notes (${VIA})`, seriesSources: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.source])),
    asOf: meta?.asOf ?? AS_OF, placeholder: false, curated: true, verified, x: ['value'],
    series: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, [v.value]])),
  });
}

// ---- Added 24 Nov 2026: Google Finance page for NVDA and the Q3 FY27 earnings call ----
// Both were pasted in by the team (secondary sources). verified=false until checked against the press release / 10-Q /
// the Google Finance page itself: the operator panel shows them amber.
const GF = 'Google Finance, NVDA page, 24 Nov 2026';
const CALL = 'NVIDIA Q3 FY27 earnings call, 17 Nov 2026 (transcript via Google Finance)';
const gf = (value: number, unit: string): Fact => ({ value, unit, source: GF });
const call = (value: number, unit: string): Fact => ({ value, unit, source: CALL });
const qRev = JSON.parse(fs.readFileSync(path.join(CLEAN, 'nvda_revenue_quarterly.json'), 'utf8')) as Dataset;
const lastQ = qRev.x.length - 1; // Bloomberg quarterly revenue; the latest point is FY27 Q3 (asserted in data.test.ts)
/** A table whose source is not the NotebookLM notes. */
function own(d: Omit<Dataset, 'placeholder' | 'curated' | 'asOf'>, asOf: string): Dataset {
  return Dataset.parse({ ...d, asOf, placeholder: false, curated: true });
}
function table(d: Omit<Dataset, 'placeholder' | 'curated' | 'asOf'>): Dataset {
  return Dataset.parse({ ...d, source: `${d.source} (${VIA})`, asOf: AS_OF, placeholder: false, curated: true });
}

const out: Dataset[] = [
  table({
    key: 'research_infra_gdp', title: 'Average yearly spend during each build-out, share of US GDP', unit: '%', verified: true,
    source: 'Brookings Papers on Economic Activity, Fall 2026 (Van Nieuwerburgh), AI projection 2025–32; historical build-out estimates in the same research',
    x: ['Highways 1956–73', 'Fibre 1996–2003', 'Railroads 1870–90', 'AI 2025–32'],
    series: { 'Average yearly spend': [1.13, 1.1, 2.24, 3.63] },
  }),
  table({
    key: 'research_alexnet', title: 'ImageNet 2012: top-5 error rate (lower is better)', unit: '%', verified: true,
    source: 'ILSVRC 2012 results; Krizhevsky, Sutskever & Hinton (2012)',
    x: ['AlexNet, on NVIDIA GPUs', 'Runner-up'],
    series: { 'Top-5 error': [15.3, 26.2] },
  }),
  table({
    key: 'research_cowos_share', title: 'Share of TSMC CoWoS packaging capacity booked for 2026', unit: '%', verified: true,
    source: 'Morgan Stanley, TrendForce and Silicon Analysts estimates, 2026',
    x: ['NVIDIA', 'Broadcom', 'AMD'],
    series: { 'Share of CoWoS': [60, 15, 11] },
  }),
  facts('research_facts', 'Figures from the research notes', true, {
    'NV1 chips made': { value: 250000, unit: '', source: 'NVIDIA history (Wikipedia; Sequoia/TwinMind)' },
    'NV1 chips returned': { value: 249000, unit: '', source: 'NVIDIA history (Wikipedia; Sequoia/TwinMind)' },
    'Sega investment': { value: 5, unit: 'USD m', source: 'NVIDIA history (Wikipedia; TwinMind)' },
    'RIVA 128 sold in four months': { value: 1, unit: 'm', source: 'GameSpot, April 2000; NVIDIA history' },
    'Xbox advance': { value: 200, unit: 'USD m', source: 'EE Times, 19 April 2000' },
    'Stanford speed-up': { value: 70, unit: 'x', source: 'Raina, Madhavan & Ng, ICML 2009' },
    'AMD MI355X memory': { value: 288, unit: 'GB', source: 'AMD Instinct MI355X specifications' },
    'NVIDIA B200 memory': { value: 192, unit: 'GB', source: 'NVIDIA B200 specifications' },
    'CUDA developers': { value: 6, unit: 'm', source: 'NVIDIA, GTC March 2026' },
    'CUDA-X libraries': { value: 1000, unit: '', source: 'NVIDIA CUDA-X' },
    'GPUs per NVL72 rack': { value: 72, unit: '', source: 'NVIDIA GB200 NVL72 specifications' },
    'Mellanox price': { value: 6.9, unit: 'USD bn', source: 'NVIDIA, 11 March 2019 (enterprise value)' },
    'TSMC share of leading-edge chips': { value: 90, unit: '%', source: 'Industry estimates (Mordor Intelligence; Bloomberg Intelligence), 2026' },
    'Cisco forward P/E, March 2000': { value: 140, unit: 'x', source: 'Market data, March 2000' },
    'Drug: idea to trials, months': { value: 30, unit: '', source: 'Insilico Medicine, ISM001-055' },
    'Sweden: more cancers found': { value: 20, unit: '%', source: 'Swedish mammography screening trial (MASAI), 2023' },
    'Sweden: less reading work': { value: 44, unit: '%', source: 'Swedish mammography screening trial (MASAI), 2023' },
    'Writers: faster': { value: 40, unit: '%', source: 'Noy & Zhang, Science, 2023' },
    'Support: more solved': { value: 14, unit: '%', source: 'Brynjolfsson, Li & Raymond, 2023' },
    'Support: more solved, new staff': { value: 34, unit: '%', source: 'Brynjolfsson, Li & Raymond, 2023' },
    'Spying campaign run by AI, low': { value: 80, unit: '%', source: 'Anthropic, November 2025 (GTG-1002)' },
    'Spying campaign run by AI, high': { value: 90, unit: '%', source: 'Anthropic, November 2025 (GTG-1002)' },
  }),
  facts('research_facts_unverified', 'Figures marked [VERIFY] in the script', false, {
    'CUDA spend per year': { value: 0.5, unit: 'USD bn', source: 'Rob May, "The CUDA Backstory"; secondary estimates' },
    'Networking revenue FY26': { value: 31, unit: 'USD bn', source: 'NVIDIA FY26 results, as reported in research notes' },
    'Supply commitments': { value: 279, unit: 'USD bn', source: 'NVIDIA Form 10-Q, quarter to 26 July 2026, as reported in research notes' },
    'Share of AI training': { value: 90, unit: '%', source: 'Industry estimates, 2026' },
    'Share of AI chip spending': { value: 80, unit: '%', source: 'IDC (81%), Mercury/SemiAnalysis (~75%), 2026' },
    'Humans in the loop': { value: 0, unit: '', source: 'Google Threat Intelligence Group, 16–17 November 2026' },
  }),
  // Added 24 Nov 2026 for Q&A prep (policy, customers, power). Web-sourced, NOT yet checked against primary
  // documents: verified=false so they show amber on the operator panel. Check the 10-K figures before use.
  facts('research_policy', 'Policy, customer and power figures for Q&A', false, {
    'Largest direct customer, share of FY26 revenue': { value: 22, unit: '%', source: 'NVIDIA Form 10-K, year to 25 Jan 2026 (SEC filing); direct customers, not named' },
    'Second direct customer, share of FY26 revenue': { value: 14, unit: '%', source: 'NVIDIA Form 10-K, year to 25 Jan 2026 (SEC filing); direct customers, not named' },
    'Revenue from customers outside the US, FY26': { value: 31, unit: '%', source: 'NVIDIA Form 10-K, year to 25 Jan 2026 (SEC filing); by customer headquarters' },
    'China share of FY26 revenue': { value: 9.1, unit: '%', source: 'NVIDIA Form 10-K FY26, as reported in research notes; by customer headquarters' },
    'US data-centre projects blocked or delayed, Q1 2026': { value: 75, unit: '', source: 'Data Center Watch, as reported by Network World, 2026' },
    'Value of those projects': { value: 130, unit: 'USD bn', source: 'Data Center Watch, as reported by Network World, 2026' },
    'Hyperscaler capex, 2026 guidance': { value: 725, unit: 'USD bn', source: 'Company guidance, as reported by Yahoo Finance, 2026 (Amazon, Alphabet, Microsoft, Meta)' },
    'GPU economic life, low': { value: 3, unit: 'years', source: 'Brookings Papers on Economic Activity, Fall 2026, as reported in research notes' },
    'GPU economic life, high': { value: 6, unit: 'years', source: 'Brookings Papers on Economic Activity, Fall 2026, as reported in research notes' },
    'NVIDIA share of GPU power in announced post-2026 frontier deals': { value: 28, unit: '%', source: 'JPMorgan (Cembalest), as reported in research notes' },
  }),
  facts('research_market', 'Share price, valuation and analyst figures (Google Finance)', false, {
    'Share price': gf(165.05, 'USD'),
    'P/E ratio, trailing': gf(17.73, 'x'),
    'EPS, trailing': gf(9.31, 'USD'),
    'Beta': gf(2.21, ''),
    '52-week high': gf(243.37, 'USD'),
    '52-week low': gf(145.71, 'USD'),
    'WACC, Google Finance': gf(14.45, '%'),
    'Cost of equity, Google Finance': gf(15, '%'),
    // The range of independent discount-rate estimates for NVIDIA (the headline rate is in assumptions.json)
    'Discount rate, lowest estimate (US semiconductor average)': { value: 10.55, unit: '%', source: 'Damodaran, US semiconductor industry average cost of capital, January 2026' },
    'Discount rate, Stock Analysis': { value: 16.42, unit: '%', source: 'Stock Analysis, NVDA statistics page, 23 Nov 2026' },
    'Discount rate, highest estimate (Bloomberg)': { value: 19.3, unit: '%', source: 'Bloomberg WACC screen, NVDA US Equity, 20 Nov 2026' },
    'Analysts rating NVDA': gf(44, ''),
    'Analysts: buy': gf(34, ''),
    'Analysts: hold': gf(9, ''),
    'Analysts: sell': gf(1, ''),
    'Analyst target, average': gf(233.36, 'USD'),
    'Analyst target, highest': gf(350, 'USD'),
    'Analyst target, lowest': gf(130, 'USD'),
  }, { source: GF, asOf: '2026-11-24' }),
  facts('research_q3_call', 'Q3 FY27 earnings call: results, outlook, capital and commitments', false, {
    'Q4 FY27 revenue guide': call(130, 'USD bn'),
    'Q4 FY27 revenue guide, range plus or minus': call(3, '%'),
    'FY28 revenue growth outlook': call(75, '%'),
    'FY28 revenue growth outlook, previous': call(70, '%'),
    'Vera Rubin revenue, first quarter of shipments': call(20, 'USD bn'), // "nearly $20 billion"
    'Data Center revenue growth, year on year, Q3 FY27': call(110, '%'),
    'Hyperscale revenue, Q3 FY27': call(60, 'USD bn'),
    'Networking revenue, Q3 FY27': call(21, 'USD bn'), // "exceeding $21 billion"
    'Gross margin, Q3 FY27': call(74.8, '%'),
    'Gross margin guide, Q4 FY27, low': call(71, '%'),
    'Gross margin guide, Q4 FY27, high': call(72, '%'),
    'Gross margin outlook, FY28, low': call(72, '%'),
    'Gross margin outlook, FY28, high': call(73, '%'),
    'Share buybacks, Q3 FY27': call(22, 'USD bn'),
    'Dividends, Q3 FY27': call(6, 'USD bn'),
    'Cash returned to shareholders, Q3 FY27': call(28, 'USD bn'),
    'Share of free cash flow returned, year to date': call(65, '%'),
    'Buyback authorization added': call(150, 'USD bn'),
    'Buyback authorization remaining': call(227, 'USD bn'),
    'Purchase commitments': call(390, 'USD bn'),
    'Guarantees': call(118, 'USD bn'),
    'Neocloud commitments': call(32, 'USD bn'),
    'Cloud industry backlog': call(2.5, 'USD tn'),
    'Frontier labs share of Data Center revenue, FY27': call(15, '%'), // "approximately 15%"
    'Licensed Hopper sales to China, Q3 FY27': call(2.4, 'USD bn'),
  }, { source: CALL, asOf: '2026-11-17' }),
  own({
    key: 'nvda_analyst_ratings', title: 'What 44 Wall Street analysts rate NVIDIA', unit: '', verified: false,
    source: `${GF}: ratings given in the past 3 months`,
    x: ['Buy', 'Hold', 'Sell'],
    series: { Analysts: [34, 9, 1] },
  }, '2026-11-24'),
  own({
    key: 'nvda_revenue_guidance', title: 'Revenue by quarter, with NVIDIA’s own guide for the next one', unit: 'USD bn', verified: false,
    source: `Bloomberg FA (Earnings) for the quarters; ${CALL} for the Q4 FY27 guide ($130bn, plus or minus 3%)`,
    x: ['FY26 Q4', 'FY27 Q1', 'FY27 Q2', 'FY27 Q3', 'FY27 Q4 (guide)'],
    series: { Revenue: [...qRev.series.Revenue.slice(lastQ - 3, lastQ + 1) as number[], 130] },
  }, '2026-11-17'),
];

for (const d of out) fs.writeFileSync(path.join(CLEAN, `${d.key}.json`), JSON.stringify(d, null, 2) + '\n');
console.log(`Wrote ${out.length} curated datasets: ${out.map((d) => d.key).join(', ')}`);
