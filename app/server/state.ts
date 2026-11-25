import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { ClientMsg, Dataset, elementCount, lookup, resolveText, slideTexts, SpineSlide, tokenRefs, type Draft, type Rehearsal, type RunEntry, type ShowState, type Slide, type Step } from '../shared/schema.ts';
import { findCue, findInterimCue, words, type Candidate } from './cues.ts';

export const DATA_DIR = path.resolve(import.meta.dirname, '../../data/clean');
export const SPINE_FILE = path.resolve(import.meta.dirname, '../../docs/script/spine.yaml');
const STATE_FILE = path.resolve(import.meta.dirname, '../state.json');

export type Ctx = { datasets: Map<string, Dataset>; spine: SpineSlide[]; pauseCues?: boolean };

export function loadDatasets(dir = DATA_DIR): Map<string, Dataset> {
  const out = new Map<string, Dataset>();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const parsed = Dataset.safeParse(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    if (parsed.success) out.set(parsed.data.key, parsed.data);
    else console.warn(`[data] skipped ${f}: ${parsed.error.issues[0]?.message}`);
  }
  return out;
}

const MONTH = '(January|February|March|April|May|June|July|August|September|October|November|December)';
export const stripAllowed = (t: string) =>
  t
    .replace(new RegExp(`\\b\\d{1,2} ${MONTH}\\b`, 'g'), '')
    .replace(/\b(19|20)\d\d\b/g, '')
    .replace(/\bper \$1m\b/g, '') // the emissions-intensity unit
    .replace(/\bFY\d\d\b|\bQ[1-4]\b|\bScopes? [123](?:(?:, | ?(?:\+|\/|&|and|or|to) ?(?:Scope )?)[123])*\b/g, '')
    .replace(/\b(NV1|RIVA 128|GeForce 256|DGX-1|NVL72|3D|A100|H100|H200|H20|B200|MI355X)\b/g, '')
    .replace(/\b(Fortune 100|Global 100|TIME100|AI21)\b/g, ''); // product names, then award and company names

