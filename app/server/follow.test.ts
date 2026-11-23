import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import Anthropic from '@anthropic-ai/sdk';
import type { ShowState } from '../shared/schema.ts';
import { Budget } from './budget.ts';
import { accept, Director, type DirectorCaller, type Verdict } from './director.ts';
import { cueSlides, Follow } from './follow.ts';
import { apply, emptyState, loadDatasets, loadSpine } from './state.ts';

const datasets = loadDatasets();
const FIXTURE = new URL('./fixtures/spine-v3.yaml', import.meta.url).pathname; // engine tests run on the frozen v3 script; the live v4 spine is checked in spine-v4.test.ts
const spine = loadSpine(datasets, FIXTURE);
const idx = (id: string) => spine.findIndex((s) => s.id === id);
const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'follow-')), 'spend.json');
const reply = (v: unknown) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v) }], usage: { input_tokens: 10, output_tokens: 10 } }) as unknown as Anthropic.Message;
const verdict = (action: Verdict['action'], slide: string | null = null, covered = 0): Verdict => ({ action, slide, covered });

/** The real Follow and Director, with a fake Claude and a fake clock. */
function rig(call: DirectorCaller, budget = new Budget(tmp(), 4)) {
  let now = 1_000;
  const tangents: string[] = [];
  const box = { state: { ...emptyState(), follow: 'live' as const } as ShowState };
  const director = new Director(budget, call, () => now);
  const follow = new Follow(director, { get: () => box.state, set: (s) => (box.state = s), spine: () => spine, datasets, tangent: (h) => tangents.push(h) }, () => now);
  const say = async (text: string, ms = 3_000) => {
    now += ms;
    follow.hear(text, true);
    await new Promise((r) => setTimeout(r, 5));
  };
  const go = (msg: unknown) => {
    const r = apply(box.state, msg, { datasets, spine });
    assert.ok(typeof r !== 'string', r as string);
    box.state = r;
    follow.manual();
  };
  return { box, director, follow, say, go, tangents, tick: (ms: number) => (now += ms), at: () => spine[box.state.index]?.id ?? 'standby' };
}
const always = (v: unknown): DirectorCaller => async () => reply(v);

test('follow: speech in any words moves the deck, and builds points', async () => {
  const seq = [verdict('slide', 'founding', 0), verdict('points', null, 2), verdict('slide', 'near-bust', 0)];
  let n = 0;
  const r = rig(async () => reply(seq[n++]));
  await r.say('so three lads are sat in a diner in california');
  assert.equal(r.at(), 'founding');
  await r.say('they want good graphics on every home computer paid for by games');
  assert.equal(r.box.state.reveal, 3);
  await r.say('and the very first thing they made got sent back');
  assert.equal(r.at(), 'near-bust');
});

test('follow: a far jump needs two verdicts in a row; nonsense and unknown slides never move the deck', async () => {
  const r = rig(always(verdict('slide', 'supply', 0)));
  r.go({ type: 'goto', index: idx('cuda') });
  r.tick(10_000);
  await r.say('the thing nobody can copy is the manufacturing in taiwan');
  assert.equal(r.at(), 'cuda');
  await r.say('almost all of the advanced chips come from there');
  assert.equal(r.at(), 'supply');
  for (const bad of [verdict('slide', 'no-such-slide'), verdict('slide', null), 'not json at all', '{"action":"explode","slide":null,"covered":0}', { action: 'points', slide: null, covered: 'lots' }]) {
    const b = rig(always(bad));
    b.go({ type: 'goto', index: idx('cuda') });
    b.tick(10_000);
    await b.say('some words that are heard here right now');
    await b.say('and some more words that are heard here');
    assert.equal(b.at(), 'cuda', JSON.stringify(bad));
  }
});

test('follow: a person always wins: the deck stays where they put it, and older speech no longer counts', async () => {
  const r = rig(always(verdict('slide', 'wall-street', 0)));
  r.go({ type: 'goto', index: idx('cuda') });
  await r.say('investors hated it and the share price fell', 1_000);
  assert.equal(r.at(), 'cuda', 'held for a moment after a manual move');
  r.tick(10_000);
  await r.say('investors really did hate it so much');
  assert.equal(r.at(), 'wall-street');
});

