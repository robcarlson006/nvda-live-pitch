import assert from 'node:assert/strict';
import test from 'node:test';
import { generic, libTitle } from '../src/ChartLibrary.tsx';
import { checkSlide, loadDatasets } from './state.ts';

test('every dataset in the operator chart library is accepted by the stage', () => {
  const datasets = loadDatasets();
  const refused: string[] = [];
  for (const d of datasets.values()) {
    if (!d.x.length || !Object.keys(d.series).length) continue;
    const problem = checkSlide({ id: `lib-${d.key}`, layout: 'chart', title: libTitle(d.title), bullets: [], chart: generic(d), sources: [] }, datasets);
    if (problem) refused.push(`${d.key}: ${problem}`);
  }
  assert.deepEqual(refused, []);
});

test('library titles lose typed numbers but keep years', () => {
  assert.equal(libTitle('What 44 Wall Street analysts rate NVIDIA'), 'What Wall Street analysts rate NVIDIA');
  assert.equal(libTitle('The DCF on one page (base case, 10.55% WACC)'), 'The DCF on one page');
  assert.equal(libTitle('Bloomberg ESG pillar scores, out of 10'), 'Bloomberg ESG pillar scores');
  assert.equal(libTitle('NVIDIA revenue by quarter, FY24 to 2026'), 'NVIDIA revenue by quarter, FY24 to 2026');
});
