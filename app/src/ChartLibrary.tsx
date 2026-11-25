import { useMemo, useState } from 'react';
import type { ChartSpec, ClientMsg, Dataset, Slide, SpineSlide } from '../shared/schema.ts';

/**
 * Every chart we can show, one click from the stage: each chart already in the script (same spec, so it is known to
 * render well), then every other dataset in data/clean (all DCF steps, reverse DCF, three rates, peers, ESG…).
 * The data is looked up by key as always; nothing here types a number.
 */
type Item = { key: string; title: string; chart: ChartSpec; from: string };

const TIME = /^(FY|Q[1-4]|\d{4})/;
/** Stage titles may not contain typed numbers (except years and FY labels): drop them from dataset titles. */
export const libTitle = (t: string) =>
  t.replace(/\s*\([^)]*\d[^)]*\)/g, '')
    .replace(/(^|\s)(?!(?:19|20)\d\d\b)(?!FY\d)[\w.-]*\d[\w.%-]*,?/g, '$1')
    .replace(/,?\s+(out of|of|at)\s*$/i, '')
    .replace(/\s{2,}/g, ' ').trim();
export function generic(d: Dataset): ChartSpec {
  const names = Object.keys(d.series);
  const unitOf = (n: string) => d.units?.[n] ?? d.unit;
  const same = names.filter((n) => unitOf(n) === unitOf(names[0]));
  const timeline = d.x.length >= 6 && d.x.every((x) => TIME.test(x));
  if (names.length >= 3 && !timeline) return { type: 'bar', display: 'table', datasetKey: d.key, series: names.slice(0, 5) };
  return { type: timeline ? 'line' : 'bar', datasetKey: d.key, series: same.slice(0, timeline ? 3 : 2), ...(d.x.includes('NVIDIA') ? { highlight: 'NVIDIA' } : {}) };
}

export function ChartLibrary({ spine, datasets, connected, send }: { spine: SpineSlide[]; datasets: Record<string, Dataset>; connected: boolean; send: (m: ClientMsg) => void }) {
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const out: Item[] = [];
    const seen = new Set<string>();
    for (const s of spine) {
      if (!s.chart || !datasets[s.chart.datasetKey]) continue;
      const id = `${s.chart.datasetKey}|${s.chart.series.join(',')}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ key: `lib-${s.id}`, title: libTitle(datasets[s.chart.datasetKey].title), chart: s.chart, from: `script: ${s.id}` });
    }
    const used = new Set(out.map((i) => i.chart.datasetKey));
    for (const d of Object.values(datasets).sort((a, b) => a.key.localeCompare(b.key))) {
      if (used.has(d.key) || !d.x.length || !Object.keys(d.series).length) continue;
      out.push({ key: `lib-${d.key}`, title: libTitle(d.title), chart: generic(d), from: d.key });
    }
    return out;
  }, [spine, datasets]);
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = items.filter((i) => words.every((w) => `${i.title} ${i.from} ${i.chart.series.join(' ')}`.toLowerCase().includes(w)));

  const show = (i: Item) => {
    const slide: Slide = { id: i.key, layout: 'chart', title: i.title, bullets: [], chart: i.chart, sources: [] };
    send({ type: 'push', slide });
  };

  return (
    <details className="op-library">
      <summary className="label">Chart library ({items.length}): any dataset on stage in one click</summary>
      <input type="search" placeholder="Search: dcf, wacc, reverse, emissions, peers…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>
        {shown.map((i) => (
          <li key={i.key}>
            <button disabled={!connected} onClick={() => show(i)}>Show</button>
            <span>{i.title}</span>
            <span className="op-meta">{i.from} · {i.chart.display === 'table' ? 'table' : i.chart.type}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
