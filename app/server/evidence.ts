import type { SpineSlide } from '../shared/schema.ts';
import { words } from './cues.ts';

/**
 * A second opinion on what is being talked about, with no AI: which slide's script shares the most telling words with what was
 * just said. Rare words count most (idf). It never moves the deck; it only backs up (or fails to back up) Claude's verdict.
 */
const COMMON = new Set('about also anyway around because been being could does doing dont even ever every from going have here into just know like lets look make many more most much only other over really right same should some something start still than that their them then there these they thing things think this those though time very want well were what when where which while will with would year years your'.split(' '));
const stem = (w: string) => w.slice(0, 6);
export const terms = (t: string) => words(t).filter((w) => (w.length >= 4 || /\d/.test(w)) && !COMMON.has(w)).map(stem);

let cache: { spine: SpineSlide[]; docs: Map<string, Set<string>>; idf: Map<string, number> } | null = null;
function index(spine: SpineSlide[]) {
  if (cache?.spine === spine) return cache;
  const docs = new Map(spine.map((s) => [s.id, new Set(terms([s.title, ...s.bullets, s.say ?? '', ...s.cues, ...s.elementCues].join(' ').replace(/\{\{.*?\}\}/g, ' ')))]));
  const df = new Map<string, number>();
  for (const d of docs.values()) for (const t of d) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = new Map([...df].map(([t, n]) => [t, Math.log((spine.length + 1) / n)]));
  return (cache = { spine, docs, idf });
}

/** The slide the words point to, if one stands clear of the rest. */
export function evidence(said: string, spine: SpineSlide[]): { id: string; score: number } | null {
  const { docs, idf } = index(spine);
  const said_ = new Set(terms(said));
  const ranked = spine
    .map((s) => ({ id: s.id, score: [...said_].reduce((n, t) => n + (docs.get(s.id)!.has(t) ? idf.get(t)! : 0), 0) }))
    .sort((a, b) => b.score - a.score);
  const [a, b] = ranked;
  return a && a.score >= 4.5 && a.score >= 1.25 * (b?.score ?? 0) ? a : null;
}

/** Rarity of each telling word across the whole script (high = appears on few slides). */
export const idfOf = (spine: SpineSlide[]): Map<string, number> => index(spine).idf;
