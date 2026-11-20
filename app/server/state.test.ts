import assert from 'node:assert/strict';
import { test } from 'node:test';
import { apply, emptyState, loadDatasets } from './state.ts';

const datasets = loadDatasets();
const slide = { id: 's1', title: 'Test', bullets: [], sources: [], chart: { type: 'line', datasetKey: 'nvda_revenue_quarterly', series: ['Revenue'] } };

test('real datasets load and are sourced', () => {
  assert.ok(datasets.size >= 1);
  for (const d of datasets.values()) {
    assert.ok(d.source && d.asOf, `${d.key} needs source + date`);
    for (const [name, values] of Object.entries(d.series)) assert.equal(values.length, d.x.length, `${d.key}/${name} length`);
  }
});

test('push puts slide live and records history', () => {
  const s = apply(emptyState(), { type: 'push', slide }, datasets);
  assert.ok(typeof s !== 'string');
  assert.equal(s.live?.id, 's1');
  assert.equal(s.history.length, 1);
});

test('rejects unknown dataset, unknown series and malformed slides', () => {
  assert.match(apply(emptyState(), { type: 'push', slide: { ...slide, chart: { ...slide.chart, datasetKey: 'nope' } } }, datasets) as string, /Unknown dataset/);
  assert.match(apply(emptyState(), { type: 'push', slide: { ...slide, chart: { ...slide.chart, series: ['Made up'] } } }, datasets) as string, /no series/);
  assert.match(apply(emptyState(), { type: 'push', slide: { id: 'x' } }, datasets) as string, /Invalid/);
});

test('clear empties the stage but keeps history', () => {
  const s1 = apply(emptyState(), { type: 'push', slide }, datasets);
  const s2 = apply(s1 as never, { type: 'clear' }, datasets);
  assert.ok(typeof s2 !== 'string');
  assert.equal(s2.live, null);
  assert.equal(s2.history.length, 1);
});