/** null if the slide can be shown; otherwise what is wrong with it. */
export function checkSlide(slide: Slide, datasets: Map<string, Dataset>): string | null {
  const { chart, stat, layout } = slide;
  if ((layout === 'chart' || layout === 'split') && !chart) return `Layout "${layout}" needs a chart`;
  if (layout === 'inputs' && !slide.groups?.length) return 'Layout "inputs" needs groups';
  if (layout === 'number' && !stat) return 'Layout "number" needs a stat';
  if (stat) {
    const ds = datasets.get(stat.datasetKey);
    const i = ds?.x.indexOf(stat.x) ?? -1;
    if (!ds || i < 0 || ds.series[stat.series]?.[i] == null) return `No value for ${stat.datasetKey} / ${stat.series} / ${stat.x}`;
  }
  if (chart) {
    const ds = datasets.get(chart.datasetKey);
    if (!ds) return `Unknown dataset "${chart.datasetKey}"`;
    const missing = chart.series.filter((s) => !(s in ds.series));
    if (missing.length) return `Dataset "${ds.key}" has no series: ${missing.join(', ')}`;
    for (const x of [...(chart.range ?? []), ...(chart.highlight ? [chart.highlight] : []), ...(chart.exclude ?? []), ...(chart.totals ?? [])])
      if (!ds.x.includes(x)) return `Dataset "${ds.key}" has no x value "${x}"`;
    if (chart.highlight && chart.exclude?.includes(chart.highlight)) return `Highlight "${chart.highlight}" is excluded from the chart`;
    if (chart.refLine && !(chart.refLine.series in ds.series)) return `Dataset "${ds.key}" has no series "${chart.refLine.series}" for the reference line`;
    if (chart.totals && chart.type !== 'waterfall') return '`totals` only applies to waterfall charts';
  }
  if (slide.steps) {
    const order = slide.steps;
    const bulletsSeen = order.flatMap((s) => ('bullet' in s ? [s.bullet] : []));
    if (bulletsSeen.length !== slide.bullets.length || slide.bullets.some((_, i) => !bulletsSeen.includes(i))) return 'Steps must build every bullet exactly once';
    const itemsSeen = order.flatMap((s) => ('item' in s ? [s.item.join('.')] : []));
    const allItems = (slide.groups ?? []).flatMap((g, gi) => g.items.map((_, ii) => `${gi}.${ii}`));
    if (itemsSeen.length !== allItems.length || allItems.some((k) => !itemsSeen.includes(k))) return 'Steps must build every input item exactly once';
    const chartAt = order.findIndex((s) => 'chart' in s);
    if (!!chart !== chartAt >= 0 || order.filter((s) => 'chart' in s).length > 1) return 'Steps must build the chart exactly once';
    for (const [k, s] of order.entries()) {
      if (!('zoom' in s)) continue;
      if (chartAt < 0 || k < chartAt) return `Zoom "${s.zoom}" comes before the chart is built`;
      if (s.zoom !== 'all' && !datasets.get(chart!.datasetKey)?.x.includes(s.zoom)) return `Zoom "${s.zoom}" is not an x value of "${chart!.datasetKey}"`;
      if (chart!.exclude?.includes(s.zoom)) return `Zoom "${s.zoom}" is excluded from the chart`;
    }
  }
  // Figures in the text ({{key | series | x}}) must exist, and digits outside them are refused:
  // every quantity on screen comes from data/. Dates and names are allowed: 1993, 12 November, FY18, Q3, Scope 3.
  for (const text of slideTexts(slide)) {
    for (const r of tokenRefs(text)) if (lookup(datasets, r.key, r.series, r.x) === undefined) return `No value for {{${r.key} | ${r.series} | ${r.x}}}`;
    if (/\d/.test(stripAllowed(resolveText(text, new Map())))) return `Hand-typed number in "${text}". Put it in data/clean and write it as {{dataset | series | x}}`;
  }
  const shown = (t: string) => resolveText(t, datasets).length;
  if (shown(slide.title) > 120) return 'Title is too long for the screen (120 characters max)';
  if (slide.bullets.some((b) => shown(b) > 160)) return 'A bullet is too long for the screen (160 characters max)';
  if ((slide.groups ?? []).some((g) => g.items.some((t) => shown(t) > 80))) return 'An input item is too long for the screen (80 characters max)';
  return null;
}

/**
 * Build order from the YAML. Items in `bullets` are text ({ text, cue } or a plain string) or chart zooms ({ zoom, cue }).
 * The chart builds straight after the title with `chartFirst: true`, otherwise right after the last text bullet.
 */
function spineSteps(r: any): { bullets: string[]; steps: Step[] | undefined; cues: (string | null)[] } {
  const items: any[] = (r.bullets ?? []).map((b: any) => (typeof b === 'string' ? { text: b } : b));
  const isZoom = (b: any) => b && 'zoom' in b;
  const lastText = items.map((b) => !isZoom(b)).lastIndexOf(true);
  const steps: Step[] = [];
  const cues: (string | null)[] = [];
  const chart = () => (steps.push({ chart: true }), cues.push(r.chartCue ?? null));
  if (r.chart && (r.chartFirst || lastText < 0)) chart();
  let n = 0;
  items.forEach((b, k) => {
    steps.push(isZoom(b) ? { zoom: String(b.zoom) } : { bullet: n++ });
    cues.push(b.cue == null ? null : String(b.cue));
    if (r.chart && !r.chartFirst && k === lastText) chart();
  });
  // Input groups (layout: inputs) build first, one item at a time: { tag, items: [ text | { text, cue } ] }
  const groupSteps: Step[] = [];
  const groupCues: (string | null)[] = [];
  (r.groups ?? []).forEach((g: any, gi: number) =>
    (g?.items ?? []).forEach((it: any, ii: number) => {
      groupSteps.push({ item: [gi, ii] });
      groupCues.push(typeof it === 'object' && it?.cue != null ? String(it.cue) : null);
    }),
  );
  const plain = !r.chartFirst && !items.some(isZoom) && !groupSteps.length; // the default order: no need to spell it out
  return { bullets: items.filter((b) => !isZoom(b)).map((b) => b.text), steps: plain ? undefined : [...groupSteps, ...steps], cues: [...groupCues, ...cues] };
}

