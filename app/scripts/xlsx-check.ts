/**
 * Gate for data/model/NVDA_DCF.xlsx. Recalculates it from scratch with LibreOffice (cached answers stripped first)
 * and compares with data/clean/model_*.json. Also flips the scenario and WACC switches in throwaway copies.
 * Run: npx tsx scripts/xlsx-check.ts   Exit code 1 on any mismatch.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type ExcelJS from 'exceljs';
import { ALLOWED, AT, clean, load, OUT, SHEETS, shown, SOFFICE, soffice } from './xlsx.ts';

const TOL = 0.01;
let bad = 0;
const ok = (pass: boolean, msg: string) => { if (!pass) bad++; console.log(`  ${pass ? '✓' : '✗'} ${msg}`); };
const close = (label: string, got: unknown, want: number, unit = '$') => ok(typeof got === 'number' && Math.abs(got - want) <= TOL, `${label.padEnd(44)} ${typeof got === 'number' ? got.toFixed(2) : String(got)}  app ${want.toFixed(2)} ${unit}`);
const cellsOf = (ws: ExcelJS.Worksheet) => { const out: ExcelJS.Cell[] = []; ws.eachRow((r) => r.eachCell((c) => { if (!c.isMerged || c.master === c) out.push(c); })); return out; };
const at = (wb: ExcelJS.Workbook, sheet: string, ref: string) => shown(wb.getWorksheet(sheet)!.getCell(ref));
const colNo = (s: string) => [...s].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
/** A formula copied along a row or down a column is the same idea: rewrite cell references relative to where it sits. */
const idea = (c: ExcelJS.Cell) => c.formula!.replace(/(\$?)([A-Z]{1,2})(\$?)(\d+)/g, (_, ca, col, ra, row) => `R${ra ? row : `[${Number(row) - Number(c.row)}]`}C${ca ? col : `[${colNo(col) - Number(c.col)}]`}`);
const num = (c: ExcelJS.Cell) => typeof c.value === 'number' || c.value instanceof Date;

const t0 = Date.now();
if (!fs.existsSync(OUT)) { console.error('No workbook. Run: npm run xlsx'); process.exit(1); }
const file = await load(OUT);

