import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { Ai, env, MODEL } from './ai.ts';
import { findAnswer, loadBank, type BankEntry } from './bank.ts';
import { Budget } from './budget.ts';
import type { AiInfo, ClientMsg, Draft, ServerMsg, SpineSlide } from '../shared/schema.ts';
import { deepgramKey, deepgramUrl, relay } from './deepgram.ts';
import { addDraft, apply, cover, isCovered, offScript, loadDatasets, loadSpine, loadState, relocate, runReport, saveState, SPINE_FILE } from './state.ts';

const PORT = Number(process.env.PORT ?? 5173);
const prod = process.env.NODE_ENV === 'production';
const root = path.resolve(import.meta.dirname, '..');
const REHEARSAL_DIR = path.resolve(root, '../rehearsal');

const datasets = loadDatasets();
let spine: SpineSlide[] = [];
let spineError: string | null = null;
let state = loadState();
console.log(`[data] ${datasets.size} datasets loaded`);

function reloadSpine() {
  try {
    spine = loadSpine(datasets);
    spineError = null;
    state = { ...state, ...relocate(state, spine), skipped: (state.skipped ?? []).filter((id) => spine.some((s) => s.id === id && s.optional)) };
    console.log(`[spine] ${spine.length} slides`);
  } catch (e) {
    spineError = (e as Error).message; // keep the last good spine on screen
    console.warn(`[spine] ${spineError}`);
  }
}
reloadSpine();

// ---------- Live-built slides ----------
const ai = new Ai(new Budget(path.join(root, 'ai-spend.json'), Number(env('AI_SPEND_CAP')) || 4));
let bank: BankEntry[] = [];
let bankError: string | null = null;
try {
  bank = loadBank(datasets);
  console.log(`[q&a] ${bank.length} prepared answers`);
} catch (e) {
  bankError = (e as Error).message;
  console.warn(`[q&a] ${bankError}`);
}
let job: { kind: 'answer' | 'riff'; abort: AbortController } | null = null;
let note: string | null = null;
let lastRiff = 0;
const RIFF_GAP = 25_000; // at most one reaction per 25 s: keeps the stage calm and the bill small
const aiInfo = (): AiInfo => ({ busy: job?.kind ?? null, note, spent: ai.budget.spent, cap: ai.budget.cap, model: MODEL, hasKey: ai.hasKey(), bankError });

const draft = (kind: Draft['kind'], heard: string, slide: Draft['slide'], from: Draft['from']): Draft => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind, heard, slide, from, at: Date.now() });
const stopJob = () => {
  job?.abort.abort();
  job = null;
};

async function build(kind: 'answer' | 'riff', heard: string, fresh = false) {
  stopJob(); // a question always beats a reaction, and a new question beats the old one
  note = null;
  if (kind === 'answer' && !fresh) {
    const hit = findAnswer(bank, heard);
    if (hit) {
      state = addDraft(state, draft(kind, heard, hit.slide, 'prepared'));
      saveState(state);
      return broadcast();
    }
  }
  const mine = { kind, abort: new AbortController() };
  job = mine;
  broadcast();
  const started = Date.now();
  const place = state.index;
  let r: Awaited<ReturnType<Ai['build']>>;
  try {
    r = await ai.build({ kind, heard, onScreen: state.live ? [state.live.title, ...state.live.bullets].join(' / ') : 'nothing' }, datasets, spine, mine.abort.signal);
  } catch (e) {
    r = { error: (e as Error).message }; // whatever happens, the show goes on
  }
  if (job !== mine) return; // cancelled or overtaken
  job = null;
  if ('error' in r) note = r.error;
  // A reaction is only worth showing if the presenter hasn't already moved on.
  else if ('slide' in r && (kind === 'answer' || (state.index === place && state.mode === 'script'))) state = addDraft(state, draft(kind, heard, r.slide, 'claude'));
  console.log(`[ai] ${kind} ${'slide' in r ? 'slide' : 'error' in r ? r.error : 'nothing to show'} in ${Date.now() - started} ms, $${ai.budget.spent.toFixed(3)} spent`);
  saveState(state);
  broadcast();
}

