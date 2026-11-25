import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import type Anthropic from '@anthropic-ai/sdk';
import { generic } from '../src/ChartLibrary.tsx';
import { Ai, MAX_RATE, toSlide, type Reply } from './ai.ts';
import { loadBank } from './bank.ts';
import { Budget } from './budget.ts';
import { Evidence, loadVault } from './evidence.ts';
import { checkSlide, loadDatasets, loadSpine } from './state.ts';

const core = loadDatasets();
const vault = loadVault();
const datasets = new Map([...core, ...vault.datasets]);
const bank = loadBank(core);
const evidence = new Evidence(vault.index, datasets, bank);
const spine = loadSpine(core);

test('the research vault is loaded: sourced facts, charts and Q&As', () => {
  assert.ok(evidence.size.facts > 1000, `facts: ${evidence.size.facts}`);
  assert.ok(vault.datasets.size > 100, `vault charts: ${vault.datasets.size}`);
  assert.ok(vault.index.qa.length > 500);
  for (const f of vault.index.facts) assert.ok(f.source && (f.source.url ? f.quote : f.source.publisher), `${f.id}: a quoted source page, or our own dataset's source`);
});

test('every vault chart passes the same checks as a stage chart, and none shows a rate above the cap', () => {
  for (const d of vault.datasets.values()) {
    if (d.key === 'vault_facts') continue;
    const problem = checkSlide({ id: `t-${d.key}`, layout: 'chart', title: 'T', bullets: [], chart: generic(d), sources: [] }, datasets);
    assert.equal(problem, null, `${d.key}: ${problem}`);
  }
  const facts = vault.datasets.get('vault_facts')!;
  for (const [id, [v]] of Object.entries(facts.series)) {
    assert.ok(facts.seriesSources?.[id], `${id} has its source`);
    const claim = evidence.facts.get(id)!.claim;
    if (/\b(wacc|discount rate|cost of capital)\b/i.test(claim) && facts.units?.[id] === '%') assert.ok(v! <= MAX_RATE, `${id}: ${claim}`);
  }
});

test('search finds the right evidence for board questions, in milliseconds', () => {
  const cases: [string, (h: ReturnType<Evidence['search']>) => boolean][] = [
    ['How much electricity do AI data centres use?', (h) => h.facts.some((f) => /TWh|electricity/i.test(f.claim))],
    ["How many women are on NVIDIA's board?", (h) => h.facts.some((f) => /women held .* board/i.test(f.claim))],
    ['Does NVIDIA rely on TSMC in Taiwan?', (h) => h.bank.some((b) => b.id === 'taiwan') || h.facts.some((f) => /TSMC/.test(f.claim))],
    ["Isn't AMD catching up?", (h) => h.facts.some((f) => /AMD/.test(f.claim))],
    ['What is NVIDIA doing about water in data centres?', (h) => h.bank.some((b) => /water/.test(b.id))],
    ['How does NVIDIA compare on emissions with Intel?', (h) => h.charts.some((c) => c.key === 'peers_emissions_intensity')],
  ];
  for (const [q, ok] of cases) {
    const t = performance.now();
    const h = evidence.search(q);
    assert.ok(performance.now() - t < 50, `${q}: under 50 ms`);
    assert.ok(ok(h), q);
  }
});

const r = (o: Partial<Reply> = {}): Reply => ({ show: true, answered: true, layout: 'statement', title: 'Board diversity', bullets: ['Women held {{vault_facts | F0655 | value}} of board seats in FY26'], chart: null, stat: null, icons: [], factIds: [], ...o });

test('a vault figure is looked up and cited, never typed; an unknown fact is refused', () => {
  const slide = toSlide(r(), datasets, 'gen-1', evidence);
  assert.equal(typeof slide, 'object', slide as string);
  assert.ok((slide as { sources: string[] }).sources.length, 'the figure cites its own fact');
  assert.match(toSlide(r({ factIds: ['F9999'] }), datasets, 'gen-1', evidence) as string, /not in EVIDENCE/);
  assert.equal(typeof toSlide(r({ bullets: ['Women held 30% of board seats'] }), datasets, 'gen-1', evidence), 'string', 'typed digits are still refused');
  const chartKey = [...vault.datasets.keys()].find((k) => k !== 'vault_facts')!;
  const d = vault.datasets.get(chartKey)!;
  const withChart = toSlide(r({ layout: 'split', chart: { type: 'bar', datasetKey: chartKey, series: [Object.keys(d.series)[0]], highlight: null, from: null, to: null } }), datasets, 'gen-1', evidence);
  assert.equal(typeof withChart, 'object', withChart as string);
});

test('a board answer gets EVIDENCE in one call and comes back with sources and links', async () => {
  let sent = '';
  const call = async (body: Anthropic.MessageCreateParamsNonStreaming) => {
    sent = JSON.stringify(body.messages);
    return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(r({ factIds: ['F0654', 'F0655'] })) }], usage: { input_tokens: 1000, output_tokens: 200 } } as unknown as Anthropic.Message;
  };
  const ai = new Ai(new Budget(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ev-')), 's.json'), 4), call, () => true);
  const out = await ai.build({ kind: 'answer', heard: "How many women are on NVIDIA's board?", onScreen: 'nothing' }, datasets, spine, new AbortController().signal, evidence);
  assert.match(sent, /EVIDENCE/);
  assert.match(sent, /F0655/);
  assert.ok('slide' in out && out.answered, JSON.stringify(out));
  assert.ok('slide' in out && out.slide.sources.length);
  assert.ok('links' in out && out.links?.length, 'the operator gets the source pages');
});

test('a unit repeated after a figure is dropped ("945 TWh TWh" never reaches the stage)', async () => {
  const { dropRepeatedUnits } = await import('./ai.ts');
  assert.equal(dropRepeatedUnits('{{vault_facts | F0003 | value}} TWh by 2030', datasets), '{{vault_facts | F0003 | value}} by 2030');
  assert.equal(dropRepeatedUnits('{{nvda_revenue_quarterly | Revenue | FY27 Q3}} in the quarter', datasets), '{{nvda_revenue_quarterly | Revenue | FY27 Q3}} in the quarter');
});
