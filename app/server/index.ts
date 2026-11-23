import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { Ai, env, MODEL } from './ai.ts';
import { findAnswer, loadBank, type BankEntry } from './bank.ts';
import { Budget } from './budget.ts';
import type { AiInfo, ClientMsg, Draft, MicInfo, ServerMsg, SpineSlide } from '../shared/schema.ts';
import { Director } from './director.ts';
import { cueSlides, Follow } from './follow.ts';
import { deepgramKey, deepgramUrl, relay } from './deepgram.ts';
import { addDraft, apply, cover, isCovered, offScript, loadDatasets, loadSpine, loadState, logMove, relocate, runReport, saveState, SPINE_FILE } from './state.ts';

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
const SPEND_FILE = process.env.SPEND_FILE || path.join(root, 'ai-spend.json'); // the shoot harness and evals use their own
const ai = new Ai(new Budget(SPEND_FILE, Number(env('AI_SPEND_CAP')) || 4));
const director = new Director(ai.budget);
let bank: BankEntry[] = [];
let bankError: string | null = null;
try {
  bank = loadBank(datasets);
  console.log(`[q&a] ${bank.length} prepared answers`);
} catch (e) {
  bankError = (e as Error).message;
  console.warn(`[q&a] ${bankError}`);
}
let job: { kind: 'answer' | 'riff' | 'research'; abort: AbortController } | null = null;
let note: string | null = null;
let lastRiff = 0;
const RIFF_GAP = 25_000; // at most one reaction per 25 s: keeps the stage calm and the bill small
const aiInfo = (): AiInfo => ({ follow: { text: director.recent(40), ms: director.ms, error: followError() }, busy: job?.kind ?? null, note, spent: ai.budget.spent, cap: ai.budget.cap, model: MODEL, hasKey: ai.hasKey(), bankError });

const followError = () => director.error ?? (state.follow === 'live' && !ai.hasKey() ? 'No Anthropic key: cue words and Next only' : null);
let mic: MicInfo = { stage: false, on: false, listening: false, engine: 'deepgram', lang: 'en-GB', device: '', problem: null };
let pending: Draft | null = null; // a tangent slide about to go up, unless the operator blocks it
let pendingTimer: NodeJS.Timeout | undefined;
const VETO_MS = 1_500;

const draft = (kind: Draft['kind'], heard: string, slide: Draft['slide'], from: Draft['from'], links?: Draft['links']): Draft => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind, heard, slide, from, at: Date.now(), ...(links ? { links } : {}) });
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
  let gap: Draft | null = null; // an honest "not in our data" slide: research it
  if ('error' in r) note = r.error;
  // A reaction is only worth showing if the presenter hasn't already moved on.
  else if ('slide' in r && (kind === 'answer' || (state.index === place && state.mode === 'script'))) {
    const d = draft(kind, heard, r.slide, 'claude');
    if (kind === 'riff' && state.follow === 'live') offer(d);
    else state = addDraft(state, d);
    if (kind === 'answer' && !r.answered) gap = d;
  }
  console.log(`[ai] ${kind} ${'slide' in r ? 'slide' : 'error' in r ? r.error : 'nothing to show'} in ${Date.now() - started} ms, $${ai.budget.spent.toFixed(3)} spent`);
  saveState(state);
  broadcast();
  if (gap) void research(heard, gap.id);
}

/** Our data doesn't answer it: search the web. The "not in our data" slide stays in the queue until this succeeds. */
async function research(heard: string, replaces?: string) {
  stopJob();
  note = null;
  const mine = { kind: 'research' as const, abort: new AbortController() };
  job = mine;
  broadcast();
  const started = Date.now();
  let r: Awaited<ReturnType<Ai['research']>>;
  try {
    r = await ai.research(heard, mine.abort.signal);
  } catch (e) {
    r = { error: (e as Error).message };
  }
  if (job !== mine) return;
  job = null;
  if ('error' in r) note = `Web research: ${r.error}`;
  else if ('slide' in r) {
    state = { ...state, drafts: state.drafts.filter((d) => d.id !== replaces) };
    state = addDraft(state, draft('answer', heard, r.slide, 'web', r.links));
  }
  console.log(`[ai] research ${'slide' in r ? 'slide' : 'error' in r ? r.error : 'stopped'} in ${Date.now() - started} ms, $${ai.budget.spent.toFixed(3)} spent`);
  saveState(state);
  broadcast();
}

// ---------- Live mode: following the meaning ----------
const follow = new Follow(director, {
  get: () => state,
  set: (next) => {
    const before = state;
    dropPending();
    state = logMove(before, next, 'live', spine);
    if (next.liveSince !== before.liveSince && job?.kind === 'riff') stopJob(); // the talk has moved on
    saveState(state);
    broadcast();
  },
  spine: () => spine,
  datasets,
  tangent: (heard) => {
    if (!state.riff || job || pending || state.drafts.length || Date.now() - lastRiff < RIFF_GAP) return;
    lastRiff = Date.now();
    void build('riff', heard);
  },
  log: (l) => process.env.FOLLOW_LOG && console.log(`[follow] ${l}`),
});
setInterval(() => void follow.tick(), 250);

