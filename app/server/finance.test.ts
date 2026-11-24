// v2 finance section: the DCF adds up, no discount rate above 15.4% reaches the board,
// and the two downside cases are never confused.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveText, slideTexts, tokenRefs, type Slide } from '../shared/schema.ts';
import { capRates, MAX_RATE, systemPrompt, usable } from './ai.ts';
import { loadBank } from './bank.ts';
import { loadDatasets, loadSpine } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const bank = loadBank(datasets);
const ds = (k: string) => datasets.get(k)!;
const at = (k: string, series: string, x: string) => ds(k).series[series][ds(k).x.indexOf(x)]!;
const RATES = ['10.55%', '14.45%', '15.4%'];
const RATE_X = ['10.55% industry (Damodaran)', '14.45% Google Finance', '15.4% Bloomberg'];
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// Everything the board can see or hear: spine slides (text and say) and prepared answers.
const boardSlides: { id: string; slide: Slide; say?: string }[] = [...spine.map((s) => ({ id: s.id, slide: s as Slide, say: s.say })), ...bank.map((b) => ({ id: `qa:${b.id}`, slide: b.slide }))];

test('the DCF bridge adds up at each rate, and matches the sensitivity value', () => {
  const shares = at('model_dcf_inputs', 'Shares outstanding', 'value');
  const netCash = at('model_dcf_inputs', 'Net cash', 'value') / 1000; // bn → tn
  for (const [k, r] of RATES.entries()) {
    const step = (x: string) => at('model_dcf_bridge', r, x);
    assert.ok(near(step('PV of FY28–32 cash flow') + step('PV of terminal value'), step('Enterprise value'), 0.0002), `${r}: PV + PV = EV`);
    assert.ok(near(step('Net cash'), netCash, 0.0001), `${r}: net cash`);
    assert.ok(near(step('Enterprise value') + step('Net cash'), step('Equity value'), 0.0002), `${r}: EV + net cash = equity`);
    const perShare = (step('Equity value') * 1000) / shares;
    assert.ok(near(perShare, at('model_sensitivity', 'Terminal growth 3%', r), 0.05), `${r}: equity ÷ shares = ${perShare}`);
    assert.equal(at('model_three_rates', 'Value per share', RATE_X[k]), at('model_sensitivity', 'Terminal growth 3%', r), `${r}: three-rates chart = sensitivity`);
    assert.ok(near(at('model_three_rates', 'Enterprise value', RATE_X[k]), step('Enterprise value'), 0.006), `${r}: EV on the three-rates slide`);
  }
});

test('the base case is above today\'s price at all three rates (the three-rates slide and recommendation claim it)', () => {
  const price = at('model_dcf_inputs', 'Share price', 'value');
  assert.equal(price, at('model_valuation', 'Value per share', 'Share price today'));
  for (const x of RATE_X) assert.ok(at('model_three_rates', 'Value per share', x) > price, `${x} above ${price}`);
  for (const x of RATE_X) assert.equal(at('model_three_rates', 'Share price today', x), price);
});

test('the DCF inputs slide uses the three rates and shows every model input', () => {
  const s = spine.find((s) => s.id === 'dcf-inputs')!;
  assert.deepEqual(s.groups!.map((g) => g.tag), ['Bloomberg', 'Google Finance', 'Damodaran (NYU)', 'Our two choices']);
  const used = new Set(slideTexts(s).flatMap(tokenRefs).filter((r) => r.key === 'model_dcf_inputs').map((r) => r.series));
  for (const series of Object.keys(ds('model_dcf_inputs').series).filter((n) => !n.startsWith('Growth fades'))) assert.ok(used.has(series), `inputs slide shows ${series}`);
  assert.deepEqual(['WACC, US semiconductor industry average', 'WACC, Google Finance', 'WACC, Bloomberg'].map((n) => at('model_dcf_inputs', n, 'value')), [10.55, 14.45, 15.4]);
});

test('the finance run is in order and the old valuation slide is gone', () => {
  const ids = spine.map((s) => s.id);
  assert.ok(!ids.includes('valuation'));
  const order = ['peers', 'dcf-inputs', 'fcf', 'dcf-bridge', 'three-rates', 'reverse-dcf', 'bear-case', 'ai-ended'];
  const pos = order.map((id) => ids.indexOf(id));
  assert.ok(pos.every((p, i) => p >= 0 && (i === 0 || p === pos[i - 1] + 1)), `consecutive: ${pos}`);
  assert.equal(spine[pos.at(-1)! + 1].speaker, "Mi'kael");
});

