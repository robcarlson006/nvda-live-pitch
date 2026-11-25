import fs from 'node:fs';
import path from 'node:path';
import { Dataset, lookup, resolveText, type SourceLink } from '../shared/schema.ts';
import type { BankEntry } from './bank.ts';

/**
 * The evidence base for live Q&A, searched locally in a few milliseconds so a board answer needs one Claude call:
 *   - our own datasets (data/clean), the prepared answers (docs/qa-bank),
 *   - the research vault (data/clean/vault, built by scripts/build-evidence.ts): sourced facts, board Q&As, charts.
 * Search is BM25 over words, with light stemming and a few finance/ESG synonyms, because questions arrive as
 * speech-to-text. Claude then picks from the hits; every figure it shows is still a {{dataset | series | x}} lookup.
 */

export const VAULT_DIR = path.resolve(import.meta.dirname, '../../data/clean/vault');

export type FactDoc = { id: string; topic: string; tags: string[]; claim: string; quote: string; period: string; confidence: string; hasValue: boolean; source: { publisher: string; title: string; url: string; published: string } | null };
type QaDoc = { id: string; question: string; variants: string[]; answer: string[]; facts: string[]; visuals: string[]; stance: string };
type VisualDoc = { id: string; key: string; title: string; caption: string; chart: string; x: string[]; series: string[]; facts: string[]; core: boolean };
export type VaultIndex = { built: string; facts: FactDoc[]; qa: QaDoc[]; visuals: VisualDoc[] };

/** Vault datasets (facts and charts), keyed like data/clean. Missing folder → none, and the app runs as before. */
export function loadVault(): { datasets: Map<string, Dataset>; index: VaultIndex } {
  const empty = { datasets: new Map<string, Dataset>(), index: { built: '', facts: [], qa: [], visuals: [] } };
  try {
    if (!fs.existsSync(path.join(VAULT_DIR, 'index.json'))) return empty;
    const datasets = new Map<string, Dataset>();
    for (const f of fs.readdirSync(VAULT_DIR).filter((f) => /^vault_.*\.json$/.test(f))) {
      const parsed = Dataset.safeParse(JSON.parse(fs.readFileSync(path.join(VAULT_DIR, f), 'utf8')));
      if (parsed.success) datasets.set(parsed.data.key, parsed.data);
    }
    return { datasets, index: JSON.parse(fs.readFileSync(path.join(VAULT_DIR, 'index.json'), 'utf8')) };
  } catch (e) {
    console.warn(`[evidence] vault not loaded: ${(e as Error).message}`);
    return empty;
  }
}

export const isVaultKey = (key: string) => key.startsWith('vault_');

