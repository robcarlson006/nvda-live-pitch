import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import Anthropic from '@anthropic-ai/sdk';
import type { ShowState, Slide } from '../shared/schema.ts';
import { Ai, toSlide, usable, type Reply } from './ai.ts';
import { findAnswer, loadBank } from './bank.ts';
import { Budget } from './budget.ts';
import { addDraft, apply, emptyState, isCovered, loadDatasets, loadSpine, offScript, relocate } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const ctx = { datasets, spine };
const idx = (id: string) => spine.findIndex((s) => s.id === id);
const run = (s: ShowState, ...msgs: unknown[]) =>
  msgs.reduce<ShowState>((acc, m) => {
    const r = apply(acc, m, ctx);
    assert.ok(typeof r !== 'string', r as string);
    return r;
  }, s);
const say = (text: string, final = true) => ({ type: 'transcript', text, final });
const reply = (o: Partial<Reply> = {}): Reply => ({ show: true, layout: 'split', title: 'Scope 3 is rising', bullets: ['{{nvda_emissions | Scope 3 | FY26}} in FY26'], chart: { type: 'line', datasetKey: 'nvda_emissions', series: ['Scope 3'], highlight: 'FY26', from: null, to: null }, stat: null, ...o });
const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'budget-')), 'spend.json');
const message = (r: unknown) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(r) }], usage: { input_tokens: 1000, output_tokens: 300 } }) as unknown as Anthropic.Message;
const job = { kind: 'answer', heard: 'what about emissions', onScreen: 'nothing' } as const;
const go = (ai: Ai, j: any = job) => ai.build(j, datasets, spine, new AbortController().signal);

test('Claude cannot put its own numbers on a slide, in digits or words', () => {
  assert.equal(typeof toSlide(reply(), datasets, 'gen-1'), 'object');
  for (const bullets of [['Own emissions per $1m'], ['Own Scope 1+2 is clean'], ['outside Scope 1 and 2'], ['Scopes 1, 2 and 3']])
    assert.equal(typeof toSlide(reply({ bullets }), datasets, 'gen-1'), 'object', bullets[0]);
  assert.equal(typeof toSlide(reply({ bullets: ['Scope 3 rose 55'] }), datasets, 'gen-1'), 'string');
  for (const bullets of [['Up 55% this year'], ['Emissions doubled'], ['About ninety percent'], ['A trillion dollars'], ['{{nvda_emissions | Scope 3 | FY26}} is up threefold'], ['{{nvda_emissions | Scope 3 | FY99}}']])
    assert.equal(typeof toSlide(reply({ bullets }), datasets, 'gen-1'), 'string', bullets[0]);
  assert.match(toSlide(reply({ chart: { ...reply().chart!, datasetKey: 'made_up' } }), datasets, 'gen-1') as string, /Unknown dataset/);
  assert.match(toSlide(reply({ bullets: ['{{research_facts_unverified | Supply commitments | value}}'] }), datasets, 'gen-1') as string, /may not be used/);
  assert.ok(!usable(datasets).some((d) => d.key === 'research_facts_unverified'));
});

test('if a correction still breaks the rules, only the bad bullet is lost', async () => {
  const r = await go(new Ai(new Budget(tmp(), 4), async () => message(reply({ bullets: ['Up 55%', 'Chip making is in Scope 3'] })), () => true));
  assert.deepEqual('slide' in r && r.slide.bullets, ['Chip making is in Scope 3']);
  assert.ok('error' in (await go(new Ai(new Budget(tmp(), 4), async () => message(reply({ title: 'Up 55%' })), () => true))), 'a bad title is never shown');
});

test('a line chart drops series too small to see', () => {
  const s = toSlide(reply({ chart: { ...reply().chart!, series: ['Scope 1', 'Scope 3'] } }), datasets, 'gen-1') as Slide;
  assert.deepEqual(s.chart!.series, ['Scope 3']);
});

test('a slide with no data says so', () => {
  const s = toSlide(reply({ layout: 'statement', bullets: ['We do not have that figure'], chart: null }), datasets, 'gen-1') as Slide;
  assert.deepEqual(s.sources, ['Team commentary; no dataset used']);
});

