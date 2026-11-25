import { z } from 'zod';
import { ICON_NAMES } from './icons.ts';

// The one slide format used everywhere: script spine, Q&A bank and Claude output.
// Charts carry only a dataset key + series names; the numbers are always looked up in code.
export const ChartSpec = z.object({
  // waterfall: each x adds to the running total and floats on it; x values in `totals` are full bars (e.g. enterprise value)
  type: z.enum(['line', 'bar', 'stackedBar', 'waterfall']),
  display: z.literal('table').optional(),
  datasetKey: z.string().min(1),
  series: z.array(z.string()).min(1),
  highlight: z.string().optional(), // an x value to emphasise, e.g. "FY26"
  range: z.tuple([z.string(), z.string()]).optional(), // first and last x value to show, e.g. ["FY05", "FY13"]
  exclude: z.array(z.string()).optional(), // x values left off this chart (they stay in the dataset)
  totals: z.array(z.string()).optional(), // waterfall only: x values drawn as full bars from zero
  refLine: z.object({ series: z.string().min(1) }).optional(), // a horizontal line at this series' first value, labelled (e.g. today's share price)
  muted: z.boolean().optional(), // draw the first series in grey instead of green (e.g. "If AI ended for good")
});

export type ChartSpec = z.infer<typeof ChartSpec>;

// A single headline figure, looked up from a dataset (never typed by hand or by the model).
export const StatSpec = z.object({
  datasetKey: z.string().min(1),
  series: z.string().min(1),
  x: z.string().min(1),
  label: z.string().max(200),
});

// Background effects drawn by the core array. Purely visual: if one fails, the slide still shows.
export const Effect = z.enum(['cpu-gpu', 'merge72', 'spread', 'dark']);

// One build step after the title: a bullet (by index), the chart, or a zoom into one x value of the chart ("all" zooms back out).
// `item` = [group, item] on an `inputs` slide: that input appears, highlighted while it is being said.
export const Step = z.union([
  z.object({ bullet: z.number().int().min(0) }),
  z.object({ chart: z.literal(true) }),
  z.object({ zoom: z.string().min(1) }),
  z.object({ item: z.tuple([z.number().int().min(0), z.number().int().min(0)]) }),
]);
export type Step = z.infer<typeof Step>;

// A block of inputs from one source on an `inputs` slide: a small text tag (no logo) and its figures.
export const Group = z.object({ tag: z.string().min(1).max(60), items: z.array(z.string().max(260)).min(1).max(6) });

// statement: one big line · number: a figure rendered by the core array · chart: chart fills the slide · split: text + chart
// inputs: blocks of figures grouped by source (the DCF inputs slide)
export const Diagram = z.object({
  kind: z.enum(['flow', 'comparison', 'map']),
  nodes: z.array(z.string().trim().min(2).max(40)).min(2).max(5),
});
export type Diagram = z.infer<typeof Diagram>;

export const SourceLink = z.object({
  title: z.string().min(1),
  url: z.url({ protocol: /^https?$/ }),
  publisher: z.string().optional(),
  date: z.string().optional(),
  updated: z.string().optional(),
  claims: z.array(z.string()).optional(),
});
export type SourceLink = z.infer<typeof SourceLink>;

export const Slide = z.object({
  id: z.string().min(1),
  layout: z.enum(['statement', 'number', 'chart', 'split', 'inputs', 'timeline']).default('split'),
  speaker: z.string().optional(),
  title: z.string().min(1).max(200), // raw length; checkSlide limits the length on screen
  bullets: z.array(z.string().max(260)).max(4).default([]),
  groups: z.array(Group).max(4).optional(),
  chart: ChartSpec.optional(),
  stat: StatSpec.optional(),
  diagram: Diagram.optional(),
  answer: z.literal(true).optional(),
  effect: Effect.optional(),
  icons: z.array(z.enum(ICON_NAMES)).max(3).optional(), // drawn by the cores on the right: one big, or 2–3 in a chain
  steps: z.array(Step).max(12).optional(), // build order after the title; absent = the bullets in order, then the chart
  // A muted, looping clip beside the text: a file in app/public/media (kept out of git), credited on screen. Hidden if missing.
  video: z.object({ file: z.string().regex(/^[\w.-]+\.(mp4|webm|mov)$/i), credit: z.string().min(1).max(120) }).optional(),
  sources: z.array(z.string()).default([]),
});
export type Slide = z.infer<typeof Slide>;

/** The build order after the title. Slides without explicit steps build their bullets, then their chart. */
export const stepsOf = (s: Slide): Step[] =>
  s.steps ?? [
    ...(s.groups ?? []).flatMap((g, gi) => g.items.map((_, ii) => ({ item: [gi, ii] as [number, number] }))),
    ...s.bullets.map((_, i) => ({ bullet: i })),
    ...(s.chart ? [{ chart: true as const }] : []),
  ];

