import assert from 'node:assert/strict';
import { test } from 'node:test';
import { elementCount, formatValue, isUnverified, slideTexts, stepsOf, zoomAt, type ShowState, type SpineSlide } from '../shared/schema.ts';
import { cueScore, findCue, words } from './cues.ts';
import { addDraft, apply, checkSlide, emptyState, isIgnoringUtterance, loadDatasets, loadSpine, relocate, runReport, sectionLastIndex, type Ctx } from './state.ts';
import { loadBank } from './bank.ts';

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
const interim = (text: string) => ({ type: 'transcript', text, final: false });
const idx = (id: string) => spine.findIndex((s) => s.id === id);
const optional = spine.filter((s) => s.optional).map((s) => s.id);

test('the script loads and every chart/number points at real data', () => {
  assert.ok(spine.length >= 25);
  assert.deepEqual(optional, ['revenue-long']);
  assert.deepEqual([...new Set(spine.map((s) => s.speaker))], ['Rob', 'Panshul', "Mi'kael"]);
  assert.equal(spine[sectionLastIndex(spine)].id, 'handoff');
});

test('zoom steps: the chart builds where it is told, zooms follow cues, and bad zooms are refused', () => {
  const e = spine[idx('emissions-peers')];
  assert.deepEqual(stepsOf(e), [{ chart: true }, { bullet: 0 }, { zoom: 'NVIDIA' }]);
  assert.equal(elementCount(e), 4);
  let s = run(emptyState(), { type: 'goto', index: idx('emissions-peers') });
  assert.equal(s.reveal, 2, 'chartFirst: the chart builds with the title');
  s = run(s, say('own buildings and electricity for every million dollars of sales'));
  assert.equal(zoomAt(e, s.reveal), null);
  s = run(s, say('NVIDIA emits about forty eight kilograms'));
  assert.equal(zoomAt(e, s.reveal), 'NVIDIA');
  assert.deepEqual(e.chart?.exclude, ['TSMC']);
  assert.equal(datasets.get('peers_emissions_intensity')?.x.includes('TSMC'), true, 'the underlying dataset stays complete');
  // A zoom without a cue lands together with the point before it; "all" zooms back out.
  const v = spine[idx('three-rates')];
  let t = run(emptyState(), { type: 'goto', index: idx('three-rates') }, say('at the us chip industry rate'), say('at google finance'), say('at bloomberg'));
  assert.equal(zoomAt(v, t.reveal), '15.4% Bloomberg');
  t = run(t, say('all three are above our reference price'));
  assert.equal(zoomAt(v, t.reveal), null);
  const base = { id: 't', layout: 'split' as const, title: 'T', bullets: ['a'], sources: [], chart: { type: 'bar' as const, datasetKey: 'peers_pe', series: ['Forward P/E'] } };
  assert.match(checkSlide({ ...base, steps: [{ bullet: 0 }, { zoom: 'NVIDIA' }, { chart: true }] }, datasets)!, /before the chart/);
  assert.match(checkSlide({ ...base, steps: [{ chart: true }, { bullet: 0 }, { zoom: 'Nvidia Corp' }] }, datasets)!, /not an x value/);
  assert.match(checkSlide({ ...base, steps: [{ chart: true }] }, datasets)!, /every bullet/);
  assert.equal(checkSlide({ ...base, steps: [{ chart: true }, { zoom: 'NVIDIA' }, { bullet: 0 }, { zoom: 'all' }] }, datasets), null);
});

test('the spoken DCF worksheet cue reveals the actual model before the three rates', () => {
  const start = run(emptyState(), { type: 'goto', index: idx('dcf-inputs') });
  const worksheet = run(start, say("here's the five year DCF"));
  assert.equal(worksheet.live?.id, 'dcf-worksheet');
  assert.equal(worksheet.live?.chart?.datasetKey, 'model_dcf_detail');
  assert.equal(worksheet.reveal, elementCount(worksheet.live!));
  assert.equal(run(worksheet, say("we didn't invent a discount rate")).live?.id, 'three-rates');
});

test('the people benchmark is dated, lower for NVIDIA and marked unverified', () => {
  const people = spine[idx('people')];
  const bench = datasets.get('research_people_turnover')!;
  assert.equal(bench.verified, false);
  assert.deepEqual(bench.x, ['NVIDIA FY26', 'Tech and media 2022']);
  assert.ok(bench.series['Staff turnover'][0]! < bench.series['Staff turnover'][1]!);
  assert.equal(people.chart?.datasetKey, bench.key);
  assert.equal(isUnverified(people, Object.fromEntries(datasets)), true);
});

