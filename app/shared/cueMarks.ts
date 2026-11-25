import { SPELLING, STOP } from './words.ts';

/**
 * Where the trigger words sit in a slide's script, so the teleprompter can highlight them and the presenter can lean
 * on them. `step` is -1 for the phrase that brings the slide up, otherwise the element it builds (elementCues index).
 * Matching uses the same words as the cue matcher: a phrase is found word for word, or failing that its key words in
 * order, close together.
 */
export type CueMark = { start: number; end: number; step: number };

type Tok = { w: string; start: number; end: number };

function tokens(text: string): Tok[] {
  const out: Tok[] = [];
  for (const m of text.toLowerCase().matchAll(/[a-z0-9]+/g)) out.push({ w: SPELLING[m[0]] ?? m[0], start: m.index!, end: m.index! + m[0].length });
  return out;
}

const phraseWords = (p: string) => (p.toLowerCase().match(/[a-z0-9]+/g) ?? []).map((w) => SPELLING[w] ?? w);
const same = (a: string, b: string) => a === b || (b.length >= 4 && (a === b + 's' || a + 's' === b));

/** First place the phrase is said, as a token range [from, to], or null. */
function locate(toks: Tok[], phrase: string, taken: boolean[]): [number, number] | null {
  const all = phraseWords(phrase);
  if (!all.length) return null;
  const free = (a: number, b: number) => taken.slice(a, b + 1).every((t) => !t);
  for (let i = 0; i + all.length <= toks.length; i++)
    if (all.every((w, j) => same(toks[i + j].w, w)) && free(i, i + all.length - 1)) return [i, i + all.length - 1];
  const key = all.filter((w) => !STOP.has(w));
  if (key.length < 2) return null;
  const span = all.length + 3;
  for (let i = 0; i < toks.length; i++) {
    if (!same(toks[i].w, key[0])) continue;
    let at = i;
    let ok = true;
    for (const w of key.slice(1)) {
      let k = at + 1;
      while (k < Math.min(toks.length, i + span) && !same(toks[k].w, w)) k++;
      if (k >= Math.min(toks.length, i + span)) { ok = false; break; }
      at = k;
    }
    if (ok && free(i, at)) return [i, at];
  }
  return null;
}

/** The first phrase of each list that the script contains wins: list a cue's main words first ("john deere" before "weeds"). */
export function cueMarks(text: string, slideCues: string[], elementCues: (string[] | null)[]): CueMark[] {
  const toks = tokens(text);
  const taken = toks.map(() => false);
  const marks: CueMark[] = [];
  const place = (phrases: string[], step: number) => {
    const found = phrases.map((p) => locate(toks, p, taken)).find((r): r is [number, number] => !!r);
    if (!found) return;
    for (let k = found[0]; k <= found[1]; k++) taken[k] = true;
    marks.push({ start: toks[found[0]].start, end: toks[found[1]].end, step });
  };
  place(slideCues, -1);
  elementCues.forEach((c, i) => c && place(c, i));
  return marks.sort((a, b) => a.start - b.start);
}
