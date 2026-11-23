/**
 * Smoke test of the real thing, with typed speech standing in for the microphone: the real server, the real follower and real Claude
 * (its own state and spend files, capped at $0.12), three paraphrased beats, one skipped slide, one board question.
 *   npm run smoke          exit code 1 if any step fails
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import WebSocket from 'ws';
import type { ServerMsg, ShowState, SpineSlide } from '../shared/schema.ts';

const APP = path.resolve(import.meta.dirname, '..');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const port = 5197;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'smoke-'));
const child = spawn(path.join(APP, 'node_modules/.bin/tsx'), ['server/index.ts'], {
  cwd: APP,
  env: { ...process.env, PORT: String(port), NODE_ENV: 'production', STATE_FILE: path.join(dir, 'state.json'), SPEND_FILE: path.join(dir, 'spend.json'), AI_SPEND_CAP: '0.12' },
  stdio: 'pipe',
});
let log = '';
child.stdout.on('data', (d) => (log += d));
child.stderr.on('data', (d) => (log += d));
for (let i = 0; i < 80 && !log.includes('Operator:'); i++) await sleep(150);
const box: { state: ShowState | null; spine: SpineSlide[]; ai: any; bank: { id: string }[] } = { state: null, spine: [], ai: null, bank: [] };
const ws = new WebSocket(`ws://localhost:${port}/ws`, { origin: `http://localhost:${port}` });
ws.on('message', (d) => { const m: ServerMsg = JSON.parse(String(d)); if (m.type === 'state') Object.assign(box, { state: m.state, spine: m.spine, ai: m.ai, bank: m.bank }); });
await new Promise((r, j) => (ws.on('open', r), ws.on('error', j)));
for (let i = 0; i < 40 && !box.state; i++) await sleep(50);
const send = (m: unknown) => ws.send(JSON.stringify(m));
const at = () => box.spine[box.state!.index]?.id ?? 'standby';
let failed = 0;
const step = (name: string, pass: boolean, extra = '') => { if (!pass) failed++; console.log(`${pass ? '✓' : '✗'} ${name}${extra ? `  ${extra}` : ''}`); };

/** Speak like a person: a few words at a time, interim results, then the final. */
async function say(text: string, wpm = 170) {
  const w = text.split(/\s+/);
  for (let i = 4; i < w.length; i += 4) { send({ type: 'transcript', text: w.slice(0, i).join(' '), final: false }); await sleep((4 * 60_000) / wpm); }
  send({ type: 'transcript', text, final: true });
}
async function until(cond: () => boolean, ms: number) { const t = Date.now(); while (!cond() && Date.now() - t < ms) await sleep(100); return Date.now() - t; }

try {
  step('server up, key present', !!box.state && box.ai?.hasKey, box.ai?.hasKey ? '' : '(no ANTHROPIC key: live follow cannot run)');
  send({ type: 'follow', mode: 'live' });
  send({ type: 'autoCue', on: true });
  send({ type: 'skip', id: 'near-bust', on: true }); // one slide skipped by the operator

  // 1. in our own words, not the script's
  let t0 = Date.now();
  await say('so picture three friends in a california diner, they think everyone should get workstation graphics at home, and games will pay for it');
  let ms = await until(() => at() === 'founding', 9_000);
  step('beat 1: paraphrase finds "founding"', at() === 'founding', `${Date.now() - t0} ms from first word, ${ms} ms after the last`);

  // 2. next beat; the skipped slide must not appear
  t0 = Date.now();
  await say('they came up with the graphics processing unit in the late nineties, microsoft put it in the first xbox and paid up front, and forbes named them company of the year');
  ms = await until(() => at() === 'first-gpu', 9_000);
  step('beat 2: paraphrase finds "first-gpu", skipping the switched-off "near-bust"', at() === 'first-gpu' && !box.state!.seen.includes('near-bust'), `${Date.now() - t0} ms`);

  // 3. the beat after, with the points building
  t0 = Date.now();
  await say('but then they did something odd, a software platform where a normal chip is a few clever people working down a list and a graphics chip is a stadium full of people doing one small thing at once, and they gave it away free with every card');
  ms = await until(() => at() === 'cuda', 9_000);
  const built = box.state!.reveal;
  step('beat 3: paraphrase finds "cuda" and builds its points', at() === 'cuda' && built >= 3, `${Date.now() - t0} ms, ${built} elements built`);

  // 4. a board question
  send({ type: 'question', action: 'start' });
  await sleep(300);
  step('question mode on', box.state!.mode === 'question');
  await say("isn't this just an AI bubble, like 1999 all over again?", 200);
  await sleep(600);
  t0 = Date.now();
  send({ type: 'question', action: 'answer' });
  await until(() => box.state!.drafts.length > 0, 6_000);
  const d = box.state!.drafts[0];
  step('question: a prepared answer is in the queue within 1 s', !!d && d.from === 'prepared' && Date.now() - t0 < 1_000, d ? `"${d.slide.title}" (${Date.now() - t0} ms)` : 'no draft');
  if (d) { send({ type: 'draft', action: 'show', id: d.id }); await sleep(400); step('approve puts it on the stage', box.state!.live?.id === d.slide.id); }
  send({ type: 'resume' });
  await sleep(300);
  step('resume returns to the script slide', at() === 'cuda' && box.state!.live?.id === 'cuda');
} finally {
  console.log(`API spent in this smoke test: $${(box.ai?.spent ?? 0).toFixed(4)}`);
  ws.close();
  child.kill();
}
console.log(failed ? `SMOKE FAIL: ${failed} step(s)` : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
