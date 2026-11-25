// Research vault → data the live Q&A can search, chart and cite.
//   npx tsx scripts/build-evidence.ts      (also part of `npm run data`)
//
// Reads research-vault/db (facts quoted word for word from saved pages, board Q&As, charts) and writes:
//   data/clean/vault/vault_facts.json   one Dataset: every sourced figure, so a slide shows it as
//                                        {{vault_facts | F0123 | value}} — looked up, never typed by the model
//   data/clean/vault/vault_v0123.json   one Dataset per vault chart the stage can draw (bar, line, stacked, KPI)
//   data/clean/vault/index.json         the search index: facts (claim, quote, source), Q&As, charts
// Low-confidence facts, and any discount rate above the 15.4% cap, are left out.
import fs from 'node:fs';
import path from 'node:path';
import { Dataset } from '../shared/schema.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const VAULT = path.join(ROOT, 'research-vault');
const OUT = path.join(ROOT, 'data/clean/vault');
const MAX_RATE = 15.4;

type Source = { id: string; url: string; title: string; publisher: string; published?: string };
type Fact = { id: string; topic: string; claim: string; source: string; quote: string; value: number | null; unit: string; period?: string; confidence: string; tags?: string[] };
type VaultQa = { id: string; question: string; variants?: string[]; answer: string[]; facts: string[]; visuals: string[]; stance?: string };
type Visual = { id: string; title: string; kind: string; spec_file: string; facts: string[]; dataset?: string; caption?: string; baseline?: boolean; added?: string };
type Spec = { title: string; subtitle?: string; unit?: string; x: string[]; series: { name: string; values: (number | null)[]; facts?: string[] }[]; source?: string; highlight?: string };

const rows = <T>(file: string): T[] => fs.readFileSync(path.join(VAULT, 'db', file), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as T);

/** The vault's free-text units → the ones formatValue knows; anything else is printed as written. */
export function normUnit(u: string | null | undefined): string {
  const t = (u ?? '').trim();
  if (/^usd ?(billion|billions|bn)$/i.test(t)) return 'USD bn';
  if (/^usd ?(million|millions|m)$/i.test(t)) return 'USD m';
  if (/^usd ?(trillion|tn)$/i.test(t)) return 'USD tn';
  if (/^(percent|per cent|%)/i.test(t)) return '%'; // "% upper bound", "% receivables": the claim carries the qualifier
  if (/^(times|x)$/i.test(t)) return 'x';
  if (/^usd per share$/i.test(t)) return 'USD';
  return t;
}

const RATE = /\b(wacc|discount rate|cost of capital)\b/i;
const tooHighRate = (text: string, value: number | null, unit: string) =>
  (RATE.test(text) && unit === '%' && value != null && value > MAX_RATE) || /\b19\.3\s*%/.test(text);

const CHART: Record<string, 'bar' | 'line' | 'stackedBar'> = { bar: 'bar', hbar: 'bar', kpi: 'bar', line: 'line', stacked: 'stackedBar' };

