/**
 * Fuzzy cue matching. A cue fires when (nearly) all of its meaningful words appear close together in what was just said.
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

const SLACK = 3; // extra words (ums, fillers) allowed in among a cue's words

/**
 * Best match of the cue in the heard words: the share of its meaningful words found close together, and where that match ends.
 * Close together matters: spoken numbers are full of common words, so "two … thousand … six" scattered over a paragraph isn't a cue.
 */
function match(cue: string, heard: string[]): { score: number; end: number } {
  const need = needed(cue);
  const span = words(cue).length + SLACK;
  let best = { score: 0, end: -1 };
  if (!need.length) return best;
  for (let i = 0; i < Math.max(1, heard.length - span + 1); i++) {
    const win = heard.slice(i, i + span);
    const at = need.map((t) => find(t, win)).filter((k) => k >= 0);
    if (at.length / need.length > best.score) best = { score: at.length / need.length, end: i + Math.max(...at) };
  }
  return best;
}

/** Share of the cue's meaningful words found close together in the heard words (0..1). */
export const cueScore = (cue: string, heard: string[]): number => match(cue, heard).score;

function needed(cue: string): string[] {
  const all = words(cue);
  const key = all.filter((w) => !STOP.has(w));
  return key.length ? key : all;
}

/** Index in `heard` of the first word matching cue word `t` (allowing a one-letter slip on longer words), or -1. */
function find(t: string, heard: string[]): number {
  return heard.findIndex((w) => w === t || (t.length >= 5 && Math.abs(w.length - t.length) <= 1 && lev(w, t) <= 1));
}

export type Candidate<T> = { cue: string; target: T };
export type Hit<T> = Candidate<T> & { end: number }; // index in the heard words of the last word the match used

const WINDOW = 30; // only recent speech counts

/**
 * First candidate (in priority order) whose cue is matched. Order matters: it stops a later slide winning over the next one.
 * `end` says where the match finished, so the words after it can carry on towards the next cue.
 */
export function findCue<T>(heard: string | string[], candidates: Candidate<T>[], threshold = 0.75): Hit<T> | null {
  const all = typeof heard === 'string' ? words(heard) : heard;
  const offset = Math.max(0, all.length - WINDOW);
  const recent = all.slice(offset);
  for (const c of candidates) {
    const m = match(c.cue, recent);
    if (m.score >= threshold) return { ...c, end: offset + m.end };
  }
  return null;
}
