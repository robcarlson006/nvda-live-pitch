import { z } from 'zod';

// The one slide format used everywhere: script spine, Q&A bank and Claude output.
// Charts carry only a dataset key + series names; the numbers are always looked up in code.
export const ChartSpec = z.object({
  type: z.enum(['line', 'bar', 'stackedBar']),
  datasetKey: z.string().min(1),
  series: z.array(z.string()).min(1),
  highlight: z.string().optional(), // an x value to emphasise, e.g. "FY26"
});

// A single headline figure, looked up from a dataset (never typed by hand or by the model).
export const StatSpec = z.object({
  datasetKey: z.string().min(1),
  series: z.string().min(1),
  x: z.string().min(1),
  label: z.string().max(120),
});

// statement: one big line · number: a figure rendered by the core array · chart: chart fills the slide · split: text + chart
export const Slide = z.object({
  id: z.string().min(1),
  layout: z.enum(['statement', 'number', 'chart', 'split']).default('split'),
  speaker: z.string().optional(),
  title: z.string().min(1).max(90),
  bullets: z.array(z.string().max(140)).max(4).default([]),
  chart: ChartSpec.optional(),
  stat: StatSpec.optional(),
  sources: z.array(z.string()).default([]),
});
export type Slide = z.infer<typeof Slide>;

/** "USD bn" → "$115.8bn"; anything else keeps its unit. */
export function formatValue(v: number, unit: string): string {
  if (unit === 'USD bn') return `$${v.toFixed(1)}bn`;
  if (unit === '%') return `${v.toFixed(1)}%`;
  if (unit === 'x') return `${v.toFixed(1)}x`;
  return `${v.toLocaleString('en-GB')} ${unit}`;
}

export const Dataset = z.object({
  key: z.string(),
  title: z.string(),
  unit: z.string(),
  source: z.string(),
  asOf: z.string(),
  placeholder: z.boolean(),
  x: z.array(z.string()),
  series: z.record(z.string(), z.array(z.number().nullable())),
});
export type Dataset = z.infer<typeof Dataset>;

export type ShowState = {
  live: Slide | null;
  liveSince: number; // bumps on every push so the stage replays the build even for the same slide
  history: Slide[];
};

export const ClientMsg = z.discriminatedUnion('type', [
  z.object({ type: z.literal('push'), slide: Slide }),
  z.object({ type: z.literal('clear') }),
]);
export type ClientMsg = z.infer<typeof ClientMsg>;

export type ServerMsg =
  | { type: 'state'; state: ShowState; clients: number }
  | { type: 'error'; message: string };
