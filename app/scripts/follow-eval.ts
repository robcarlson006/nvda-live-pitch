/**
 * Measures how well the deck follows speech. Replays a transcript the way Deepgram delivers it (interim chunks, then finals)
 * through the real Follow + Director + state code, with real API calls on a virtual clock: while Claude thinks, the speaker keeps talking.
 *   npm run follow-eval -- dev            (rehearsal/evals/dev)      npm run follow-eval -- holdout
 *   ... -- dev --only a-full              one scenario               ... --verbose   every verdict
 *   ... -- dev --skip a-                  all but
 * Spend goes to loop/eval-spend.json (hard cap $3).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { ShowState } from '../shared/schema.ts';
import { Budget } from '../server/budget.ts';
import { Director, type DirectorCaller } from '../server/director.ts';
import { cueSlides, Follow } from '../server/follow.ts';
import { apply, emptyState, loadDatasets, loadSpine } from '../server/state.ts';

export type Segment = { on: string; say: string; pauseAfterMs?: number; speaker?: string };
export type Scenario = { id: string; kind: string; note?: string; wpm?: number; segments: Segment[] };

const ROOT = path.resolve(import.meta.dirname, '../..');
const datasets = loadDatasets();
const spine = loadSpine(datasets);
const norm = (w: string) => w.replace(/\s+/g, ' ').trim();

export type Result = {
  id: string; kind: string; beats: number; right: number; late: number[]; falseJumps: string[]; misses: string[];
  tangents: { wanted: number; hit: number; false: number }; latency: number[]; calls: number; errors: number;
};

/** One scenario, on a virtual clock driven by real call latency. */
export async function replay(sc: Scenario, budget: Budget, call?: DirectorCaller, verbose = false): Promise<Result> {
  // ---- the audio: every word with the time it is spoken, then chunked as Deepgram does
  const msPerWord = 60_000 / (sc.wpm ?? 150);
  const words: { w: string; at: number; seg: number }[] = [];
  let t = 1_000;
  sc.segments.forEach((s, seg) => {
    for (const w of norm(s.say).split(' ')) words.push({ w, at: (t += msPerWord), seg });
    t += s.pauseAfterMs ?? 500;
  });
  const events: { at: number; text: string; final: boolean; upto: number }[] = [];
  let utter: typeof words = [];
  words.forEach((w, i) => {
    utter.push(w);
    const last = i === words.length - 1 || words[i + 1].seg !== w.seg;
    const end = last || (utter.length >= 8 && /[.?!]$/.test(w.w)) || utter.length >= 22;
    // ~0.35 s for audio to come back as text
    if (end) events.push({ at: w.at + 450, text: utter.map((x) => x.w).join(' '), final: true, upto: i }), (utter = []);
    else if (utter.length % 4 === 0) events.push({ at: w.at + 350, text: utter.map((x) => x.w).join(' '), final: false, upto: i });
  });

  // ---- the show
  let now = 0, heardWord = -1, errors = 0, calls = 0;
  const latency: number[] = [];
  const box = { state: { ...emptyState(), follow: 'live' as const, seen: [] } as ShowState };
  const moves: { word: number; to: string; via: string }[] = [];
  const tangents: number[] = [];
  let inflight: { done: number; resolve: () => void } | null = null;
  const real: DirectorCaller | undefined = call;
  const director = new Director(budget, real, () => now);
  // Wrap look(): measure the real wait, and make the virtual clock pass by the same amount before the verdict lands.
  const look = director.look.bind(director);
  director.look = async (...a) => {
    const began = performance.now();
    const p = look(...a);
    const v = await p;
    const ms = performance.now() - began;
    calls++;
    latency.push(ms);
    if (!v) errors++;
    if (director.error) errors++;
    await new Promise<void>((resolve) => (inflight = { done: now + ms, resolve }));
    return v;
  };
  const follow = new Follow(director, {
    get: () => box.state,
    set: (s, why) => {
      if (why === 'slide') moves.push({ word: heardWord, to: spine[s.index].id, via: 'live' });
      box.state = s;
    },
    spine: () => spine,
    datasets,
    tangent: () => { if (!tangents.length || heardWord - tangents.at(-1)! > 40) tangents.push(heardWord); },
    log: (l) => verbose && console.log(`   [${heardWord}] seg ${words[Math.max(0, heardWord)].seg} want ${sc.segments[words[Math.max(0, heardWord)].seg].on} at ${spine[box.state.index]?.id ?? '-'}: ${l}`),
  }, () => now);

  const settle = async () => { for (let k = 0; k < 4; k++) await new Promise((r) => setImmediate(r)); };
  const waitForCall = async () => { while ((follow as any).running && !inflight) await new Promise((r) => setTimeout(r, 2)); };
  const advance = async (to: number) => {
    for (;;) {
      await waitForCall();
      if (inflight && inflight.done <= to) {
        now = Math.max(now, inflight.done);
        const f = inflight;
        inflight = null;
        f.resolve();
        await settle();
        void follow.tick();
        await settle();
        continue;
      }
      now = Math.max(now, to);
      return;
    }
  };
  for (const e of events) {
    for (let tick = now + 250; tick < e.at; tick += 250) { await advance(tick); void follow.tick(); await settle(); } // the server's 250 ms timer
    await advance(e.at);
    heardWord = e.upto;
    const s = apply(box.state, { type: 'transcript', text: e.text, final: e.final }, { datasets, spine, cueSlides: cueSlides(box.state, director.error, true) }) as ShowState;
    if (s.liveSince !== box.state.liveSince) moves.push({ word: heardWord, to: spine[s.index].id, via: 'cue' });
    box.state = s;
    follow.hear(e.text, e.final);
    await settle();
  }
  for (let k = 0; k < 16; k++) { await advance(now + 250); void follow.tick(); await settle(); }
  await advance(now + 8_000);

  // ---- score: for each segment, was the deck on the right slide by its end (+ a few words' grace)?
  const at = (word: number) => moves.filter((m) => m.word <= word).at(-1)?.to ?? 'standby';
  const r: Result = { id: sc.id, kind: sc.kind, beats: 0, right: 0, late: [], falseJumps: [], misses: [], tangents: { wanted: 0, hit: 0, false: 0 }, latency, calls, errors };
  let expected = 'standby';
  sc.segments.forEach((seg, k) => {
    const first = words.findIndex((w) => w.seg === k), last = words.findLastIndex((w) => w.seg === k);
    const nextWanted = sc.segments[k + 1]?.on;
    const prev = expected;
    if (seg.on === 'tangent' || seg.on === 'stay') {
      if (seg.on === 'tangent') {
        r.tangents.wanted++;
        if (tangents.some((x) => x >= first && x <= last + 6)) r.tangents.hit++;
      }
    } else expected = seg.on;
    if (seg.on !== 'tangent' && tangents.some((x) => x > first + 6 && x <= last)) r.tangents.false++;
    if (seg.on !== 'stay' && seg.on !== 'tangent' && seg.on !== prev) {
      r.beats++;
      const hit = moves.find((m) => m.word >= first - 4 && m.word <= last + 6 && m.to === seg.on);
      const good = (hit && at(last + 4) === seg.on) || (at(last + 4) === seg.on);
      if (good) (r.right++, r.late.push(Math.max(0, (hit?.word ?? first) - first)));
      else r.misses.push(`${k}:${seg.on} (was ${at(last + 4)})`);
    }
    // a move during this segment to anything that is neither this segment's slide nor the one before (late arrival) nor the next (early)
    for (const m of moves.filter((m) => m.word >= first && m.word <= last))
      if (m.to !== expected && m.to !== prev && !(m.to === nextWanted && m.word >= last - 6)) r.falseJumps.push(`${k}(${seg.on}): → ${m.to} [${m.via}]`);
  });
  return r;
}

