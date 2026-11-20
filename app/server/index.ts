import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMsg, SpineSlide } from '../shared/schema.ts';
import { apply, loadDatasets, loadSpine, loadState, saveState, SPINE_FILE } from './state.ts';

const PORT = Number(process.env.PORT ?? 5173);
const prod = process.env.NODE_ENV === 'production';
const root = path.resolve(import.meta.dirname, '..');

const datasets = loadDatasets();
let spine: SpineSlide[] = [];
let spineError: string | null = null;
let state = loadState();
console.log(`[data] ${datasets.size} datasets loaded`);

function reloadSpine() {
  try {
    spine = loadSpine(datasets);
    spineError = null;
    if (state.index >= spine.length) state = { ...state, index: spine.length - 1 };
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

const wss = new WebSocketServer({ server, path: '/ws' });
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