test('follow: a verdict about a slide the operator has since left is thrown away', async () => {
  let release!: (m: Anthropic.Message) => void;
  const r = rig(() => new Promise((res) => (release = res)));
  r.go({ type: 'goto', index: idx('cuda') });
  r.tick(10_000);
  await r.say('wall street hated all of this spending a lot');
  r.go({ type: 'goto', index: idx('supply') });
  release(reply(verdict('slide', 'wall-street', 0)));
  await new Promise((res) => setTimeout(res, 5));
  assert.equal(r.at(), 'supply');
});

test('follow drill: timeout, 429, refused key, garbage and spend cap: the deck stays put, says so, and cue words take over', async () => {
  const faults: [string, DirectorCaller][] = [
    ['timeout', async () => { throw new Anthropic.APIConnectionTimeoutError(); }],
    ['429', async () => { throw new Anthropic.RateLimitError(429, {} as any, 'slow down', new Headers()); }],
    ['401', async () => { throw new Anthropic.AuthenticationError(401, {} as any, 'no', new Headers()); }],
    ['offline', async () => { throw new Anthropic.APIConnectionError({ message: 'x' }); }],
    ['not json', async () => reply('<html>busy</html>')],
  ];
  for (const [name, call] of faults) {
    const r = rig(call);
    r.go({ type: 'goto', index: idx('cuda') });
    r.tick(10_000);
    await r.say('wall street hated it and the price halved');
    assert.equal(r.at(), 'cuda', name);
    assert.ok(r.director.error, `${name}: the operator is told`);
    const ctx = { datasets, spine, cueSlides: cueSlides(r.box.state, r.director.error, true) };
    const s = apply(r.box.state, { type: 'transcript', text: 'wall street hated it', final: true }, ctx) as ShowState;
    assert.equal(spine[s.index].id, 'wall-street', `${name}: cue words take over`);
  }
  const broke = rig(async () => assert.fail('no call may be made'), new Budget(tmp(), 0));
  await broke.say('three engineers in a diner with a lot of coffee');
  assert.match(broke.director.error!, /cap/);
});

test('follow: while Claude is reachable, cue words alone never change slide, but still build the slide on screen', () => {
  const s = { ...emptyState(), follow: 'live' as const };
  const ctx = { datasets, spine, cueSlides: cueSlides(s, null, true) };
  const at = apply(s, { type: 'goto', index: idx('cuda') }, ctx) as ShowState;
  const a = apply(at, { type: 'transcript', text: 'wall street hated it', final: true }, ctx) as ShowState;
  assert.equal(spine[a.index].id, 'cuda');
  const b = apply(a, { type: 'transcript', text: 'doing one job after another', final: true }, ctx) as ShowState;
  assert.ok(b.reveal > at.reveal);
  assert.equal(cueSlides({ ...s, follow: 'script' }, null, true), true);
  assert.equal(cueSlides(s, null, false), true);
});

test('follow: recovers by itself once Claude answers again', async () => {
  let up = false;
  const r = rig(async () => {
    if (!up) throw new Anthropic.APIConnectionError({ message: 'x' });
    return reply(verdict('slide', 'founding', 0));
  });
  await r.say('three engineers in a diner with a lot of coffee');
  assert.ok(r.director.error);
  up = true;
  await r.say('and they had an idea about computer graphics');
  assert.equal(r.director.error, null);
  assert.equal(r.at(), 'founding');
});

test('follow: tangents need two verdicts; question mode and follow-off are deaf', async () => {
  const r = rig(always(verdict('tangent')));
  r.go({ type: 'goto', index: idx('cuda') });
  r.tick(10_000);
  await r.say('my granddad worked in the shipyards all his life');
  assert.equal(r.tangents.length, 0);
  await r.say('and he always said train your apprentices in the bad years');
  assert.equal(r.tangents.length, 1);
  const q = rig(async () => assert.fail('must not listen'));
  q.box.state = { ...q.box.state, mode: 'question' };
  await q.say('what about the energy use of all of this');
  q.box.state = { ...q.box.state, mode: 'script', autoCue: false };
  await q.say('what about the energy use of all of this');
});

