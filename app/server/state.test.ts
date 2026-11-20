import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ShowState } from '../shared/schema.ts';
import { cueScore, findCue, words } from './cues.ts';
import { apply, emptyState, loadDatasets, loadSpine, type Ctx } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets); // also proves docs/script/spine.yaml is valid against the real data
const ctx: Ctx = { datasets, spine };
const run = (s: ShowState, ...msgs: unknown[]) =>
  msgs.reduce<ShowState>((acc, m) => {
    const r = apply(acc, m, ctx);
    assert.ok(typeof r !== 'string', r as string);
    return r;
  }, s);
const say = (text: string) => ({ type: 'transcript', text, final: true });
const idx = (id: string) => spine.findIndex((s) => s.id === id);

test('the script loads and every chart/number points at real data', () => {
  assert.ok(spine.length >= 10);
});

test('push validates charts against the data', () => {
  const slide = { id: 's1', title: 'Test', layout: 'split', chart: { type: 'line', datasetKey: 'nope', series: ['Revenue'] } };
  assert.match(apply(emptyState(), { type: 'push', slide }, ctx) as string, /Unknown dataset/);
  assert.match(apply(emptyState(), { type: 'push', slide: { id: 'x' } }, ctx) as string, /Invalid/);
});

test('next walks elements, then slides; back returns a fully built slide', () => {
  let s = run(emptyState(), { type: 'next' });
  assert.equal(s.index, 0);
  const cuda = idx('cuda');
  s = run(s, { type: 'goto', index: cuda });
  assert.equal(s.reveal, 1, 'cued bullets wait');
  s = run(s, { type: 'next' });
  assert.equal(s.reveal, 2);
  s = run(s, { type: 'next' }, { type: 'next' });
  assert.equal(s.index, cuda + 1);
  s = run(s, { type: 'back' });
  assert.equal(s.index, cuda);
  assert.equal(s.reveal, 3);
});

test('speech fires the next slide cue, tolerating filler words and small slips', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('founding') });
  s = run(s, say('so then in two thousand six they'), say('released CUDA which was huge'));
  assert.equal(s.index, idx('cuda'));
  assert.equal(s.heard, '', 'buffer clears after a cue');
  s = run(s, say('thousands of cores working in paralel'));
  assert.equal(s.reveal, 2, 'element cue fired despite the typo');
});

test('cues only listen forward, never jump far ahead or back', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('cuda') });
  s = run(s, say('everything you just watched was built and run by ai'));
  assert.equal(s.index, idx('cuda'));
  s = run(s, { type: 'autoCue', on: false }, say('alexnet in 2012'));
  assert.equal(s.index, idx('cuda'), 'follow-speech off');
});

test('an interim result fires once; its final copy is ignored', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('cuda') });
  s = run(s, { type: 'transcript', text: 'then alexnet', final: false });
  assert.equal(s.index, idx('alexnet'));
  s = run(s, say('then alexnet'));
  assert.equal(s.index, idx('alexnet'));
  assert.equal(s.heard, '');
});

test('cue scoring', () => {
  assert.deepEqual(words('Data Centre, 2006!'), ['data', 'center', '2006']);
  assert.equal(cueScore('the CEO', words('so the ceo resigned')), 1);
  assert.equal(cueScore('built live', words('we built this')), 0.5);
  assert.equal(findCue('nothing relevant here', [{ cue: 'released cuda', target: 1 }]), null);
});
