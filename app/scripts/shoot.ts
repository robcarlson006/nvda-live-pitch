/**
 * The loop's eyes. Starts its own isolated server (never 5173), drives installed Chrome headless, and saves
 * for every slide three screenshots (early, mid-build, fully built) plus frame times, with and without a 4x CPU throttle.
 *   npm run shoot                         all spine slides, screenshots + perf
 *   npm run shoot -- --slides cuda,bubble --no-perf
 *   npm run shoot -- --bank --no-spine    the prepared answers
 *   npm run shoot -- --perf-only --size 1280x720 --out loop/shots/x
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium, type Page } from 'playwright-core';
import WebSocket from 'ws';
import { elementCount, type ServerMsg, type ShowState, type SpineSlide } from '../shared/schema.ts';

const APP = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A production server with its own port, state and spend file, and no API keys: it can never touch the real show or spend money. */
export async function startServer(port = 5199) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shoot-'));
  const child = spawn(path.join(APP, 'node_modules/.bin/tsx'), ['server/index.ts'], {
    cwd: APP,
    env: { ...process.env, PORT: String(port), NODE_ENV: 'production', STATE_FILE: path.join(dir, 'state.json'), SPEND_FILE: path.join(dir, 'spend.json'), AI_SPEND_CAP: '0.0001' },
    stdio: 'pipe',
  });
  let log = '';
  child.stdout.on('data', (d) => (log += d));
  child.stderr.on('data', (d) => (log += d));
  for (let i = 0; i < 80 && !log.includes('Operator:'); i++) await sleep(150);
  if (!log.includes('Operator:')) throw new Error(`server did not start:\n${log}`);
  const url = `http://localhost:${port}`;
  const ws = new WebSocket(`ws://localhost:${port}/ws`, { origin: url });
  const box: { state: ShowState | null; spine: SpineSlide[]; bank: { id: string }[] } = { state: null, spine: [], bank: [] };
  ws.on('message', (d) => {
    const m: ServerMsg = JSON.parse(String(d));
    if (m.type === 'state') Object.assign(box, { state: m.state, spine: m.spine, bank: m.bank });
    if (m.type === 'error') console.warn('server:', m.message);
  });
  await new Promise((r, j) => (ws.on('open', r), ws.on('error', j)));
  for (let i = 0; i < 40 && !box.state; i++) await sleep(50);
  return { url, box, send: (m: unknown) => ws.send(JSON.stringify(m)), stop: () => (ws.close(), child.kill()), log: () => log };
}

export async function startBrowser(size = '1920x1080') {
  const [width, height] = size.split('x').map(Number);
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.warn(`page: ${m.text().slice(0, 200)}`));
  page.on('pageerror', (e) => console.warn(`page error: ${e.message}`));
  await page.addInitScript(`(() => { window.__f = []; let l = performance.now(); const t = (n) => { window.__f.push(n - l); l = n; requestAnimationFrame(t); }; requestAnimationFrame(t); })()`);
  return { browser, page };
}

const stats = (f: number[]) => {
  const s = [...f].sort((a, b) => a - b);
  const q = (p: number) => Math.round((s[Math.min(s.length - 1, Math.floor(s.length * p))] ?? 0) * 10) / 10;
  return { p50: q(0.5), p95: q(0.95), max: q(1), frames: s.length };
};

async function perf(page: Page, run: () => Promise<void>, ms: number) {
  await page.evaluate('window.__f.length = 0');
  await run();
  await sleep(ms);
  return stats((await page.evaluate('window.__f')) as number[]);
}

async function main() {
  const size = opt('size') ?? '1920x1080';
  const out = path.resolve(APP, '..', opt('out') ?? `loop/shots/${new Date().toISOString().slice(5, 16).replace(/[:T]/g, '')}`);
  fs.mkdirSync(out, { recursive: true });
  const srv = await startServer(Number(opt('port') ?? 5199));
  const { browser, page } = await startBrowser(size);
  try {
    await page.goto(`${srv.url}/stage`);
    await sleep(1500);
    if (!flag('perf-only') && !opt('slides')) await page.screenshot({ path: path.join(out, '_standby.png') });
    const want = opt('slides')?.split(',');
    const cdp = await page.context().newCDPSession(page);
    const perfOut: Record<string, unknown> = {};
    const slides = flag('no-spine') ? [] : srv.box.spine.map((s, i) => ({ s, i })).filter(({ s }) => !want || want.includes(s.id));
    for (const { s, i } of slides) {
      const n = elementCount(s);
      const steps = () => Math.max(0, n - (srv.box.state?.reveal ?? n));
      if (!flag('perf-only')) {
        srv.send({ type: 'goto', index: i });
        await sleep(650);
        await page.screenshot({ path: path.join(out, `${s.id}-a.png`) });
        const todo = steps();
        for (let k = 0; k < Math.ceil(todo / 2); k++) (srv.send({ type: 'next' }), await sleep(500));
        await sleep(700);
        await page.screenshot({ path: path.join(out, `${s.id}-b.png`) });
        while (steps() > 0) (srv.send({ type: 'next' }), await sleep(500));
        await sleep(3400);
        await page.screenshot({ path: path.join(out, `${s.id}-c.png`) });
      }
      if (!flag('no-perf')) {
        const play = async () => {
          srv.send({ type: 'goto', index: i });
          await sleep(1200);
          while (steps() > 0) (srv.send({ type: 'next' }), await sleep(500));
        };
        const normal = await perf(page, play, 1800);
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        const slow = await perf(page, play, 1800);
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
        perfOut[s.id] = { normal, slow4x: slow };
        console.log(s.id.padEnd(16), JSON.stringify(normal), '4x', JSON.stringify(slow));
      }
    }
    if (flag('bank'))
      for (const b of srv.box.bank.filter((b) => !want || want.includes(b.id))) {
        srv.send({ type: 'bank', id: b.id });
        await sleep(4200);
        await page.screenshot({ path: path.join(out, `qa-${b.id}.png`) });
      }
    if (!flag('no-perf')) fs.writeFileSync(path.join(out, 'perf.json'), JSON.stringify(perfOut, null, 1));
    console.log(`saved to ${out}`);
  } finally {
    await browser.close();
    srv.stop();
  }
}
if (process.argv[1] === import.meta.filename) await main();
