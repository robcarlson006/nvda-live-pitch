import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { Ai, env, MODEL } from './ai.ts';
import { findAnswer, loadBank, type BankEntry } from './bank.ts';
import { Budget } from './budget.ts';
import { resolveText, slideSources, SourceLink, type AiInfo, type ClientMsg, type Draft, type ServerMsg, type SpineSlide, type Stuck } from '../shared/schema.ts';
import { deepgramKey, deepgramUrl, relay } from './deepgram.ts';
import { accept, Director } from './director.ts';
import { addDraft, answerOnDeck, apply, isCovered, isIgnoringUtterance, liveGo, livePoints, logMove, offScript, loadDatasets, loadSpine, loadState, relocate, runReport, saveState, SPINE_FILE } from './state.ts';

const PORT = Number(process.env.PORT ?? 5173);
const prod = process.env.NODE_ENV === 'production';
const root = path.resolve(import.meta.dirname, '..');
const REHEARSAL_DIR = path.resolve(root, '../rehearsal');

const datasets = loadDatasets();
const sourceDatasets = Object.fromEntries(datasets);
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
let job: { kind: NonNullable<AiInfo['busy']>; abort: AbortController; draftId?: string; question?: string } | null = null;
const recentAnswers = new Map<string, Draft>();
let followEpoch = 0;
let note: string | null = null;
let lastRiff = 0;
const RIFF_GAP = 25_000; // at most one reaction per 25 s: keeps the stage calm and the bill small
const director = new Director(ai.budget);
/** The last board question the AI could not answer, for the operator's alert. Cleared by a new question or Dismiss. */
let stuck: Stuck | null = null;
const getStuck = (question: string, kind: Stuck['kind'], reason: string): Stuck => ({ question: question.slice(-400), kind, reason, at: Date.now() });
const aiInfo = (): AiInfo => ({ follow: { text: director.recent(14), ms: director.ms, error: director.error }, busy: job?.kind ?? null, note, spent: ai.budget.spent, cap: ai.budget.cap, model: MODEL, hasKey: ai.hasKey(), bankError, activeDraftId: job?.draftId, activeQuestion: job?.question, stuck });

function draft(kind: Draft['kind'], heard: string, slide: Draft['slide'], from: Draft['from'], links?: Draft['links'], evidenceGap = false): Draft {
  const citations = new Map((links ?? []).map((l) => [l.url, l]));
  if (kind === 'answer' && from !== 'web') {
    for (const source of slideSources(slide, sourceDatasets)) {
      for (const match of source.matchAll(/https?:\/\/[^\s<>)]+/g)) {
        const url = match[0].replace(/[.,;]+$/, '');
        const link = SourceLink.safeParse({ url, title: source.replace(match[0], '').trim().replace(/^[, .-]+|[, .-]+$/g, '') || url });
        if (link.success && !citations.has(url)) citations.set(url, link.data);
      }
    }
  }
  return { id: randomUUID(), kind, heard, slide, from, at: Date.now(), links: [...citations.values()], evidenceGap };
}

function remember(d: Draft) {
  if (d.kind !== 'answer') return;
  recentAnswers.set(d.threadId ?? d.id, d);
  if (recentAnswers.size > 12) recentAnswers.delete(recentAnswers.keys().next().value!);
}

function submitDraft(d: Draft) {
  remember(d);
  state = addDraft(state, d);
  saveState(state);
  broadcast();
}

const stopJob = () => {
  job?.abort.abort();
  job = null;
};

async function visualise(d: Draft) {
  if (!ai.hasKey() || d.kind !== 'answer' || d.evidenceGap || d.slide.chart || d.slide.stat || d.slide.diagram) return;
  const mine = { kind: 'visual' as const, abort: new AbortController(), draftId: d.id, question: d.heard };
  job = mine;
  broadcast();
  const visual = await ai.visual(d.slide, datasets, mine.abort.signal).catch(() => undefined);
  if (job !== mine) return;
  job = null;
  if (visual) {
    const slide = 'chart' in visual
      ? { ...d.slide, layout: 'split' as const, steps: undefined, chart: visual.chart }
      : { ...d.slide, diagram: visual.diagram };
    const enriched = draft(d.kind, d.heard, slide, d.from, d.links);
    if (replaceDraft(d, enriched)) return;
  }
  broadcast();
}

function replaceDraft(old: Draft, updated: Draft) {
  const index = state.drafts.findIndex((item) => item.id === old.id);
  if (index < 0) return false;
  const version = { ...updated, threadId: old.threadId ?? old.id };
  remember(version);
  // Approval refers to the exact version the operator saw.
  state = { ...state, drafts: state.drafts.map((item, i) => i === index ? version : item) };
  saveState(state);
  broadcast();
  return true;
}

