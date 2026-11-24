import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Parses a Bloomberg FA "Financial Statement Analysis" PDF into rows.
 * pdftotext -layout keeps columns aligned, so each number is assigned to the period column whose
 * date ("For the period ending") right edge is nearest to the number's right edge.
 */
export type Row = { template: string; section: string; label: string; values: Record<string, number> };
export type Report = { ticker: string; currency: string; periodicity: string; rows: Row[] };

const PERIOD = /(?:Original|Restated|Preliminary|Estimate):(\d{4}(?: Q[1-4]| A)?)|Current(?:\/LTM)?/g;
const DATE = /\d{4}-\d{1,2}-\d{1,2}/g;
const NUM = /(?<=\s\s)-?[\d,]*\.?\d+(?=\s|$)/g;

/**
 * `plain`: the text is only searched with regexes (DES and WACC snapshots), so if pdftotext (poppler) is not installed,
 * macOS's own PDFKit is used instead. Tables (FA reports) always need pdftotext, which keeps the columns aligned.
 */
export function pdfText(file: string, opts: { plain?: boolean } = {}): string {
  try {
    return execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (e: any) {
    if (!opts.plain || e?.code !== 'ENOENT') throw e;
    return execFileSync('swift', [fileURLToPath(new URL('./pdf-text.swift', import.meta.url)), file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  }
}

/** "2026 Q3" → "FY26 Q3", "2026 A" / "2026" → "FY26", "Current/LTM" → "LTM" */
export function periodName(raw: string): string {
  if (raw === 'Current/LTM') return 'LTM';
  if (raw === 'Current') return 'Current';
  const m = raw.match(/(\d{4})(?: (Q[1-4]))?/)!;
  return `FY${m[1].slice(2)}${m[2] ? ' ' + m[2] : ''}`;
}

export function parseReport(text: string): Report {
  const head = text.slice(0, 2000);
  const ticker = head.match(/Ticker: (.+?) Equity/)?.[1].trim() ?? '?';
  const currency = head.match(/Currency: ([A-Z]{3})/)?.[1] ?? '?';
  const periodicity = head.match(/Periodicity: (\w+)/)?.[1] ?? '?';
  const rows = new Map<string, Row>();
  let template = '';

  for (const page of text.split('\f')) {
    const lines = page.split('\n');
    const dateIdx = lines.findIndex((l) => l.startsWith('For the period ending'));
    if (dateIdx < 1) continue;

    // The period line sits just above the dates. Some cells are "Estimate:..." and some layouts
    // wrap, so take period names in order and pair them with dates in order.
    const periodLine = lines[dateIdx - 1];
    const periods = [...periodLine.matchAll(PERIOD)].map((m) => periodName(m[1] ?? m[0]));
    const dateEdges = [...lines[dateIdx].matchAll(DATE)].map((m) => m.index! + m[0].length);
    // Pair dates with periods by index only when the counts match; otherwise use the period labels' own
    // right edges, so a column with no date can never shift every later value one period over.
    const periodEdges = [...periodLine.matchAll(PERIOD)].map((m) => m.index! + m[0].length);
    const edges = dateEdges.length === periods.length ? dateEdges : periodEdges;
    if (periods.length === 0) continue;

    const title = lines.slice(0, dateIdx - 1).reverse().find((l) => l.trim() && !/Ticker:|Filing:|Financial Statement Analysis/.test(l));
    if (title && !NUM.test(title)) template = title.trim();
    NUM.lastIndex = 0;

    let section = '';
    for (const line of lines.slice(dateIdx + 1)) {
      if (/^This report may not|^Bloomberg ®/.test(line)) break;
      const nums = [...line.matchAll(NUM)];
      const firstNum = nums[0]?.index ?? line.length;
      const label = line.slice(0, firstNum).trim();
      if (!nums.length) {
        if (label && !line.startsWith(' ')) section = label;
        continue;
      }
      if (!label) continue;
      const key = `${template}|${section}|${label}`;
      const row = rows.get(key) ?? { template, section, label, values: {} };
      for (const n of nums) {
        const right = n.index! + n[0].length;
        let best = 0;
        edges.forEach((e, i) => Math.abs(e - right) < Math.abs(edges[best] - right) && (best = i));
        if (Math.abs(edges[best] - right) <= 6) row.values[periods[best]] = Number(n[0].replace(/,/g, ''));
      }
      rows.set(key, row);
    }
  }
  return { ticker, currency, periodicity, rows: [...rows.values()] };
}

/** Find one row. Throws if missing or ambiguous, so the pipeline fails loudly instead of charting the wrong thing. */
export function pick(r: Report, q: { template?: string | RegExp; section?: string | RegExp; label: string | RegExp }): Row {
  const m = (v: string, p?: string | RegExp) => p === undefined || (typeof p === 'string' ? v === p : p.test(v));
  const hits = r.rows.filter((row) => m(row.template, q.template) && m(row.section, q.section) && m(row.label, q.label));
  if (hits.length !== 1) throw new Error(`${r.ticker}: ${hits.length} rows match ${JSON.stringify({ ...q, label: String(q.label), template: String(q.template), section: String(q.section) })}`);
  return hits[0];
}

// CLI: npx tsx scripts/fa-parse.ts <pdf> [filter] → prints rows for exploring
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = parseReport(pdfText(process.argv[2]));
  const f = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
  console.log(r.ticker, r.currency, r.periodicity, r.rows.length, 'rows');
  for (const row of r.rows) {
    const line = `${row.template} | ${row.section} | ${row.label}`;
    if (!f || f.test(line)) console.log(line, JSON.stringify(row.values).slice(0, 160));
  }
}
