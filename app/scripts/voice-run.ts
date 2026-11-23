/**
 * Voice rehearsal without a person: the script is read by a computer voice (macOS `say`), the words reach the show
 * exactly as speech-to-text results do (interim results word by word, then the final sentence), at the voice's real pace,
 * and the stage is photographed whenever something new is built. It runs on its own throwaway server with no API keys,
 * so it tests the fallback path (cue words and the local element lead) and can never spend money or touch the real show.
 *
 *   npm run voice -- [--slides hook,founding,...] [--play] [--rate 175] [--voice Daniel] [--out dir]
 *
 * --play also speaks out loud through the speakers, so you can watch the stage build with the voice.
 * Writes a report (voice-report.md) and a photo per beat.
 */
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { elementCount, type ShowState } from '../shared/schema.ts';
import { sleep, startBrowser, startServer } from './shoot.ts';

const args = process.argv.slice(2);
const opt = (n: string) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const play = args.includes('--play');
const rate = opt('rate') ?? '175';
const only = opt('slides')?.split(',');
const APP = path.resolve(import.meta.dirname, '..');
const out = path.resolve(APP, '..', opt('out') ?? `rehearsal/voice-${new Date().toISOString().slice(5, 16).replace(/[:T]/g, '')}`);
fs.mkdirSync(out, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-'));

const voices = execFileSync('say', ['-v', '?']).toString();
const voice = opt('voice') ?? (/^Daniel\b/m.test(voices) ? 'Daniel' : undefined);

/** Seconds of audio the voice needs for this text (rendered to a file, so it is the real length). */
function seconds(text: string, i: number): number {
  const f = path.join(tmp, `${i}.aiff`);
  execFileSync('say', [...(voice ? ['-v', voice] : []), '-r', rate, '-o', f, text]);
  const m = /estimated duration: ([\d.]+)/.exec(execFileSync('afinfo', [f]).toString());
  return m ? Number(m[1]) : text.split(' ').length / 2.7;
}
const speak = (text: string) => new Promise<void>((r) => spawn('say', [...(voice ? ['-v', voice] : []), '-r', rate, text], { stdio: 'ignore' }).on('close', () => r()));

const srv = await startServer(5197);
const { browser, page } = await startBrowser('1280x720');
const spine = srv.box.spine.filter((s) => !only || only.includes(s.id));
const t0 = Date.now();
const at = () => Math.round((Date.now() - t0) / 100) / 10;

type Ev = { t: number; id: string; reveal: number; total: number; via: string; heard: string };
const events: Ev[] = [];
let last = '';
let lastWords = '';
const poll = setInterval(() => {
  const s: ShowState | null = srv.box.state;
  if (!s?.live) return;
  const key = `${s.live.id}:${s.reveal}`;
  if (key === last) return;
  last = key;
  const sp = srv.box.spine.find((x) => x.id === s.live!.id);
  events.push({ t: at(), id: s.live.id, reveal: s.reveal, total: sp ? elementCount(sp) : 0, via: s.lastCue?.phrase ?? '', heard: lastWords });
}, 50);

await page.goto(`${srv.url}/stage`);
await page.addStyleTag({ content: '.session{display:none}' });
await sleep(2000);
srv.send({ type: 'follow', mode: 'script' }); // cue words and the local lead: what runs when Claude can't be reached
srv.send({ type: 'autoCue', on: true });
srv.send({ type: 'goto', index: srv.box.spine.findIndex((s) => s.id === spine[0].id) });

const lastPhoto = { key: '' };
const photoLoop = setInterval(async () => {
  const s = srv.box.state;
  if (!s?.live) return;
  const key = `${s.live.id}:${s.reveal}`;
  if (key === lastPhoto.key) return;
  lastPhoto.key = key;
  await sleep(1400); // let the beat finish building
  try {
    await page.screenshot({ path: path.join(out, `${String(events.length).padStart(3, '0')}-${key.replace(':', '-b')}.jpg`), type: 'jpeg', quality: 60 });
  } catch {}
}, 100);

const arrivals: { id: string; t: number; index: number }[] = [];
const finished: { id: string; t: number; index: number }[] = [];
let n = 0;
for (const slide of spine) {
  const sentences = (slide.say ?? '').split(/(?<=[.?!])\s+/).filter(Boolean);
  for (const sentence of sentences) {
    const words = sentence.replace(/[—–]/g, ' ').split(/\s+/).filter(Boolean);
    const dur = seconds(sentence, n++);
    const speaking = play ? speak(sentence) : Promise.resolve();
    const started = Date.now();
    for (let i = 0; i < words.length; i++) {
      const due = (dur * 1000 * i) / words.length;
      await sleep(Math.max(0, due - (Date.now() - started)));
      lastWords = words.slice(Math.max(0, i - 6), i + 1).join(' ');
      if (i % 2 === 1 && i < words.length - 1) srv.send({ type: 'transcript', text: words.slice(0, i + 1).join(' '), final: false });
    }
    await sleep(Math.max(0, dur * 1000 - (Date.now() - started)));
    srv.send({ type: 'transcript', text: sentence, final: true });
    await speaking;
    await sleep(250);
  }
  const idx = srv.box.state?.index ?? -1;
  finished.push({ id: slide.id, t: at(), index: idx });
  await sleep(900); // a breath between slides, and between speakers
}
await sleep(2500);
clearInterval(poll);
clearInterval(photoLoop);

// ---- report
const lines: string[] = [`# Voice rehearsal ${new Date().toISOString()}`, '', `Voice: ${voice ?? 'system default'}, ${rate} words per minute. Mode: cue words + local lead (no AI). Total ${at()} s.`, ''];
const idOf = (i: number) => srv.box.spine[i]?.id;
let bad = 0;
for (const f of finished) {
  const sl = srv.box.spine.find((s) => s.id === f.id)!;
  const total = elementCount(sl);
  const mine = events.filter((e) => e.id === f.id);
  const maxBuilt = Math.max(0, ...mine.map((e) => e.reveal));
  const onIt = idOf(f.index) === f.id;
  const bursts = mine.filter((e, i) => i > 0 && e.t - mine[i - 1].t < 0.6).length;
  const problems: string[] = [];
  if (!mine.length) problems.push('never reached');
  else if (maxBuilt < total) problems.push(`built ${maxBuilt} of ${total} beats`);
  if (!onIt && mine.length) problems.push(`deck had moved on to "${idOf(f.index)}" before the slide's last word`);
  if (bursts) problems.push(`${bursts} beat(s) arrived together (<0.6 s apart)`);
  if (problems.length) bad++;
  lines.push(`## ${problems.length ? '⚠' : '✓'} ${f.id}${problems.length ? `: ${problems.join('; ')}` : ''}`);
  for (const e of mine) lines.push(`- ${e.t}s  beat ${e.reveal}/${e.total}${e.via ? ` via “${e.via}”` : ''}${e.heard ? `, after “…${e.heard}”` : ''}`);
  lines.push('');
}
lines.splice(3, 0, bad ? `**${bad} of ${finished.length} slides need attention.**` : `**All ${finished.length} slides built completely and in order.**`, '');
fs.writeFileSync(path.join(out, 'voice-report.md'), lines.join('\n'));
console.log(lines.slice(0, 4).join('\n'));
console.log(`report and photos in ${out}`);
await browser.close();
srv.stop();
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(0);