/** After each finished sentence: if a presenter has wandered off script, build something for it. */
function maybeRiff() {
  if (!state.riff || !state.autoCue || state.mode !== 'script' || job || state.drafts.length || state.index < 0) return;
  if (isCovered(state) && Date.now() - state.liveSince < RIFF_GAP) return; // give a new slide time to be read
  if (Date.now() - lastRiff < RIFF_GAP || !offScript(state, spine)) return;
  lastRiff = Date.now();
  const heard = state.stray;
  state = { ...state, stray: '' };
  void build('riff', heard);
}

function handleAi(msg: ClientMsg, before: typeof state): void {
  if (msg.type === 'question') {
    if (msg.action === 'answer') {
      const q = `${before.question} ${before.questionTail}`.trim();
      if (before.mode !== 'question') return;
      if (q) void build('answer', q);
      else note = 'No question was heard. Type it instead, or try again.';
    } else stopJob();
  } else if (msg.type === 'ask') void build(msg.kind ?? 'answer', msg.text, msg.fresh);
  else if (msg.type === 'clear') stopJob();
  else if (msg.type === 'bank') {
    const e = bank.find((b) => b.id === msg.id);
    if (e) state = cover(state, e.slide);
  } else if (msg.type === 'transcript' && msg.final) maybeRiff();
}

let reloadTimer: NodeJS.Timeout;
fs.watch(path.dirname(SPINE_FILE), () => {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => (reloadSpine(), broadcast()), 200);
});

let frontend: http.RequestListener;
if (prod) {
  const sirv = (await import('sirv')).default;
  frontend = sirv(path.join(root, 'dist'), { single: true }); // any route → index.html
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  frontend = vite.middlewares;
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/datasets') {
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(Object.fromEntries(datasets)));
  }
  frontend(req, res);
});

const wss = new WebSocketServer({ noServer: true });
const audio = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  // Both sockets can spend API credit: only this laptop, and only our own page (not some other site open in the browser).
  const ours = req.headers.origin === `http://${req.headers.host}`;
  if (!ours || !LOOPBACK.has(req.socket.remoteAddress ?? '')) return socket.destroy();
  if (url.pathname === '/ws') return wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  if (url.pathname !== '/audio') return socket.destroy();
  audio.handleUpgrade(req, socket, head, (ws) => {
    const lang = url.searchParams.get('lang') ?? 'en-GB';
    console.log(`[mic] on (${lang})`);
    relay(ws, { key: deepgramKey(), url: deepgramUrl(lang) });
  });
});

const send = (ws: WebSocket, msg: ServerMsg) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));
function broadcast() {
  wss.clients.forEach((ws) => send(ws, { type: 'state', state, spine, spineError, clients: wss.clients.size, ai: aiInfo(), bank: bank.map(({ id, question }) => ({ id, question })) }));
}

wss.on('connection', (ws) => {
  broadcast(); // new client gets current state; others see the client count change
  ws.on('message', (data) => {
    let raw: unknown;
    try {
      raw = JSON.parse(String(data));
    } catch {
      return send(ws, { type: 'error', message: 'Bad JSON' });
    }
    const next = apply(state, raw, { datasets, spine });
    if (typeof next === 'string') return send(ws, { type: 'error', message: next });
    const msg = raw as ClientMsg; // apply() has validated it
    if (next === state && !['ask', 'bank', 'clear'].includes(msg.type)) return;
    if (state.rehearsal && !next.rehearsal) {
      // A rehearsal run just stopped: log it. A failed write must never take the show down.
      try {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = path.join(REHEARSAL_DIR, `${stamp}.json`);
        fs.mkdirSync(REHEARSAL_DIR, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(runReport(state.rehearsal, Date.now(), spine), null, 2) + '\n');
        send(ws, { type: 'saved', file: path.relative(path.resolve(root, '..'), file) });
        console.log(`[rehearsal] saved ${file}`);
      } catch (e) {
        send(ws, { type: 'error', message: `Could not save the rehearsal log: ${(e as Error).message}` });
      }
    }
    const before = state;
    state = next;
    handleAi(msg, before);
    saveState(state);
    broadcast();
  });
  ws.on('close', broadcast);
});

server.listen(PORT, () => {
  console.log(`\n  Stage:    http://localhost:${PORT}/stage`);
  console.log(`  Operator: http://localhost:${PORT}/operator\n`);
});