test('emissions figures read as plain English', () => {
  assert.deepEqual([0.048, 1.241, 2.82, 25.032, 108.743].map((v) => formatValue(v, 'tonnes CO2')), ['48 kg', '1.2 tonnes', '2.8 tonnes', '25 tonnes', '109 tonnes']);
});

test('push validates charts against the data', () => {
  const slide = { id: 's1', title: 'Test', layout: 'split', chart: { type: 'line', datasetKey: 'nope', series: ['Revenue'] } };
  assert.match(apply(emptyState(), { type: 'push', slide }, ctx) as string, /Unknown dataset/);
  assert.match(apply(emptyState(), { type: 'push', slide: { id: 'x' } }, ctx) as string, /Invalid/);
});

test('answer slides can only go live through their current approval queue entry', () => {
  const start = run(emptyState(), { type: 'goto', index: idx('cuda') });
  const answer = { id: 'qa-evidence', answer: true, layout: 'statement', title: 'Evidence', bullets: [], sources: [] } as const;
  assert.match(apply(start, { type: 'push', slide: answer }, ctx) as string, /approval queue/);
  assert.match(apply(start, { type: 'push', slide: { ...answer, answer: undefined } }, ctx) as string, /approval queue/);
  assert.match(apply(start, { type: 'push', slide: { ...answer, id: 'gen-answer', answer: undefined } }, ctx) as string, /approval queue/);
  const queued = addDraft(start, { id: 'current', kind: 'answer', heard: 'Question?', from: 'prepared', at: 0, slide: { ...answer, bullets: [], sources: [] } });
  assert.equal(queued.live, start.live);
  assert.match(apply(queued, { type: 'draft', action: 'show', id: 'stale' }, ctx) as string, /no longer in the queue/);
  assert.equal(run(queued, { type: 'draft', action: 'show', id: 'current' }).live?.id, answer.id);
});

test('slide text may not contain hand-typed numbers; {{tokens}} must resolve', () => {
  const base = { id: 't', layout: 'statement' as const, bullets: [], sources: [] };
  assert.match(checkSlide({ ...base, title: 'Revenue hit $194bn' }, datasets)!, /Hand-typed number/);
  assert.match(checkSlide({ ...base, title: 'Up {{research_facts | nope | value}}' }, datasets)!, /No value/);
  assert.equal(checkSlide({ ...base, title: 'In 1993, on 12 November, FY26 Q3: {{research_facts | Xbox advance | value}}' }, datasets), null);
});

test('operator sees which slides still rely on unverified figures', () => {
  const ds = Object.fromEntries(datasets);
  // The unverified networking-revenue and AI-chip-share figures were cut from the pitch on 25 Nov.
  assert.equal(isUnverified(spine[idx('catch-up')], ds), false);
  assert.equal(isUnverified(spine[idx('connections')], ds), false);
  assert.equal(isUnverified(spine[idx('people')], ds), true, 'the dated turnover benchmark is still flagged');
  assert.equal(isUnverified({ ...spine[idx('chips')], bullets: ['{{research_facts_unverified | Networking revenue FY26 | value}}'] }, ds), true, 'figure inside a bullet');
  assert.equal(isUnverified(spine[idx('chips')], ds), false);
});

test('next walks elements, then slides; back returns a fully built slide', () => {
  let s = run(emptyState(), { type: 'next' });
  assert.equal(s.index, 0);
  const cuda = idx('cuda');
  s = run(s, { type: 'goto', index: cuda });
  assert.equal(s.reveal, 1, 'cued bullets wait');
  s = run(s, { type: 'next' });
  assert.equal(s.reveal, 2);
  s = run(s, { type: 'next' }, { type: 'next' }, { type: 'next' }, { type: 'next' });
  assert.equal(s.index, cuda + 1);
  s = run(s, { type: 'back' });
  assert.equal(s.index, cuda);
  assert.equal(s.reveal, elementCount(spine[cuda]));
});

test('speech fires the next slide cue, tolerating filler words and small slips', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('first-gpu') });
  s = run(s, say('instead in november'), say('they announced CUDA which was huge'));
  assert.equal(s.index, idx('cuda'));
  s = run(s, say('a normall processor, a handful of workers'));
  assert.equal(s.reveal, 2, 'element cue fired despite the typo');
});

