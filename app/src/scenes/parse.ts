/**
 * Reading a scene's picture from the points the speaker says, so scenes follow script edits. Pure functions (no CSS,
 * no React), so they can be tested in Node.
 */

export type Group = { label: string; names: string[] };

/** "Label: A, B and C, which …" → { label, names }. Not a group (no label or no names) → null. */
export function parseGroup(point: string): Group | null {
  const m = point.match(/^([^:]{2,40}):\s*(.+)$/);
  if (!m) return null;
  const list = m[2].split(/,\s*which\b|\s+\(|,\s*pending\b|;|\.\s/)[0];
  const names = list
    .split(/,\s*|\s+and\s+/)
    .map((n) => n.trim().replace(/\.$/, ''))
    .filter((n) => n && n.length <= 28 && /^[A-Z0-9]/.test(n))
    .slice(0, 5);
  return names.length ? { label: m[1].trim(), names } : null;
}

export type Buyer = { label: string; detail: string };

export function parseBuyer(point: string): Buyer | null {
  const m = point.match(/^([^:]{2,32}):\s*(.+)$/);
  return m ? { label: m[1].trim(), detail: m[2].trim() } : null;
}

export function parseConcentration(point: string): { pct: number; text: string; caption: string } | null {
  if (!/customer/i.test(point)) return null;
  const m = point.match(/(\d+(?:\.\d+)?)%/);
  if (!m) return null;
  const who = point.match(/^(.*?)\s+(?:still\s+)?(?:made|make|makes)\s+up/i)?.[1];
  return { pct: Math.min(100, Number(m[1])), text: `${m[1]}%`, caption: who ? `${who}: share of revenue` : "share of revenue" };
}