/** Every piece of text on a slide that can hold figures: title, bullets, headline label and input items. */
export const slideTexts = (s: Slide): string[] => [s.title, ...s.bullets, s.stat?.label ?? '', ...(s.groups ?? []).flatMap((g) => g.items)];

/** Which chart x value the slide is zoomed into once `reveal` elements are built, if any. */
export function zoomAt(s: Slide, reveal: number): string | null {
  let on: string | null = null;
  stepsOf(s).forEach((st, k) => {
    if ('zoom' in st && k + 1 < reveal) on = st.zoom === 'all' ? null : st.zoom;
  });
  return on;
}

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
  seriesVerified: z.record(z.string(), z.boolean()).optional(), // per-series override of `verified` (e.g. one figure the team has confirmed)
  x: z.array(z.string()),
  series: z.record(z.string(), z.array(z.number().nullable())),
});
export type Dataset = z.infer<typeof Dataset>;

const whole = (v: number) => Number.isInteger(v);

/** "USD bn" → "$115.8bn"; anything else keeps its unit. Whole numbers drop the ".0". */
export function formatValue(v: number, unit: string): string {
  if (unit === 'USD bn') return whole(v) ? `$${v}bn` : `$${v.toFixed(1)}bn`;
  if (unit === 'USD tn') return `$${Number(v.toFixed(2))}tn`;
  if (unit === 'bn') return `${v}bn`;
  if (unit === 'year') return `${v}`;
  if (unit === 'USD m') return `$${v.toLocaleString('en-GB')}m`;
  // Up to two decimals, so a 14.45% discount rate or a 10.55% sector rate is never shown as 14.4% / 10.6%.
  if (unit === '%') return `${whole(v) ? v : Number(v.toFixed(2))}%`;
  if (unit === 'USD') return `$${v.toFixed(2)}`;
  if (unit === 'x') return whole(v) ? `${v}x` : `${v.toFixed(1)}x`;
  if (unit === 'm') return `${v}m`;
  if (unit === '') return v.toLocaleString('en-GB');
  if (unit === "'000 t CO2e") return v >= 1000 ? `${(v / 1000).toFixed(1)}m t CO2e` : `${Math.round(v)}k t CO2e`;
  // Plain English for small amounts of carbon: 0.048 → "48 kg", 1.241 → "1.2 tonnes", 108.743 → "109 tonnes".
  if (unit === 'tonnes CO2') return v < 1 ? `${Math.round(v * 1000)} kg` : v < 10 ? `${Number(v.toFixed(1))} tonnes` : `${Math.round(v)} tonnes`;
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
  const keys = [s.chart?.datasetKey, s.stat?.datasetKey, ...slideTexts(s).flatMap((t) => tokenRefs(t).map((r) => r.key))];
  return [...new Set(keys.filter((k): k is string => !!k))];
}

/** The source line for a slide: each dataset it uses, or the exact fact's source for figures in its text. */
export function slideSources(s: Slide, datasets: Record<string, Dataset>): string[] {
  const out = [...s.sources];
  for (const key of [s.chart?.datasetKey, s.stat?.datasetKey]) {
    const ds = key ? datasets[key] : undefined;
    if (ds) out.push(ds.seriesSources?.[s.stat?.series ?? ''] && key === s.stat?.datasetKey ? ds.seriesSources[s.stat!.series] : `${ds.source}, as of ${ds.asOf}`);
  }
  for (const r of slideTexts(s).flatMap(tokenRefs)) {
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
  // One per element after the title, in build order (see stepsOf). null = builds straight after the previous one.
  elementCues: z.array(z.string().nullable()).default([]),
});
export type SpineSlide = z.infer<typeof SpineSlide>;

/** Elements build in this order: title (with the figure, for number slides), then each step (by default each bullet, then the chart). */
export const elementCount = (s: Slide) => 1 + stepsOf(s).length;

export type RunEntry = { id: string; index: number; at: number; via: 'cue' | 'next' | 'back' | 'goto' | 'live'; cue?: string; cueDispatchMs?: number };
export type Rehearsal = { startedAt: number; entries: RunEntry[] };

/** A slide built live, waiting for the operator. */
export type Draft = { id: string; kind: 'answer' | 'riff'; heard: string; slide: Slide; from: 'prepared' | 'claude' | 'web'; at: number; links?: SourceLink[]; threadId?: string; evidenceGap?: boolean };