test('words after a cue carry on to the next cue in the same breath', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('first-gpu') });
  s = run(s, say("instead in november 2006 they announced cuda here's the idea a normal processor is a handful of very fast workers doing one job after another"));
  assert.equal(s.index, idx('cuda'));
  assert.equal(s.reveal, 2);
});

test('cues only listen forward, never jump far ahead or back', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('cuda') });
  s = run(s, say('everything you just watched was built and run by ai'));
  assert.equal(s.index, idx('cuda'));
  s = run(s, { type: 'autoCue', on: false }, say('wall street hated it'));
  assert.equal(s.index, idx('cuda'), 'follow-speech off');
});

test('an interim result fires once; its final copy is ignored', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('first-gpu') });
  s = run(s, interim('then they announced cuda'));
  assert.equal(s.index, idx('cuda'));
  s = run(s, say('then they announced cuda'));
  assert.equal(s.index, idx('cuda'));
  assert.equal(s.heard, '');
});

test('an early cue survives a long initial transcript result', () => {
  const start = run(emptyState(), { type: 'goto', index: idx('first-gpu') });
  const text = `they announced cuda ${'then came more talk '.repeat(9)}`;
  assert.equal(run(start, say(text)).index, idx('cuda'));
  assert.equal(run(start, interim(text)).index, idx('cuda'));
});

test('Q&A suppresses cues and its unfinished utterance through resume', () => {
  const start = run(emptyState(), { type: 'goto', index: idx('first-gpu') });
  const held = apply(start, interim('announced'), { ...ctx, pauseCues: true });
  assert.ok(typeof held !== 'string' && isIgnoringUtterance(held));
  const final = run(held, say('announced CUDA'));
  assert.equal(final.index, start.index);
  assert.equal(final.stray, '');
  assert.equal(isIgnoringUtterance(final), false);
  assert.equal(run(final, say('announced CUDA')).index, idx('cuda'));

  const queued = addDraft(start, {
    id: 'draft', kind: 'answer', heard: 'Question?', from: 'prepared', at: 0,
    slide: { id: 'qa-evidence', answer: true, layout: 'statement', title: 'Evidence', bullets: [], sources: [] },
  });
  const onStage = run(queued, interim('they announced CUDA'), { type: 'draft', action: 'show', id: 'draft' }, say('they announced CUDA'));
  assert.equal(onStage.live?.id, 'qa-evidence');
  assert.equal(onStage.lastCue, start.lastCue);
  const resumed = run(onStage, { type: 'resume' }, say('they announced CUDA'));
  assert.equal(resumed.index, idx('cuda'));
});

test('cue logs measure transcript receipt to cue dispatch, excluding invalid timestamps', () => {
  const runStart = run(emptyState(), { type: 'goto', index: idx('first-gpu') }, { type: 'rehearsal', action: 'start' });
  const text = interim('they announced CUDA');
  const receivedAt = Date.now() - 50;
  const timed = run(runStart, { ...text, receivedAt });
  const cue = timed.lastCue!;
  assert.equal(cue.receivedAt, receivedAt);
  const report = runReport(timed.rehearsal!, Date.now(), spine);
  assert.equal(report.medianCueDispatchMs, cue.at - receivedAt);
  assert.ok(report.medianCueDispatchMs! >= 50);
  for (const invalid of [Date.now() - 60_000, Date.now() + 60_000]) {
    const untimed = run(runStart, { ...text, receivedAt: invalid });
    assert.equal(untimed.lastCue?.receivedAt, undefined);
    assert.equal(runReport(untimed.rehearsal!, Date.now(), spine).medianCueDispatchMs, null);
  }
});

test('optional slides can be switched off: next, back and cues skip them', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('alexnet') }, { type: 'skip', id: 'revenue-long', on: true });
  assert.deepEqual(s.skipped, ['revenue-long']);
  for (let n = 0; n < 10 && s.index === idx('alexnet'); n++) s = run(s, { type: 'next' });
  assert.equal(s.index, idx('four-layers'));
  s = run(s, { type: 'back' });
  assert.equal(s.index, idx('alexnet'));
  s = run(s, say('so why is nvidia the gold standard'));
  assert.equal(s.index, idx('four-layers'));
  assert.match(apply(s, { type: 'skip', id: 'cuda', on: true }, ctx) as string, /not an optional/);
  s = run(s, { type: 'skip', id: 'revenue-long', on: false });
  assert.deepEqual(s.skipped, []);
});

