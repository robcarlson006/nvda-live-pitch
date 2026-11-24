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

const QUESTION_BREAK = /[?!]\s*(?=\S)|(?:[,;]\s*|\b(?:and|also|plus|but)\s+)(?=(?:what|why|how|where|when|who|which|can|could|does|do|is|are|has|have|will|would)\b)/i;

export const questionPartCount = (question: string) => question.trim().split(QUESTION_BREAK).length;

/** Route ambiguous questions to evidence lookup rather than reusing a partial answer. */
export function findAnswer(bank: BankEntry[], question: string): BankEntry | null {
  const heard = words(question);
  if (!heard.length) return null;
  const exact = bank.find((entry) => words(entry.question).join(' ') === heard.join(' '));
  if (exact) return exact;
  if (questionPartCount(question) > 1) return null;

  const matches = bank.filter((entry) => entry.ask.some((phrase) => {
    const terms = words(phrase);
    // A lone topic word is an alias, but it is too broad to answer a longer question.
    if (terms.length === 1) return heard.length <= 3 && heard.includes(terms[0]);
    return cueScore(phrase, heard) === 1;
  }));
  return matches.length === 1 ? matches[0] : null;
}
