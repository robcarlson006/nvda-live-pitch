import { STOP, words } from './words.ts';

/**
 * Finds the script slide a Q&A question or request is about, in a millisecond and with no AI: "can we see the DCF
 * again?", "go back to slide 20", "show the priced-in slide". Runs on the server (spoken and typed questions) and in
 * the operator's browser (the jump chips under the question box). It only ever picks one of our own slides.
 */
type SlideRef = { id: string; title: string; cues: string[] };
export type SlideHit = { index: number; score: number; explicit: boolean; alternatives: number[] };

/** Plain names people use for each slide, beyond its title and cue words. */
const ALIASES: Record<string, string[]> = {
  founding: ['founding', 'founded', 'dennys', 'napkin', 'origin story'],
  'first-gpu': ['first gpu', 'geforce', 'invented the gpu'],
  cuda: ['cuda'],
  'wall-street': ['wall street'],
  alexnet: ['alexnet', 'deep learning moment'],
  'revenue-long': ['revenue history', 'long term revenue', 'revenue over time', 'revenue chart'],
  'four-layers': ['four layers', 'the layers'],
  chips: ['chips slide', 'blackwell', 'the chips'],
  software: ['software', 'moat'],
  connections: ['connections', 'networking', 'nvlink', 'mellanox'],
  supply: ['supply', 'supply chain', 'tsmc'],
  'catch-up': ['caught up', 'catch up', 'competition', 'competitors', 'custom chips', 'tpu'],
  'last-quarter': ['last quarter', 'quarterly results', 'q3 results', 'latest results'],
  beats: ['beats', 'beat expectations', 'beat estimates'],
  guidance: ['guidance', 'outlook', 'next quarter'],
  peers: ['peers', 'p e', 'pe ratio', 'forward p e', 'multiples', 'valuation multiples', 'is it expensive'],
  'dcf-inputs': ['dcf inputs', 'inputs', 'assumptions', 'where the numbers come from', 'terminal growth'],
  'dcf-worksheet': ['dcf', 'five year dcf', 'the dcf', 'discounted cash flow', 'cash flow', 'cash flows', 'worksheet', 'dcf worksheet', 'valuation model'],
  'three-rates': ['three rates', 'three discount rates', 'discount rate', 'discount rates', 'wacc', 'value per share'],
  'dcf-summary': ['dcf summary', 'one page', 'dcf on one page', 'whole dcf', 'summary', 'upside', 'target price', 'price target', 'intrinsic value', 'fair value'],
  'reverse-dcf': ['priced in', 'reverse dcf', 'implied growth', 'what the price assumes', 'market assumes', 'margin of safety'],
  'bear-case': ['bear case', 'downside', 'worst case', 'rivals take share'],
  'ai-ended': ['ai ended', 'ai ends', 'ai bubble bursts', 'if ai stops'],
  'space-race': ['space race', 'sputnik', 'ai race'],
  'already-doing': ['already doing', 'use cases', 'john deere', 'ecolab', 'delivering results', 'real world'],
  'beyond-hyperscalers': ['hyperscalers', 'customers', 'customer mix', 'demand', 'enterprise demand'],
  governance: ['governance', 'jensen', 'ceo', 'resigned', 'reinstated', 'board'],
  people: ['people slide', 'staff', 'employees', 'turnover', 'best place to work', 'best places to work', 'glassdoor', 'fortune', 'rankings'],
  renewables: ['renewables', 'renewable', 'renewable energy', 'clean energy'],
  'emissions-peers': ['emissions', 'carbon', 'emissions intensity', 'scope one', 'scope two', 'compared to intel'],
  recommendation: ['recommendation', 'position size', 'three percent', 'why buy'],
  close: ['closing slide', 'the close', 'last slide', 'final slide'],
};

/** Slides that belong together: when one is picked, the rest are offered beside it. */
const GROUPS = [['dcf-inputs', 'dcf-worksheet', 'three-rates', 'dcf-summary', 'reverse-dcf'], ['bear-case', 'ai-ended'], ['governance', 'people', 'renewables', 'emissions-peers']];

