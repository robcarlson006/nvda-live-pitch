import fs from 'node:fs';
import path from 'node:path';
import { ClientMsg, Dataset, type ShowState } from '../shared/schema.ts';

export const DATA_DIR = path.resolve(import.meta.dirname, '../../data/clean');
const STATE_FILE = path.resolve(import.meta.dirname, '../state.json');

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

export function emptyState(): ShowState {
  return { live: null, liveSince: 0, history: [] };
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

/** Pure reducer: returns the new state, or an error string. Raw input is validated here (trust boundary). */
export function apply(state: ShowState, raw: unknown, datasets: Map<string, Dataset>): ShowState | string {
  const parsed = ClientMsg.safeParse(raw);
  if (!parsed.success) return `Invalid message: ${parsed.error.issues[0]?.message}`;
  const msg = parsed.data;
  if (msg.type === 'clear') return { ...state, live: null, liveSince: Date.now() };

  const chart = msg.slide.chart;
  if (chart) {
    const ds = datasets.get(chart.datasetKey);
    if (!ds) return `Unknown dataset "${chart.datasetKey}"`;
    const missing = chart.series.filter((s) => !(s in ds.series));
    if (missing.length) return `Dataset "${ds.key}" has no series: ${missing.join(', ')}`;
  }
  return { live: msg.slide, liveSince: Date.now(), history: [...state.history, msg.slide] };
}