function usePrepared(entry: BankEntry, heard: string) {
  stopJob();
  note = null;
  const d = draft('answer', heard, entry.slide, 'prepared', entry.links);
  submitDraft(d);
  void visualise(d);
}

async function build(kind: 'answer' | 'riff', heard: string, previous?: string) {
  stopJob(); // a new question always takes priority
  note = null;
  if (kind === 'answer') stuck = null;
  if (kind === 'answer' && !previous) {
    const hit = findAnswer(bank, heard);
    if (hit) return usePrepared(hit, heard);
  }
  const mine = { kind, abort: new AbortController(), question: kind === 'answer' ? heard : undefined };
  job = mine;
  broadcast();
  const place = state.index;
  let r: Awaited<ReturnType<Ai['build']>>;
  try {
    r = await ai.build({ kind, heard, previous, onScreen: state.live ? [state.live.title, ...state.live.bullets].join(' / ') : 'nothing' }, datasets, spine, mine.abort.signal);
  } catch (e) {
    r = { error: (e as Error).message };
  }
  if (job !== mine) return;
  job = null;
  if ('clarify' in r) {
    // Confused by what was heard: no slide is queued. The operator asks the board member to clarify, then re-asks or types it.
    stuck = getStuck(heard, 'unclear', r.clarify);
    return broadcast();
  }
  if ('error' in r) {
    note = r.error;
    if (kind === 'answer') {
      stuck = getStuck(heard, 'failed', `The AI did not answer (${r.error}). A holding slide is queued${ai.hasKey() ? ' and web research is running' : ''}.`);
      const fallback = draft('answer', heard, {
        id: `gen-${Date.now()}`, layout: 'statement', answer: true, title: 'We need to check that',
        bullets: ['We would verify it before drawing an investment conclusion.'],
        sources: ['Pitch evidence bank · no verified answer for this question'],
      }, 'claude', undefined, true);
      submitDraft(fallback);
      if (ai.hasKey()) void research(heard, fallback.id, previous);
    } else broadcast();
    return;
  }
  if (!('slide' in r) || (kind === 'riff' && (state.index !== place || state.mode !== 'script'))) return broadcast();
  const d = draft(kind, heard, r.slide, 'claude', r.links, kind === 'answer' && !r.answered);
  if (kind === 'answer' && !r.answered) stuck = getStuck(heard, 'no-data', `Our data does not answer this. A holding slide ("We need to check that") is queued${ai.hasKey() ? ' and web research is running' : ''}.`);
  submitDraft(d);
  if (kind === 'answer' && !r.answered) void research(heard, d.id, previous);
  else void visualise(d);
}

/** The evidence-gap answer stays available if research takes too long or fails. */
async function research(heard: string, replaces: string, previous?: string) {
  const fallback = state.drafts.find((item) => item.id === replaces);
  if (!fallback || !ai.hasKey()) return;
  stopJob();
  note = null;
  const mine = { kind: 'research' as const, abort: new AbortController(), draftId: replaces, question: heard };
  job = mine;
  broadcast();
  let r: Awaited<ReturnType<Ai['research']>>;
  try {
    r = await ai.research(heard, mine.abort.signal, previous);
  } catch (e) {
    r = { error: (e as Error).message };
  }
  if (job !== mine) return;
  job = null;
  if ('error' in r) note = `Web research: ${r.error}`;
  else if ('slide' in r) {
    const d = draft('answer', heard, { ...r.slide, answer: true }, 'web', r.links);
    if (stuck?.question === heard.slice(-400)) stuck = null; // web research found an answer after all
    if (replaceDraft(fallback, d)) {
      void visualise(d);
      return;
    }
  }
  broadcast();
}

/** After each finished sentence: if a presenter has wandered off script, build something for it. */
function maybeRiff() {
  if (answerOnDeck(state) || state.backup || !state.riff || !state.autoCue || state.mode !== 'script' || job || state.drafts.length || state.index < 0) return;
  if (isCovered(state) && Date.now() - state.liveSince < RIFF_GAP) return; // give a new slide time to be read
  if (Date.now() - lastRiff < RIFF_GAP || !offScript(state, spine)) return;
  lastRiff = Date.now();
  const heard = state.stray;
  state = { ...state, stray: '' };
  void build('riff', heard);
}

/**
 * Live mode: every few words, a fast model says where the talk is now. Cue words keep working beside it,
 * so if the AI is slow, wrong or unreachable the deck still moves. Its verdicts only ever choose among our own slides.
 */
function canFollow() {
  return state.follow === 'live' && state.autoCue && state.mode === 'script' && !state.backup && !isCovered(state) && !answerOnDeck(state) && job?.kind !== 'answer' && job?.kind !== 'research';
}

