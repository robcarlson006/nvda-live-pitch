import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { Slide, SourceLink, type Dataset } from '../shared/schema.ts';
import { cueScore, words } from './cues.ts';
import { checkSlide } from './state.ts';

/** Prepared answers (docs/qa-bank/answers.yaml): instant, free, and they work with no internet. */
export const BANK_FILE = path.resolve(import.meta.dirname, '../../docs/qa-bank/answers.yaml');
const Entry = z.object({ id: z.string(), question: z.string(), ask: z.array(z.string()).min(1), slide: z.record(z.string(), z.unknown()), links: z.array(SourceLink).optional() });
export type BankEntry = Omit<z.infer<typeof Entry>, 'slide'> & { slide: Slide };

export function loadBank(datasets: Map<string, Dataset>, file = BANK_FILE): BankEntry[] {
  return z.array(Entry).parse(parse(fs.readFileSync(file, 'utf8'))).map((e) => {
    const slide = Slide.parse({ ...e.slide, id: `qa-${e.id}`, answer: true });
    const problem = checkSlide(slide, datasets);
    if (problem) throw new Error(`Q&A "${e.id}": ${problem}`);
    return { ...e, slide };
  });
}

/** The prepared answer whose phrases best match the question, or null. Every word of a phrase must be heard, close together. */
export function findAnswer(bank: BankEntry[], question: string): BankEntry | null {
  const heard = words(question);
  let best: { e: BankEntry; len: number } | null = null;
  for (const e of bank)
    for (const p of e.ask) {
      const len = words(p).length;
      if (cueScore(p, heard) === 1 && len > (best?.len ?? 0)) best = { e, len };
    }
  return best?.e ?? null;
}
