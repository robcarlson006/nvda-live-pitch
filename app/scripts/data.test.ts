import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { dcf, grow, impliedGrowth } from './model.ts';

const CLEAN = path.resolve(import.meta.dirname, '../../data/clean');
const ds = (k: string) => JSON.parse(fs.readFileSync(path.join(CLEAN, `${k}.json`), 'utf8'));
const val = (k: string, s: string, x: string) => {
  const d = ds(k);
  return d.series[s][d.x.indexOf(x)];
};

// Spot checks: each value was read by eye from the Bloomberg PDFs / DES screen.
test('parsed values match the Bloomberg exports', () => {
  assert.equal(val('nvda_revenue_annual', 'Revenue', 'FY26'), 215.938); // DES: 215.94B
  assert.equal(val('nvda_revenue_annual', 'Revenue', 'FY22'), 26.914); // DES: 26.91B
  assert.equal(val('nvda_segments_annual', 'Data Center', 'FY26'), 193.737); // DES: 193.74B
  assert.equal(val('nvda_revenue_quarterly', 'Revenue', 'FY27 Q3'), 115.844); // FA Earnings
  assert.equal(val('nvda_revenue_quarterly', 'Consensus', 'FY24 Q3'), 16.09);
  assert.equal(val('nvda_revenue_forecast', 'Consensus estimate', 'FY27'), 422.222); // DES FY27: 422.22B
  // NVIDIA's forward P/E is re-priced in model.ts when assumptions.json sets a newer share price: price ÷ DES consensus EPS $9.64
  // (Bloomberg's own 20 Nov value was 14.07, DES Est P/E 14.06 at $135.46).
  const A = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../data/model/assumptions.json'), 'utf8'));
  assert.equal(val('peers_pe', 'Forward P/E', 'NVIDIA'), A.priceOverride.value != null ? Math.round((A.priceOverride.value / 9.64) * 100) / 100 : 14.07);
  assert.equal(val('peers_pe', 'Current P/E', 'AMD'), 100.08); // FA Multiples, "Current" column
  assert.equal(val('peers_pe', 'Forward P/E', 'AMD'), 53.35); // FA Multiples, Estimate 2026
  assert.equal(val('nvda_emissions', 'Scope 1', 'FY14'), 2.74);
});

test('every dataset is sourced, dated and rectangular', () => {
  for (const f of fs.readdirSync(CLEAN).filter((f) => f.endsWith('.json'))) {
    const d = ds(f.replace('.json', ''));
    assert.ok(d.source.length > 10 && /^\d{4}-\d{2}-\d{2}$/.test(d.asOf), `${d.key} source/date`);
    for (const [s, v] of Object.entries(d.series)) assert.equal((v as unknown[]).length, d.x.length, `${d.key}/${s}`);
  }
});

test('DCF of flat cash flow with zero growth equals the perpetuity formula', () => {
  const r = dcf({ path: [100, 100, 100, 100, 100], margin: 0.5, wacc: 10, g: 0, netCash: 0, shares: 1, t: [1, 2, 3, 4, 5] });
  assert.ok(Math.abs(r.ev - 50 / 0.1) < 1e-9);
});

test('reverse DCF growth reproduces the price', () => {
  const base = { rev27: 400, margin: 0.45, wacc: 12, g: 3, netCash: 60, shares: 24, t: [1.2, 2.2, 3.2, 4.2, 5.2] };
  const gImp = impliedGrowth(base, 135);
  const v = dcf({ ...base, path: grow(base.rev27, Array(5).fill(gImp)) }).perShare;
  assert.ok(Math.abs(v - 135) < 0.01, `got ${v}`);
});

test('valuation cases are ordered, and the headline rate is in the sensitivity table', () => {
  const A = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../data/model/assumptions.json'), 'utf8'));
  const [price, stress, bear, base, bull] = ds('model_valuation').series['Value per share'];
  assert.deepEqual(ds('model_valuation').x.slice(0, 5), ['Share price today', 'Stress case', 'Bear case', 'Base case', 'Bull case']);
  assert.ok(stress < bear && bear < base && base < bull, 'stress < bear < base < bull');
  assert.equal(price, A.priceOverride.value ?? price);
  if (typeof A.wacc.value === 'number') assert.ok(ds('model_sensitivity').x.includes(`${A.wacc.value}%`), 'headline WACC column');
  assert.ok(ds('model_sensitivity').x.includes('10.55%') && ds('model_sensitivity').x.includes('19.3%'), 'range ends');
});

test('realistic bear case: custom growth path and margin override reach the revenue paths', () => {
  const A = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../data/model/assumptions.json'), 'utf8'));
  const g: number[] = A.scenarios.bear.growth;
  assert.equal(A.scenarios.bear.fy28, 'custom');
  assert.equal(g.length, 5);
  const bear: number[] = ds('model_revenue_paths').series.Bear; // FY26, FY27, FY28..FY32
  g.forEach((r, k) => assert.ok(Math.abs(bear[k + 2] / bear[k + 1] - (1 + r / 100)) < 1e-3, `FY${28 + k} growth`));
  assert.ok(A.scenarios.bear.marginOverride > 0 && /AUDIT|Bloomberg|FY27/.test(A.scenarios.bear.why), 'margin override is sourced');
});

test('Google Finance and earnings-call facts are dated, sourced and flagged unverified', () => {
  for (const k of ['research_market', 'research_q3_call']) {
    const d = ds(k);
    assert.equal(d.verified, false, `${k} unverified`);
    for (const s of Object.keys(d.series)) assert.ok(d.seriesSources[s].length > 5, `${k}/${s} source`);
  }
  assert.equal(val('research_market', 'Analysts rating NVDA', 'value'), val('research_market', 'Analysts: buy', 'value') + val('research_market', 'Analysts: hold', 'value') + val('research_market', 'Analysts: sell', 'value'));
  assert.deepEqual(ds('nvda_analyst_ratings').series.Analysts, [34, 9, 1]);
  // the guide is appended to Bloomberg's own quarters, never typed over them
  assert.equal(val('nvda_revenue_guidance', 'Revenue', 'FY27 Q3'), val('nvda_revenue_quarterly', 'Revenue', 'FY27 Q3'));
  assert.equal(val('nvda_revenue_guidance', 'Revenue', 'FY27 Q4 (guide)'), val('research_q3_call', 'Q4 FY27 revenue guide', 'value'));
  // our values sit on the same chart as the targets, read from the model rather than typed
  assert.equal(val('model_vs_analysts', 'Value per share', 'Our base case'), val('model_valuation', 'Value per share', 'Base case'));
  assert.equal(val('model_vs_analysts', 'Value per share', 'Average target'), val('research_market', 'Analyst target, average', 'value'));
});

test('AMD data centre revenue comes from the Bloomberg export', () => {
  assert.equal(val('peers_datacenter_revenue', 'Data centre revenue', 'AMD'), 16.635); // AMD FA By Segment, FY25: 16,635
  assert.equal(val('peers_datacenter_revenue', 'Data centre revenue', 'NVIDIA'), 193.737);
});

test('curated research datasets are marked, and [VERIFY] figures are flagged unverified', () => {
  for (const f of fs.readdirSync(CLEAN).filter((f) => f.startsWith('research_'))) {
    const d = ds(f.replace('.json', ''));
    assert.equal(d.curated, true, `${d.key} curated`);
    assert.equal(typeof d.verified, 'boolean', `${d.key} verified flag`);
  }
  assert.equal(ds('research_facts_unverified').verified, false);
  assert.equal(val('research_facts_unverified', 'Supply commitments', 'value'), 279);
});