async function followSpeech() {
  if (!canFollow() || !director.ready()) return;
  const was = state;
  const epoch = followEpoch;
  const v = await director.look(was, spine, datasets);
  if (!v) return broadcast(); // shows the error banner, if any
  // The operator or a cue moved the show while the model was thinking: this verdict is about a screen that is gone.
  if (epoch !== followEpoch || !canFollow() || state.liveSince !== was.liveSince || state.index !== was.index || state.reveal !== was.reveal) return broadcast();
  const votes = director.vote(v.action === 'slide' ? `slide:${v.slide}` : v.action);
  if (!accept(v, state, spine, votes)) return broadcast();
  if (v.action === 'tangent') {
    // Same path as an off-script reaction: built from our data, queued for approval unless "Show without approval" is on.
    if (!job && !state.drafts.length && Date.now() - lastRiff >= RIFF_GAP && !isCovered(state) && state.riff) {
      lastRiff = Date.now();
      void build('riff', director.recent(60));
    }
    return broadcast();
  }
  const out = v.action === 'slide' && v.slide ? liveGo(state, spine, v.slide, v.covered) : livePoints(state, spine, v.covered);
  if (out !== state) {
    const target = v.action === 'slide' ? String(v.slide) : `${spine[state.index]?.id}: points`;
    state = logMove(state, { ...out, lastCue: { phrase: `(heard) ${director.recent(8)}`, target, at: Date.now() } }, 'live', spine);
    saveState(state);
  }
  broadcast();
}

function handleAi(msg: ClientMsg, before: typeof state): void {
  // Speech from before a manual move, a toggle or a question is about a different moment: never judge it again.
  if (['next', 'back', 'goto', 'clear', 'follow', 'resume', 'bank', 'question', 'autoCue', 'draft', 'ask', 'backup', 'skip', 'push'].includes(msg.type)) {
    followEpoch++;
    director.reset();
  }
  if (msg.type === 'question') {
    if (msg.action === 'answer') {
      const q = `${before.question} ${before.questionTail}`.trim();
      if (before.mode !== 'question') return;
      if (q) void build('answer', q);
      else note = 'No question was heard. Type it instead, or try again.';
    } else stopJob();
  } else if (msg.type === 'ask') {
    const prior = msg.followup ? recentAnswers.get(msg.followup) : undefined;
    const previous = prior ? [prior.heard, prior.slide.title, ...prior.slide.bullets.map((b) => resolveText(b, datasets))].join(' / ') : undefined;
    if (msg.followup && !prior) {
      note = 'That earlier answer is no longer available. Include its context in a new question.';
      return;
    }
    const question = msg.text.trim();
    if (question) void build(msg.kind ?? 'answer', question, previous);
  } else if ((msg.type === 'backup' && msg.on) || msg.type === 'clear' || (msg.type === 'draft' && job?.draftId === msg.id)) stopJob();
  else if (msg.type === 'bank') {
    const e = bank.find((b) => b.id === msg.id);
    if (e) usePrepared(e, e.question);
  } else if (msg.type === 'transcript' && msg.final && !isIgnoringUtterance(before)) maybeRiff();
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
  wss.clients.forEach((ws) => send(ws, { type: 'state', state, spine, spineError, clients: wss.clients.size, ai: aiInfo(), bank: bank.map(({ id, question, ask }) => ({ id, question, ask })), answers: [...recentAnswers.values()] }));
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
    if ((raw as { type?: string })?.type === 'dismissStuck') {
      stuck = null;
      return broadcast();
    }
    const before = state;
    const pauseCues = job?.kind === 'answer' || job?.kind === 'research';
    const next = apply(before, raw, { datasets, spine, pauseCues });
    if (typeof next === 'string') return send(ws, { type: 'error', message: next });
    const msg = raw as ClientMsg; // apply() has validated it
    const feedDirector = () => {
      if (msg.type === 'transcript' && !isIgnoringUtterance(before) && canFollow()) {
        director.hear(msg.text, msg.final);
        void followSpeech();
      }
    };
    if (next === state && !['ask', 'bank', 'clear'].includes(msg.type)) return feedDirector();
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
    state = next;
    handleAi(msg, before);
    if (msg.type === 'transcript' && state.lastCue !== before.lastCue) {
      followEpoch++;
      director.reset(); // miss speech already consumed by a deterministic cue
    } else feedDirector();
    saveState(state);
    broadcast();
  });
  ws.on('close', broadcast);
});

server.listen(PORT, () => {
  console.log(`\n  Stage:    http://localhost:${PORT}/stage`);
  console.log(`  Operator: http://localhost:${PORT}/operator\n`);
});