/** Reads docs/script/spine.yaml. Bullets may be plain strings, { text, cue } or { zoom, cue }; the chart may have chartCue. Throws with a readable message. */
export function loadSpine(datasets: Map<string, Dataset>, file = SPINE_FILE): SpineSlide[] {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(raw)) throw new Error('spine.yaml must be a list of slides');
  const ids = new Set<string>();
  return raw.map((r: any, i: number) => {
    const { bullets, steps, cues } = spineSteps(r ?? {});
    const groups = r?.groups?.map((g: any) => ({ ...g, items: (g?.items ?? []).map((it: any) => (typeof it === 'object' ? it?.text : it)) }));
    const parsed = SpineSlide.safeParse({ ...r, bullets, steps, elementCues: cues, ...(groups ? { groups } : {}) });
    const where = `Slide ${i + 1} (${r?.id ?? 'no id'})`;
    if (!parsed.success) throw new Error(`${where}: ${parsed.error.issues[0].path.join('.')} ${parsed.error.issues[0].message}`);
    if (ids.has(parsed.data.id)) throw new Error(`${where}: duplicate id`);
    ids.add(parsed.data.id);
    const problem = checkSlide(parsed.data, datasets);
    if (problem) throw new Error(`${where}: ${problem}`);
    const { say } = parsed.data;
    if (!say) return parsed.data;
    for (const { key, series, x } of tokenRefs(say)) {
      if (lookup(datasets, key, series, x) === undefined) throw new Error(`${where}: No spoken value for ${key} / ${series} / ${x}`);
    }
    return { ...parsed.data, say: resolveText(say, datasets) };
  });
}

/** After the script changes, find the live slide again by id (slides may have moved), and pick up its edits. */
export function relocate(state: ShowState, spine: SpineSlide[]): Pick<ShowState, 'index' | 'live' | 'reveal'> {
  if (state.index < 0 || isCovered(state)) return { index: Math.min(state.index, spine.length - 1), live: state.live, reveal: state.reveal };
  const i = spine.findIndex((s) => s.id === state.live?.id);
  if (i < 0) return { index: -1, live: null, reveal: 0 }; // slide removed: standby
  return { index: i, live: spine[i], reveal: Math.min(state.reveal, elementCount(spine[i])) };
}

export function emptyState(): ShowState {
  return { index: -1, live: null, reveal: 0, liveSince: 0, history: [], autoCue: true, heard: '', consumed: 0, lastCue: null, skipped: [], rehearsal: null, mode: 'script', question: '', questionTail: '', stray: '', drafts: [], under: 0, riff: true, autoShow: false, follow: 'script', seen: [], approveTangents: false, motion: true, backup: false };
}