test('spending: capped before the call, kept across restarts, uncertain means spent', async () => {
  const file = tmp();
  let calls = 0;
  const ai = new Ai(new Budget(file, 4), async () => (calls++, message(reply())), () => true);
  assert.ok('slide' in (await go(ai)));
  assert.ok(Math.abs(new Budget(file, 4).spent - 0.005) < 1e-9, 'real cost is saved');
  const broke = new Ai(new Budget(file, 0.02), async () => (calls++, message(reply())), () => true);
  assert.match(((await go(broke)) as any).error, /cap reached/);
  assert.equal(calls, 1, 'no call is made once the cap could be passed');
  fs.writeFileSync(file, 'garbage');
  assert.equal(new Budget(file, 4).spent, 4);
  const lost = new Ai(new Budget(tmp(), 4), async () => { throw new Anthropic.APIConnectionError({ message: 'x' }); }, () => true);
  assert.match(((await go(lost)) as any).error, /Could not reach/);
  assert.ok(lost.budget.spent > 0, 'a dropped call counts as spent');
});

test('a bad slide gets one correction, then an error; a pointless reaction is skipped', async () => {
  const seq = [reply({ bullets: ['Up 55%'] }), reply()];
  let n = 0;
  assert.ok('slide' in (await go(new Ai(new Budget(tmp(), 4), async () => message(seq[n++]), () => true))));
  assert.equal(n, 2);
  n = 0;
  const r = await go(new Ai(new Budget(tmp(), 4), async () => (n++, message({ nope: 1 })), () => true));
  assert.ok('error' in r && n === 2);
  assert.deepEqual(await go(new Ai(new Budget(tmp(), 4), async () => message(reply({ show: false })), () => true), { ...job, kind: 'riff' }), { skip: true });
});

test('a question fires no cues, and its trailing words are ignored', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('four-layers') }, { type: 'question', action: 'start' }, say('on paper amd beats you so'), say('why buy', false));
  assert.equal(spine[s.index].id, 'four-layers');
  assert.equal(`${s.question} ${s.questionTail}`, 'on paper amd beats you so why buy');
  s = run(s, { type: 'question', action: 'answer' }, say('why buy amds latest chip'));
  assert.equal(spine[s.index].id, 'four-layers');
  s = run(s, say('amds latest chip'));
  assert.equal(spine[s.index].id, 'chips', 'and listening carries on afterwards');
});

test('a live-built slide covers the script without losing its place', () => {
  const slide = toSlide(reply(), datasets, 'gen-1') as Slide;
  const d = { id: 'd1', kind: 'answer', heard: 'q', slide, from: 'claude', at: 0 } as const;
  let s = run(emptyState(), { type: 'goto', index: idx('cuda') });
  const reveal = s.reveal;
  s = addDraft(s, d);
  assert.equal(s.live!.id, 'cuda', 'waits for approval');
  const shown = run(s, { type: 'draft', action: 'show', id: 'd1' });
  assert.ok(isCovered(shown) && shown.drafts.length === 0);
  assert.equal(spine[relocate(shown, spine).index].id, 'cuda');
  const back = run(shown, { type: 'resume' });
  assert.deepEqual([back.live!.id, back.reveal], ['cuda', reveal]);
  assert.equal(run(shown, say('wall street hated it')).live!.id, 'wall-street', 'the next cue still works');
  assert.equal(run(s, { type: 'draft', action: 'reject', id: 'd1' }).drafts.length, 0);
  assert.ok(isCovered(addDraft({ ...s, autoShow: true }, d)));
});

test('off script is noticed; reading any slide is not', () => {
  for (const slide of spine) {
    if (!slide.say) continue;
    const s = { ...emptyState(), index: spine.indexOf(slide), stray: slide.say };
    assert.equal(offScript(s, spine), false, slide.id);
  }
  const s = { ...emptyState(), index: idx('wall-street'), stray: 'let me tell you about something different my grandmother uses robots at her hospital and the nurses there rely on machine translation to speak with patients from poland and it changed how quickly they get treated' };
  assert.equal(offScript(s, spine), true);
});

test('prepared answers are valid and matched by their question, and never by unrelated ones', () => {
  const bank = loadBank(datasets);
  assert.ok(bank.length >= 10);
  for (const e of bank) assert.equal(findAnswer(bank, e.question)?.id, e.id, e.question);
  for (const q of ['what is your favourite product', 'how fast is revenue growing', 'why is amd cheaper']) assert.equal(findAnswer(bank, q), null, q);
});
