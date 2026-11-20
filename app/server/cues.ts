/**
 * Fuzzy cue matching. A cue fires when (nearly) all of its meaningful words appear in what was just said.
 * Speech-to-text slips by a letter are tolerated on longer words ("Blackwel" still matches "Blackwell").
 */
const STOP = new Set('a an the and of to is it in that this we our you on for at as so be are was its i us with by from'.split(' '));
const SPELLING: Record<string, string> = { centre: 'center', centres: 'centers', colour: 'color' };

export function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SPELLING[w] ?? w);
}

function lev(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}

/** Share of the cue's meaningful words found in the heard words (0..1). */
export function cueScore(cue: string, heard: string[]): number {
  const all = words(cue);
  const key = all.filter((w) => !STOP.has(w));
  const need = key.length ? key : all;
  if (!need.length) return 0;
  const hit = need.filter((t) => heard.some((w) => w === t || (t.length >= 5 && Math.abs(w.length - t.length) <= 1 && lev(w, t) <= 1)));
  return hit.length / need.length;
}

export type Candidate<T> = { cue: string; target: T };

/** First candidate (in priority order) whose cue is matched. Order matters: it stops a later slide winning over the next one. */
export function findCue<T>(heardText: string, candidates: Candidate<T>[], threshold = 0.75): Candidate<T> | null {
  const heard = words(heardText).slice(-30); // only recent speech counts
  return candidates.find((c) => cueScore(c.cue, heard) >= threshold) ?? null;
}
