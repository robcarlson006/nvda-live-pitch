// Times the live Q&A path against the real Claude API: the fast router, a cold answer, the cache warm-up, then warm
// answers. Pick the answer model with ANTHROPIC_MODEL (e.g. claude-haiku-5-5). About 1–2 cents a question; own $1 cap.
// Usage: ANTHROPIC_MODEL=claude-sonnet-5-5 npx tsx scripts/qa-speed.ts
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Ai, env, MODEL } from '../server/ai.ts';
import { Budget } from '../server/budget.ts';
import { Evidence, loadVault } from '../server/evidence.ts';
import { loadBank } from '../server/bank.ts';
import { loadDatasets, loadSpine } from '../server/state.ts';
import { findSlide } from '../shared/router.ts';

const QUESTIONS = [
  "AI's energy use is an environmental disaster, and you just used it for a slideshow.",
  'What are NVIDIA’s Scope 3 emissions doing?',
  'What happens to our portfolio if you are wrong?',
  "Isn't Jensen Huang's return a governance risk?",
  'How much water do the chip factories use?',
];
const core = loadDatasets(); const v = loadVault(); const ds = new Map([...core, ...v.datasets]);
const bankAll = loadBank(core); const ev = new Evidence(v.index, ds, bankAll); const spine = loadSpine(core);
const bank = bankAll.map(({ id, question }) => ({ id, question }));
const client = new Anthropic({ apiKey: env('ANTHROPIC_API_KEY'), maxRetries: 0, timeout: 20000 });
const calls: string[] = [];
const ai = new Ai(new Budget(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'qs-')), 's.json'), 1), async (body, signal) => {
  const t = Date.now(); const m = await client.messages.create(body, { signal });
  calls.push(`${body.model} ${Date.now() - t} ms · in ${m.usage.input_tokens} · cache read ${m.usage.cache_read_input_tokens ?? 0} · write ${m.usage.cache_creation_input_tokens ?? 0} · out ${m.usage.output_tokens}`);
  return m;
});
const flush = () => { for (const c of calls.splice(0)) console.log(`    ${c}`); };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

console.log(`Answer model: ${MODEL}\n`);
console.log('Local slide finder:');
for (const q of ['Can we see the DCF again?', 'go back to slide 20', ...QUESTIONS]) {
  const t = performance.now(); const h = findSlide(q, spine);
  console.log(`  ${(performance.now() - t).toFixed(2)} ms  ${q}  →  ${h ? `${spine[h.index].id}${h.explicit ? ' (jump)' : ' (card)'}` : 'none'}`);
}
console.log('\nFast router (Haiku):');
for (const q of QUESTIONS.slice(0, 3)) {
  const t = Date.now(); const r = await ai.route(q, spine, bank, new AbortController().signal);
  console.log(`  ${Date.now() - t} ms  ${q}  →  ${JSON.stringify(r)}`); flush();
}
const answer = async (q: string, label: string) => {
  const t = Date.now();
  const r = await ai.build({ kind: 'answer', heard: q, onScreen: 'nothing' }, ds, spine, new AbortController().signal, ev);
  console.log(`  ${label} ${Date.now() - t} ms  ${q}\n    → ${'slide' in r ? `${r.answered ? 'answered' : 'gap'}: ${r.slide.title} | ${r.slide.bullets.join(' | ')}${r.slide.chart ? ` | chart ${r.slide.chart.datasetKey}` : ''}` : JSON.stringify(r)}`);
  flush();
};
console.log('\nAnswers:');
await answer(QUESTIONS[0], 'cold');
ai.warm(ds, spine); await sleep(6000); console.log('  (warm-up sent)'); flush();
for (const q of QUESTIONS.slice(1)) await answer(q, 'warm');
console.log(`\nSpent $${ai.budget.spent.toFixed(3)}`);
