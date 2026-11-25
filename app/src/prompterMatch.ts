/** Following a speaker through the script word by word: the teleprompter's matching, kept free of React for tests. */

export type Word = { text: string; norm: string; slide: number; style: '' | 'strong' | 'em'; eos: boolean; first: boolean };

export const STOP = new Set('a an the and or but of to in on at for is it its that this as by be we our you your i are was were with from so if than then there their they he she not no do does did has have had can will just'.split(' '));

export const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/'s$/, 's').replace(/[^a-z0-9]/g, '');

function edit1(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let diff = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++diff > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return diff + (a.length - i) + (b.length - j) <= 1;
}

/** Same word, allowing for speech-to-text spelling: plurals, one wrong letter in a long word, a shared stem. */
export function same(script: string, heard: string) {
  if (!script || !heard) return false;
  if (script === heard) return true;
  if (script.length >= 6 && heard.length >= 6 && (edit1(script, heard) || script.slice(0, 6) === heard.slice(0, 6))) return true;
  return script.replace(/s$/, '') === heard.replace(/s$/, '');
}

/**
 * Where the speaker is after hearing `word`. `at` is the last word said (-1 before the start).
 * A nearby match moves on; a far one (a skipped sentence) needs the previous heard word to agree as well,
 * so one common word can never fling the marker down the page.
 */
export function advance(words: Word[], at: number, word: string, prev: string | null): number {
  const w = norm(word);
  if (!w) return at;
  const near = STOP.has(w) ? 3 : 8;
  for (let j = at + 1; j <= Math.min(words.length - 1, at + near); j++) if (same(words[j].norm, w)) return j;
  if (STOP.has(w) || !prev) return at;
  const p = norm(prev);
  if (STOP.has(p)) return at; // "the cash" is too common to justify a long jump
  for (let j = at + near + 1; j <= Math.min(words.length - 1, at + 70); j++) {
    if (same(words[j].norm, w) && j > 0 && same(words[j - 1].norm, p)) return j;
  }
  return at;
}
