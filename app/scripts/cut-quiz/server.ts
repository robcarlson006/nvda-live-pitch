// The cut quiz: a tiny local page for choosing what to cut from the spoken script, one match-up at a time.
// Reads docs/script/spine.yaml + docs/script/cut-candidates.yaml, saves every pick to docs/script/cut-choices.json.
// Run: cd app && PORT=5191 npx tsx scripts/cut-quiz/server.ts   (then open http://localhost:5191)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { parse } from 'yaml';
import { resolveText } from '../../shared/schema.ts';
import { loadDatasets } from '../../server/state.ts';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const SPINE = path.join(ROOT, 'docs/script/spine.yaml');
const CANDIDATES = path.join(ROOT, 'docs/script/cut-candidates.yaml');
const CHOICES = path.join(ROOT, 'docs/script/cut-choices.json');
const IMAGES = path.join(ROOT, 'app/public/fallback');
const PAGE = path.join(import.meta.dirname, 'index.html');
const PORT = Number(process.env.PORT ?? 5191);

const datasets = loadDatasets();
const shown = (say: string) => resolveText(say, datasets).replace(/\*\*?/g, '');

function payload() {
  const spine = parse(fs.readFileSync(SPINE, 'utf8')) as { id: string; speaker: string; title: string; say?: string; optional?: boolean }[];
  const cand = parse(fs.readFileSync(CANDIDATES, 'utf8'));
  for (const [id, t] of Object.entries<{ say: string }>(cand.trims)) {
    if (!spine.some((s) => s.id === id)) throw new Error(`trim ${id}: no such slide`);
    Object.assign(t, { slide: id, shown: shown(t.say) });
  }
  for (const [id, c] of Object.entries<{ slides: string[] }>(cand.cuts))
    for (const s of c.slides) if (!spine.some((x) => x.id === s)) throw new Error(`cut ${id}: no slide ${s}`);
  const choices = fs.existsSync(CHOICES) ? JSON.parse(fs.readFileSync(CHOICES, 'utf8')) : { picks: [], keepGoing: false };
  return {
    spine: spine.map((s, i) => ({ id: s.id, n: i + 1, speaker: s.speaker, title: s.title, say: s.say ?? '', shown: shown(s.say ?? ''), image: `/slides/slide-${String(i + 1).padStart(2, '0')}.jpg` })),
    ...cand,
    choices,
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  try {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return res.end(fs.readFileSync(PAGE));
    }
    if (url.pathname === '/api/data') {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      return res.end(JSON.stringify(payload()));
    }
    if (url.pathname === '/api/choices' && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        const data = JSON.parse(body);
        if (!Array.isArray(data.picks)) { res.writeHead(400); return res.end('picks must be a list'); }
        fs.writeFileSync(CHOICES + '.tmp', JSON.stringify({ ...data, savedAt: new Date().toISOString() }, null, 2) + '\n');
        fs.renameSync(CHOICES + '.tmp', CHOICES);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end('{"ok":true}');
      });
      return;
    }
    const m = url.pathname.match(/^\/slides\/(slide-\d\d\.jpg)$/);
    if (m && fs.existsSync(path.join(IMAGES, m[1]))) {
      res.writeHead(200, { 'content-type': 'image/jpeg', 'cache-control': 'max-age=3600' });
      return res.end(fs.readFileSync(path.join(IMAGES, m[1])));
    }
    res.writeHead(404);
    res.end('not found');
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end(String(e instanceof Error ? e.message : e));
  }
});
server.listen(PORT, '127.0.0.1', () => console.log(`cut quiz on http://localhost:${PORT}`));