// ---------- text ----------
const STOP = new Set('a an the and or but of to in on at for is it its that this as by be we our you your i are was were with from so if than then there their they he she not no do does did has have had can will just what why how when who which would could should about into over more most very any all some much many been being me my us them his her also isnt dont doesnt wont'.split(' '));
const stem = (w: string) => w.length > 4 ? w.replace(/(ings|ing|ies|ied|es|ed|s)$/, (m) => (m === 'ies' || m === 'ied' ? 'y' : '')) : w;
export const terms = (text: string) =>
  text.toLowerCase().replace(/’/g, "'").replace(/'s\b/g, '').split(/[^a-z0-9.%]+/).map((w) => w.replace(/^\.+|\.+$/g, '')).filter((w) => w && !STOP.has(w)).map(stem);

/** Words a board member says → words the evidence uses. Speech-to-text spellings included. */
const SYNONYMS: Record<string, string> = {
  ceo: 'ceo huang jensen chief executive', jensen: 'jensen huang ceo', huang: 'huang jensen ceo', successor: 'successor succession ceo',
  water: 'water cooling withdrawal consumption', carbon: 'carbon emission co2 scope', emission: 'emission carbon co2 scope ghg',
  energy: 'energy electricity power twh', electricity: 'electricity energy power twh', power: 'power energy electricity',
  china: 'china export control chinese', export: 'export control china', democrat: 'democrat congress senate bill regulation policy',
  dems: 'democrat congress policy', regulation: 'regulation law policy antitrust', antitrust: 'antitrust competition regulator',
  uk: 'uk britain british united kingdom', britain: 'uk british', tax: 'tax taxes', competitor: 'competitor amd intel broadcom rival',
  rival: 'rival competitor amd', amd: 'amd competitor', cuda: 'cuda software developer', bubble: 'bubble valuation crash',
  valuation: 'valuation dcf price earnings', dcf: 'dcf valuation cash flow', debt: 'debt cash balance', dividend: 'dividend buyback return',
  buyback: 'buyback repurchase return', customer: 'customer hyperscaler concentration', hyperscaler: 'hyperscaler cloud customer microsoft amazon google meta',
  government: 'government sovereign public national', sovereign: 'sovereign government national', taiwan: 'taiwan tsmc supply',
  tsmc: 'tsmc taiwan supply foundry', supply: 'supply tsmc packaging cowos', esg: 'esg sustainability governance social environmental',
  diversity: 'diversity women board', staff: 'staff employee turnover', employee: 'employee staff', ecolab: 'ecolab cooling water',
  margin: 'margin profit', revenue: 'revenue sales', growth: 'growth revenue', risk: 'risk downside', invidia: 'nvidia', nvidea: 'nvidia',
};
const expand = (text: string) => {
  const base = terms(text);
  const extra = base.flatMap((t) => (SYNONYMS[t] ? terms(SYNONYMS[t]) : []));
  return [...base, ...extra.filter((t) => !base.includes(t))];
};

// ---------- BM25 ----------
type Kind = 'fact' | 'qa' | 'visual' | 'dataset' | 'bank';
type Doc = { kind: Kind; id: string; tf: Map<string, number>; len: number };

class Bm25 {
  private docs: Doc[] = [];
  private df = new Map<string, number>();
  private avg = 1;
  add(kind: Kind, id: string, text: string) {
    const ts = terms(text);
    const tf = new Map<string, number>();
    for (const t of ts) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    this.docs.push({ kind, id, tf, len: ts.length || 1 });
  }
  finish() {
    this.avg = this.docs.reduce((a, d) => a + d.len, 0) / Math.max(1, this.docs.length);
  }
  search(query: string[], kind: Kind, k: number) {
    const N = this.docs.length;
    const out: { id: string; score: number }[] = [];
    for (const d of this.docs) {
      if (d.kind !== kind) continue;
      let s = 0;
      for (const q of query) {
        const f = d.tf.get(q);
        if (!f) continue;
        const idf = Math.log(1 + (N - (this.df.get(q) ?? 0) + 0.5) / ((this.df.get(q) ?? 0) + 0.5));
        s += (idf * f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (d.len / this.avg)));
      }
      if (s > 0) out.push({ id: d.id, score: s });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, k);
  }
}

export type Hits = { facts: FactDoc[]; qa: QaDoc[]; charts: { key: string; title: string; chart: string; core: boolean }[]; bank: BankEntry[] };

export class Evidence {
  private bm = new Bm25();
  readonly facts: Map<string, FactDoc>;
  private qa: Map<string, QaDoc>;
  private charts = new Map<string, { key: string; title: string; chart: string; core: boolean }>();
  private bank = new Map<string, BankEntry>();

  constructor(index: VaultIndex, datasets: Map<string, Dataset>, bank: BankEntry[] = []) {
    this.facts = new Map(index.facts.map((f) => [f.id, f]));
    this.qa = new Map(index.qa.map((q) => [q.id, q]));
    for (const f of index.facts) this.bm.add('fact', f.id, `${f.claim} ${f.claim} ${f.topic.replace(/-/g, ' ')} ${f.tags.join(' ')} ${f.source?.publisher ?? ''}`);
    for (const q of index.qa) this.bm.add('qa', q.id, `${q.question} ${q.question} ${q.variants.join(' ')} ${q.answer.join(' ')}`);
    for (const v of index.visuals) {
      if (!datasets.has(v.key)) continue;
      this.charts.set(v.key, { key: v.key, title: v.title, chart: v.chart, core: v.core });
      this.bm.add('visual', v.key, `${v.title} ${v.title} ${v.caption} ${v.series.join(' ')} ${v.x.join(' ')}`);
    }
    for (const d of datasets.values()) {
      if (isVaultKey(d.key) || d.verified === false || d.placeholder) continue;
      if (!this.charts.has(d.key)) this.charts.set(d.key, { key: d.key, title: d.title, chart: 'bar', core: true });
      this.bm.add('dataset', d.key, `${d.title} ${d.title} ${Object.keys(d.series).join(' ')} ${d.x.slice(0, 12).join(' ')} ${d.key.replace(/_/g, ' ')}`);
    }
    for (const b of bank) {
      this.bank.set(b.id, b);
      this.bm.add('bank', b.id, `${b.question} ${b.question} ${b.ask.join(' ')} ${b.slide.title} ${b.slide.bullets.join(' ')}`);
    }
    this.bm.finish();
  }

