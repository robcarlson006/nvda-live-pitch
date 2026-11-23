/**
 * Filmstrip: motion on one page. For a slide, 6 frames across the build (about 1.5 s), tiled into ONE png.
 *   npm run filmstrip -- cuda                 -> loop/shots/film/cuda-film.png (3x2, 1600 px wide)
 *   npm run filmstrip -- cuda,bubble --out loop/shots/r2 --frames 6 --gap 260 --size 1280x720 --label before
 * With --say "words…" the frames are speech instead of Next: the words arrive a few at a time as interim results (shows the pre-glow and the cue landing).
 * Frame k is taken `gap` ms after the k-th Next (elements land one at a time, as a cue would send them); frame 0 is the slide arriving.
 * Each tile is stamped with the milliseconds since the slide change. Uses only the installed Chrome (also to tile): no extra packages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { elementCount } from '../shared/schema.ts';
import { sleep, startBrowser, startServer } from './shoot.ts';

const APP = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const opt = (n: string, d?: string) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);

export async function tile(page: import('playwright-core').Page, shots: { png: Buffer; label: string }[], file: string, cols = 3, width = 1600) {
  const tw = Math.floor(width / cols);
  const html = `<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:0">${shots
    .map((s) => `<div style="position:relative;width:${tw}px;height:${Math.round((tw * 9) / 16)}px;outline:1px solid #222"><img src="data:image/png;base64,${s.png.toString('base64')}" style="width:100%;height:100%;display:block"><span style="position:absolute;left:8px;top:6px;font:600 15px/1 ui-monospace,monospace;color:#76b900;background:#000a;padding:3px 6px;border-radius:3px">${s.label}</span></div>`)
    .join('')}</body>`;
  const rows = Math.ceil(shots.length / cols);
  await page.setViewportSize({ width, height: Math.round(((tw * 9) / 16) * rows) });
  await page.setContent(html);
  await page.waitForFunction('[...document.images].every(i => i.complete)');
  await page.screenshot({ path: file });
}

async function main() {
  const ids = (args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) ?? '').split(',').filter(Boolean);
  if (!ids.length) throw new Error('usage: npm run filmstrip -- <slide-id[,id]> [--out dir] [--frames 6] [--gap 260] [--label before]');
  const frames = Number(opt('frames', '6')), gap = Number(opt('gap', '260')), size = opt('size', '1280x720')!;
  const out = path.resolve(APP, '..', opt('out', 'loop/shots/film')!);
  fs.mkdirSync(out, { recursive: true });
  const srv = await startServer(Number(opt('port', '5198')));
  const { browser, page } = await startBrowser(size);
  try {
    await page.goto(`${srv.url}/stage`);
    await sleep(1500);
    for (const id of ids) {
      const i = srv.box.spine.findIndex((s) => s.id === id);
      if (i < 0) throw new Error(`no slide "${id}"`);
      const n = elementCount(srv.box.spine[i]);
      srv.send({ type: 'goto', index: i });
      const t0 = Date.now();
      await sleep(gap);
      const say = opt('say')?.split(/\s+/);
      const per = say ? Math.ceil(say.length / frames) : 0;
      const shots: { png: Buffer; label: string }[] = [];
      for (let k = 0; k < frames; k++) {
        if (say) srv.send({ type: 'transcript', text: say.slice(0, Math.min(say.length, (k + 1) * per)).join(' '), final: false }); // speech arrives a few words at a time
        else if (k > 0 && k <= n) srv.send({ type: 'next' }); // never past the last element: that would change slide
        await sleep(gap);
        if (opt('debug')) console.log(k, 'ghosts', await page.locator('.ghost').count(), JSON.stringify(srv.box.state?.glow), srv.box.state?.reveal);
        const png = await page.screenshot();
        shots.push({ png, label: `${id} +${Date.now() - t0}ms · el ${Math.min(k, n)}/${n}` });
      }
      const file = path.join(out, `${id}-film${opt('label') ? '-' + opt('label') : ''}.png`);
      await tile(await browser.newPage(), shots, file);
      console.log(`saved ${file} (${fs.statSync(file).size >> 10} KB)`);
    }
  } finally {
    await browser.close();
    srv.stop();
  }
}
await main();
