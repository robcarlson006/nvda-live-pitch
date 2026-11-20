import http from 'node:http';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMsg } from '../shared/schema.ts';
import { apply, loadDatasets, loadState, saveState } from './state.ts';

const PORT = Number(process.env.PORT ?? 5173);
const prod = process.env.NODE_ENV === 'production';
const root = path.resolve(import.meta.dirname, '..');

const datasets = loadDatasets();
let state = loadState();
console.log(`[data] ${datasets.size} datasets loaded`);

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
  const url = req.url ?? '/';
  if (url === '/api/datasets') {
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(Object.fromEntries(datasets)));
  }
  frontend(req, res);
});

const wss = new WebSocketServer({ server, path: '/ws' });
const send = (ws: WebSocket, msg: ServerMsg) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));
const broadcast = () => wss.clients.forEach((ws) => send(ws, { type: 'state', state, clients: wss.clients.size }));

wss.on('connection', (ws) => {
  broadcast(); // new client gets current state; others see the client count change
  ws.on('message', (data) => {
    let raw: unknown;
    try {
      raw = JSON.parse(String(data));
    } catch {
      return send(ws, { type: 'error', message: 'Bad JSON' });
    }
    const next = apply(state, raw, datasets);
    if (typeof next === 'string') return send(ws, { type: 'error', message: next });
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