test('a rehearsal run logs each slide, how it got there, and time spent', () => {
  let s = run(emptyState(), { type: 'rehearsal', action: 'start' }, { type: 'goto', index: idx('first-gpu') }, say('they announced cuda'), { type: 'next' });
  const log = s.rehearsal!;
  assert.deepEqual(log.entries.map((e) => [e.id, e.via]), [['first-gpu', 'goto'], ['cuda', 'cue']]);
  assert.equal(log.entries[1].cue, 'announced cuda');
  s = run(s, { type: 'next' }, { type: 'next' }, { type: 'next' }, { type: 'next' });
  assert.equal(s.rehearsal!.entries.at(-1)!.via, 'next');
  const report = runReport(s.rehearsal!, Date.now() + 1000, spine);
  assert.equal(report.slides.length, 3);
  assert.ok(report.slides.at(-1)!.seconds >= 1);
  assert.equal(report.openingSectionTargetSeconds, 240);
  s = run(s, { type: 'rehearsal', action: 'stop' });
  assert.equal(s.rehearsal, null);
});

test('numbers in passing do not add up to a cue', () => {
  assert.equal(spellOut('In 2006, 249,000 of 1.4, 1993'), 'In two thousand and six, two hundred and forty nine thousand of one point four, nineteen ninety three');
  const s = run(emptyState(), { type: 'goto', index: idx('wall-street') }, say('of two hundred and fifty thousand made about two hundred and forty nine thousand came back and it cost half a billion'));
  assert.equal(spine[s.index].id, 'wall-street');
});

test('cue scoring', () => {
  assert.deepEqual(words('Data Centre, 2006!'), ['data', 'center', '2006']);
  assert.equal(cueScore('the CEO', words('so the ceo resigned')), 1);
  assert.equal(cueScore('built live', words('we built this')), 0.5);
  // Deepgram writes US spellings even in en-GB mode.
  assert.equal(cueScore('highways and fibre', words('highways and fiber each took')), 1);
  assert.equal(cueScore('twenty five tonnes', words('intel twenty five tons')), 1);
  assert.equal(findCue('nothing relevant here', [{ cue: 'released cuda', target: 1 }]), null);
  assert.equal(findCue('so they released cuda and then', [{ cue: 'released cuda', target: 1 }])!.end, 3);
  assert.equal(findCue('they cuda released', [{ cue: 'released cuda', target: 1 }]), null);
  assert.equal(findCue('hello', [{ cue: 'hello hello', target: 1 }]), null);
  assert.equal(findCue('released cuda last year new words', [{ cue: 'released cuda', target: 1 }], 0.75, 4), null);
  assert.equal(findCue('they released cuda', [{ cue: 'released cuda', target: 1 }], 0.75, 2)?.end, 2);
});

// ---------- The deck can't skip ahead ----------

/** Slide order as the deck walks it: everything, or with every optional slide switched off. */
const orders: [string, SpineSlide[]][] = [
  ['full script', spine],
  ['optional slides off', spine.filter((s) => !s.optional)],
];

test('no cue is shared by a slide and either of the next two slides', () => {
  for (const [name, order] of orders)
    order.forEach((a, i) => {
      for (const b of order.slice(i + 1, i + 3))
        for (const ca of [...a.cues, ...a.elementCues.filter((c): c is string => !!c)])
          for (const cb of b.cues)
            assert.ok(cueScore(cb, words(ca)) < 0.75 && cueScore(ca, words(cb)) < 0.75, `${name}: "${a.id}" cue "${ca}" overlaps "${b.id}" cue "${cb}"`);
    });
});

/** Every run of 30 words in a slide's script, i.e. everything the matcher could ever see while that slide is live. */
const windows = (text: string) => {
  const w = words(text);
  return Array.from({ length: Math.max(1, w.length - 29) }, (_, i) => w.slice(i, i + 30));
};

test("reading a slide's script never triggers the next two slides", () => {
  for (const [name, order] of orders)
    order.forEach((a, i) => {
      for (const b of order.slice(i + 1, i + 3))
        for (const win of [...windows(a.say ?? ''), ...windows(spellOut(a.say ?? ''))])
          for (const cue of b.cues) assert.ok(cueScore(cue, win) < 0.75, `${name}: reading "${a.id}" fires "${b.id}" via "${cue}"`);
    });
});

const ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
const TENS = '- - twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');
function spoken(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : '');
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${spoken(n % 100)}` : ''}`;
  return `${spoken(Math.floor(n / 1000))} thousand${n % 1000 ? `${n % 1000 < 100 ? ' and' : ''} ${spoken(n % 1000)}` : ''}`;
}
/** Deepgram writes numbers as words: "1993" → "nineteen ninety three", "249,000" → "two hundred and forty nine thousand". */
const spellOut = (text: string) =>
  text.replace(/\d[\d,]*(\.\d+)?/g, (m) => {
    const [whole, dec] = m.replace(/,/g, '').split('.');
    const tail = m.endsWith(',') ? ',' : '';
    if (/^19\d\d$/.test(whole)) return `nineteen ${spoken(Number(whole.slice(2)))}${tail}`;
    return spoken(Number(whole)) + (dec ? ` point ${[...dec].map((d) => ONES[Number(d)]).join(' ')}` : '') + tail;
  });

const sentences = (text: string) => text.match(/[^.?!]+[.?!]*/g)!.map((t) => t.trim()).filter(Boolean);

/** Read Rob's script out loud, one sentence per speech-to-text result, and check every slide builds in order. */
function readAloud(order: SpineSlide[], from: number, to: number, mode: 'final' | 'interim', start: ShowState, read = (t: string) => t) {
  let s = start;
  for (const slide of order.slice(from, to + 1)) {
    for (const sentence of sentences(slide.say!).map(read)) {
      if (mode === 'interim') {
        const w = sentence.split(' ');
        for (let n = 1; n <= w.length; n++) s = run(s, interim(w.slice(0, n).join(' ')));
      }
      s = run(s, say(sentence));
    }
    assert.equal(spine[s.index]?.id, slide.id, `after reading "${slide.id}" the deck is on "${spine[s.index]?.id}"`);
    assert.equal(s.reveal, elementCount(slide), `"${slide.id}" built ${s.reveal} of ${elementCount(slide)} elements: waiting for "${slide.elementCues[s.reveal - 1]}"`);
  }
}

for (const [name, order] of orders)
  for (const mode of ['final', 'interim'] as const)
    for (const [how, read] of [['as digits', (t: string) => t], ['as words', spellOut]] as const)
    test(`reading Rob's script aloud builds every slide in order (${name}, ${mode} results, numbers ${how})`, () => {
      const skipped = name === 'full script' ? [] : optional;
      const base = { ...emptyState(), skipped };
      readAloud(order, 0, order.findIndex((s) => s.id === 'handoff'), mode, base, read);
      // The close, picking up after Mi'kael's last slide.
      const before = order.findIndex((s) => s.id === 'close') - 1;
      readAloud(order, before + 1, order.length - 1, mode, run(base, { type: 'goto', index: idx(order[before].id) }), read);
    });

test('after a script edit the live slide is found again by id', () => {
  const s = run(emptyState(), { type: 'goto', index: idx('cuda') });
  const moved = [spine[0], ...spine]; // everything shifts down one
  assert.equal(relocate(s, moved as SpineSlide[]).index, idx('cuda') + 1);
  assert.equal(relocate(s, spine.filter((x) => x.id !== 'cuda')).index, -1, 'deleted slide → standby');
});

test('static backup switches the stage to full pages and advances whole slides', () => {
  let s = run(emptyState(), { type: 'goto', index: idx('dcf-worksheet') }, { type: 'backup', on: true });
  assert.equal(s.backup, true);
  s = run(s, { type: 'next' });
  assert.equal(s.index, idx('three-rates'));
  assert.equal(s.reveal, elementCount(spine[s.index]));
  s = run(s, say('turn it around'));
  assert.equal(s.index, idx('three-rates'), 'speech cannot move the static deck');
  s = run(s, { type: 'back' });
  assert.equal(s.index, idx('dcf-worksheet'));
  assert.equal(s.reveal, elementCount(spine[s.index]));
  s = run(s, { type: 'backup', on: false });
  assert.equal(s.backup, false);
});

test('no presenter names on any slide or prepared answer (they can be spoken, never shown)', () => {
  const NAMES = /\b(rob|robert|panshul|mi'?kael|mikael|carlson|aeron)\b/i;
  const shown = (s: Parameters<typeof slideTexts>[0]) => [...slideTexts(s), ...(s.groups ?? []).map((g) => g.tag), ...(s.diagram?.nodes ?? [])];
  for (const s of spine) for (const t of shown(s)) assert.doesNotMatch(String(t), NAMES, `${s.id}: "${t}"`);
  for (const e of loadBank(datasets)) for (const t of shown(e.slide)) assert.doesNotMatch(String(t), NAMES, `${e.id}: "${t}"`);
});
