import fs from 'node:fs';

/** USD per million tokens (Anthropic list prices, Nov 2026). Cache writes cost 1.25x input. */
export const PRICES: Record<string, { in: number; out: number; cacheRead: number }> = {
  'claude-sonnet-5-5': { in: 2, out: 10, cacheRead: 0.1 },
  'claude-opus-5-5': { in: 4, out: 20, cacheRead: 0.2 },
  'claude-haiku-5-5': { in: 0.1, out: 0.5, cacheRead: 0.1 },
};

export type Usage = { input_tokens: number; output_tokens: number; cache_creation?: { ephemeral_1h_input_tokens?: number | null } | null; cache_creation_input_tokens?: number | null; cache_read_input_tokens?: number | null; server_tool_use?: { web_search_requests?: number } | null };
export const SEARCH_PRICE = 0.01; // USD per web search

export function costOf(model: string, u: Usage): number {
  const p = PRICES[model];
  // Cache writes: 1.25x input for the 5-minute cache, 2x for the 1-hour one.
  const long = u.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  const short = Math.max(0, (u.cache_creation_input_tokens ?? 0) - long);
  return (u.input_tokens * p.in + short * p.in * 1.25 + long * p.in * 2 + (u.cache_read_input_tokens ?? 0) * p.cacheRead + u.output_tokens * p.out) / 1e6 + (u.server_tool_use?.web_search_requests ?? 0) * SEARCH_PRICE;
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
