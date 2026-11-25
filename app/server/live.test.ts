import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import Anthropic from '@anthropic-ai/sdk';
import type { ShowState, Slide } from '../shared/schema.ts';
import { Ai, toSlide, usable, type Reply } from './ai.ts';
import { findAnswer, loadBank } from './bank.ts';
import { pageText, researchUrl, toWebSlide } from './research.ts';
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

test('a rejected board claim needs research; a riff can keep its valid bullet', async () => {
  const ai = new Ai(new Budget(tmp(), 4), async () => message(reply({ bullets: ['Up 55%', 'Chip making is in Scope 3'] })), () => true);
  const r = await go(ai);
  assert.ok('slide' in r && !r.answered);
  const riff = await go(ai, { ...job, kind: 'riff' });
  assert.deepEqual('slide' in riff && riff.slide.bullets, ['Chip making is in Scope 3']);
  assert.ok('error' in (await go(new Ai(new Budget(tmp(), 4), async () => message(reply({ title: 'Up 55%' })), () => true))), 'a bad title is never shown');
});

test('a garbled board question asks the operator to clarify instead of guessing; a riff ignores clarify', async () => {
  const confused = reply({ answered: false, clarify: 'Only heard "what about the"; ask them to finish the question.' });
  const r = await go(new Ai(new Budget(tmp(), 4), async () => message(confused), () => true));
  assert.deepEqual(r, { clarify: 'Only heard "what about the"; ask them to finish the question.' });
  const riff = await go(new Ai(new Budget(tmp(), 4), async () => message(confused), () => true), { ...job, kind: 'riff' });
  assert.ok('slide' in riff, 'clarify only applies to board questions');
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
  s = run(s, { type: 'question', action: 'answer' }, say('why buy their tensor cores'));
  assert.equal(spine[s.index].id, 'four-layers', "the question's trailing words fire nothing");
  s = run(s, say('tensor cores'));
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

test('prepared matches do not answer only one part of a compound question', () => {
  const bank = loadBank(datasets);
  assert.ok(findAnswer(bank, 'Could you talk about supply chain emissions?'));
  for (const question of [
    'What about Scope 3? What is your forecast for battery storage?',
    'What about Scope 3 and how much power do data centres use globally?',
    'What about customer concentration and export controls?',
    'Which governance policies apply to a private company in Brazil?',
  ]) assert.equal(findAnswer(bank, question), null, question);
});

test('a sourced local reply with one evidence line cannot pass as a complete compound answer', async () => {
  const ai = new Ai(new Budget(tmp(), 4), async () => message(reply()), () => true);
  const result = await go(ai, { ...job, heard: 'What about Scope 3? What is the forecast for battery storage?' });
  assert.ok('slide' in result && !result.answered);
  assert.match(result.slide.title, /need to check/);
});

const visualInput: Slide = {
  id: 'qa-example', layout: 'statement', title: 'Supply chain emissions', bullets: ['Chipmaking drives emissions.', 'Operational emissions are smaller.'],
  sources: ['NVIDIA sustainability disclosures'],
};

test('a visual uses verified series or exact answer phrases', async () => {
  const signal = new AbortController().signal;
  const chart = { type: 'line', datasetKey: 'nvda_emissions', series: ['Scope 3'] };
  const diagram = { kind: 'comparison', nodes: ['Supply chain emissions', 'Operational emissions'] };
  const pick = (reply: unknown) => new Ai(new Budget(tmp(), 4), async () => message(reply), () => true).visual(visualInput, datasets, signal);
  assert.deepEqual(await pick({ chart, diagram: null }), { chart });
  assert.deepEqual(await pick({ chart: { ...chart, datasetKey: 'research_facts_unverified' }, diagram }), { diagram });
  assert.equal(await pick({ chart: { ...chart, series: ['Invented series'] }, diagram: null }), undefined);
  assert.equal(await pick({ chart: null, diagram: { ...diagram, nodes: ['Supply chain emissions', 'Operational emissions rise'] } }), undefined);
});

test('late AI responses are ignored after cancellation and unavailable visuals leave the answer usable', async () => {
  const stop = new AbortController();
  let release: (result: Anthropic.Message) => void = () => assert.fail('missing response handler');
  const ai = new Ai(new Budget(tmp(), 4), (_, signal) => {
    assert.equal(signal.aborted, false);
    return new Promise((resolve) => { release = resolve; });
  }, () => true);
  const pending = ai.visual(visualInput, datasets, stop.signal);
  stop.abort();
  release(message({ chart: null, diagram: { kind: 'comparison', nodes: ['Supply chain emissions', 'Operational emissions'] } }));
  assert.equal(await pending, undefined);
  assert.deepEqual(visualInput.bullets, ['Chipmaking drives emissions.', 'Operational emissions are smaller.']);

  const offline = new Ai(new Budget(tmp(), 4), async () => assert.fail('offline must not call the provider'), () => false);
  assert.match(((await go(offline)) as { error: string }).error, /No Anthropic key/);
  assert.equal(await offline.visual(visualInput, datasets, new AbortController().signal), undefined);
});

test('a provider visual timeout leaves the draft text and budget usable', async () => {
  const ai = new Ai(new Budget(tmp(), 4), async () => {
    throw new Anthropic.APIConnectionTimeoutError();
  }, () => true);
  assert.equal(await ai.visual(visualInput, datasets, new AbortController().signal), undefined);
  assert.ok(ai.budget.spent > 0 && ai.budget.spent < ai.budget.cap);
});

// ---------- Web research ----------

const cite = (cited_text: string, url = 'https://www.iea.org/x') => ({ type: 'web_search_result_location', cited_text, url, title: 'IEA', encrypted_index: '' }) as any;
const result = (url: string) => ({ type: 'web_search_result', url, title: 'Energy and AI', page_age: 'April 10, 2025' });
const found = { type: 'web_search_tool_result', tool_use_id: 't', content: [result('https://www.iea.org/x')] };
const cited = (text: string, ...cites: any[]) => ({ type: 'text', text, citations: cites });
const plain = (text: string) => ({ type: 'text', text, citations: null });
const web = (blocks: unknown[], read = async (_url: string, _signal?: AbortSignal): Promise<{ text: string; date?: string }> => ({ text: '' }), signal?: AbortSignal) =>
  toWebSlide(blocks as any, '22 November 2026', read, signal);

test('a researched fact must match a sentence in its cited source, including figures, units and periods', async () => {
  const source = 'Data centres used about 415 TWh in 2024.';
  const check = (claim: string, excerpt = source) => web([found, cited(claim, cite(excerpt))]);
  assert.equal(typeof await check(source), 'object');
  for (const incorrect of [
    'Data centres used about 415 TWh in 2025.',
    'Data centres used about 415 GWh in 2024.',
    'Data centres used about 415 tWh in 2024.',
    'Data centres used about 450 TWh in 2024.',
    'Data centres used 415 TWh in 2024.',
    'Households used about 415 TWh in 2024.',
    'Electricity consumption will double.',
  ]) assert.match(await check(incorrect) as string, /No claim/, incorrect);
  assert.match(await check('The bill took effect.', 'A witness denied that The bill took effect.') as string, /No claim/);
  assert.match(await web([found, cited(source, cite(source, 'https://www.iea.org/absent'))]) as string, /No claim/);
});

test('approved hosts use HTTPS and dot-boundary matching', () => {
  assert.equal(researchUrl('https://www.IEA.org/report')?.publisher, 'International Energy Agency');
  assert.equal(researchUrl('https://research.investor.nvidia.com/report')?.publisher, 'NVIDIA Investor Relations');
  for (const url of ['http://iea.org', 'https://badiea.org', 'https://iea.org.evil.com', 'https://iea.org:8443', 'https://name:secret@iea.org', 'https://iea.org@evil.com', 'https://127.0.0.1', 'not a link']) {
    assert.equal(researchUrl(url), null, url);
  }
});

test('unapproved citations cannot supply a claim or trigger a fetch even when returned by search', async () => {
  const bad = 'https://iea.org.evil.com/result';
  const claim = 'Data centres used 415 TWh in 2024.';
  const search = { ...found, content: [...found.content, result(bad)] };
  const noFetch = async () => assert.fail('must never fetch an unapproved URL');
  assert.match(await web([search, cited(claim, cite(claim, bad))], noFetch) as string, /No claim/);
  assert.match(await web([search, cited(claim, cite('Short excerpt.', bad))], noFetch) as string, /No claim/);
  const kept = await web([search, cited(claim, cite('Short excerpt.', bad), cite(claim))], noFetch);
  assert.ok(typeof kept !== 'string');
  assert.deepEqual(kept.links.map((link) => link.url), ['https://www.iea.org/x']);
});

test('fallback checks only the cited page and keeps its date and claim with the source', async () => {
  const claim = 'Data centres used 415 TWh in 2024.';
  const signal = new AbortController().signal;
  const r = await web([plain('Searching.'), found, plain('- '), cited(claim, cite('Data centres used 415'))], async (url, received) => {
    assert.equal(url, 'https://www.iea.org/x');
    assert.equal(received, signal);
    return { text: `Electricity demand. ${claim} Other news.`, date: '2025-04-10' };
  }, signal);
  assert.ok(typeof r !== 'string');
  assert.deepEqual(r.slide.bullets, [claim]);
  assert.deepEqual(r.slide.sources, ['Live web research · 22 November 2026 · International Energy Agency']);
  assert.deepEqual(r.links, [{
    title: 'Energy and AI', url: 'https://www.iea.org/x', publisher: 'International Energy Agency',
    date: '2025-04-10', updated: 'April 10, 2025', claims: [claim],
  }]);
});

test('fallback page requests are bounded and cancelled with the job', async () => {
  const urls = Array.from({ length: 5 }, (_, i) => `https://www.iea.org/${i}`);
  const claim = 'Data centres used 415 TWh in 2024.';
  const search = { ...found, content: urls.map(result) };
  const blocks = [search, cited(claim, ...urls.map((url) => cite('Short excerpt.', url)))];
  const fetched: string[] = [];
  assert.match(await web(blocks, async (url) => {
    fetched.push(url);
    return { text: '' };
  }) as string, /No claim/);
  assert.deepEqual(fetched, urls.slice(0, 3));
  const abort = new AbortController();
  const cancelled = await web(blocks, async () => {
    abort.abort();
    return { text: claim };
  }, abort.signal);
  assert.match(cancelled as string, /cancelled/);
});

test('fallback page fetches check the URL again and disable redirects', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async (_url: URL, options?: RequestInit) => {
    assert.equal(options?.redirect, 'error');
    assert.ok(options?.signal instanceof AbortSignal);
    return new Response('<meta content="2025-04-10T09:30:00Z" property="article:published_time"><h1>Electricity</h1><p>Data centres used 415 TWh in 2024.</p>', { headers: { 'content-type': 'text/html' } });
  });
  assert.equal((await pageText('https://iea.org.evil.com/x')).text, '');
  assert.equal(fetch.mock.callCount(), 0);
  const page = await pageText('https://iea.org/x');
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(page.date, '2025-04-10');
  assert.match(page.text, /Data centres used 415 TWh in 2024/);
});

