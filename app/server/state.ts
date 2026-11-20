import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ClientMsg, Dataset, elementCount, SpineSlide, type ShowState, type Slide } from '../shared/schema.ts';
import { findCue, type Candidate } from './cues.ts';

export const DATA_DIR = path.resolve(import.meta.dirname, '../../data/clean');
export const SPINE_FILE = path.resolve(import.meta.dirname, '../../docs/script/spine.yaml');
const STATE_FILE = path.resolve(import.meta.dirname, '../state.json');

export type Ctx = { datasets: Map<string, Dataset>; spine: SpineSlide[] };

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

/** null if the slide can be shown; otherwise what is wrong with it. */
export function checkSlide(slide: Slide, datasets: Map<string, Dataset>): string | null {
  const { chart, stat, layout } = slide;
  if ((layout === 'chart' || layout === 'split') && !chart) return `Layout "${layout}" needs a chart`;
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
  }
  return null;
}

/** Reads docs/script/spine.yaml. Bullets may be plain strings or { text, cue }; the chart may have chartCue. Throws with a readable message. */
export function loadSpine(datasets: Map<string, Dataset>, file = SPINE_FILE): SpineSlide[] {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(raw)) throw new Error('spine.yaml must be a list of slides');
  const ids = new Set<string>();
  return raw.map((r: any, i: number) => {
    const bullets = (r.bullets ?? []).map((b: any) => (typeof b === 'string' ? { text: b } : b));
    const parsed = SpineSlide.safeParse({
      ...r,
      bullets: bullets.map((b: any) => b.text),
      elementCues: [...bullets.map((b: any) => b.cue ?? null), ...(r.chart ? [r.chartCue ?? null] : [])],
    });
    const where = `Slide ${i + 1} (${r?.id ?? 'no id'})`;
    if (!parsed.success) throw new Error(`${where}: ${parsed.error.issues[0].path.join('.')} ${parsed.error.issues[0].message}`);
    if (ids.has(parsed.data.id)) throw new Error(`${where}: duplicate id`);
    ids.add(parsed.data.id);
    const problem = checkSlide(parsed.data, datasets);
    if (problem) throw new Error(`${where}: ${problem}`);
    return parsed.data;
  });
}

export function emptyState(): ShowState {
  return { index: -1, live: null, reveal: 0, liveSince: 0, history: [], autoCue: true, heard: '', skipNextFinal: false, lastCue: null };
}

export function loadState(): ShowState {
  try {
    return { ...emptyState(), ...JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) };
  } catch {
    return emptyState();
  }
}

export function saveState(s: ShowState) {
  // write-then-rename so a crash mid-write never leaves a corrupt state file
  fs.writeFileSync(STATE_FILE + '.tmp', JSON.stringify(s));
  fs.renameSync(STATE_FILE + '.tmp', STATE_FILE);
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
  return { ...state, index, live: slide, reveal: revealFrom(slide, 0), liveSince: Date.now(), history: [...state.history, slide], heard: '' };
}

function next(state: ShowState, spine: SpineSlide[]): ShowState {
  if (state.live && state.reveal < elementCount(state.live)) return { ...state, reveal: revealFrom(state.live, state.reveal), heard: '' };
  if (state.index + 1 < spine.length) return show(state, spine[state.index + 1], state.index + 1);
  return state;
}

/** Pure reducer: returns the new state, or an error string. Raw input is validated here (trust boundary). */
export function apply(state: ShowState, raw: unknown, { datasets, spine }: Ctx): ShowState | string {
  const parsed = ClientMsg.safeParse(raw);
  if (!parsed.success) return `Invalid message: ${parsed.error.issues[0]?.message}`;
  const msg = parsed.data;

  switch (msg.type) {
    case 'clear':
      return { ...state, index: -1, live: null, reveal: 0, liveSince: Date.now(), heard: '' };
    case 'push': {
      const problem = checkSlide(msg.slide, datasets);
      if (problem) return problem;
      return { ...show(state, msg.slide, -1), reveal: elementCount(msg.slide) }; // ad-hoc slides build all at once
    }
    case 'next':
      return next(state, spine);
    case 'back':
      if (state.index <= 0) return { ...state, index: -1, live: null, reveal: 0, liveSince: Date.now(), heard: '' };
      return { ...show(state, spine[state.index - 1], state.index - 1), reveal: elementCount(spine[state.index - 1]) };
    case 'goto':
      if (msg.index < 0 || msg.index >= spine.length) return `No slide ${msg.index + 1}`;
      return show(state, spine[msg.index], msg.index);
    case 'autoCue':
      return { ...state, autoCue: msg.on, heard: '' };
    case 'transcript': {
      if (msg.final && state.skipNextFinal) return { ...state, skipNextFinal: false };
      const heard = msg.final ? `${state.heard} ${msg.text}`.split(/\s+/).slice(-40).join(' ').trim() : state.heard;
      const base = { ...state, heard };
      if (!state.autoCue) return base;

      // Listen only for what can come next: this slide's next element, then the next two slides.
      type T = { kind: 'element' } | { kind: 'slide'; index: number };
      const cands: Candidate<T>[] = [];
      const live = state.index >= 0 ? spine[state.index] : undefined;
      if (live && state.reveal < elementCount(live)) {
        const c = live.elementCues[state.reveal - 1];
        if (c) cands.push({ cue: c, target: { kind: 'element' } });
      }
      for (const i of [state.index + 1, state.index + 2]) if (spine[i]) for (const cue of spine[i].cues) cands.push({ cue, target: { kind: 'slide', index: i } });

      const hit = findCue(msg.final ? heard : `${heard} ${msg.text}`, cands);
      if (!hit) return base;
      const lastCue = { phrase: hit.cue, target: hit.target.kind === 'element' ? `${live!.id}: next element` : spine[hit.target.index].id, at: Date.now() };
      const fired = hit.target.kind === 'element' ? next(base, spine) : show(base, spine[hit.target.index], hit.target.index);
      return { ...fired, heard: '', lastCue, skipNextFinal: !msg.final };
    }
  }
}
