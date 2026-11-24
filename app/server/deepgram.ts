import fs from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { WebSocket } from 'ws';

/**
 * Relay: operator browser (raw 16 kHz 16-bit mono audio) → this server → Deepgram → text back to the browser.
 * The API key stays here. If Deepgram drops, audio is held and the connection retried; if it stays down, the
 * browser is told 'failed' and switches to Chrome's speech-to-text.
 */
export type AudioMsg =
  | { type: 'transcript'; text: string; final: boolean }
  | { type: 'status'; state: 'listening' | 'reconnecting' | 'failed'; message?: string };

const ENV_FILE = path.resolve(import.meta.dirname, '../.env');

/** Read on every mic start, so a key pasted into .env works without restarting the server. */
export function deepgramKey(): string {
  if (process.env.DEEPGRAM_API_KEY) return process.env.DEEPGRAM_API_KEY.trim();
  try {
    return (parseEnv(fs.readFileSync(ENV_FILE, 'utf8')).DEEPGRAM_API_KEY ?? '').trim();
  } catch {
    return '';
  }
}

// Words speech-to-text tends to get wrong, taken from what the spine says and the Q&A bank asks.
// Deepgram's limit is 500 tokens; its advice is 20–50 terms, so names no longer in the script are dropped.
export const KEYTERMS = [
  // The story and the products
  'NVIDIA', 'CUDA', 'GeForce 256', 'RIVA 128', "Denny's", 'Jensen Huang', 'Ian Buck', 'Andrew Ng', 'AlexNet', 'ImageNet',
  'Xbox', 'Tensor Cores', 'NVLink', 'Mellanox', 'Blackwell', 'Vera Rubin', 'Sputnik', 'GPU',
  // Competitors, customers, the open-model ecosystem
  'AMD', 'ROCm', 'TSMC', 'Broadcom', 'Huawei', 'H20', 'Nscale', 'Hugging Face', 'Mistral', 'OpenAI', 'Anthropic', 'hyperscaler',
  // Finance and valuation
  'EBITDA', 'P/E', 'WACC', 'discounted cash flow', 'Damodaran',
  // ESG and governance
  'Scope 1', 'Scope 2', 'Scope 3', 'export controls', 'Glassdoor', 'Colette Kress',
  // The team
  'Panshul', "Mi'kael",
];

export function deepgramUrl(lang: string, base = 'wss://api.deepgram.com/v1/listen'): string {
  const u = new URL(base);
  // No numerals/smart_format: they rewrite words between interim and final results, which breaks cue de-duplication.
  const q = { model: 'nova-3', language: lang === 'en-US' ? 'en-US' : 'en-GB', encoding: 'linear16', sample_rate: '16000', channels: '1', interim_results: 'true', endpointing: '300' };
  for (const [k, v] of Object.entries(q)) u.searchParams.set(k, v);
  for (const t of KEYTERMS) u.searchParams.append('keyterm', t);
  return u.href;
}

const MAX_HELD = 16000 * 2 * 5; // 5 seconds of audio
const REFUSED: Record<number, string> = {
  400: 'Deepgram rejected the request settings',
  401: 'Deepgram rejected the API key. Check DEEPGRAM_API_KEY in app/.env',
  402: 'Deepgram says the account is out of credit',
  403: 'This Deepgram key is not allowed to use live transcription',
};

type Opts = { key: string; url: string; giveUpMs?: number; stallMs?: number };

/** Runs for as long as `client` is connected. */
export function relay(client: WebSocket, { key, url, giveUpMs = 6000, stallMs = 8000 }: Opts) {
  let dg: WebSocket | null = null;
  let held: Buffer[] = [];
  let heldBytes = 0;
  let downSince = Date.now();
  let lastSign = 0; // last time Deepgram showed it was alive
  let lastAudio = 0;
  let interimOpen = false;
  let done = false;
  let retry: NodeJS.Timeout | undefined;

  const tell = (msg: AudioMsg) => client.readyState === WebSocket.OPEN && client.send(JSON.stringify(msg));

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(retry);
    clearInterval(beat);
    if (dg?.readyState === WebSocket.OPEN) {
      dg.send('{"type":"CloseStream"}');
      dg.close();
    } else dg?.terminate();
  };
  const fail = (message: string) => {
    if (done) return;
    tell({ type: 'status', state: 'failed', message });
    finish();
    client.close(4000);
  };

  const connect = () => {
    const sock = new WebSocket(url, { headers: { Authorization: `Token ${key}` }, handshakeTimeout: 3000 });
    dg = sock;
    const isCurrent = () => !done && dg === sock;

    sock.on('open', () => {
      if (!isCurrent()) return;
      lastSign = Date.now();
      for (const b of held) sock.send(b);
      held = [];
      heldBytes = 0;
      tell({ type: 'status', state: 'listening' });
    });
    sock.on('pong', () => (lastSign = Date.now()));
    sock.on('message', (data) => {
      if (!isCurrent()) return;
      lastSign = Date.now();
      let m: any;
      try {
        m = JSON.parse(String(data));
      } catch {
        return;
      }
      if (m.type === 'Error') console.warn(`[deepgram] ${m.description ?? m.message ?? 'error'}`);
      if (m.type !== 'Results') return;
      downSince = 0;
      const text = String(m.channel?.alternatives?.[0]?.transcript ?? '').trim().slice(0, 2000);
      const final = m.is_final === true;
      // An empty final still matters after an interim: it closes that utterance.
      if (text || (final && interimOpen)) tell({ type: 'transcript', text, final });
      interimOpen = !final && (interimOpen || !!text);
    });
    sock.on('unexpected-response', (_req, res) => {
      const code = res.statusCode ?? 0;
      res.resume();
      if (!isCurrent()) return;
      console.warn(`[deepgram] refused: HTTP ${code}`);
      if (REFUSED[code]) fail(REFUSED[code]);
      else lost();
    });
    sock.on('error', (e) => console.warn(`[deepgram] ${e.message}`)); // 'close' follows
    sock.on('close', () => isCurrent() && lost());
  };

  const lost = () => {
    const old = dg;
    dg = null;
    old?.terminate();
    interimOpen = false;
    downSince ||= Date.now();
    if (Date.now() - downSince > giveUpMs) return fail('Deepgram is unreachable');
    tell({ type: 'status', state: 'reconnecting' });
    clearTimeout(retry);
    retry = setTimeout(connect, 400);
  };

  // Venue Wi-Fi can die without closing the socket: no sign of life means reconnect.
  const beat = setInterval(() => {
    if (dg?.readyState !== WebSocket.OPEN) return;
    if (Date.now() - lastSign > stallMs) return lost();
    dg.ping();
    if (Date.now() - lastAudio > 3000) dg.send('{"type":"KeepAlive"}');
  }, Math.min(2500, stallMs / 2));

  client.on('message', (data, isBinary) => {
    if (done || !isBinary) return;
    const buf = data as Buffer;
    lastAudio = Date.now();
    if (dg?.readyState === WebSocket.OPEN) return dg.send(buf);
    held.push(buf);
    heldBytes += buf.length;
    while (heldBytes > MAX_HELD) heldBytes -= held.shift()!.length;
  });
  client.on('close', finish);
  client.on('error', finish);

  if (!key) return fail('No Deepgram key in app/.env');
  connect();
}
