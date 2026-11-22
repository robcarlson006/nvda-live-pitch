import { z } from 'zod';

// The one slide format used everywhere: script spine, Q&A bank and Claude output.
// Charts carry only a dataset key + series names; the numbers are always looked up in code.
export const ChartSpec = z.object({
  type: z.enum(['line', 'bar', 'stackedBar']),
  datasetKey: z.string().min(1),
  series: z.array(z.string()).min(1),
  highlight: z.string().optional(), // an x value to emphasise, e.g. "FY26"
  range: z.tuple([z.string(), z.string()]).optional(), // first and last x value to show, e.g. ["FY05", "FY13"]
});

// A single headline figure, looked up from a dataset (never typed by hand or by the model).
export const StatSpec = z.object({
  datasetKey: z.string().min(1),
  series: z.string().min(1),
  x: z.string().min(1),
  label: z.string().max(200),
});

// Background effects drawn by the core array. Purely visual: if one fails, the slide still shows.
export const Effect = z.enum(['cpu-gpu', 'merge72']);

// statement: one big line · number: a figure rendered by the core array · chart: chart fills the slide · split: text + chart
export const Slide = z.object({
  id: z.string().min(1),
  layout: z.enum(['statement', 'number', 'chart', 'split']).default('split'),
  speaker: z.string().optional(),
  title: z.string().min(1).max(200), // raw length; checkSlide limits the length on screen
  bullets: z.array(z.string().max(260)).max(4).default([]),
  chart: ChartSpec.optional(),
  stat: StatSpec.optional(),
  effect: Effect.optional(),
  sources: z.array(z.string()).default([]),
});
export type Slide = z.infer<typeof Slide>;

export const Dataset = z.object({
  key: z.string(),
  title: z.string(),
  unit: z.string(),
  units: z.record(z.string(), z.string()).optional(), // per-series unit, overrides `unit` (curated fact tables)
  source: z.string(),
  seriesSources: z.record(z.string(), z.string()).optional(), // per-series source, overrides `source` (curated fact tables)
  asOf: z.string(),
  placeholder: z.boolean(),
  curated: z.boolean().optional(), // typed in from research, not parsed from Bloomberg
  verified: z.boolean().optional(), // false = needs a primary source before the pitch
  x: z.array(z.string()),
  series: z.record(z.string(), z.array(z.number().nullable())),
});
export type Dataset = z.infer<typeof Dataset>;

const whole = (v: number) => Number.isInteger(v);

/** "USD bn" → "$115.8bn"; anything else keeps its unit. Whole numbers drop the ".0". */
export function formatValue(v: number, unit: string): string {
  if (unit === 'USD bn') return whole(v) ? `$${v}bn` : `$${v.toFixed(1)}bn`;
  if (unit === 'USD m') return `$${v.toLocaleString('en-GB')}m`;
  if (unit === '%') return whole(v) ? `${v}%` : `${v.toFixed(1)}%`;
  if (unit === 'USD') return `$${v.toFixed(2)}`;
  if (unit === 'x') return whole(v) ? `${v}x` : `${v.toFixed(1)}x`;
  if (unit === 'm') return `${v}m`;
  if (unit === '') return v.toLocaleString('en-GB');
  if (unit === "'000 t CO2e") return v >= 1000 ? `${(v / 1000).toFixed(1)}m t CO2e` : `${Math.round(v)}k t CO2e`;
  if (unit === "'000 MWh") return `${Math.round(v).toLocaleString('en-GB')} GWh`;
  return `${v.toLocaleString('en-GB')} ${unit}`;
}

export const unitOf = (ds: Dataset, series: string) => ds.units?.[series] ?? ds.unit;

/** The formatted value, or undefined if the dataset has no such point. */
export function lookup(datasets: Map<string, Dataset> | Record<string, Dataset>, key: string, series: string, x: string): string | undefined {
  const ds = datasets instanceof Map ? datasets.get(key) : datasets[key];
  const v = ds?.series[series]?.[ds.x.indexOf(x)];
  return ds && v != null ? formatValue(v, unitOf(ds, series)) : undefined;
}

/**
 * Figures inside slide text are written as {{datasetKey | series | x}} and looked up here,
 * so a number in a title or bullet still comes from data/, never from the script or the model.
 */
const TOKEN = /\{\{\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\}\}/g;
export type TokenRef = { key: string; series: string; x: string };
export const tokenRefs = (text: string): TokenRef[] => [...text.matchAll(TOKEN)].map((m) => ({ key: m[1], series: m[2], x: m[3] }));
export const resolveText = (text: string, datasets: Map<string, Dataset> | Record<string, Dataset>) =>
  text.replace(TOKEN, (_, k, s, x) => lookup(datasets, k, s, x) ?? '…');

/** Every dataset a slide draws on: chart, headline figure, and figures in its text. */
export function slideDatasetKeys(s: Slide): string[] {
  const keys = [s.chart?.datasetKey, s.stat?.datasetKey, ...[s.title, ...s.bullets, s.stat?.label ?? ''].flatMap((t) => tokenRefs(t).map((r) => r.key))];
  return [...new Set(keys.filter((k): k is string => !!k))];
}