test('research fails closed when an answer is unsupported or partially unverified', async () => {
  const claim = 'Data centres used 415 TWh in 2024.';
  assert.match(await web([found, plain('NOT FOUND')]) as string, /No reliable/);
  assert.match(await web([found, plain('- Uncited claim')]) as string, /No claim/);
  assert.match(await web([found, cited(`- ${claim}`, cite(claim)), plain('\n- A bill became law.')]) as string, /Part of the web answer/);
  assert.match(await web([found, cited(claim, cite(claim)), plain(' That is a lot.')]) as string, /No claim/);
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
  const ai = new Ai(new Budget(file, 4), async () => ({ stop_reason: 'end_turn', content: [found, cited('Data centres used 415 TWh in 2024.', cite('Data centres used 415 TWh in 2024.'))], usage: { input_tokens: 10_000, output_tokens: 100, server_tool_use: { web_search_requests: 2 } } }) as any, () => true);
  const r = await ai.research('how much power', new AbortController().signal);
  assert.ok('slide' in r && r.links?.length === 1);
  assert.ok(Math.abs(ai.budget.spent - 0.041) < 1e-9);
  const broke = new Ai(new Budget(tmp(), 0.1), async () => assert.fail('should not call'), () => true);
  assert.match(((await broke.research('q', new AbortController().signal)) as any).error, /cap reached/);
});