  get size() {
    return { facts: this.facts.size, qa: this.qa.size, charts: this.charts.size, bank: this.bank.size };
  }

  search(question: string, k = { facts: 14, qa: 4, charts: 6, bank: 2 }): Hits {
    const q = expand(question);
    // A vault Q&A that matches pulls in the facts and charts it was built on.
    const qa = this.bm.search(q, 'qa', k.qa).map((h) => this.qa.get(h.id)!);
    const factIds = new Set(this.bm.search(q, 'fact', k.facts).map((h) => h.id));
    for (const item of qa) for (const id of item.facts.slice(0, 4)) if (this.facts.has(id)) factIds.add(id);
    const chartKeys = new Set([...this.bm.search(q, 'visual', k.charts), ...this.bm.search(q, 'dataset', 3)].map((h) => h.id));
    return {
      facts: [...factIds].slice(0, k.facts + 6).map((id) => this.facts.get(id)!),
      qa,
      charts: [...chartKeys].slice(0, k.charts + 2).map((key) => this.charts.get(key)!).filter(Boolean),
      bank: this.bm.search(q, 'bank', k.bank).map((h) => this.bank.get(h.id)!),
    };
  }

  /** The search results, written for Claude. Vault charts carry their values; our own datasets are already in DATA. */
  block(h: Hits, datasets: Map<string, Dataset>): string {
    const lines: string[] = ['EVIDENCE (searched for this question; use what answers it, ignore the rest)'];
    if (h.charts.length) {
      lines.push('', 'Charts you can show (chart.datasetKey):');
      for (const c of h.charts) {
        const d = datasets.get(c.key);
        if (!d) continue;
        lines.push(c.core
          ? `- ${c.key} (in DATA): ${d.title}`
          : `- ${JSON.stringify({ key: d.key, title: d.title, suggested: c.chart, unit: d.unit, source: d.source, asOf: d.asOf, x: d.x, series: d.series })}`);
      }
    }
    if (h.facts.length) {
      lines.push('', 'Facts you can cite (put their ids in factIds; show a figure only as written after "figure:"):');
      for (const f of h.facts) {
        const fig = f.hasValue ? lookup(datasets, 'vault_facts', f.id, 'value') : undefined;
        const src = f.source ? `${f.source.publisher}${f.source.published ? `, ${f.source.published}` : ''}` : 'vault';
        lines.push(`- ${f.id} [${f.confidence}; ${src}] ${f.claim}${fig ? ` | figure: {{vault_facts | ${f.id} | value}} = ${fig}` : ''}`);
      }
    }
    if (h.bank.length) {
      lines.push('', "The team's prepared answers on nearby questions (follow their framing):");
      for (const b of h.bank) lines.push(`- ${b.question} → ${resolveText([b.slide.title, ...b.slide.bullets].join(' / '), datasets)}`);
    }
    if (h.qa.length) {
      lines.push('', 'Overnight research notes on nearby questions (context only; never copy their figures, use the facts above):');
      for (const q of h.qa) lines.push(`- ${q.question} → ${q.answer.join(' ')} [facts: ${q.facts.join(', ') || 'none'}]`);
    }
    return lines.join('\n');
  }

  /** Citations for the facts a slide used: a short source line each, and the page links for the operator. */
  cite(ids: string[]): { sources: string[]; links: SourceLink[] } {
    const found = [...new Set(ids)].map((id) => this.facts.get(id)).filter((f): f is FactDoc => !!f?.source);
    const sources = [...new Set(found.map((f) => {
      const s = f.source!;
      const doc = docName(s.title);
      return [s.publisher, doc && !s.publisher.includes(doc) ? doc : '', s.published].filter(Boolean).join(', ');
    }))];
    const links = [...new Map(found.map((f) => [f.source!.url, { title: (docName(f.source!.title) || f.source!.publisher).slice(0, 160), url: f.source!.url, publisher: f.source!.publisher }])).values()]
      .filter((l) => /^https?:\/\//.test(l.url));
    return { sources, links };
  }
}

/** A readable document name: a page title without the site suffix, or a PDF's file name when the title is its URL. */
export function docName(title: string): string {
  const t = title.trim();
  if (/^https?:\/\//.test(t)) {
    const file = decodeURIComponent(t.split(/[?#]/)[0].split('/').pop() ?? '').replace(/\.(pdf|html?|aspx)$/i, '');
    return file.replace(/[-_]+/g, ' ').trim().slice(0, 70);
  }
  return t.replace(/\s*[|·–-]\s*[^|·–-]+$/, '').slice(0, 70);
}
