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
  assert.equal(val('peers_pe', 'Forward P/E', 'NVIDIA'), 14.07); // DES Est P/E 14.06
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

test('DCF bridge parts add up to the value per share in model_valuation', () => {
  const b = ds('model_dcf_bridge'), v = ds('model_valuation');
  b.x.forEach((c: string, i: number) => {
    const total = Object.values<number[]>(b.series).reduce((t, s) => t + s[i], 0);
    assert.ok(Math.abs(total - v.series['Value per share'][v.x.indexOf(c)]) <= 0.05, `${c}: ${total}`);
  });
});