function main() {
  const sources = new Map(rows<Source>('sources.jsonl').map((s) => [s.id, s]));
  // Facts the vault took from our own data cite that dataset's source and date ("local:nvda_emissions").
  const ownData = path.join(ROOT, 'data/clean');
  for (const f of fs.readdirSync(ownData).filter((f) => f.endsWith('.json'))) {
    const d = JSON.parse(fs.readFileSync(path.join(ownData, f), 'utf8'));
    if (d.key) sources.set(`local:${d.key}`, { id: `local:${d.key}`, url: '', title: d.title, publisher: d.source, published: d.asOf });
  }
  const cite = (s?: Source) => (s ? `${s.publisher}, ${s.title}${s.published ? ` (${s.published})` : ''}` : 'Research vault');
  const today = new Date().toISOString().slice(0, 10);

  // ---- Facts ----
  const facts = rows<Fact>('facts.jsonl').filter((f) => f.confidence !== 'low' && !tooHighRate(`${f.claim} ${f.quote}`, f.value, normUnit(f.unit)));
  const kept = new Set(facts.map((f) => f.id));
  const withValue = facts.filter((f) => typeof f.value === 'number' && Number.isFinite(f.value));
  const factsDataset: Dataset = {
    key: 'vault_facts',
    title: 'Sourced facts from the research vault',
    unit: '',
    units: Object.fromEntries(withValue.map((f) => [f.id, normUnit(f.unit)])),
    source: 'Research vault: each figure quoted word for word from a saved source page',
    seriesSources: Object.fromEntries(withValue.map((f) => [f.id, cite(sources.get(f.source))])),
    asOf: today,
    placeholder: false,
    curated: true,
    x: ['value'],
    series: Object.fromEntries(withValue.map((f) => [f.id, [f.value]])),
  };

  // ---- Charts the stage can draw ----
  const charts: Dataset[] = [];
  const visuals = rows<Visual>('visuals.jsonl');
  const indexVisuals: { id: string; key: string; title: string; caption: string; chart: string; x: string[]; series: string[]; facts: string[]; core: boolean }[] = [];
  for (const v of visuals) {
    if (v.baseline && v.dataset) {
      // A themed picture of one of our own datasets: searchable, charted from data/clean.
      indexVisuals.push({ id: v.id, key: v.dataset, title: v.title, caption: v.caption ?? '', chart: CHART[v.kind] ?? 'bar', x: [], series: [], facts: [], core: true });
      continue;
    }
    if (!CHART[v.kind]) continue; // tables and waterfalls stay in the vault gallery
    let spec: Spec;
    try {
      spec = JSON.parse(fs.readFileSync(path.join(VAULT, v.spec_file), 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(spec.x) || !spec.x.length || !Array.isArray(spec.series) || !spec.series.length) continue;
    const linked = [...new Set([...(v.facts ?? []), ...spec.series.flatMap((s) => s.facts ?? [])])];
    // A chart built on a fact we dropped (low confidence, or a rate above the cap) is dropped with it.
    if (linked.some((id) => /^F\d+$/.test(id) && !kept.has(id))) continue;
    const unit = normUnit(spec.unit);
    if (spec.series.some((s) => s.values.length !== spec.x.length || s.values.some((n) => n !== null && !Number.isFinite(n)))) continue;
    if (spec.series.some((s) => s.values.some((n) => tooHighRate(`${spec.title} ${s.name}`, n, unit)))) continue;
    if (new Set(spec.x).size !== spec.x.length || new Set(spec.series.map((s) => s.name)).size !== spec.series.length) continue;
    const key = `vault_${v.id.toLowerCase()}`;
    const sourceList = [...new Set(linked.map((id) => facts.find((f) => f.id === id)).filter((f): f is Fact => !!f).map((f) => cite(sources.get(f.source))))];
    const ds: Dataset = {
      key,
      title: [spec.title, spec.subtitle].filter(Boolean).join(' · '),
      unit,
      source: spec.source || sourceList.slice(0, 3).join('; ') || 'Research vault',
      asOf: (v.added ?? today).slice(0, 10),
      placeholder: false,
      curated: true,
      x: spec.x,
      series: Object.fromEntries(spec.series.map((s) => [s.name, s.values])),
    };
    const parsed = Dataset.safeParse(ds);
    if (!parsed.success) continue;
    charts.push(parsed.data);
    indexVisuals.push({ id: v.id, key, title: ds.title, caption: v.caption ?? '', chart: CHART[v.kind], x: spec.x, series: spec.series.map((s) => s.name), facts: linked.filter((id) => kept.has(id)), core: false });
  }

  // ---- Board Q&As researched overnight (context; their figures must come from the facts) ----
  const qa = rows<VaultQa>('qa.jsonl').map((q) => ({ id: q.id, question: q.question, variants: q.variants ?? [], answer: q.answer, facts: q.facts.filter((id) => kept.has(id)), visuals: q.visuals, stance: q.stance ?? '' }));

  const index = {
    built: new Date().toISOString(),
    facts: facts.map((f) => {
      const s = sources.get(f.source);
      return { id: f.id, topic: f.topic, tags: f.tags ?? [], claim: f.claim, quote: f.quote, period: f.period ?? '', confidence: f.confidence, hasValue: typeof f.value === 'number', source: s ? { publisher: s.publisher, title: s.title, url: s.url, published: s.published ?? '' } : null };
    }),
    qa,
    visuals: indexVisuals,
  };

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'vault_facts.json'), JSON.stringify(Dataset.parse(factsDataset)) + '\n');
  for (const c of charts) fs.writeFileSync(path.join(OUT, `${c.key}.json`), JSON.stringify(c) + '\n');
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index) + '\n');
  console.log(`[evidence] ${facts.length} facts (${withValue.length} with a figure), ${charts.length} charts, ${qa.length} Q&As, ${indexVisuals.filter((v) => v.core).length} views of our own data → data/clean/vault/`);
}

main();