export function loadState(): ShowState {
  try {
    return { ...emptyState(), ...JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')), mode: 'script', question: '', questionTail: '', heard: '', consumed: 0, stray: '', drafts: [] };
  } catch {
    return emptyState();
  }
}

export function saveState(s: ShowState) {
  // write-then-rename so a crash mid-write never leaves a corrupt state file
  fs.writeFileSync(STATE_FILE + '.tmp', JSON.stringify(s));
  fs.renameSync(STATE_FILE + '.tmp', STATE_FILE);
}

/** A live-built (or prepared answer) slide is covering the script. */
export const isCovered = (s: ShowState) => !!s.live && /^(gen|qa)-/.test(s.live.id);

const IGNORE_UTTERANCE = -1;
export const isIgnoringUtterance = (s: ShowState) => s.consumed === IGNORE_UTTERANCE;
export const answerOnDeck = (s: ShowState) =>
  !!s.live?.answer || !!s.live?.id.startsWith('qa-') || s.drafts.some((draft) => draft.kind === 'answer');

/** Put a live-built slide on stage without losing the place in the script. */
export function cover(state: ShowState, slide: Slide): ShowState {
  const under = isCovered(state) ? state.under : state.reveal;
  return { ...show(state, slide, state.index), reveal: elementCount(slide), under };
}

/** Back to the script slide underneath, as it was. */
function resume(state: ShowState, spine: SpineSlide[]): ShowState {
  if (!isCovered(state)) return state;
  const s = spine[state.index];
  if (!s) return { ...state, index: -1, live: null, reveal: 0, liveSince: Date.now(), heard: '', stray: '' };
  return { ...show(state, s, state.index), reveal: Math.max(1, Math.min(state.under, elementCount(s))) };
}

/** Hold the finished slide in the approval queue. */
export function addDraft(state: ShowState, d: Draft): ShowState {
  return {
    ...state,
    ...(d.kind === 'answer' ? { heard: '', stray: '' } : {}),
    drafts: [...state.drafts, d].slice(-5),
  };
}

const COMMON = new Set('that this with from have they them then than there their what when which would could should about because just like really very also been were will your some more into over know think going thing things here well actually right okay yeah people want make made much many only even every where nvidia company'.split(' '));
const contentWords = (t: string) => words(t).filter((w) => w.length >= 4 && !COMMON.has(w));

/**
 * Is the presenter off script? True when enough has been said since the last cue, and most of its
 * content words appear nowhere in the script around the current slide. Free: no AI involved.
 */
export function offScript(state: ShowState, spine: SpineSlide[]): boolean {
  const said = contentWords(state.stray).slice(-30);
  if (said.length < 12) return false;
  const near = spine.slice(Math.max(0, state.index - 1), state.index + 5);
  const vocab = new Set(near.flatMap((s) => contentWords([s.say ?? '', s.title, ...s.bullets, ...s.cues].join(' '))));
  return said.filter((w) => vocab.has(w)).length / said.length < 0.45;
}

/** Reveal up to (not including) the next element that waits for its own cue. */
function revealFrom(slide: SpineSlide | Slide, from: number): number {
  const cues = 'elementCues' in slide ? slide.elementCues : [];
  const total = elementCount(slide);
  let r = from + 1;
  while (r < total && !cues[r - 1]) r++;
  return r;
}

function show(state: ShowState, slide: Slide, index: number): ShowState {
  // liveSince always moves on, even within the same millisecond, so the stage rebuilds and the log sees every change.
  return { ...state, index, live: slide, reveal: revealFrom(slide, 0), liveSince: Math.max(Date.now(), state.liveSince + 1), history: [...state.history, slide].slice(-50), heard: '', stray: '', seen: /^(gen|qa)-/.test(slide.id) || state.seen.includes(slide.id) ? state.seen : [...state.seen, slide.id] };
}

/** Live mode: go to a script slide (or back to the one under a tangent) with that many of its points built. */
export function liveGo(state: ShowState, spine: SpineSlide[], id: string, covered: number): ShowState {
  const i = spine.findIndex((s) => s.id === id);
  if (i < 0) return state;
  if (i === state.index) return livePoints(isCovered(state) ? resume(state, spine) : state, spine, covered);
  return livePoints(show(state, spine[i], i), spine, covered);
}

/** Live mode: build the slide on screen as far as the presenter has got. Never un-builds. */
export function livePoints(state: ShowState, spine: SpineSlide[], covered: number): ShowState {
  const s = spine[state.index];
  if (!s || state.live?.id !== s.id || covered < 1) return state;
  const want = Math.min(elementCount(s), covered + 1);
  if (want <= state.reveal) return state;
  return { ...state, reveal: revealFrom(s, want - 1), heard: '', stray: '' };
}

/** The next/previous slide the operator hasn't switched off. */
const isOn = (spine: SpineSlide[], skipped: string[], i: number) => !!spine[i] && !skipped.includes(spine[i].id);
function step(spine: SpineSlide[], skipped: string[], from: number, dir: 1 | -1): number {
  for (let i = from + dir; i >= 0 && i < spine.length; i += dir) if (isOn(spine, skipped, i)) return i;
  return -1;
}

function next(state: ShowState, spine: SpineSlide[]): ShowState {
  if (state.backup) {
    const i = step(spine, state.skipped, state.index, 1);
    return i >= 0 ? { ...show(state, spine[i], i), reveal: elementCount(spine[i]) } : state;
  }
  if (state.live && state.reveal < elementCount(state.live)) return { ...state, reveal: revealFrom(state.live, state.reveal), heard: '', stray: '' };
  const i = step(spine, state.skipped, state.index, 1);
  return i >= 0 ? show(state, spine[i], i) : state;
}

type Target = { kind: 'element' } | { kind: 'slide'; index: number };

/** Listen only for what can come next: this slide's next element, then the next two slides that are switched on. */
function candidates(state: ShowState, spine: SpineSlide[], final: boolean): Candidate<Target>[] {
  const out: Candidate<Target>[] = [];
  const live = state.index >= 0 ? spine[state.index] : undefined;
  if (live && state.live?.id === live.id && state.reveal < elementCount(live)) {
    const c = live.elementCues[state.reveal - 1];
    if (c) out.push({ cue: c, target: { kind: 'element' } });
  }
  const a = step(spine, state.skipped, state.index, 1);
  const b = final && a >= 0 ? step(spine, state.skipped, a, 1) : -1;
  for (const i of [a, b]) if (i >= 0) for (const cue of spine[i].cues) out.push({ cue, target: { kind: 'slide', index: i } });
  return out;
}

/**
 * Speech in. Final results are appended to `heard`; interim results are matched but not stored, and `consumed`
 * remembers how much of the current utterance a cue has already used, so its final copy can't fire twice.
 * After a cue fires, the words after it carry on, so a bullet said in the same breath as its slide still lands.
 */
function hear(state: ShowState, text: string, final: boolean, spine: SpineSlide[], paused: boolean, receivedAt?: number): ShowState {
  if (paused || state.backup || answerOnDeck(state) || isIgnoringUtterance(state)) {
    // The final may arrive after Q&A closes. Keep the whole utterance out of the script follower.
    const consumed = final ? 0 : IGNORE_UTTERANCE;
    if (state.consumed === consumed && !state.heard && !state.stray) return state;
    return { ...state, heard: '', stray: '', consumed };
  }
  const prior = state.heard ? state.heard.split(' ') : [];
  const fresh = words(text).slice(state.consumed);
  const buf = [...prior, ...fresh];
  const newText = state.consumed === 0 ? text : fresh.join(' ');
  let s = final ? { ...state, stray: `${state.stray} ${newText}`.trim().slice(-1200) } : state;
  let used = 0;
  if (state.autoCue) {
    for (let k = 0; k < 4; k++) {
      const eligible = candidates(s, spine, final);
      const remaining = buf.slice(used);
      const newFrom = Math.max(0, prior.length - used);
      const hit = final ? findCue(remaining, eligible, 0.75, newFrom) : findInterimCue(remaining, eligible, newFrom);
      if (!hit) break;
      const before = s;
      const live = s.index >= 0 ? spine[s.index] : undefined;
      s = hit.target.kind === 'element' ? next(s, spine) : show(s, spine[hit.target.index], hit.target.index);
      const at = Date.now();
      s = { ...s, lastCue: { phrase: hit.cue, target: hit.target.kind === 'element' ? `${live?.id}: next element` : spine[hit.target.index].id, at, ...(receivedAt !== undefined && receivedAt <= at && at - receivedAt <= 30000 ? { receivedAt } : {}) } };
      if (hit.target.kind === 'slide') s = logMove(before, s, 'cue', spine);
      used += hit.end + 1;
    }
  }
  if (final) return { ...s, heard: buf.slice(used).slice(-40).join(' '), consumed: 0 };
  // Interim: its words arrive again in the final result, so only record what was used.
  if (used === 0) return state; // nothing fired: no change, so no broadcast or disk write for every partial result
  if (used <= prior.length) return { ...s, heard: prior.slice(used).join(' '), consumed: state.consumed };
  return { ...s, heard: '', consumed: state.consumed + used - prior.length };
}

/** Pure reducer: returns the new state, or an error string. Raw input is validated here (trust boundary). */
export function apply(state: ShowState, raw: unknown, ctx: Ctx): ShowState | string {
  const parsed = ClientMsg.safeParse(raw);
  if (!parsed.success) return `Invalid message: ${parsed.error.issues[0]?.message}`;
  const msg = parsed.data;
  const out = reduce(state, msg, ctx);
  // Rehearsal log: one entry each time a script slide goes live, saying what moved it there.
  if (typeof out === 'string' || !out.rehearsal || out === state || out.liveSince === state.liveSince || out.index < 0) return out;
  const via = msg.type === 'next' || msg.type === 'back' || msg.type === 'goto' ? msg.type : null;
  return via ? logMove(state, out, via, ctx.spine) : out;
}

/** Adds a script slide going live to the rehearsal log. */
export function logMove(state: ShowState, out: ShowState, via: RunEntry['via'], spine: SpineSlide[]): ShowState {
  if (!out.rehearsal || out.liveSince === state.liveSince || out.index < 0 || isCovered(out)) return out;
  const measured = via === 'cue' ? out.lastCue : null;
  const entry: RunEntry = { id: spine[out.index].id, index: out.index, at: out.liveSince, via, ...(measured ? { cue: measured.phrase } : {}), ...(measured?.receivedAt !== undefined ? { cueDispatchMs: measured.at - measured.receivedAt } : {}) };
  return { ...out, rehearsal: { ...out.rehearsal, entries: [...out.rehearsal.entries, entry] } };
}

function reduce(state: ShowState, msg: z.output<typeof ClientMsg>, { datasets, spine, pauseCues = false }: Ctx): ShowState | string {
  switch (msg.type) {
    case 'dismissStuck': // the server's own alert, not show state
      return state;
    case 'backup':
      return { ...state, backup: msg.on, heard: '', stray: '' };
    case 'clear':
      return { ...state, seen: [], index: -1, live: null, reveal: 0, liveSince: Date.now(), heard: '' };
    case 'push': {
      if (msg.slide.answer || /^(gen|qa)-/.test(msg.slide.id)) return 'Use the approval queue to show a live answer';
      const problem = checkSlide(msg.slide, datasets);
      if (problem) return problem;
      return { ...show(state, msg.slide, -1), reveal: elementCount(msg.slide) }; // ad-hoc slides build all at once
    }
    case 'next':
      return next(state, spine);
    case 'back': {
      if (isCovered(state)) return resume(state, spine);
      const i = step(spine, state.skipped, state.index, -1);
      if (i < 0) return { ...state, index: -1, live: null, reveal: 0, liveSince: Date.now(), heard: '' };
      return { ...show(state, spine[i], i), reveal: elementCount(spine[i]) };
    }
    case 'goto':
      if (msg.index < 0 || msg.index >= spine.length) return `No slide ${msg.index + 1}`;
      return state.backup ? { ...show(state, spine[msg.index], msg.index), reveal: elementCount(spine[msg.index]) } : show(state, spine[msg.index], msg.index); // explicit jumps may land on a skipped slide
    case 'autoCue':
      return { ...state, autoCue: msg.on, heard: '', stray: '' };
    case 'skip': {
      const slide = spine.find((s) => s.id === msg.id);
      if (!slide?.optional) return `"${msg.id}" is not an optional slide`;
      const rest = state.skipped.filter((id) => id !== msg.id);
      return { ...state, skipped: msg.on ? [...rest, msg.id] : rest };
    }
    case 'rehearsal': {
      if (msg.action === 'stop') return { ...state, rehearsal: null };
      const now = Date.now();
      const entries: RunEntry[] = state.index >= 0 ? [{ id: spine[state.index].id, index: state.index, at: now, via: 'goto' }] : [];
      return { ...state, seen: state.index >= 0 ? [spine[state.index].id] : [], rehearsal: { startedAt: now, entries } };
    }
    case 'question':
      if (msg.action === 'start') return { ...state, mode: 'question', question: '', questionTail: '', heard: '', consumed: 0, stray: '' };
      // The rest of an utterance still in progress belongs to the question: ignore it until its final result.
      return { ...state, mode: 'script', question: '', questionTail: '', consumed: state.questionTail ? IGNORE_UTTERANCE : 0 };
    case 'draft': {
      const d = state.drafts.find((x) => x.id === msg.id);
      if (!d) return 'That slide is no longer in the queue';
      const rest = { ...state, drafts: state.drafts.filter((x) => x !== d) };
      return msg.action === 'show' ? cover(rest, d.slide) : rest;
    }
    case 'resume':
      return resume(state, spine);
    case 'setting':
      return { ...state, [msg.key]: msg.on };
    case 'follow':
      return { ...state, follow: msg.mode, heard: '', stray: '' };
    case 'tangent':
    case 'micCmd':
    case 'micStatus':
    case 'ask':
    case 'bank':
      return state; // handled by the server (needs Claude or the prepared answers)
    case 'transcript':
      if (state.mode === 'question')
        return msg.final ? { ...state, question: `${state.question} ${msg.text}`.trim().slice(-1500), questionTail: '' } : { ...state, questionTail: msg.text };
      return hear(state, msg.text, msg.final, spine, pauseCues, msg.receivedAt);
  }
}

/** A finished run, as written to rehearsal/<timestamp>.json: time on each slide and how it got there. */
export function runReport(run: Rehearsal, stoppedAt: number, spine: SpineSlide[], sectionEnd = sectionLastIndex(spine)) {
  const slides = run.entries.map((e, i) => ({
    id: e.id,
    speaker: spine[e.index]?.speaker,
    seconds: Math.round(((run.entries[i + 1]?.at ?? stoppedAt) - e.at) / 100) / 10,
    via: e.via,
    ...(e.cue ? { cue: e.cue } : {}),
    ...(e.cueDispatchMs !== undefined ? { cueDispatchMs: e.cueDispatchMs } : {}),
  }));
  const cueTimes = slides.flatMap((s) => s.cueDispatchMs === undefined ? [] : [s.cueDispatchMs]).sort((a, b) => a - b);
  const middle = Math.floor(cueTimes.length / 2);
  const inSection = (id: string) => spine.findIndex((s) => s.id === id) <= sectionEnd;
  const sum = (xs: typeof slides) => Math.round(xs.reduce((t, s) => t + s.seconds, 0) * 10) / 10;
  return {
    startedAt: new Date(run.startedAt).toISOString(),
    stoppedAt: new Date(stoppedAt).toISOString(),
    totalSeconds: Math.round((stoppedAt - run.startedAt) / 100) / 10,
    openingSectionSeconds: sum(slides.filter((s) => inSection(s.id))),
    openingSectionTargetSeconds: 240,
    cueFired: slides.filter((s) => s.via === 'cue').length,
    medianCueDispatchMs: cueTimes.length ? (cueTimes[middle] + cueTimes[Math.floor((cueTimes.length - 1) / 2)]) / 2 : null,
    followed: slides.filter((s) => s.via === 'live').length,
    manual: slides.filter((s) => s.via !== 'cue' && s.via !== 'live').length,
    slides,
  };
}

/** Last slide of the opening section: the run of slides by the first speaker (Rob's "why", beats 1–21). */
export function sectionLastIndex(spine: SpineSlide[]): number {
  const i = spine.findIndex((s) => s.speaker !== spine[0]?.speaker);
  return i < 0 ? spine.length - 1 : i - 1;
}
