import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import Anthropic from '@anthropic-ai/sdk';
import type { ShowState, Slide } from '../shared/schema.ts';
import { Ai, toSlide, usable, type Reply } from './ai.ts';
import { findAnswer, loadBank } from './bank.ts';
import { checkLine, figures, onPage, shorten, toWebSlide } from './research.ts';
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
const reply = (o: Partial<Reply> = {}): Reply => ({ show: true, answered: true, layout: 'split', title: 'Scope 3 is rising', bullets: ['{{nvda_emissions | Scope 3 | FY26}} in FY26'], chart: { type: 'line', datasetKey: 'nvda_emissions', series: ['Scope 3'], highlight: 'FY26', from: null, to: null }, stat: null, icons: [], ...o });
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

test('an answer with no data says so; a presenter aside just gets its graphic', async () => {
  const r = reply({ layout: 'statement', bullets: ['We do not have that figure'], chart: null, icons: ['robot', 'hospital'] });
  const a = await go(new Ai(new Budget(tmp(), 4), async () => message(r), () => true));
  assert.ok('slide' in a && !a.answered);
  assert.deepEqual(a.slide.sources, ['Pitch evidence bank · no supporting source for this question']);
  const t = await go(new Ai(new Budget(tmp(), 4), async () => message(r), () => true), { ...job, kind: 'riff' });
  assert.ok('slide' in t);
  assert.deepEqual([t.slide.sources, t.slide.icons], [[], ['robot', 'hospital']]);
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
  assert.equal(addDraft({ ...s, autoShow: true, drafts: [] }, d).drafts[0]?.id, d.id, 'answers always wait for approval');
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
  for (const q of ['what is your favourite product', 'how fast is revenue growing', 'why is amd cheaper', 'what has the eu said about the energy use of data centers', 'how much water do data centers use globally', 'what is the carbon footprint of training chatgpt']) assert.equal(findAnswer(bank, q), null, q);
});

// ---------- Web research ----------

const cite = (cited_text: string, url = 'https://www.iea.org/x') => ({ type: 'web_search_result_location', cited_text, url, title: 'IEA', encrypted_index: '' }) as any;
const found = { type: 'web_search_tool_result', tool_use_id: 't', content: [{ type: 'web_search_result', url: 'https://www.iea.org/x', title: 'IEA' }] };
const cited = (text: string, ...cites: any[]) => ({ type: 'text', text, citations: cites });
const plain = (text: string) => ({ type: 'text', text, citations: null });
const web = (blocks: unknown[], read = async () => '') => toWebSlide(blocks as any, '22 November 2026', read);

test('a researched figure must match its source, including its unit', () => {
  assert.deepEqual(figures('$1,200 million, 20 per cent, 3% and 1.5bn; CO2 and 415 TWh'), ['1200m', '20%', '3%', '1.5b', '415']);
  const ok = (text: string, src: string) => checkLine({ text, cites: [cite(src)] });
  assert.equal(ok('Used 415 TWh in 2024', 'Data centres used about 415 TWh'), null);
  assert.equal(ok('Costs 5 billion', 'It cost $5bn'), null);
  assert.match(ok('Costs 5 billion', 'It cost $5 million')!, /5b/);
  assert.match(ok('Used 450 TWh', 'used 415 TWh')!, /450/);
  assert.match(ok('Use has doubled', 'Use has risen')!, /doubled/);
  assert.match(checkLine({ text: 'No figures, no source', cites: [] })!, /no source/);
});

test('if the excerpt is too short, the page itself is checked, close together', () => {
  const page = 'Electricity demand. Data centres accounted for around 1.5% of the world’s electricity consumption in 2024, or 415 terawatt-hours. ' + 'filler '.repeat(400) + ' 9% of something else';
  assert.ok(onPage('Data centres took 1.5% of electricity consumption, 415 terawatt-hours, in 2024', page));
  assert.ok(!onPage('Data centres took 9% of electricity consumption, 415 terawatt-hours', page), 'figures from different passages');
  assert.ok(!onPage('Cement plants emitted 415 somethings worldwide yesterday', page), 'same figure, different subject');
});

test('a web slide keeps checked facts, drops the rest, and says where they came from', async () => {
  const r = await web([plain('I will search.'), found, plain('TITLE: Data centre electricity\n-\n'), cited('Data centres used 415 TWh in 2024', cite('used 415 TWh')), plain('. That is a lot.\n-\n'), cited('It will reach 999 TWh', cite('will grow', 'https://b.com/y')), plain('\n- Made up and uncited 7%')]);
  assert.ok(typeof r !== 'string');
  assert.deepEqual(r.slide.bullets, ['Data centres used 415 TWh in 2024.']);
  assert.equal(r.slide.title, 'Data centre electricity');
  assert.deepEqual(r.slide.sources, ['Live web research, 22 November 2026, not our own data: iea.org']);
  assert.equal(r.dropped.length, 1);
  assert.match((await web([found, plain('NOT FOUND')])) as string, /No reliable/);
  assert.match((await web([found, plain('TITLE: x\n- nothing cited 5%')])) as string, /no fact/);
  const t = await web([found, plain('TITLE: Use doubled to 9%\n'), cited('It grew', cite('It grew'))]);
  assert.equal(typeof t !== 'string' && t.slide.title, 'What published sources say');
});

test('a question our data cannot answer is flagged for research; a web slide always waits for approval', async () => {
  const r = await go(new Ai(new Budget(tmp(), 4), async () => message(reply({ answered: false, chart: null, layout: 'statement', bullets: ['We do not have that'] })), () => true));
  assert.equal('slide' in r && r.answered, false);
  const slide = toSlide(reply(), datasets, 'gen-web-1') as Slide;
  const s = addDraft({ ...emptyState(), autoShow: true }, { id: 'w', kind: 'answer', heard: 'q', slide, from: 'web', at: 0 });
  assert.ok(!isCovered(s) && s.drafts.length === 1);
});

test('research spends within the cap and counts searches', async () => {
  const file = tmp();
  const ai = new Ai(new Budget(file, 4), async () => ({ stop_reason: 'end_turn', content: [found, cited('Data centres used 415 TWh', cite('used 415 TWh'))], usage: { input_tokens: 10_000, output_tokens: 100, server_tool_use: { web_search_requests: 2 } } }) as any, () => true);
  const r = await ai.research('how much power', new AbortController().signal);
  assert.ok('slide' in r && r.links?.length === 1);
  assert.ok(Math.abs(ai.budget.spent - 0.041) < 1e-9);
  const broke = new Ai(new Budget(tmp(), 0.1), async () => assert.fail('should not call'), () => true);
  assert.match(((await broke.research('q', new AbortController().signal)) as any).error, /cap reached/);
});

test('private lives and gossip are never shown; long facts keep their first sentence', async () => {
  const line = (s: string) => cited(s, cite(s));
  for (const s of ['He admitted being unfaithful', 'Reports of relationships with two women', 'She is allegedly a spy', 'Scrutiny over his personal relationships'])
    assert.equal(typeof (await web([found, plain('TITLE: x\n'), line(s)])), 'string', s);
  assert.notEqual(typeof (await web([found, plain('TITLE: x\n'), line("NVIDIA's relationship with TSMC is long-standing")])), 'string');
  const long = 'The board announced that the chief executive resigned, effective immediately. ' + 'And then it carried on at great length about the process. '.repeat(4);
  assert.equal(shorten(long), 'The board announced that the chief executive resigned, effective immediately.');
});