// A request to see a slide, not a question about its subject: "show", "pull up", "go back to", "see … again", "slide".
// Words like "return" or "back" alone are not enough ("Huang's return", "cash back").
const NAV_WORDS = new Set('show display open revisit slide'.split(' '));
const NAV_PAIRS = [['pull', 'up'], ['bring', 'up'], ['go', 'back'], ['back', 'to'], ['flip', 'to'], ['jump', 'to'], ['look', 'again'], ['see', 'again']];
const isNav = (w: string[]) => w.some((x) => NAV_WORDS.has(x)) || NAV_PAIRS.some(([a, b]) => { const i = w.indexOf(a); return i >= 0 && w.indexOf(b, i + 1) > i && w.indexOf(b, i + 1) - i <= 6; });

const UNITS = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
const TENS: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50 };

/** "slide 20", "slide twenty one", "slide number 5" → 20 / 21 / 5 (1-based), or null. */
function slideNumber(w: string[]): number | null {
  for (let i = 0; i < w.length - 1; i++) {
    if (w[i] !== 'slide' && w[i] !== 'page') continue;
    let k = i + 1;
    if (w[k] === 'number') k++;
    if (/^\d+$/.test(w[k] ?? '')) return Number(w[k]);
    if (TENS[w[k]] !== undefined) {
      const unit = UNITS.indexOf(w[k + 1] ?? '');
      return TENS[w[k]] + (unit >= 1 && unit <= 9 ? unit : 0);
    }
    if (UNITS.indexOf(w[k] ?? '') > 0) return UNITS.indexOf(w[k]);
  }
  return null;
}

const same = (a: string, b: string) => a === b || (b.length >= 4 && (a === b + 's' || a + 's' === b));

/** How many of a phrase's key words were said, in order and close together (0 if not all of them). */
function phraseScore(phrase: string, said: string[]): number {
  const all = words(phrase);
  const key = all.filter((w) => !STOP.has(w));
  const need = key.length ? key : all;
  if (!need.length) return 0;
  for (let i = 0; i < said.length; i++) {
    if (!same(said[i], need[0])) continue;
    let at = i;
    let ok = true;
    for (const w of need.slice(1)) {
      let k = at + 1;
      while (k < Math.min(said.length, at + 4) && !same(said[k], w)) k++;
      if (k >= Math.min(said.length, at + 4)) { ok = false; break; }
      at = k;
    }
    if (ok) return need.length;
  }
  return 0;
}

export function findSlide(text: string, spine: SlideRef[]): SlideHit | null {
  const said = words(text);
  if (!said.length) return null;
  const nav = isNav(said);
  const n = slideNumber(said);
  if (n !== null && n >= 1 && n <= spine.length) return { index: n - 1, score: 99, explicit: true, alternatives: [] };

  const scores = spine.map((s) => {
    const phrases = [...(ALIASES[s.id] ?? []), ...s.cues, s.id.replace(/-/g, ' ')];
    let best = Math.max(0, ...phrases.map((p) => phraseScore(p, said)));
    // The title, said nearly in full ("the five-year DCF", "our recommendation: buy").
    const title = words(s.title).filter((w) => !STOP.has(w) && !/^\d/.test(w));
    const got = title.filter((t) => said.some((w) => same(w, t))).length;
    if (title.length >= 2 && got / title.length >= 0.75) best = Math.max(best, got);
    return best;
  });
  const top = Math.max(...scores);
  if (top <= 0) return null;
  const tied = scores.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0);
  const index = tied[0];
  const group = GROUPS.find((g) => g.includes(spine[index].id)) ?? [];
  const others = scores.map((v, i) => ({ v, i })).filter(({ v, i }) => i !== index && v > 0).sort((a, b) => b.v - a.v).map(({ i }) => i);
  const fromGroup = group.map((id) => spine.findIndex((s) => s.id === id)).filter((i) => i >= 0 && i !== index);
  const alternatives = [...new Set([...others, ...fromGroup])].slice(0, 4);
  // Confident enough to jump without asking: a request to see something ("show", "go back to", "slide"), naming
  // one slide more clearly than any other.
  return { index, score: top, explicit: nav && tied.length === 1, alternatives };
}
