import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMsg, SpineSlide } from '../shared/schema.ts';
import { deepgramKey, deepgramUrl, relay } from './deepgram.ts';
import { apply, loadDatasets, loadSpine, loadState, relocate, runReport, saveState, SPINE_FILE } from './state.ts';

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
  if (url.pathname === '/ws') return wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  if (url.pathname !== '/audio') return socket.destroy();
  // /audio spends Deepgram credit: only this laptop, and only our own page (not some other site open in the browser).
  const ours = req.headers.origin === `http://${req.headers.host}`;
  if (!ours || !LOOPBACK.has(req.socket.remoteAddress ?? '')) return socket.destroy();
  audio.handleUpgrade(req, socket, head, (ws) => {
    const lang = url.searchParams.get('lang') ?? 'en-GB';
    console.log(`[mic] on (${lang})`);
    relay(ws, { key: deepgramKey(), url: deepgramUrl(lang) });
  });
});

const send = (ws: WebSocket, msg: ServerMsg) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));
function broadcast() {
  wss.clients.forEach((ws) => send(ws, { type: 'state', state, spine, spineError, clients: wss.clients.size }));
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
    if (next === state) return;
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
    saveState(state);
    broadcast();
  });
  ws.on('close', broadcast);
});

server.listen(PORT, () => {
  console.log(`\n  Stage:    http://localhost:${PORT}/stage`);
  console.log(`  Operator: http://localhost:${PORT}/operator\n`);
});