export type ShowState = {
  index: number; // position in the spine; -1 = standby or an ad-hoc slide
  live: Slide | null;
  reveal: number; // how many elements of the live slide are on screen
  liveSince: number; // bumps whenever a new slide goes live, so the stage rebuilds from scratch
  history: Slide[];
  autoCue: boolean;
  heard: string; // speech since the last cue fired (normalised words)
  consumed: number; // words of the in-progress (interim) utterance already used by a cue
  lastCue: { phrase: string; target: string; at: number; receivedAt?: number } | null;
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
  follow: 'script' | 'live'; // script: cue words move the deck. live: it follows the meaning, and tangents get a slide by themselves
  seen: string[]; // ids of the script slides shown so far
  approveTangents: boolean; // live mode: wait for a tap before a tangent slide goes up
  backup: boolean; // show static, locally bundled slide images on the stage
  motion: boolean; // camera moves and slide morphs. false = the plain pre-v2 behaviour (kill-switch: operator toggle, key m, or ?motion=off on the stage)
};

/** What the operator panel shows about Claude. Not saved with the show. */
export type AiInfo = { follow: { text: string; ms: number; error: string | null }; busy: 'answer' | 'riff' | 'research' | 'visual' | null; note: string | null; spent: number; cap: number; model: string; hasKey: boolean; bankError: string | null; activeDraftId?: string; activeQuestion?: string; stuck?: Stuck | null };
/** The AI could not answer a board question: shown as an alert on the operator panel until dismissed or a new question starts. */
export type Stuck = { question: string; reason: string; kind: 'unclear' | 'no-data' | 'failed'; at: number };

export const ClientMsg = z.discriminatedUnion('type', [
  z.object({ type: z.literal('push'), slide: Slide }),
  z.object({ type: z.literal('clear') }),
  z.object({ type: z.literal('dismissStuck') }), // handled by the server before apply(): clears the operator's "couldn't answer" alert
  z.object({ type: z.literal('backup'), on: z.boolean() }),
  z.object({ type: z.literal('next') }),
  z.object({ type: z.literal('back') }),
  z.object({ type: z.literal('goto'), index: z.number().int() }),
  z.object({ type: z.literal('transcript'), text: z.string().max(20000) /* one long unbroken stretch of speech must never be refused */, final: z.boolean(), receivedAt: z.number().int().optional() }),
  z.object({ type: z.literal('autoCue'), on: z.boolean() }),
  z.object({ type: z.literal('skip'), id: z.string(), on: z.boolean() }),
  z.object({ type: z.literal('rehearsal'), action: z.enum(['start', 'stop']) }),
  z.object({ type: z.literal('question'), action: z.enum(['start', 'answer', 'cancel']) }),
  z.object({ type: z.literal('ask'), text: z.string().min(1).max(1500), kind: z.enum(['answer', 'riff']).default('answer'), followup: z.string().max(100).optional() }),
  z.object({ type: z.literal('draft'), action: z.enum(['show', 'reject']), id: z.string() }),
  z.object({ type: z.literal('bank'), id: z.string() }),
  z.object({ type: z.literal('resume') }),
  z.object({ type: z.literal('setting'), key: z.enum(['riff', 'autoShow', 'approveTangents', 'motion']), on: z.boolean() }),
  z.object({ type: z.literal('follow'), mode: z.enum(['script', 'live']) }),
  z.object({ type: z.literal('tangent'), action: z.enum(['show', 'block']) }),
  z.object({ type: z.literal('micCmd'), action: z.enum(['start', 'stop']), engine: z.enum(['deepgram', 'chrome']).optional(), lang: z.enum(['en-GB', 'en-US']).optional() }),
  z.object({ type: z.literal('micStatus'), on: z.boolean(), listening: z.boolean(), engine: z.enum(['deepgram', 'chrome']), lang: z.enum(['en-GB', 'en-US']), device: z.string().max(200), problem: z.string().max(300).nullable() }),
]);
export type ClientMsg = z.input<typeof ClientMsg>;

/** The microphone lives on the stage page (the laptop); operators control it from anywhere. */
export type MicInfo = { stage: boolean; on: boolean; listening: boolean; engine: 'deepgram' | 'chrome'; lang: 'en-GB' | 'en-US'; device: string; problem: string | null };

export type ServerMsg =
  | { type: 'state'; state: ShowState; spine: SpineSlide[]; spineError: string | null; clients: number; ai: AiInfo; bank: { id: string; question: string; ask?: string[] }[]; answers?: Draft[]; mic?: MicInfo; pending?: Draft | null }
  | { type: 'hearing'; text: string }
  | { type: 'micCmd'; action: 'start' | 'stop'; engine?: 'deepgram' | 'chrome'; lang?: 'en-GB' | 'en-US' }
  | { type: 'error'; message: string }
  | { type: 'saved'; file: string };
