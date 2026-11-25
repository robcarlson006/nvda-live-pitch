/**
 * A spoken run-through of the whole script through the real speech-to-text, without a microphone.
 *
 *   npx tsx scripts/deepgram-run.ts [--rate 150] [--speed 2] [--voice Daniel] [--out <folder>]
 *
 * 1. Reads every slide's `say` text aloud with the Mac's built-in voice at --rate words a minute (macOS `say`),
 *    so the audio length is the script's spoken length at that pace.
 * 2. Streams the audio to Deepgram with the app's own settings (deepgramUrl: Flux or nova-3, keyterms, interim results),
 *    at --speed times real time.
 * 3. Feeds every transcript into the show exactly as the server does (apply → 'transcript'), with cue words on,
 *    and checks that each slide went live in order and finished building on its own.
 * Costs a few cents of Deepgram credit (billed on audio length). Needs DEEPGRAM_API_KEY in app/.env.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { WebSocket } from 'ws';
import { deepgramKey, deepgramModel, deepgramUrl, parseDeepgram } from '../server/deepgram.ts';
import { apply, emptyState, loadDatasets, loadSpine, type Ctx } from '../server/state.ts';
import { elementCount, type ShowState } from '../shared/schema.ts';

const arg = (k: string, d: string) => (process.argv.includes(`--${k}`) ? process.argv[process.argv.indexOf(`--${k}`) + 1] : d);
const RATE = Number(arg('rate', '150'));
const SPEED = Number(arg('speed', '2'));
const VOICE = arg('voice', 'Daniel'); // British English
const OUT = arg('out', fs.mkdtempSync(path.join(os.tmpdir(), 'dg-run-')));
const GAP_S = 0.8; // pause between slides
const SR = 16000;

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const ctx: Ctx = { datasets, spine };

// ---------- 1. Audio ----------
fs.mkdirSync(OUT, { recursive: true });
const pcm: Buffer[] = [];
const starts: { id: string; speaker: string; at: number; secs: number; words: number }[] = [];
let samples = 0;
for (const s of spine) {
  const aiff = path.join(OUT, `${s.id}.aiff`);
  const wav = path.join(OUT, `${s.id}.wav`);
  execFileSync('say', ['-v', VOICE, '-r', String(RATE), '-o', aiff, s.say ?? '']);
  execFileSync('afconvert', ['-f', 'WAVE', '-d', `LEI16@${SR}`, '-c', '1', aiff, wav]);
  const buf = fs.readFileSync(wav);
  const data = buf.subarray(buf.indexOf('data') + 8); // skip the WAV header
  starts.push({ id: s.id, speaker: s.speaker ?? '', at: samples / SR, secs: data.length / 2 / SR, words: (s.say ?? '').split(/\s+/).filter(Boolean).length });
  pcm.push(data, Buffer.alloc(Math.round(GAP_S * SR) * 2));
  samples += data.length / 2 + Math.round(GAP_S * SR);
}
const audio = Buffer.concat(pcm);
const total = audio.length / 2 / SR;
const mmss = (t: number) => { const s = Math.round(t); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
console.log(`Audio: ${spine.length} slides, ${mmss(total)} at ${RATE} words a minute (voice ${VOICE}), in ${OUT}`);
const bySpeaker = new Map<string, number>();
for (const s of starts) bySpeaker.set(s.speaker, (bySpeaker.get(s.speaker) ?? 0) + s.secs + GAP_S);
console.log([...bySpeaker].map(([k, v]) => `${k} ${mmss(v)}`).join(' · '));

// ---------- 2 + 3. Deepgram → the show ----------
const key = deepgramKey();
if (!key) throw new Error('No DEEPGRAM_API_KEY in app/.env');
let state: ShowState = { ...emptyState(), autoCue: true };
const moves: { id: string; at: number; via: string }[] = [];
const built = new Map<string, number>(); // slide id → most elements built
let heardAt = 0; // audio time (s) at the end of the latest transcript, from Deepgram's timestamps
let finals = 0;

const step = (msg: unknown) => {
  const before = state.index;
  const r = apply(state, msg, ctx);
  if (typeof r === 'string') throw new Error(r);
  state = r;
  if (state.index !== before && state.index >= 0) moves.push({ id: spine[state.index].id, at: heardAt, via: state.lastCue?.phrase ?? '' });
  if (state.live) built.set(state.live.id, Math.max(built.get(state.live.id) ?? 0, state.reveal));
};

await new Promise<void>((resolve, reject) => {
  const dg = new WebSocket(deepgramUrl('en-GB'), { headers: { Authorization: `Token ${key}` } });
  dg.on('unexpected-response', (_q, res) => reject(new Error(`Deepgram refused: HTTP ${res.statusCode}`)));
  dg.on('error', reject);
  dg.on('message', (data) => {
    const r = parseDeepgram(JSON.parse(String(data)));
    if (!r || (!r.text && !r.final)) return;
    if (r.final) finals++;
    heardAt = r.endsAt ?? heardAt;
    step({ type: 'transcript', text: r.text, final: r.final });
    // DG_LOG=<file>: every transcript with where the show is, for diagnosing a stall.
    if (process.env.DG_LOG) fs.appendFileSync(process.env.DG_LOG, `${heardAt.toFixed(1)}s ${r.final ? 'FINAL' : 'interim'} [${state.live?.id ?? '-'} ${state.reveal} consumed=${state.consumed}] ${r.text}\n`);
  });
  dg.on('close', () => resolve());
  dg.on('open', async () => {
    const chunk = SR * 2 * 0.1; // 100 ms
    for (let i = 0; i < audio.length; i += chunk) {
      dg.send(audio.subarray(i, i + chunk));
      await new Promise((r) => setTimeout(r, 100 / SPEED));
    }
    dg.send(JSON.stringify({ type: deepgramModel() === 'flux' ? 'ForceEndTurn' : 'Finalize' }));
    setTimeout(() => dg.send(JSON.stringify({ type: 'CloseStream' })), 1500);
  });
});

// ---------- Report ----------
console.log(`\nDeepgram: ${finals} finished phrases\n`);
let ok = 0;
const problems: string[] = [];
for (const [i, s] of spine.entries()) {
  const move = moves.find((m) => m.id === s.id);
  const got = built.get(s.id) ?? 0;
  const want = elementCount(s);
  const lag = move ? move.at - starts[i].at : NaN;
  const fine = !!move && got === want;
  if (fine) ok++;
  else problems.push(`${s.id}: ${move ? `built ${got} of ${want}; stuck waiting for "${s.elementCues[got - 1]?.join(" / ")}"` : 'never went live'}`);
  console.log(`${fine ? '✓' : '✗'} ${s.id.padEnd(16)} ${mmss(starts[i].at).padStart(5)}  ${move ? `live ${lag.toFixed(1)}s into its script, on "${move.via}"` : '—'}  ${got}/${want} built`);
}
const order = moves.map((m) => spine.findIndex((s) => s.id === m.id));
const inOrder = order.every((v, k) => k === 0 || v > order[k - 1]);
console.log(`\n${ok}/${spine.length} slides went live and fully built by speech alone. Order ${inOrder ? 'correct' : 'WRONG: ' + moves.map((m) => m.id).join(' → ')}.`);
if (problems.length) console.log('Problems:\n  ' + problems.join('\n  '));
process.exit(ok === spine.length && inOrder ? 0 : 1);