console.log('Shape');
ok(file.worksheets.map((w) => w.name).join('|') === SHEETS.join('|'), `exactly five sheets: ${file.worksheets.map((w) => w.name).join(', ')}`);
ok(file.worksheets.every((w) => w.state === 'visible' && ![...Array(w.columnCount)].some((_, i) => w.getColumn(i + 1).hidden) && !cellsOf(w).some((c) => w.getRow(Number(c.row)).hidden)), 'no hidden sheets, columns or rows');
ok(!((file as any).definedNames?.model ?? []).some((n: any) => !/Print_/.test(n.name)), 'no named ranges');
let total = 0;
const strange: string[] = [], array: string[] = [], colour: string[] = [], empty: string[] = [];
for (const ws of file.worksheets) for (const c of cellsOf(ws)) {
  const blue = c.font?.color?.argb === 'FF0000FF';
  if (c.formula) {
    total++;
    const allowed = ws.name === 'Start here' ? [...ALLOWED, 'TEXT'] : ALLOWED;
    for (const m of c.formula.replace(/"[^"]*"/g, '').matchAll(/([A-Z][A-Z.]*)\(/g)) if (!allowed.includes(m[1])) strange.push(`${ws.name}!${c.address} ${m[1]}`);
    if ((c.model as any).shareType || /^\{/.test(c.formula)) array.push(`${ws.name}!${c.address}`);
    if (c.result === undefined || c.result === null) empty.push(`${ws.name}!${c.address}`);
    if (blue) colour.push(`${ws.name}!${c.address} formula in blue`);
  } else if (num(c) && !blue && ws.name !== 'Checks') colour.push(`${ws.name}!${c.address} typed number not blue`);
}
ok(!strange.length, `only ${ALLOWED.join(', ')} and + − × ÷ ^ (TEXT on Start here) ${strange.join('; ')}`);
ok(!array.length, `no array formulas or data tables ${array.join('; ')}`);
ok(!colour.length, `every typed number is blue, every formula is not ${colour.join('; ')}`);
ok(!empty.length, `${total} formulas, all with saved answers ${empty.join('; ')}`);
const dcf = file.worksheets.find((w) => w.name === 'DCF')!;
const dcfF = cellsOf(dcf).filter((c) => c.formula);
const main = dcfF.filter((c) => Number(c.row) <= 23);
const ideas = (cs: ExcelJS.Cell[]) => new Set(cs.map(idea)).size;
ok(ideas(main) <= 25, `DCF, scenario on show: ${ideas(main)} different formulas to learn (${main.length} cells once copied across); limit 25`);
console.log(`    DCF sheet in all: ${ideas(dcfF)} different formulas, ${dcfF.length} cells`);

// ---------- recalculate: the file as it is, three scenarios, the other discount rate, all in one LibreOffice launch ----------
const cases: Record<string, (wb: ExcelJS.Workbook) => void> = {
  asis: () => {},
  ...Object.fromEntries([1, 2, 3].map((n) => [`scenario${n}`, (wb: ExcelJS.Workbook) => { wb.getWorksheet('Inputs')!.getCell(AT.scenario).value = n; }])),
  wacc2: (wb) => { wb.getWorksheet('Inputs')!.getCell(AT.waccSwitch).value = 2; },
};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nvda-xlsx-check-'));
const calc: Record<string, ExcelJS.Workbook> = {};
let live = Boolean(SOFFICE);
try {
  if (live) {
    fs.mkdirSync(path.join(tmp, 'out'));
    const files: string[] = [];
    for (const [name, change] of Object.entries(cases)) {
      const wb = await load(OUT);
      change(wb);
      for (const ws of wb.worksheets) for (const c of cellsOf(ws)) if (c.formula) c.value = { formula: c.formula } as ExcelJS.CellFormulaValue;
      files.push(path.join(tmp, `${name}.xlsx`));
      await wb.xlsx.writeFile(files.at(-1)!);
    }
    const out = soffice(files, path.join(tmp, 'out'), 30_000);
    for (const [i, name] of Object.keys(cases).entries()) calc[name] = await load(out[i]);
  }
} catch (e) {
  live = false;
  console.warn(`! ${(e as Error).message}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
if (!live) console.warn('! WARNING: LibreOffice is not available. Comparing the SAVED answers only; the formulas were NOT recalculated and the switches were NOT tested.');
const wb = live ? calc.asis : file;

const V = clean('model_valuation');
const P = clean('model_revenue_paths');
const S = clean('model_sensitivity');
const price = V.series['Value per share'][V.x.indexOf('Share price today')]!;
const want = (n: string) => V.series['Value per share'][V.x.indexOf(`${n} case`)]!;
const NAMES = ['Bear', 'Base', 'Bull'] as const;
const rowOf = (n: string) => AT.table[n.toLowerCase() as keyof typeof AT.table];

console.log('Same answers as data/clean/model_*.json');
for (const n of NAMES) {
  close(`${n} value per share`, at(wb, 'DCF', `C${rowOf(n)}`), want(n));
  close(`${n} value vs price`, (at(wb, 'DCF', `E${rowOf(n)}`) as number) * 100, (want(n) / price - 1) * 100, '%');
}
close('Share price', at(wb, 'DCF', 'C21'), price);
let gridBad = 0;
Object.entries(S.series).forEach(([, vals], j) => vals.forEach((v, i) => { if (Math.abs((at(wb, 'Sensitivity', `${AT.grid.cols[i]}${AT.grid.top + j}`) as number) - v!) > TOL) gridBad++; }));
ok(gridBad === 0, `Sensitivity: all ${S.x.length * Object.keys(S.series).length} cells match ${gridBad ? `(${gridBad} do not)` : ''}`);

console.log('Inside the workbook');
const errors = wb.worksheets.flatMap((ws) => cellsOf(ws).filter((c) => { const v = shown(c) as any; return v?.error || (typeof v === 'string' && /^(#|Err:)/.test(v)) || (c.formula && typeof v === 'number' && !Number.isFinite(v)); }).map((c) => `${ws.name}!${c.address}`));
ok(!errors.length, `no error cells ${errors.join(' ')}`);
const tf = cellsOf(wb.getWorksheet('Checks')!).filter((c) => c.formula && typeof shown(c) === 'boolean');
ok(tf.length >= 20 && tf.every((c) => shown(c) === true), `Checks sheet: ${tf.filter((c) => shown(c) === true).length} of ${tf.length} TRUE`);
if (live) {
  const stale = file.worksheets.flatMap((ws) => cellsOf(ws).filter((c) => c.formula).filter((c) => { const a = shown(c), b = at(wb, ws.name, c.address); return typeof a === 'number' ? Math.abs(a - (b as number)) > 1e-6 : a !== b; }).map((c) => `${ws.name}!${c.address}`));
  ok(!stale.length, `saved answers equal a fresh recalculation ${stale.slice(0, 5).join(' ')}`);

  console.log('Switches');
  NAMES.forEach((n, i) => {
    const w = calc[`scenario${i + 1}`];
    close(`Scenario switch ${i + 1} shows ${n}`, at(w, 'DCF', AT.perShare), want(n));
    const revs = ['C', 'D', 'E', 'F', 'G'].map((c) => at(w, 'DCF', `${c}${AT.mainRow.revenue}`) as number);
    ok(revs.every((r, k) => Math.abs(r - P.series[n][P.x.indexOf(`FY${28 + k}`)]!) <= TOL), `  revenue FY28 to FY32 matches model_revenue_paths (${n})`);
  });
  const alt = `${Math.round((at(wb, 'Inputs', 'B17') as number) * 1000) / 10}%`;
  const g = `Terminal growth ${Math.round((at(wb, 'Inputs', 'B24') as number) * 1000) / 10}%`;
  close(`WACC switch 2 (${alt}, ${g.toLowerCase()})`, at(calc.wacc2, 'DCF', AT.perShare), S.series[g]?.[S.x.indexOf(alt)] ?? NaN);
}
console.log(`${bad ? `FAIL: ${bad} problem(s)` : live ? 'PASS' : 'PASS on saved answers only (not recalculated)'} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(bad ? 1 : 0);