// ---- No discount rate above 15.4% ----
const RATE_WORDS = /\b(rate|wacc|discount|cost of capital)\b/i;
const FORBIDDEN = /\b19\.3\b|\b16\.42\s*%|nineteen point three|sixteen point four|stock analysis/i;

test('no discount rate above 15.4% in any slide, say line or prepared answer', () => {
  for (const { id, slide, say } of boardSlides) {
    // 1. every figure a slide looks up: a rate series or rate column above the cap is refused
    for (const t of slideTexts(slide))
      for (const r of tokenRefs(t)) {
        const d = ds(r.key);
        const v = d.series[r.series]?.[d.x.indexOf(r.x)];
        if (RATE_WORDS.test(r.series) && (d.units?.[r.series] ?? d.unit) === '%') assert.ok(v! <= MAX_RATE, `${id}: ${r.series} = ${v}`);
        for (const label of [r.series, r.x]) if (/^\d/.test(label) && RATE_WORDS.test(`${d.title} ${d.source}`)) assert.ok(parseFloat(label) <= MAX_RATE, `${id}: rate ${label}`);
      }
    // 2. chart columns that are rates
    if (slide.chart) for (const label of [...ds(slide.chart.datasetKey).x, ...slide.chart.series]) if (/^\d+(\.\d+)?%/.test(label)) assert.ok(parseFloat(label) <= MAX_RATE, `${id}: chart rate ${label}`);
    // 3. what is on screen and what is said: any "x%" in a sentence about a rate, and the two retired rates by name
    const texts = [...slideTexts(slide).map((t) => resolveText(t, datasets)), ...slide.sources, say ?? ''];
    for (const t of texts) {
      assert.doesNotMatch(t, FORBIDDEN, `${id}: "${t}"`);
      for (const sentence of t.split(/(?<=[.;:])\s/))
        if (RATE_WORDS.test(sentence)) for (const m of sentence.matchAll(/(\d+(?:\.\d+)?)\s*(%|percent)/g)) assert.ok(Number(m[1]) <= MAX_RATE, `${id}: ${m[0]} in "${sentence}"`);
    }
  }
});

test('the Q&A generator never sees a discount rate above 15.4%', () => {
  const fake = { key: 'k', title: 'Value by discount rate', unit: 'USD', source: 's', asOf: '2026', placeholder: false, x: ['10.55%', '19.3%'], series: { 'Base case': [391, 167], '19.3%': [1, 2] } };
  const capped = capRates(fake);
  assert.deepEqual(capped.x, ['10.55%']);
  assert.deepEqual(Object.keys(capped.series), ['Base case']);
  assert.deepEqual(capped.series['Base case'], [391]);
  const wacc = capRates({ ...fake, title: 'Market', x: ['value'], units: { 'WACC, X': '%' }, unit: '', series: { 'WACC, X': [19.3], 'Beta': [2.2] } });
  assert.deepEqual(Object.keys(wacc.series), ['Beta']);
  for (const d of usable(datasets)) {
    for (const [name, vals] of Object.entries(d.series)) {
      if (RATE_WORDS.test(name) && (d.units?.[name] ?? d.unit) === '%') assert.ok(vals.every((v) => v == null || v <= MAX_RATE), `${d.key}/${name}`);
      if (/^\d+(\.\d+)?%/.test(name)) assert.ok(parseFloat(name) <= MAX_RATE, `${d.key} series ${name}`);
    }
    if (RATE_WORDS.test(`${d.title} ${d.source}`)) for (const x of d.x) if (/^\d+(\.\d+)?%/.test(x)) assert.ok(parseFloat(x) <= MAX_RATE, `${d.key} x ${x}`);
  }
  assert.doesNotMatch(systemPrompt(datasets, spine), /\b19\.3\b|16\.42%|nineteen point three/);
});

// ---- Bear case vs "If AI ended for good" ----
const BEAR = /\bbear\b/i;
const ENDED = /ended for good/i;
const isBear = (r: { series: string; x: string }) => r.x === 'Bear case' || r.series === 'Bear case';
const isEnded = (r: { series: string; x: string }) => r.x === 'If AI ended for good' || r.series === 'If AI ended for good';
const clauses = (t: string) => t.split(/[.;]\s|,\s(?=and |if |our )/i);

