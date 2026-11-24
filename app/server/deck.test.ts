// The offline backup must line up with the live deck: the stage shows backup page N for spine slide N.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { loadDatasets, loadSpine } from './state.ts';

const FALLBACK = path.resolve(import.meta.dirname, '../public/fallback');

test('there is one static backup page per spine slide, in order', () => {
  const spine = loadSpine(loadDatasets());
  const pages = fs.readdirSync(FALLBACK).filter((f) => /^slide-\d+\.jpg$/.test(f));
  assert.equal(pages.length, spine.length, `backup has ${pages.length} pages, spine has ${spine.length} slides: run python3 fallback/build.py`);
  const order = JSON.parse(fs.readFileSync(path.join(FALLBACK, 'pages.json'), 'utf8'));
  assert.deepEqual(order.spine, spine.map((s) => s.id), 'backup pages were built from a different spine: run python3 fallback/build.py');
});
