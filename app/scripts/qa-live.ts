// Asks the live Q&A pipeline real board questions against the real Claude API, and prints the timing, raw reply and result.
// Costs about 1–2 cents a question (its own $1 cap). Usage: npx tsx scripts/qa-live.ts "question" ["question" …]
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Ai, env } from '../server/ai.ts';
import { Budget } from '../server/budget.ts';
import { Evidence, loadVault } from '../server/evidence.ts';
import { loadBank } from '../server/bank.ts';
import { loadDatasets, loadSpine } from '../server/state.ts';
const core = loadDatasets(); const v = loadVault(); const ds = new Map([...core, ...v.datasets]);
const ev = new Evidence(v.index, ds, loadBank(core)); const spine = loadSpine(core);
const client = new Anthropic({ apiKey: env('ANTHROPIC_API_KEY'), maxRetries: 0, timeout: 20000 });
const ai = new Ai(new Budget(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'l-')), 's.json'), 1), async (body, signal) => {
  const t = Date.now(); const m = await client.messages.create(body, { signal });
  const txt = m.content.flatMap((b) => b.type === 'text' ? [b.text] : []).join('');
  console.log(`  call ${Date.now() - t} ms, in ${m.usage.input_tokens} (cache read ${m.usage.cache_read_input_tokens}, write ${m.usage.cache_creation_input_tokens}) out ${m.usage.output_tokens}\n  RAW ${txt.slice(0, 900)}`);
  return m;
});
for (const q of process.argv.slice(2)) {
  console.log('\nQ', q);
  const r = await ai.build({ kind: 'answer', heard: q, onScreen: 'nothing' }, ds, spine, new AbortController().signal, ev);
  console.log('  =>', JSON.stringify('slide' in r ? { answered: r.answered, title: r.slide.title } : r));
}
