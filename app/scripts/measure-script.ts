// Counts spoken words per slide in docs/script/spine.yaml and converts to time at 150 words a minute.
// Each {{dataset | series | x}} figure counts as 5 spoken words ("three hundred and eighty-nine dollars").
// Usage: npx tsx scripts/measure-script.ts [--json]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const WPM = 150;
const FIGURE_WORDS = 5;
const SPINE = path.resolve(import.meta.dirname, '../../docs/script/spine.yaml');

export function spokenWords(say: string): { words: number; figures: number } {
  const figures = (say.match(/\{\{[^}]*\}\}/g) ?? []).length;
  const plain = say.replace(/\{\{[^}]*\}\}/g, ' ').replace(/[*_]/g, '');
  const words = plain.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return { words: words + figures * FIGURE_WORDS, figures };
}

const secs = (words: number) => Math.round((words / WPM) * 60);
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const slides = parse(fs.readFileSync(SPINE, 'utf8')) as { id: string; speaker: string; say?: string; optional?: boolean }[];
const rows = slides.map((s, i) => ({ n: i + 1, id: s.id, speaker: s.speaker, optional: !!s.optional, ...spokenWords(s.say ?? '') }));

const isMain = !!process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename;
if (isMain && process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else if (isMain) {
  console.log('| # | Slide | Speaker | Words | Figures | Time |');
  console.log('|---:|---|---|---:|---:|---:|');
  for (const r of rows) console.log(`| ${r.n} | ${r.id}${r.optional ? ' (optional)' : ''} | ${r.speaker} | ${r.words} | ${r.figures} | ${secs(r.words)} s |`);
  const by = new Map<string, number>();
  for (const r of rows) by.set(r.speaker, (by.get(r.speaker) ?? 0) + r.words);
  console.log('\n| Speaker | Words | Time |\n|---|---:|---:|');
  let total = 0;
  for (const [k, v] of by) { total += v; console.log(`| ${k} | ${v} | ${mmss(secs(v))} |`); }
  console.log(`| **All** | **${total}** | **${mmss(secs(total))}** |`);
}
