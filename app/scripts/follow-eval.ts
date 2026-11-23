/**
 * How well does the live director follow speech, with NO cue words helping?
 *
 *   tsx scripts/follow-eval.ts --dry                 count the calls and estimate the cost; spends nothing
 *   tsx scripts/follow-eval.ts [--set dev|holdout] [--variant verbatim|nocue]
 *
 * It reads each slide's `say` text aloud, word by word (interim results, then the finished sentence), into the real
 * Director, and applies its verdicts exactly as server/index.ts does. Truth is which slide's speech each word belongs to.
 * dev = the first half of the deck (tune on this). holdout = the second half (look at it ONCE, at the end).
 * `nocue` removes the words of the slide's own cue phrases, so it can only be followed by meaning.
 * Every model reply is cached on disk (loop/eval-cache/), so a repeat run costs $0.00. Hard cap: $2.50.
 * Numbers are slightly kind: a real call takes ~0.5 s, about 2 more words of speech than the replay allows.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../server/ai.ts';
import { Budget, costOf, PRICES } from '../server/budget.ts';
import { accept, Director, DIRECTOR_MODEL, directorPrompt, type DirectorCaller } from '../server/director.ts';
import { emptyState, liveGo, livePoints, loadDatasets, loadSpine } from '../server/state.ts';
import type { ShowState } from '../shared/schema.ts';

const arg = (k: string, d: string) => process.argv[process.argv.indexOf(`--${k}`) + 1] ?? d;
const dry = process.argv.includes('--dry');
const set = arg('set', 'dev');
const variant = arg('variant', 'nocue');
const CAP = 2.5;
const SLACK = 4; // words: about the director's reaction time
const CACHE = path.resolve(import.meta.dirname, '../../loop/eval-cache');
fs.mkdirSync(CACHE, { recursive: true });

const datasets = loadDatasets();
const all = loadSpine(datasets).filter((s) => s.say);
const half = Math.ceil(all.length / 2);
const spine = set === 'holdout' ? all.slice(half) : all.slice(0, half);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

const budget = new Budget(path.join(CACHE, 'spend.json'), CAP);
const startSpend = budget.spent;
let hits = 0;
let misses = 0;
let planned = 0;
let paid = 0; // real money only: a cached reply costs nothing

const live = new Anthropic({ apiKey: dry ? 'dry' : env('ANTHROPIC_API_KEY'), baseURL: 'https://api.anthropic.com', maxRetries: 1, timeout: 20_000 });
const caller: DirectorCaller = async (body, signal) => {
  const key = crypto.createHash('sha256').update(JSON.stringify([body.model, body.system, body.messages, body.output_config])).digest('hex');
  const file = path.join(CACHE, `${key}.json`);
  if (fs.existsSync(file)) return hits++, JSON.parse(fs.readFileSync(file, 'utf8'));
  planned++;
  if (dry) return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"action":"stay","slide":null,"covered":0}' }], usage: { input_tokens: 0, output_tokens: 0 } } as unknown as Anthropic.Message;
  misses++;
  const msg = await live.messages.create(body, { signal });
  paid += costOf(body.model, msg.usage);
  fs.writeFileSync(file, JSON.stringify(msg));
  return msg;
};

type Word = { w: string; slide: number; last: boolean };
const words: Word[] = spine.flatMap((s, i) => {
  const cueWords = new Set(s.cues.flatMap((c) => c.split(/\s+/).map(norm)));
  const toks = s.say!.split(/\s+/).filter((t) => (variant === 'verbatim' ? true : !cueWords.has(norm(t))));
  return toks.map((w, k) => ({ w, slide: i, last: /[.!?]$/.test(w) || k === toks.length - 1 }));
});

const director = new Director(budget, caller);
let state: ShowState = { ...emptyState(), follow: 'live' };
const moves: { at: number; to: number; ok: boolean }[] = [];
const reached = new Map<number, number>(); // slide -> word position at which it first went on screen
let sentence: string[] = [];

for (let pos = 0; pos < words.length; pos++) {
  const { w, slide, last } = words[pos];
  sentence.push(w);
  director.hear(sentence.join(' '), last);
  if (last) sentence = [];
  if (!director.ready(Date.now() + 10_000)) continue;
  const was = state;
  const v = await director.look(was, spine, datasets);
  if (!v) {
    if (director.error) console.log(`  (director: ${director.error})`);
    if (director.error?.includes('cap')) break;
    continue;
  }
  const votes = director.vote(v.action === 'slide' ? `slide:${v.slide}` : v.action);
  if (!accept(v, state, spine, votes)) continue;
  if (v.action === 'tangent') continue;
  const out = v.action === 'slide' && v.slide ? liveGo(state, spine, v.slide, v.covered) : livePoints(state, spine, v.covered);
  if (out === state) continue;
  const moved = out.index !== state.index;
  state = out;
  if (moved) {
    moves.push({ at: pos, to: out.index, ok: out.index === slide });
    if (!reached.has(out.index)) reached.set(out.index, pos);
  }
}

if (dry) {
  const p = PRICES[DIRECTOR_MODEL];
  const prompt = directorPrompt(spine, datasets).length / 2;
  const per = (prompt * p.in * 0.15 + 400 * p.in + 30 * p.out) / 1e6; // deck prompt cached after the first call
  console.log(`${set}/${variant}: ${words.length} words, ${spine.length} slides, ~${planned} calls (${hits} already cached), est. $${(planned * per).toFixed(2)} (cap $${CAP}; spent so far $${startSpend.toFixed(2)})`);
  process.exit(0);
}

const start = (i: number) => words.findIndex((x) => x.slide === i);
const lateness = spine.map((_, i) => (reached.has(i) ? Math.max(0, reached.get(i)! - start(i)) : null));
const got = lateness.filter((x) => x !== null) as number[];
const finished = spine.map((_, i) => {
  const end = words.findLastIndex((x) => x.slide === i) - SLACK; // judged a few words before the end: a move on its last words is not a mistake
  const m = moves.filter((x) => x.at <= end).at(-1);
  return m?.to === i;
});
const p50 = got.sort((a, b) => a - b)[Math.floor(got.length / 2)];
console.log(`${set}/${variant}: ${words.length} words over ${spine.length} slides`);
console.log(`  right slide on screen by the end of its speech: ${finished.filter(Boolean).length}/${spine.length} = ${((100 * finished.filter(Boolean).length) / spine.length).toFixed(0)}%   (target >= 90%)`);
console.log(`  words late (median, slides reached): ${p50 ?? 'n/a'}   (target <= 15)`);
const early = (m: { at: number }) => words.findLastIndex((x) => x.slide === words[m.at].slide) - m.at;
const bad = moves.filter((m) => !m.ok && early(m) > SLACK);
console.log(`  moves to the wrong slide: ${bad.length} of ${moves.length}   (target <= 1.5 per run; ${moves.filter((m) => !m.ok).length - bad.length} more came within ${SLACK} words of the slide's end and are not counted)`);
for (const m of bad) {
  const on = words[m.at].slide;
  const left = words.findLastIndex((x) => x.slide === on) - m.at; // how many words of that slide were still to come
  console.log(`    word ${m.at}: went to ${spine[m.to].id} while on ${spine[on].id}, ${left} word(s) before it ended${m.to === on + 1 ? ' (the next slide: early)' : ''}`);
}
console.log(`  missed: ${spine.filter((_, i) => !finished[i]).map((s) => s.id).join(', ') || 'none'}`);
console.log(`  model calls: ${misses} new, ${hits} cached · paid this run $${paid.toFixed(3)} (cap $${CAP})`);
