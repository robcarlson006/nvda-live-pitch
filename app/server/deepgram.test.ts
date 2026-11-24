import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { test, type TestContext } from 'node:test';
import { WebSocket, WebSocketServer } from 'ws';
import { deepgramUrl, KEYTERMS, relay } from './deepgram.ts';

const results = (transcript: string, is_final: boolean) => JSON.stringify({ type: 'Results', is_final, channel: { alternatives: [{ transcript }] } });
const until = async (ok: () => boolean, what: string) => {
  for (let i = 0; i < 300; i++) {
    if (ok()) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  assert.fail(`timed out: ${what}`);
};

/** A fake Deepgram, and a browser connected to it through the real relay. */
async function setup(t: TestContext, opts: { status?: number; key?: string; giveUpMs?: number; stallMs?: number; deaf?: boolean } = {}) {
  const conns: { ws: WebSocket; req: http.IncomingMessage; audio: Buffer[]; text: string[] }[] = [];
  const fakeHttp = http.createServer();
  const fake = new WebSocketServer({ noServer: true, autoPong: !opts.deaf });
  let attempts = 0;
  fakeHttp.on('upgrade', (req, socket, head) => {
    attempts++;
    if (opts.status) return socket.end(`HTTP/1.1 ${opts.status} No\r\nContent-Length: 0\r\n\r\n`);
    fake.handleUpgrade(req, socket, head, (ws) => {
      const c = { ws, req, audio: [] as Buffer[], text: [] as string[] };
      ws.on('message', (d, bin) => (bin ? c.audio.push(d as Buffer) : c.text.push(String(d))));
      conns.push(c);
    });
  });
  const front = new WebSocketServer({ port: 0 });
  await Promise.all([once(fakeHttp.listen(0), 'listening'), once(front, 'listening')]);
  const url = deepgramUrl('en-GB', `ws://localhost:${(fakeHttp.address() as AddressInfo).port}/v1/listen`);
  front.on('connection', (ws) => relay(ws, { key: opts.key ?? 'test-key', url, giveUpMs: opts.giveUpMs, stallMs: opts.stallMs }));
  const got: any[] = [];
  const browser = new WebSocket(`ws://localhost:${(front.address() as AddressInfo).port}`);
  browser.on('message', (d) => got.push(JSON.parse(String(d))));
  t.after(() => {
    browser.terminate();
    for (const c of fake.clients) c.terminate();
    front.close();
    fakeHttp.close();
  });
  await once(browser, 'open');
  return { conns, got, browser, attempts: () => attempts, states: () => got.filter((m) => m.type === 'status').map((m) => m.state) };
}

test("keyterms stay within Deepgram's advice: unique, at most 50, every one sent", () => {
  assert.ok(KEYTERMS.length <= 50, `${KEYTERMS.length} keyterms`);
  assert.equal(new Set(KEYTERMS.map((t) => t.toLowerCase())).size, KEYTERMS.length);
  assert.deepEqual(new URL(deepgramUrl('en-GB')).searchParams.getAll('keyterm'), KEYTERMS);
});

test('the relay sends the key and settings, passes audio up and text back', async (t) => {
  const { conns, got, browser, states } = await setup(t);
  browser.send(Buffer.alloc(1600, 1)); // before Deepgram has connected: held, not lost
  await until(() => states().includes('listening'), 'listening');
  const { req, ws, audio } = conns[0];
  assert.equal(req.headers.authorization, 'Token test-key');
  const q = new URL(req.url!, 'http://x').searchParams;
  assert.deepEqual([q.get('model'), q.get('language'), q.get('encoding'), q.get('sample_rate'), q.get('interim_results')], ['nova-3', 'en-GB', 'linear16', '16000', 'true']);
  assert.ok(q.getAll('keyterm').includes('CUDA'));
  await until(() => audio.length === 1, 'held audio');
  ws.send(results('', false)); // silence: nothing to pass on
  ws.send(results('wall street', false));
  ws.send(results('wall street hated it', true));
  await until(() => got.filter((m) => m.type === 'transcript').length === 2, 'transcripts');
  assert.deepEqual(got.filter((m) => m.type === 'transcript').map((m) => [m.text, m.final]), [['wall street', false], ['wall street hated it', true]]);
});

test('an empty final still closes an interim', async (t) => {
  const { conns, got, states } = await setup(t);
  await until(() => states().includes('listening'), 'listening');
  conns[0].ws.send(results('um', false));
  conns[0].ws.send(results('', true));
  conns[0].ws.send(results('', true)); // nothing open now
  conns[0].ws.send(results('next', true));
  await until(() => got.some((m) => m.text === 'next'), 'next');
  assert.deepEqual(got.filter((m) => m.type === 'transcript').map((m) => m.text), ['um', '', 'next']);
});

test('if Deepgram drops, it reconnects and audio said meanwhile is kept', async (t) => {
  const { conns, browser, states } = await setup(t);
  await until(() => states().includes('listening'), 'listening');
  conns[0].ws.terminate();
  await until(() => states().includes('reconnecting'), 'reconnecting');
  browser.send(Buffer.alloc(1600, 2));
  await until(() => conns.length === 2 && conns[1].audio.length === 1, 'second connection with held audio');
  assert.equal(states().at(-1), 'listening');
});

test('a dead connection that never closes is noticed', async (t) => {
  const { conns } = await setup(t, { deaf: true, stallMs: 200 });
  await until(() => conns.length >= 2, 'reconnect after silence');
});

test('a bad key, or no key, fails at once with a clear message and no retry', async (t) => {
  const bad = await setup(t, { status: 401 });
  await until(() => bad.states().includes('failed'), 'failed');
  assert.match(bad.got.at(-1).message, /API key/);
  await new Promise((r) => setTimeout(r, 600));
  assert.equal(bad.attempts(), 1);
  const none = await setup(t, { key: '' });
  await until(() => none.states().includes('failed'), 'failed');
  assert.match(none.got.at(-1).message, /No Deepgram key/);
  assert.equal(none.attempts(), 0);
});

test('if Deepgram stays down it gives up, so the browser can switch to its backup', async (t) => {
  const { states, attempts } = await setup(t, { status: 503, giveUpMs: 700 });
  await until(() => states().includes('failed'), 'failed');
  assert.ok(attempts() >= 2);
});

test('stopping the mic closes the Deepgram stream', async (t) => {
  const { conns, browser, states } = await setup(t);
  await until(() => states().includes('listening'), 'listening');
  browser.close();
  await until(() => conns[0].ws.readyState === WebSocket.CLOSED, 'closed');
  assert.ok(conns[0].text.includes('{"type":"CloseStream"}'));
});
