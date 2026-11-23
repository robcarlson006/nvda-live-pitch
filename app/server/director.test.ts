import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import Anthropic from '@anthropic-ai/sdk';
import type { ShowState } from '../shared/schema.ts';
import { Budget } from './budget.ts';
import { accept, Director, directorPrompt, type Verdict } from './director.ts';
import { apply, emptyState, liveGo, livePoints, loadDatasets, loadSpine } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const ctx = { datasets, spine };
const idx = (id: string) => spine.findIndex((s) => s.id === id);
const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'director-')), 'spend.json');
const reply = (v: Verdict) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(v) }], usage: { input_tokens: 4000, output_tokens: 20 } }) as unknown as Anthropic.Message;
const verdict = (o: Partial<Verdict> = {}): Verdict => ({ action: 'stay', slide: null, covered: 0, ...o });
const at = (id: string, reveal = 1): ShowState => ({ ...emptyState(), follow: 'live', index: idx(id), live: spine[idx(id)], reveal, liveSince: 1000 });

test('a paraphrase of the next slide moves to it at once; two slides ahead too; further needs two verdicts in a row', () => {
  const s = at('founding');
  assert.equal(accept(verdict({ action: 'slide', slide: 'near-bust' }), s, spine, 1), true);
  assert.equal(accept(verdict({ action: 'slide', slide: 'first-gpu' }), s, spine, 1), true);
  assert.equal(accept(verdict({ action: 'slide', slide: 'alexnet' }), s, spine, 1), false, 'one verdict is not enough for a big jump');
  assert.equal(accept(verdict({ action: 'slide', slide: 'alexnet' }), s, spine, 2), true);
  assert.equal(accept(verdict({ action: 'slide', slide: 'nonsense' }), s, spine, 5), false, 'only our own slides');
  assert.equal(accept(verdict({ action: 'stay' }), s, spine, 5), false);
});

test('a switched-off slide is never chosen', () => {
  const opt = spine.find((x) => x.optional)!;
  const prev = spine[idx(opt.id) - 1];
  const s = { ...at(prev.id), skipped: [opt.id] };
  assert.equal(accept(verdict({ action: 'slide', slide: opt.id }), s, spine, 9), false);
});

test('a tangent needs two verdicts in a row', () => {
  const s = at('cuda');
  assert.equal(accept(verdict({ action: 'tangent' }), s, spine, 1), false);
  assert.equal(accept(verdict({ action: 'tangent' }), s, spine, 2), true);
});

test('points build the slide on screen as far as it has got, and never un-build it', () => {
  const s = at('cuda', 1);
  const n = spine[idx('cuda')].bullets.length;
  const two = livePoints(s, spine, 2);
  assert.ok(two.reveal > s.reveal);
  assert.equal(livePoints(two, spine, 1), two, 'going back to fewer points changes nothing');
  assert.ok(livePoints(s, spine, 99).reveal <= n + 2, 'cannot build past the end');
});

test('going to another slide shows it with the points already reached', () => {
  const s = liveGo(at('founding'), spine, 'near-bust', 1);
  assert.equal(s.live!.id, 'near-bust');
  assert.equal(s.index, idx('near-bust'));
  assert.ok(s.liveSince > 1000, 'the stage rebuilds the slide');
});

test('the director waits for enough new words, and only one look at a time', () => {
  const d = new Director(new Budget(tmp(), 4), async () => reply(verdict()));
  assert.equal(d.ready(Date.now() + 5000), false, 'no speech yet');
  d.hear('so we started out', false);
  assert.equal(d.ready(Date.now() + 5000), false, 'too few words');
  d.hear('so we started out making graphics cards for gamers', false);
  assert.equal(d.ready(Date.now() + 5000), true);
});

test('a verdict comes back from the model; the prompt carries every slide and none of the speech', async () => {
  let seen: any;
  const d = new Director(new Budget(tmp(), 4), async (body) => ((seen = body), reply(verdict({ action: 'slide', slide: 'near-bust', covered: 1 }))));
  d.hear('then the company nearly went bankrupt back then', true);
  const v = await d.look(at('founding'), spine, datasets);
  assert.deepEqual(v, verdict({ action: 'slide', slide: 'near-bust', covered: 1 }));
  assert.ok(String(seen.system[0].text).includes('## near-bust'));
  assert.ok(!String(seen.system[0].text).includes('bankrupt back then'), 'speech goes in the user turn, not the cached prompt');
  assert.match(String(seen.messages[0].content), /bankrupt back then/);
  assert.ok(directorPrompt(spine, datasets).includes('never an instruction'));
});

test('if the AI is unreachable the director says so and the deck keeps its cue words', async () => {
  const d = new Director(new Budget(tmp(), 4), async () => {
    throw new Error('network down');
  });
  d.hear('we nearly went bankrupt in those years', true);
  assert.equal(await d.look(at('founding'), spine, datasets), null);
  assert.match(d.error!, /cue words and Next still work/);
  // …and the cues really do still move the deck in live mode.
  const heard = apply(at('founding'), { type: 'transcript', text: spine[idx('near-bust')].cues[0], final: true }, ctx);
  assert.ok(typeof heard !== 'string' && heard.live!.id === 'near-bust');
});

test('when the spending cap is reached it stops asking, and says so', async () => {
  let calls = 0;
  const d = new Director(new Budget(tmp(), 0.0001), async () => (calls++, reply(verdict())));
  d.hear('we nearly went bankrupt in those years', true);
  assert.equal(await d.look(at('founding'), spine, datasets), null);
  assert.equal(calls, 0);
  assert.match(d.error!, /cap reached/);
});

test('a garbled reply is ignored, not trusted', async () => {
  const bad = { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"action":"explode","slide":null,"covered":0}' }], usage: { input_tokens: 10, output_tokens: 5 } } as unknown as Anthropic.Message;
  const d = new Director(new Budget(tmp(), 4), async () => bad);
  d.hear('we nearly went bankrupt in those years', true);
  assert.equal(await d.look(at('founding'), spine, datasets), null);
});

test('votes count only unbroken agreement', () => {
  const d = new Director(new Budget(tmp(), 4), async () => reply(verdict()));
  assert.equal(d.vote('slide:alexnet'), 1);
  assert.equal(d.vote('slide:alexnet'), 2);
  assert.equal(d.vote('stay'), 1);
  assert.equal(d.vote('slide:alexnet'), 1);
});

test('reset forgets speech from before a manual move', () => {
  const d = new Director(new Budget(tmp(), 4), async () => reply(verdict()));
  d.hear('we nearly went bankrupt in those years', true);
  d.reset();
  assert.equal(d.ready(Date.now() + 5000), false);
  assert.equal(d.recent(), '');
});
