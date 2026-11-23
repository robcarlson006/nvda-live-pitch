import assert from 'node:assert/strict';
import { test } from 'node:test';
import { elementCount } from '../shared/schema.ts';
import { leadScore, LEAD_REVEAL } from './lead.ts';
import { apply, emptyState, loadDatasets, loadSpine } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const ctx = { datasets, spine, cueSlides: false };
const idx = (id: string) => spine.findIndex((s) => s.id === id);
const say = (text: string, final = false) => ({ type: 'transcript', text, final });
const live = (id: string, over = {}) => {
  const r = apply({ ...emptyState(), follow: 'live', autoCue: true }, { type: 'goto', index: idx(id) }, ctx) as any;
  return { ...r, ...over };
};
const feed = (s: any, text: string, final = false) => apply(s, say(text, final), ctx) as any;

test('lead: the next element lands when its own sentence is being said, not before', () => {
  const s0 = live('supply');
  const at = s0.reveal;
  // talk about something else on the same slide's topic words that belong to a later element: nothing yet
  assert.equal(feed(s0, 'and then there is the weather').reveal, at, 'unrelated talk');
  const s1 = feed(s0, "one company TSMC in Taiwan makes nine in ten of the world's top chips");
  assert.equal(s1.reveal, at + 1, 'first element');
  assert.equal(s1.lastCue.phrase, 'heard it', 'by the local lead, not a cue word');
});

test('lead: an interim result and its final copy reveal once, not twice', () => {
  const s0 = live('supply');
  const a = feed(s0, "one company TSMC in Taiwan makes nine in ten of the world's top chips");
  const b = feed(a, "one company TSMC in Taiwan makes nine in ten of the world's top chips", true);
  assert.equal(b.reveal, a.reveal);
});

test('lead: off in script mode, with auto-cue off, or in question mode', () => {
  const t = "one company TSMC in Taiwan makes nine in ten of the world's top chips";
  const base = live('supply');
  assert.equal(feed({ ...base, follow: 'script' }, t).reveal, base.reveal);
  assert.equal(feed({ ...base, autoCue: false }, t).reveal, base.reveal);
  assert.equal(feed({ ...base, mode: 'question' }, t).reveal, base.reveal);
});

test('lead: never builds past the last element and never un-builds', () => {
  const sl = spine[idx('supply')];
  const full = live('supply', { reveal: elementCount(sl) });
  assert.equal(feed(full, "one company TSMC in Taiwan makes nine in ten of the world's top chips").reveal, elementCount(sl));
  assert.equal(leadScore([], sl, 0, spine), 0);
  assert.equal(leadScore(['taiwan'], sl, 0, spine), 0, 'one word is never enough');
  assert.ok(LEAD_REVEAL >= 0.4, 'threshold is not loosened below what was measured');
});

test('glow: speech arriving word by word lights the next element before it lands; glow never dims', () => {
  const s0 = live('supply');
  const words = "one company TSMC in Taiwan makes nine in ten of the world's top chips".split(' ');
  let s = s0, lit = -1, landed = -1, last = 0;
  words.forEach((_, k) => {
    s = feed(s, words.slice(0, k + 1).join(' '));
    const g = s.glow && s.glow.since === s.liveSince && s.glow.at === s.reveal ? s.glow.v : 0;
    if (s.reveal === s0.reveal) { assert.ok(g >= last, 'never dims'); last = g; if (g > 0 && lit < 0) lit = k; }
    if (s.reveal > s0.reveal && landed < 0) landed = k;
  });
  assert.ok(lit >= 0 && landed >= 0 && lit < landed, `glowed at word ${lit}, landed at word ${landed}`);
});