test('a repeated research question is answered from the session cache without a second search', async () => {
  let calls = 0;
  const ai = new Ai(new Budget(tmp(), 4), async () => {
    calls++;
    return { stop_reason: 'end_turn', content: [found, cited('Data centres used 415 TWh in 2024.', cite('Data centres used 415 TWh in 2024.'))], usage: { input_tokens: 1000, output_tokens: 20 } } as any;
  }, () => true);
  const first = await ai.research('How much power do data centres use?', new AbortController().signal);
  const again = await ai.research('how much power do data centres use', new AbortController().signal);
  assert.equal(calls, 1);
  assert.ok('slide' in first && 'slide' in again);
  assert.deepEqual(again.slide.bullets, first.slide.bullets);
  assert.notEqual(again.slide.id, first.slide.id);
  await ai.research('How much power do data centres use?', new AbortController().signal, 'Different context');
  assert.equal(calls, 2, 'different context is a different question');
});

test('a verified web sentence cannot stand in for multiple explicit questions', async () => {
  const ai = new Ai(new Budget(tmp(), 4), async () => ({
    stop_reason: 'end_turn',
    content: [found, cited('Data centres used 415 TWh', cite('Data centres used 415 TWh'))],
    usage: { input_tokens: 1000, output_tokens: 20 },
  }) as unknown as Anthropic.Message, () => true);
  const result = await ai.research('How much power did data centres use? What is their water use?', new AbortController().signal);
  assert.ok('error' in result);
  assert.match(result.error, /every part/);
});

