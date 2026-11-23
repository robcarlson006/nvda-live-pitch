import { elementCount, type SpineSlide } from '../shared/schema.ts';
import { words } from './cues.ts';
import { idfOf, terms } from './evidence.ts';

/**
 * Local, instant element lead (no AI): how much of what the NEXT element is about has just been said.
 * Each element's signature is the telling words of its bullet, its cue and the sentence of the slide's `say:` it comes from.
 * Rare words count most, and words shared with the slide's other elements count less, so only this element's own talk pulls it in.
 * The score is the share of the signature's weight heard in the last few words: 0 = nothing, 1 = all of it.
 */
export const LEAD_REVEAL = Number(process.env.LEAD_T ?? 0.5); // reveal at this share
export const LEAD_GLOW = 0.15; // the element is becoming likely: the stage can pre-glow it (one telling word is enough)
export const LEAD_NEAR = 0.3; // nearly said: brighter
const RECENT = 16; // words that count

type Sig = Map<string, number>;
const cache = new WeakMap<SpineSlide, Sig[]>();

const plain = (t: string) => t.replace(/\{\{.*?\}\}/g, ' ');

function signatures(s: SpineSlide, spine: SpineSlide[]): Sig[] {
  const hit = cache.get(s);
  if (hit) return hit;
  const idf = idfOf(spine);
  const sentences = (s.say ?? '').split(/(?<=[.?!])\s+/).filter(Boolean);
  const own = (t: string) => new Set(terms(plain(t)));
  const total = elementCount(s) - 1;
  const raw: Set<string>[] = [];
  let prev = -1;
  for (let j = 0; j < total; j++) {
    const text = j < s.bullets.length ? `${s.bullets[j]} ${s.elementCues[j] ?? ''}` : `${s.chart?.datasetKey ?? ''} ${s.elementCues[j] ?? ''}`;
    const mine = own(text);
    // the sentence this element comes from: best overlap, never before the previous element's sentence
    let best = Math.min(sentences.length - 1, prev + 1), score = 0;
    sentences.forEach((sen, k) => {
      if (k < prev) return;
      const sc = [...own(sen)].reduce((n, t) => n + (mine.has(t) ? idf.get(t) ?? 0 : 0), 0);
      if (sc > score) (score = sc), (best = k);
    });
    prev = Math.max(prev, best);
    raw.push(new Set([...mine, ...(sentences[best] ? own(sentences[best]) : [])]));
  }
  const share = new Map<string, number>();
  for (const r of raw) for (const t of r) share.set(t, (share.get(t) ?? 0) + 1);
  const out = raw.map((r) => new Map([...r].map((t) => [t, (idf.get(t) ?? 1) / (share.get(t) ?? 1)] as const)));
  cache.set(s, out);
  return out;
}

/** 0..1: how much of element `j` (0 = the first bullet) of this slide was said in the last few words of `heard`. */
export function leadScore(heard: string[], s: SpineSlide, j: number, spine: SpineSlide[], minWords = 2): number {
  const sig = signatures(s, spine)[j];
  if (!sig || !sig.size) return 0;
  const said = new Set(terms(heard.slice(-RECENT).join(' ')));
  let got = 0, all = 0, n = 0;
  for (const [t, w] of sig) (all += w), said.has(t) && ((got += w), n++);
  return n >= minWords ? got / all : 0;
}
