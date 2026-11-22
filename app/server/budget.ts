import fs from 'node:fs';

/** USD per million tokens (Anthropic list prices, Nov 2026). Cache writes cost 1.25x input. */
export const PRICES: Record<string, { in: number; out: number; cacheRead: number }> = {
  'claude-sonnet-5-5': { in: 2, out: 10, cacheRead: 0.1 },
  'claude-opus-5-5': { in: 4, out: 20, cacheRead: 0.2 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5, cacheRead: 0.1 },
};

export type Usage = { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number | null; cache_read_input_tokens?: number | null };

export function costOf(model: string, u: Usage): number {
  const p = PRICES[model];
  return (u.input_tokens * p.in + (u.cache_creation_input_tokens ?? 0) * p.in * 1.25 + (u.cache_read_input_tokens ?? 0) * p.cacheRead + u.output_tokens * p.out) / 1e6;
}

/**
 * A running total on disk, so restarting the app never resets it. Money is reserved before a call (worst case)
 * and settled to the real cost after. Anything uncertain counts as spent.
 */
export class Budget {
  spent = 0;
  private reserved = 0;
  constructor(private file: string, readonly cap: number) {
    if (!fs.existsSync(file)) return;
    try {
      const n = JSON.parse(fs.readFileSync(file, 'utf8')).spent;
      if (typeof n !== 'number' || !(n >= 0)) throw new Error('bad total');
      this.spent = n;
    } catch {
      this.spent = cap; // unreadable: stop spending rather than start again from zero
    }
  }
  /** Returns false if this call could take the total over the cap. */
  reserve(worst: number): boolean {
    if (this.spent + this.reserved + worst > this.cap) return false;
    this.reserved += worst;
    return true;
  }
  settle(worst: number, actual: number) {
    this.reserved -= worst;
    this.spent += actual;
    fs.writeFileSync(this.file + '.tmp', JSON.stringify({ spent: this.spent, cap: this.cap }));
    fs.renameSync(this.file + '.tmp', this.file);
  }
}