/** The source line for a slide: each dataset it uses, or the exact fact's source for figures in its text. */
export function slideSources(s: Slide, datasets: Record<string, Dataset>): string[] {
  const out = [...s.sources];
  for (const key of [s.chart?.datasetKey, s.stat?.datasetKey]) {
    const ds = key ? datasets[key] : undefined;
    if (ds) out.push(ds.seriesSources?.[s.stat?.series ?? ''] && key === s.stat?.datasetKey ? ds.seriesSources[s.stat!.series] : `${ds.source}, as of ${ds.asOf}`);
  }
  for (const r of [s.title, ...s.bullets, s.stat?.label ?? ''].flatMap(tokenRefs)) {
    const ds = datasets[r.key];
    if (ds) out.push(ds.seriesSources?.[r.series] ?? `${ds.source}, as of ${ds.asOf}`);
  }
  return [...new Set(out)];
}

/** Shown only to the operator, as "unverified", if any of its data still needs a primary source. */
export const isUnverified = (s: Slide, datasets: Record<string, Dataset>) => slideDatasetKeys(s).some((k) => datasets[k]?.verified === false);

/** A slide in the scripted spine: a Slide plus the phrases that trigger it and its elements. */
export const SpineSlide = Slide.extend({
  cues: z.array(z.coerce.string().min(1)).min(1),
  say: z.string().optional(),
  optional: z.boolean().default(false), // can be skipped from the operator panel
  // One per element after the title (bullets in order, then the chart). null = builds straight after the previous one.
  elementCues: z.array(z.string().nullable()).default([]),
});
export type SpineSlide = z.infer<typeof SpineSlide>;

/** Elements build in this order: title (with the figure, for number slides), each bullet, then the chart. */
export const elementCount = (s: Slide) => 1 + s.bullets.length + (s.chart ? 1 : 0);

export type RunEntry = { id: string; index: number; at: number; via: 'cue' | 'next' | 'back' | 'goto'; cue?: string };
export type Rehearsal = { startedAt: number; entries: RunEntry[] };

/** A slide built live, waiting for the operator (or shown at once if auto-show is on). */
export type Draft = { id: string; kind: 'answer' | 'riff'; heard: string; slide: Slide; from: 'prepared' | 'claude' | 'web'; at: number; links?: { title: string; url: string }[] };

export type ShowState = {
  index: number; // position in the spine; -1 = standby or an ad-hoc slide
  live: Slide | null;
  reveal: number; // how many elements of the live slide are on screen
  liveSince: number; // bumps whenever a new slide goes live, so the stage rebuilds from scratch
  history: Slide[];
  autoCue: boolean;
  heard: string; // speech since the last cue fired (normalised words)
  consumed: number; // words of the in-progress (interim) utterance already used by a cue
  lastCue: { phrase: string; target: string; at: number } | null;
  skipped: string[]; // ids of optional slides the operator has switched off
  rehearsal: Rehearsal | null;
  mode: 'script' | 'question'; // question: speech is collected as a board member's question, and fires no cues
  question: string; // finished speech of the question so far
  questionTail: string; // its in-progress (interim) words
  stray: string; // finished speech since the last cue, as heard: used to notice going off script
  drafts: Draft[];
  under: number; // how much of the script slide was built when a live-built slide covered it
  riff: boolean; // react when a presenter goes off script
  autoShow: boolean; // show live-built slides without waiting for approval
};

/** What the operator panel shows about Claude. Not saved with the show. */
export type AiInfo = { busy: 'answer' | 'riff' | 'research' | null; note: string | null; spent: number; cap: number; model: string; hasKey: boolean; bankError: string | null };

export const ClientMsg = z.discriminatedUnion('type', [
  z.object({ type: z.literal('push'), slide: Slide }),
  z.object({ type: z.literal('clear') }),
  z.object({ type: z.literal('next') }),
  z.object({ type: z.literal('back') }),
  z.object({ type: z.literal('goto'), index: z.number().int() }),
  z.object({ type: z.literal('transcript'), text: z.string().max(2000), final: z.boolean() }),
  z.object({ type: z.literal('autoCue'), on: z.boolean() }),
  z.object({ type: z.literal('skip'), id: z.string(), on: z.boolean() }),
  z.object({ type: z.literal('rehearsal'), action: z.enum(['start', 'stop']) }),
  z.object({ type: z.literal('question'), action: z.enum(['start', 'answer', 'cancel']) }),
  z.object({ type: z.literal('ask'), text: z.string().min(1).max(1500), kind: z.enum(['answer', 'riff']).default('answer'), fresh: z.boolean().default(false), web: z.boolean().default(false) }),
  z.object({ type: z.literal('draft'), action: z.enum(['show', 'reject']), id: z.string() }),
  z.object({ type: z.literal('bank'), id: z.string() }),
  z.object({ type: z.literal('resume') }),
  z.object({ type: z.literal('setting'), key: z.enum(['riff', 'autoShow']), on: z.boolean() }),
]);
export type ClientMsg = z.input<typeof ClientMsg>;

export type ServerMsg =
  | { type: 'state'; state: ShowState; spine: SpineSlide[]; spineError: string | null; clients: number; ai: AiInfo; bank: { id: string; question: string }[] }
  | { type: 'error'; message: string }
  | { type: 'saved'; file: string };