const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(xs.length * p))] ?? 0;

async function main() {
  const args = process.argv.slice(2);
  const set = args[0] ?? 'dev';
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
  const skip = args.includes('--skip') ? args[args.indexOf('--skip') + 1].split(',') : [];
  const verbose = args.includes('--verbose');
  const dir = path.join(ROOT, 'rehearsal/evals', set);
  const budget = new Budget(path.join(ROOT, 'loop/eval-spend.json'), 1.5);
  const start = budget.spent;
  const all: Scenario[] = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'results.json' && !f.startsWith('_')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .filter((s) => (!only || only.some((o) => s.id.startsWith(o))) && !skip.some((o) => s.id.startsWith(o)));
  const results: Result[] = [];
  const queue = [...all];
  await Promise.all(Array.from({ length: verbose ? 1 : 4 }, async () => {
    for (let sc = queue.shift(); sc; sc = queue.shift()) {
      try {
        const r = await replay(sc, budget, undefined, verbose);
        results.push(r);
        console.log(`${r.id.padEnd(26)} ${r.right}/${r.beats} right · late p50 ${pct(r.late, 0.5)} · false ${r.falseJumps.length} · tangents ${r.tangents.hit}/${r.tangents.wanted} (+${r.tangents.false} false) · ${r.calls} calls${r.errors ? ` · ${r.errors} errors` : ''}`);
        if (r.misses.length) console.log(`     missed: ${r.misses.join(' | ')}`);
        if (r.falseJumps.length) console.log(`     false:  ${r.falseJumps.join(' | ')}`);
      } catch (e) { console.log(`${sc.id}: FAILED ${(e as Error).stack}`); }
    }
  }));
  const sum = (f: (r: Result) => number) => results.reduce((t, r) => t + f(r), 0);
  const late = results.flatMap((r) => r.late), lat = results.flatMap((r) => r.latency);
  const total = {
    set, scenarios: results.length, accuracy: Math.round((1000 * sum((r) => r.right)) / Math.max(1, sum((r) => r.beats))) / 10, beats: sum((r) => r.beats),
    falseJumps: sum((r) => r.falseJumps.length), falseJumpsPerRun: Math.round((100 * sum((r) => r.falseJumps.length)) / Math.max(1, results.length)) / 100,
    wordsLateP50: pct(late, 0.5), wordsLateP90: pct(late, 0.9), tangentHit: `${sum((r) => r.tangents.hit)}/${sum((r) => r.tangents.wanted)}`, tangentFalse: sum((r) => r.tangents.false),
    latencyP50: Math.round(pct(lat, 0.5)), latencyP95: Math.round(pct(lat, 0.95)), calls: sum((r) => r.calls), errors: sum((r) => r.errors), spent: Math.round((budget.spent - start) * 10000) / 10000, totalSpent: Math.round(budget.spent * 1000) / 1000,
  };
  console.log(JSON.stringify(total));
  if (!only) fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ total, results }, null, 1));
}
if (process.argv[1] === import.meta.filename) await main();