test('web search receives the scoped registry and carries a total search limit through continuation', async () => {
  const calls: Anthropic.MessageCreateParamsNonStreaming[] = [];
  const ai = new Ai(new Budget(tmp(), 4), async (body) => {
    calls.push(body);
    return {
      stop_reason: calls.length === 1 ? 'pause_turn' : 'end_turn', content: [],
      usage: { input_tokens: 2000, output_tokens: 40, server_tool_use: { web_search_requests: 2 } },
    } as unknown as Anthropic.Message;
  }, () => true);
  await ai.research('Question', new AbortController().signal, 'Previous sourced answer');
  assert.deepEqual(calls.map((body) => body.tools?.map((tool) => 'max_uses' in tool && tool.max_uses)), [[3], [1]]);
  const search = calls[0].tools?.[0];
  assert.ok(search && 'allowed_domains' in search);
  assert.ok(search.allowed_domains?.includes('sec.gov'));
  assert.ok(search.allowed_domains?.includes('iea.org'));
  assert.ok(!search.allowed_domains?.includes('reuters.com'));
  assert.match(JSON.stringify(calls[0].messages), /Previous sourced answer/);
});

test('private lives and gossip are never shown', async () => {
  const line = (s: string) => cited(s, cite(s));
  for (const s of ['He admitted being unfaithful', 'Reports of relationships with two women', 'She is allegedly a spy', 'Scrutiny over his personal relationships'])
    assert.equal(typeof (await web([found, line(s)])), 'string', s);
  assert.notEqual(typeof (await web([found, line("NVIDIA's relationship with TSMC is long-standing")])), 'string');

});
