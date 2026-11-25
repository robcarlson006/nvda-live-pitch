/**
 * Fuzzy cue matching. A cue fires when (nearly) all of its meaningful words appear close together in what was just said.
 * Speech-to-text slips by a letter are tolerated on longer words ("Blackwel" still matches "Blackwell").
 */
const STOP = new Set('a an the and of to is it in that this we our you on for at as so be are was its i us with by from'.split(' '));
// Deepgram writes US spellings even in en-GB mode ("fiber", "tons"), so UK spellings in cues are mapped to them.
const SPELLING: Record<string, string> = {
  centre: 'center', centres: 'centers', colour: 'color', fibre: 'fiber', fibres: 'fibers', tonne: 'ton', tonnes: 'tons',
  grey: 'gray', programme: 'program', programmes: 'programs', analyse: 'analyze', modelling: 'modeling', labour: 'labor', defence: 'defense',
};

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
function match(cue: string, heard: string[], newFrom = 0): { score: number; end: number } {
  const need = needed(cue);
  const span = words(cue).length + SLACK;
  let best = { score: 0, end: -1 };
  if (!need.length) return best;
  for (let i = Math.max(0, newFrom - span + 1); i < heard.length; i++) {
    const end = Math.min(heard.length, i + span);
    let cursor = i;
    let matched = 0;
    for (const word of need) {
      const at = find(word, heard.slice(cursor, end));
      if (at < 0) continue;
      matched++;
      cursor += at + 1;
    }
    if (cursor > newFrom && matched / need.length > best.score) {
      best = { score: matched / need.length, end: cursor - 1 };
    }
    if (best.score === 1) break;
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

/** Index in `heard` of the first word matching cue word `t` (allowing a plural, or a one-letter slip on longer words), or -1. */
function find(t: string, heard: string[]): number {
  return heard.findIndex((w) => w === t || (t.length >= 4 && (w === t + 's' || w + 's' === t)) || (t.length >= 5 && Math.abs(w.length - t.length) <= 1 && lev(w, t) <= 1));
}

export type Candidate<T> = { cue: string; target: T };
export type Hit<T> = Candidate<T> & { end: number }; // index in the heard words of the last word the match used

const WINDOW = 30; // keep only a short overlap with preceding speech

/**
 * First candidate (in priority order) whose cue is matched. Order matters: it stops a later slide winning over the next one.
 * `end` says where the match finished, so the words after it can carry on towards the next cue.
 * When newFrom is provided, match through the incoming utterance and require a new word at the end of the cue.
 */
export function findCue<T>(heard: string | string[], candidates: Candidate<T>[], threshold = 0.75, newFrom?: number): Hit<T> | null {
  const all = typeof heard === 'string' ? words(heard) : heard;
  const offset = Math.max(0, (newFrom ?? all.length) - WINDOW);
  const recent = all.slice(offset);
  // The cue said first wins (so a slide change isn't swallowed by a leftover point named later in the same breath);
  // on a tie, the earlier candidate (the next point, then the next slide) wins.
  let best: Hit<T> | null = null;
  for (const c of candidates) {
    const m = match(c.cue, recent, Math.max(0, (newFrom ?? offset) - offset));
    if (m.score >= threshold && (!best || offset + m.end < best.end)) best = { ...c, end: offset + m.end };
  }
  return best;
}

/** The speech engine may revise a partial. Only use an exact, ordered cue that ends in new speech. */
export function findInterimCue<T>(heard: string[], candidates: Candidate<T>[], newFrom: number): Hit<T> | null {
  let best: Hit<T> | null = null;
  for (const candidate of candidates) {
    const hit = interimHit(heard, candidate, newFrom);
    if (hit && (!best || hit.end < best.end)) best = hit;
  }
  return best;
}

function interimHit<T>(heard: string[], candidate: Candidate<T>, newFrom: number): Hit<T> | null {
  const start = Math.max(0, newFrom - WINDOW);
  {
    const phrase = words(candidate.cue);
    if (!phrase.length || (phrase.length === 1 && phrase[0].length < 4)) return null;
    for (let i = Math.max(start, newFrom - phrase.length + 1); i <= heard.length - phrase.length; i++) {
      if (phrase.every((word, j) => heard[i + j] === word)) return { ...candidate, end: i + phrase.length - 1 };
    }
    // Not word for word: every key word present, close together and ending in new speech ("we've beaten our expectations").
    if (needed(candidate.cue).length >= 2) {
      const m = match(candidate.cue, heard.slice(start), newFrom - start);
      if (m.score === 1) return { ...candidate, end: start + m.end };
    }
  }
  return null;
}