test('accept: the next slide at once, further or backwards twice, switched-off slides never', () => {
  const s = { ...emptyState(), index: idx('cuda'), live: spine[idx('cuda')], reveal: 1 };
  assert.equal(accept(verdict('slide', 'wall-street'), s, spine, 1), true);
  assert.equal(accept(verdict('slide', 'first-gpu'), s, spine, 1), false);
  assert.equal(accept(verdict('slide', 'first-gpu'), s, spine, 2), true);
  assert.equal(accept(verdict('slide', 'close'), s, spine, 1), false);
  assert.equal(accept(verdict('slide', 'near-bust'), { ...s, skipped: ['near-bust'] }, spine, 5), false);
  assert.equal(accept(verdict('stay'), s, spine, 9), false);
});

test('follow: one sentence never runs the deck forward several slides', async () => {
  let n = 0;
  const order = ['beats', 'segments', 'peers', 'valuation'];
  const r = rig(async () => reply(verdict('slide', order[Math.min(n++, 3)], 0)));
  r.go({ type: 'goto', index: idx('last-quarter') });
  r.tick(10_000);
  await r.say('and here is the thing about it now', 700);
  await r.say('you can see where it is going', 700);
  await r.say('and that is how it goes', 700);
  assert.ok(['beats', 'last-quarter'].includes(r.at()), r.at());
});

test('early move: clear talk about the NEXT slide moves the deck before Claude commits, but only while Claude is answering', async () => {
  const text = 'investors despised it because the chips cost more and gamers could not see the point of cuda';
  // Claude says "stay" (as a cautious model would), so any move here is the local one.
  const r = rig(async () => reply(verdict('stay')));
  r.box.state = apply(r.box.state, { type: 'goto', index: idx('cuda') }, { datasets, spine }) as ShowState;
  r.follow.manual();
  r.director.sinceMove = 99;
  r.tick(5_000);
  await r.say('and that is the whole idea of the software platform'); // Claude answers: healthy
  assert.ok(r.director.lastOk > 0);
  assert.equal(r.at(), 'cuda');
  await r.say(text); // the slide on screen is not built yet: Claude's call
  assert.equal(r.at(), 'cuda', 'not while the slide on screen is still being built');
  r.box.state = { ...r.box.state, reveal: spine[idx('cuda')].bullets.length + 1 };
  await r.say(text);
  assert.equal(r.at(), 'cuda', 'one result is not enough');
  await r.say(text);
  assert.equal(r.at(), 'wall-street', 'two in a row, slide built: ahead of Claude');
  // right after a move, more of the same must not run the deck forward again
  await r.say('wall street hated it and the share price fell and the stock was halved in the crisis');
  assert.equal(r.at(), 'wall-street');
});

test('early move: never before Claude has answered, never across a skipped-ahead slide, never while a person holds the deck', async () => {
  const text = 'investors despised it because the chips cost more and gamers could not see the point of cuda';
  const dead = rig(async () => { throw new Error('offline'); });
  dead.box.state = apply(dead.box.state, { type: 'goto', index: idx('cuda') }, { datasets, spine }) as ShowState;
  dead.director.sinceMove = 99;
  dead.box.state = { ...dead.box.state, reveal: spine[idx('cuda')].bullets.length + 1 };
  await dead.say(text);
  await dead.say(text);
  assert.equal(dead.at(), 'cuda', 'Claude never answered');

  const held = rig(async () => reply(verdict('stay')));
  held.box.state = apply(held.box.state, { type: 'goto', index: idx('cuda') }, { datasets, spine }) as ShowState;
  held.director.sinceMove = 99;
  await held.say('and that is the whole idea of the software platform');
  held.follow.manual(); // the operator pressed a key just now
  held.box.state = { ...held.box.state, reveal: spine[idx('cuda')].bullets.length + 1 };
  await held.say(text, 500);
  await held.say(text, 500);
  assert.equal(held.at(), 'cuda', 'held for a few seconds after a person moved the deck');

  const far = rig(async () => reply(verdict('stay')));
  far.box.state = apply(far.box.state, { type: 'goto', index: idx('cuda') }, { datasets, spine }) as ShowState;
  far.director.sinceMove = 99;
  await far.say('and that is the whole idea of the software platform');
  far.tick(5_000);
  await far.say('the biggest companies and governments are all building AI and you would have to stop innovation itself to stop this company');
  assert.equal(far.at(), 'cuda', 'a slide further ahead is Claude\'s call, not the early rule\'s');
});