function dropPending() {
  clearTimeout(pendingTimer);
  pending = null;
}
/** Live mode: the tangent slide goes up by itself after a moment in which the operator can block it. */
function offer(d: Draft) {
  dropPending();
  pending = d;
  if (state.approveTangents) return;
  pendingTimer = setTimeout(showPending, VETO_MS);
}
function showPending() {
  const d = pending;
  dropPending();
  if (d && state.mode === 'script') {
    state = cover(state, d.slide);
    saveState(state);
  }
  broadcast();
}

/** After each finished sentence: if a presenter has wandered off script, build something for it. */
function maybeRiff() {
  if (state.follow === 'live' && !followError()) return; // the director notices tangents itself
  if (!state.riff || !state.autoCue || state.mode !== 'script' || job || state.drafts.length || state.index < 0) return;
  if (isCovered(state) && Date.now() - state.liveSince < RIFF_GAP) return; // give a new slide time to be read
  if (Date.now() - lastRiff < RIFF_GAP || !offScript(state, spine)) return;
  lastRiff = Date.now();
  const heard = state.stray;
  state = { ...state, stray: '' };
  void build('riff', heard);
}

function handleAi(msg: ClientMsg, before: typeof state): void {
  if (['next', 'back', 'goto', 'resume', 'clear', 'push', 'bank', 'draft', 'question', 'follow'].includes(msg.type)) {
    follow.manual();
    dropPending();
  }
  if (msg.type === 'question') {
    if (msg.action === 'answer') {
      const q = `${before.question} ${before.questionTail}`.trim();
      if (before.mode !== 'question') return;
      if (q) void build('answer', q);
      else note = 'No question was heard. Type it instead, or try again.';
    } else stopJob();
  } else if (msg.type === 'ask' && msg.web) void research(msg.text);
  else if (msg.type === 'ask') void build(msg.kind ?? 'answer', msg.text, msg.fresh);
  else if (msg.type === 'clear') stopJob();
  else if (msg.type === 'bank') {
    const e = bank.find((b) => b.id === msg.id);
    if (e) state = cover(state, e.slide);
  } else if (msg.type === 'tangent') {
    if (msg.action === 'show') return showPending();
    dropPending();
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

const backupDeck = (await import('sirv')).default(path.resolve(root, '../fallback'), { dev: true }); // the static backup deck (npm run fallback), one key away on the stage
const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/backup/')) {
    req.url = req.url.slice('/backup'.length);
    return backupDeck(req, res);
  }
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
  wss.clients.forEach((ws) => send(ws, { type: 'state', state, spine, spineError, clients: wss.clients.size, ai: aiInfo(), bank: bank.map(({ id, question }) => ({ id, question })), mic, pending }));
}

let micOwner: WebSocket | null = null;
const others = (from: WebSocket, msg: ServerMsg) => wss.clients.forEach((ws) => ws !== from && send(ws, msg));

wss.on('connection', (ws) => {
  broadcast(); // new client gets current state; others see the client count change
  ws.on('message', (data) => {
    let raw: unknown;
    try {
      raw = JSON.parse(String(data));
    } catch {
      return send(ws, { type: 'error', message: 'Bad JSON' });
    }
    const next = apply(state, raw, { datasets, spine, cueSlides: cueSlides(state, director.error, ai.hasKey()) });
    if (typeof next === 'string') return send(ws, { type: 'error', message: next });
    const msg = raw as ClientMsg; // apply() has validated it
    if (msg.type === 'level') return others(ws, { type: 'level', v: msg.v });
    if (msg.type === 'micCmd') return others(ws, { type: 'micCmd', action: msg.action, engine: msg.engine, lang: msg.lang });
    if (msg.type === 'micStatus') {
      const { type: _, ...info } = msg;
      mic = { stage: false, ...info };
      micOwner = ws;
      return broadcast();
    }
    if (msg.type === 'transcript') {
      others(ws, { type: 'hearing', text: msg.text });
      const cued = next.liveSince !== state.liveSince; // a cue word has already moved the deck
      queueMicrotask(() => {
        follow.hear(msg.text, msg.final);
        if (cued) director.mark();
      });
    }
    if (next === state && !['ask', 'bank', 'clear', 'tangent', 'question', 'draft', 'resume'].includes(msg.type)) return;
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
  ws.on('close', () => {
    if (micOwner === ws) {
      micOwner = null;
      mic = { ...mic, on: false, listening: false, problem: 'The page with the microphone was closed' };
    }
    broadcast();
  });
});

server.listen(PORT, () => {
  console.log(`\n  Stage:    http://localhost:${PORT}/stage`);
  console.log(`  Operator: http://localhost:${PORT}/operator\n`);
});
