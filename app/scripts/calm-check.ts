/** Checks that key m (calm) silences the pre-glow and the ghost transcript line. npm run calm-check */
import { sleep, startBrowser, startServer } from './shoot.ts';
const srv = await startServer(5196);
const { browser, page } = await startBrowser('1280x720');
let bad = 0;
const ok = (p: boolean, m: string) => { if (!p) bad++; console.log(`${p ? '✓' : '✗'} ${m}`); };
try {
  await page.goto(`${srv.url}/stage`);
  await sleep(1200);
  const i = srv.box.spine.findIndex((s) => s.id === 'supply');
  srv.send({ type: 'goto', index: i });
  await sleep(1500);
  const say = async () => { for (const t of ['one company', 'one company TSMC']) { srv.send({ type: 'transcript', text: t, final: false }); await sleep(500); } };
  const opacity = () => page.evaluate(() => { const e = document.querySelector('.ghost'); return e ? Number(getComputedStyle(e).opacity) : -1; });
  await say();
  ok((await opacity()) > 0.05, `glow visible before calm (opacity ${(await opacity()).toFixed(2)})`);
  await page.keyboard.press('t');
  await sleep(400);
  srv.send({ type: 'transcript', text: 'ghost words here', final: false });
  await sleep(800);
  ok((await page.locator('.ghost-line').count()) <= 1, 'ghost line toggles with t');
  await page.keyboard.press('m');
  await sleep(500);
  ok((await opacity()) <= 0.01, `calm hides the glow (opacity ${(await opacity()).toFixed(2)})`);
  ok((await page.locator('.ghost-line').count()) === 0, 'calm hides the ghost line');
} finally { await browser.close(); srv.stop(); }
process.exit(bad ? 1 : 0);
