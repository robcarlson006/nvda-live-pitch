/**
 * The static fallback: every script slide fully built and every prepared answer, as pictures of the real app.
 * Needs no server, network or AI on the day: open fallback/index.html (arrow keys, Home; Q jumps to the answers) or the PDF.
 * Run: npm run build && npm run fallback
 */
import fs from 'node:fs';
import path from 'node:path';
import { elementCount } from '../shared/schema.ts';
import { sleep, startBrowser, startServer } from './shoot.ts';

const OUT = path.resolve(import.meta.dirname, '../../fallback');
const IMG = path.join(OUT, 'slides');
fs.mkdirSync(IMG, { recursive: true });
for (const f of fs.readdirSync(IMG)) fs.unlinkSync(path.join(IMG, f));

const srv = await startServer(5198);
const { browser, page } = await startBrowser();
const pages: { file: string; title: string; kind: 'slide' | 'answer' }[] = [];
const shot = async (name: string, title: string, kind: 'slide' | 'answer') => {
  const file = `${String(pages.length).padStart(2, '0')}-${name}.jpg`;
  await page.screenshot({ path: path.join(IMG, file), type: 'jpeg', quality: 62 });
  pages.push({ file, title, kind });
};
try {
  await page.goto(`${srv.url}/stage`);
  await page.addStyleTag({ content: '.session{display:none}' }); // these would be this script's session, not the pitch's
  await sleep(2500);
  await shot('standby', 'NVIDIA', 'slide');
  for (const [i, s] of srv.box.spine.entries()) {
    srv.send({ type: 'goto', index: i });
    await sleep(700);
    while ((srv.box.state?.reveal ?? 99) < elementCount(s)) (srv.send({ type: 'next' }), await sleep(250));
    await sleep(s.chart ? 5200 : 3400);
    await shot(s.id, s.title.replace(/\{\{.*?\}\}/g, '…'), 'slide');
  }
  srv.send({ type: 'clear' });
  for (const b of srv.box.bank as { id: string; question: string }[]) {
    srv.send({ type: 'bank', id: b.id });
    await sleep(7000);
    await shot(`qa-${b.id}`, b.question, 'answer');
  }
  const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const firstAnswer = pages.findIndex((p) => p.kind === 'answer');
  fs.writeFileSync(
    path.join(OUT, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>NVIDIA pitch: fallback</title>
<style>html,body{margin:0;height:100%;background:#000;color:#f4f6f1;font:18px system-ui}img{width:100vw;height:100vh;object-fit:contain;display:block}
#menu{display:none;position:fixed;inset:0;background:#000e;overflow:auto;padding:4vh 6vw;columns:2}#menu a{display:block;color:#f4f6f1;padding:5px 0;text-decoration:none;break-inside:avoid}#menu a:hover{color:#76b900}</style>
<img id="s" alt=""><div id="menu">${pages.map((p, i) => `<a href="#${i}">${i}. ${p.kind === 'answer' ? 'Q: ' : ''}${esc(p.title)}</a>`).join('')}</div>
<script>const P=${JSON.stringify(pages.map((p) => 'slides/' + p.file))},Q=${firstAnswer};P.forEach(p=>{new Image().src=p});
let i=0,back=0;const M=document.getElementById('menu'),S=document.getElementById('s');
const go=n=>{i=Math.max(0,Math.min(P.length-1,n));S.src=P[i];M.style.display='none'};
const hash=()=>go(parseInt(location.hash.slice(1))||0);addEventListener('hashchange',hash);hash();
addEventListener('keydown',e=>{const k=e.key;if(['ArrowRight','PageDown',' '].includes(k))go(i+1);else if(['ArrowLeft','PageUp'].includes(k))go(i-1);else if(k==='Home')go(0);
else if(k==='q'){back=i<Q?i:back;go(Q);M.style.display='block'}else if(k==='r')go(back);else if(k==='m')M.style.display=M.style.display==='block'?'none':'block';else if(k==='f')document.documentElement.requestFullscreen();else return;e.preventDefault()});
S.onclick=()=>go(i+1);</script>`,
  );
  // the same pictures as a PDF
  const pdf = await browser.newPage();
  const html = path.join(OUT, '.print.html');
  fs.writeFileSync(html, `<!doctype html><style>@page{size:13.333in 7.5in;margin:0}body{margin:0;background:#000}img{width:13.333in;height:7.5in;display:block;break-after:page}</style>${pages.map((p) => `<img src="slides/${p.file}">`).join('')}`);
  await pdf.goto(`file://${html}`);
  await sleep(1500);
  await pdf.pdf({ path: path.join(OUT, 'NVDA-pitch-fallback.pdf'), width: '13.333in', height: '7.5in', printBackground: true });
  fs.unlinkSync(html);
  console.log(`${pages.length} pages (${pages.filter((p) => p.kind === 'answer').length} answers) in ${OUT}`);
} finally {
  await browser.close();
  srv.stop();
}