test('bear case and "If AI ended for good" labels are never swapped', () => {
  const bearValue = at('model_valuation', 'Value per share', 'Bear case');
  const endedValue = at('model_valuation', 'Value per share', 'If AI ended for good');
  for (const { id, slide, say } of boardSlides) {
    for (const t of slideTexts(slide))
      for (const c of clauses(t)) {
        const refs = tokenRefs(c);
        if (refs.some(isBear)) assert.ok(BEAR.test(c) && !ENDED.test(c), `${id}: bear figure under the wrong label: "${c}"`);
        if (refs.some(isEnded)) assert.ok(ENDED.test(c) && !BEAR.test(c), `${id}: "If AI ended for good" figure under the wrong label: "${c}"`);
      }
    // charts: each downside path dataset sits only on its own slide
    if (slide.chart?.datasetKey === 'model_path_bear') assert.ok(BEAR.test(slide.title) && !ENDED.test(slide.title), id);
    if (slide.chart?.datasetKey === 'model_path_ai_ended') assert.ok(ENDED.test(slide.title) && !BEAR.test(slide.title), id);
    // what is said: no sentence puts one case's number next to the other case's name
    for (const sentence of (say ?? '').split(/(?<=[.;?])\s/)) {
      if (ENDED.test(sentence)) assert.doesNotMatch(sentence, new RegExp(`\\b(${Math.round(bearValue)}|hundred and two)\\b`), `${id}: "${sentence}"`);
      if (BEAR.test(sentence)) assert.doesNotMatch(sentence, new RegExp(`\\b(${Math.round(endedValue)}|sixty four)\\b`), `${id}: "${sentence}"`);
    }
    // the old name is gone everywhere the board sees or hears
    for (const t of [...slideTexts(slide), say ?? '']) assert.doesNotMatch(t, /stress case|realistic bear|if spending stops/i, `${id}: "${t}"`);
  }
  // the dataset labels themselves
  assert.deepEqual(ds('model_downside').x, ['Bear case', 'If AI ended for good']);
  assert.ok(at('model_downside', 'Value per share', 'If AI ended for good') < at('model_downside', 'Value per share', 'Bear case'));
  assert.ok(at('model_downside', 'Cost to the portfolio', 'If AI ended for good') < 2, 'costs the portfolio under 2%');
  assert.ok(at('model_downside', 'Value per share', 'If AI ended for good') > 0, 'not zero');
});

test('the label check catches a swap', () => {
  const t = 'Our bear case: {{model_valuation | Value per share | If AI ended for good}}';
  assert.ok(clauses(t).some((c) => tokenRefs(c).some(isEnded) && BEAR.test(c)));
});

test('the DCF summary table on stage: the three approved rates, value, EV, % above a dated reference price', () => {
  const s = spine.find((s) => s.id === 'three-rates')!;
  assert.equal(s.chart?.display, 'table');
  assert.deepEqual(s.chart?.series, ['Value per share', 'Enterprise value', 'Above reference price']);
  assert.deepEqual(ds('model_three_rates').x, RATE_X);
  assert.equal(s.chart?.refLine?.series, 'Share price today');
  assert.equal(ds('model_three_rates').units?.['Above reference price'], '%');
  assert.match(ds('model_three_rates').asOf, /^\d{4}-\d{2}-\d{2}$/, 'the reference price carries a date');
  const price = at('model_dcf_inputs', 'Share price', 'value');
  for (const x of RATE_X) assert.ok(near(at('model_three_rates', 'Above reference price', x), (at('model_three_rates', 'Value per share', x) / price - 1) * 100, 0.01), x);
});

test('the bridge from the round-one target adds up to today\'s base case, and is flagged unverified', () => {
  const b = (x: string) => at('model_target_bridge', 'Value per share', x);
  assert.ok(near(b('Round-one target') + b('Updated inputs, same rate') + b('Discount rate change'), b('Base case today'), 0.011));
  assert.equal(b('Base case today'), at('model_three_rates', 'Value per share', RATE_X[0]));
  assert.equal(ds('model_target_bridge').verified, false, 'round one is team-reported, not a primary source');
});
