/**
 * Writes data/model/NVDA_DCF.xlsx: the valuation model as a spreadsheet with live formulas.
 * Same inputs as model.ts (Bloomberg PDFs, data/clean, data/model/assumptions.json). No figure is typed in here.
 * Two passes: build → recalculate with LibreOffice → write the answers back beside the formulas,
 * so the file opens with numbers in any viewer.
 * Run: npm run xlsx (from app/). Check: npx tsx scripts/xlsx-check.ts
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ExcelJS from 'exceljs';
import { Dataset } from '../shared/schema.ts';
import { pdfText } from './fa-parse.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
export const OUT = path.join(ROOT, 'data/model/NVDA_DCF.xlsx');
export const SHEETS = ['Start here', 'Inputs', 'DCF', 'Sensitivity', 'Checks'];
/** Functions a first-year student knows. TEXT is for the sentences on Start here only. */
export const ALLOWED = ['SUM', 'IF', 'CHOOSE', 'MAX', 'ABS', 'AVERAGE', 'ROUND'];
export const clean = (key: string): Dataset => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/clean', `${key}.json`), 'utf8'));

// ---------- where things are (used by xlsx-check.ts too) ----------
export const AT = {
  scenario: 'B6', waccSwitch: 'B7', // Inputs
  mainRow: { years: 5, growth: 6, revenue: 7, margin: 8, fcf: 9, factor: 10, pv: 11 }, // DCF, C..G
  ev: 'C16', perShare: 'C20', // DCF, the scenario on show
  table: { bear: 31, base: 32, bull: 33 }, // DCF, all three scenarios: B EV, C value per share, E vs price
  grid: { top: 14, cols: ['B', 'C', 'D', 'E', 'F'] }, // Sensitivity
} as const;

// ---------- LibreOffice ----------
export const SOFFICE = ['/opt/homebrew/bin/soffice', '/Applications/LibreOffice.app/Contents/MacOS/soffice', '/usr/bin/soffice'].find((p) => fs.existsSync(p));

/** Recalculates workbooks in ONE LibreOffice launch. Returns the recalculated copies' paths. */
export function soffice(files: string[], outDir: string, timeout = 60_000, to = 'xlsx'): string[] {
  if (!SOFFICE) throw new Error('LibreOffice (soffice) is not installed, so the workbook cannot be calculated. Install LibreOffice, then rerun.');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'soffice-'));
  try {
    const r = spawnSync(SOFFICE, [`-env:UserInstallation=file://${profile}`, '--headless', '--convert-to', to, '--outdir', outDir, ...files], { timeout, killSignal: 'SIGKILL', encoding: 'utf8' });
    const out = files.map((f) => path.join(outDir, path.basename(f).replace(/\.xlsx$/, `.${to}`)));
    const missing = out.filter((f) => !fs.existsSync(f));
    if (r.error || missing.length) throw new Error(`LibreOffice could not calculate the workbook: ${r.error?.message ?? r.stderr}`);
    return out;
  } finally {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

/** The value a viewer would show: formula result, or the constant. (exceljs drops 0 and FALSE from cell.value, so use .result) */
export const shown = (c: ExcelJS.Cell): unknown => (c.formula ? c.result : c.value);
export async function load(file: string): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  return wb;
}

// ---------- inputs, read from the same places as model.ts ----------
function inputs() {
  const A = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/model/assumptions.json'), 'utf8'));
  const raw = (f: string) => pdfText(path.join(ROOT, 'data/bloomberg-raw', f));
  const des = raw('nvda_des_2026-11-20.pdf');
  const wp = raw('nvda_wacc_2026-11-20.pdf');
  const num = (t: string, re: RegExp) => {
    const m = t.match(re);
    if (!m) throw new Error(`Not found in Bloomberg export: ${re}`);
    return Number(m[1].replace(/,/g, ''));
  };
  const fc = clean('nvda_revenue_forecast');
  const rev = clean('nvda_revenue_annual');
  const fcf = clean('nvda_fcf_annual');
  const get = (d: Dataset, s: string, x: string) => {
    const v = d.series[s][d.x.indexOf(x)];
    if (v == null) throw new Error(`${d.key}: no ${s} for ${x}`);
    return v;
  };
  const csv = fs.readFileSync(path.join(ROOT, 'data/model/valuation.csv'), 'utf8').split('\n');
  const evs = csv.filter((l) => l.startsWith('Enterprise value')).map((l) => Number(l.split(',')[1]));
  const names = csv.filter((l) => /^Value per share \(USD\) \[/.test(l)).map((l) => l.match(/\[(\w+)\]/)![1]);
  const csvOf = (label: string) => Number(csv.find((l) => l.startsWith(label))!.split(',')[1]);
  const marginYears: string[] = A.fcfMarginYears.value;
  for (const n of ['bear', 'base', 'bull']) if (A.scenarios[n].label.includes('"')) throw new Error('Scenario labels cannot contain double quotes.');
  if (marginYears.length !== 3) throw new Error('The sheet lays out exactly three margin years.');
  // Judgement alternative, not data: the model's first discount rate (docs/PROGRESS.md), or the team's own number if one is set.
  const alt = typeof A.wacc.value === 'number' ? A.wacc.value : 12;
  const sens = clean('model_sensitivity');
  if (!sens.x.includes(`${alt}%`)) throw new Error(`model_sensitivity has no ${alt}% column to check the WACC switch against.`);
  return {
    A, alt, sens, marginYears,
    waccSwitch: A.wacc.value === 'bloomberg' ? 1 : 2,
    asOf: clean('model_valuation').asOf!,
    price: (A.priceOverride.value ?? num(des, /Last Px\s+USD\/([\d.]+)/)) as number,
    shares: num(des, /Curr Shares Out\s+([\d.]+)B/),
    mktCap: num(des, /~ Mkt Cap\s+([\d,.]+)B/),
    ev: num(des, /Curr EV\s+([\d,.]+)B/),
    bbgWacc: num(wp, /WACC\s+([\d.]+)%/),
    eqW: num(wp, /\n\s*Equity\s+([\d.]+)%/), eqC: num(wp, /\n\s*Equity\s+[\d.]+%\s+([\d.]+)%/),
    debtW: num(wp, /\n\s*Debt\s+([\d.]+)%/), debtC: num(wp, /\n\s*Debt\s+[\d.]+%\s+([\d.]+)%/),
    rev27: get(fc, 'Consensus estimate', 'FY27'), rev28: get(fc, 'Consensus estimate', 'FY28'),
    fcfs: marginYears.map((y) => get(fcf, 'Free cash flow', y)), revs: marginYears.map((y) => get(rev, 'Revenue', y)),
    fcAsOf: fc.asOf!, fcfAsOf: fcf.asOf!,
    app: {
      value: clean('model_valuation').series['Value per share'] as number[], valueX: clean('model_valuation').x,
      paths: clean('model_revenue_paths'), implied: clean('model_implied_growth').series['Growth per year'][1]!,
      ev: Object.fromEntries(names.map((n, i) => [n, evs[i]])) as Record<string, number>,
      netCash: csvOf('Net cash'), margin: csvOf('Base FCF margin'),
    },
  };
}

// ---------- look ----------
const GREEN = 'FF3F6B00', PALE = 'FFEAF3DA', BLUE = 'FF0000FF', GREY = 'FF6B6B6B', LINE = 'FFD0D0D0';
const PCT = '0.0%', BN = '#,##0.0', USD = '$#,##0.00', DAY = 'd mmm yyyy';
type V = string | number | boolean | Date;
type Opt = { fmt?: string; bold?: boolean; size?: number; color?: string; fill?: string; align?: 'left' | 'center' | 'right'; wrap?: boolean; italic?: boolean; top?: boolean; indent?: number };

function build(answers?: ExcelJS.Workbook): ExcelJS.Workbook {
  const I = inputs();
  const wb = new ExcelJS.Workbook();
  wb.creator = 'NVDA student pitch team';
  wb.title = 'NVIDIA discounted cash flow model';
  wb.created = wb.modified = new Date(`${I.asOf}T00:00:00Z`);
  wb.calcProperties.fullCalcOnLoad = true;

  const sheet = (name: string, widths: number[], zoom = 100) => {
    const ws = wb.addWorksheet(name, {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 1, horizontalCentered: true, margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 } },
      headerFooter: { oddFooter: '&L&8NVIDIA DCF, valuation date ' + I.asOf + '&C&8&A&R&8Page &P of &N' },
    });
    widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
    const put = (ref: string, v: V | { f: string } | null, o: Opt = {}) => {
      const c = ws.getCell(ref);
      if (v !== null && typeof v === 'object' && 'f' in v) {
        const a = answers ? shown(answers.getWorksheet(name)!.getCell(ref)) : undefined;
        if (answers && (a === undefined || a === null)) throw new Error(`No calculated value for ${name}!${ref}`);
        c.value = { formula: v.f, result: a as any } as ExcelJS.CellFormulaValue;
      } else c.value = v as ExcelJS.CellValue;
      c.font = { name: 'Arial', size: o.size ?? 10, bold: o.bold, italic: o.italic, color: { argb: o.color ?? 'FF000000' } };
      c.alignment = { vertical: 'middle', horizontal: o.align, wrapText: o.wrap, indent: o.indent };
      if (o.fmt) c.numFmt = o.fmt;
      if (o.fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: o.fill } };
      if (o.top) c.border = { top: { style: 'thin', color: { argb: 'FF000000' } } };
      return c;
    };
    const api = {
      ws, put,
      input: (ref: string, v: V, fmt?: string, o: Opt = {}) => put(ref, v, { fmt, color: BLUE, align: 'right', ...o }),
      calc: (ref: string, f: string, fmt?: string, o: Opt = {}) => put(ref, { f }, { fmt, align: 'right', ...o }),
      note: (ref: string, t: string) => put(ref, t, { size: 9, italic: true, color: GREY, wrap: true, align: 'left', indent: 1 }),
      title: (t: string, sub: string) => {
        put('A1', t, { size: 16, bold: true, color: GREEN });
        put('A2', sub, { color: GREY });
        ws.getRow(1).height = 26;
      },
      header: (row: number, labels: string[], o: Opt = {}) => labels.forEach((l, i) => put(`${'ABCDEFGHIJK'[i]}${row}`, l, { bold: true, color: GREEN, fill: PALE, align: i === 0 || l.length > 15 ? 'left' : 'right', indent: i && l.length > 15 ? 1 : 0, ...o })),
      /** faint rules so the eye can follow a row across to its note */
      rules: (from: number, to: number, lastCol: string) => {
        for (let r = from; r <= to; r++) for (let c = 1; c <= ws.getColumn(lastCol).number; c++) { const x = ws.getCell(r, c); x.border = { ...x.border, bottom: { style: 'hair', color: { argb: LINE } } }; }
      },
      finish: (freezeRow: number, lastRef: string) => {
        // zoomScaleNormal too: without it Excel ignores zoomScale in normal view
        ws.views = [{ state: 'frozen', xSplit: 0, ySplit: freezeRow, showGridLines: false, zoomScale: zoom, zoomScaleNormal: zoom, activeCell: 'A1' }];
        ws.pageSetup.printArea = `A1:${lastRef}`;
      },
    };
    return api;
  };

  const start = sheet('Start here', [40, 21, 21, 21, 21, 21]);
  buildInputs(sheet('Inputs', [40, 13, 9.5, 9.5, 9.5, 9.5, 9.5, 8, 37, 12, 62], 90), I);
  buildDcf(sheet('DCF', [34, 13, 12, 12, 12, 12, 12, 80], 90), I);
  buildSensitivity(sheet('Sensitivity', [34, 13, 13, 13, 13, 13, 62]), I);
  buildChecks(sheet('Checks', [50, 15, 15, 12, 10, 76]), I);
  buildStart(start, I);
  return wb;
}
type Sheet = { ws: ExcelJS.Worksheet; put: (r: string, v: any, o?: Opt) => ExcelJS.Cell; input: (r: string, v: V, fmt?: string, o?: Opt) => ExcelJS.Cell; calc: (r: string, f: string, fmt?: string, o?: Opt) => ExcelJS.Cell; note: (r: string, t: string) => ExcelJS.Cell; title: (t: string, s: string) => void; header: (row: number, l: string[], o?: Opt) => void; rules: (from: number, to: number, last: string) => void; finish: (freeze: number, last: string) => void };
type In = ReturnType<typeof inputs>;
const FY = ['C', 'D', 'E', 'F', 'G'];
const YEARS = ['FY28', 'FY29', 'FY30', 'FY31', 'FY32'];

// ---------- Inputs ----------
function buildInputs(s: Sheet, I: In) {
  const { A } = I;
  s.title('Inputs', 'Blue = a choice or a Bloomberg figure you can change. Black = calculated. Every other sheet reads from here.');
  const head = (row: number, t: string, mid: string[] = []) => s.header(row, [t, mid[0] ?? '', ...Array.from({ length: 5 }, (_, i) => mid[i + 1] ?? ''), '', '', '', '']);
  const line = (row: number, label: string, unit: string, src: string, date: string, say: string) => {
    s.put(`A${row}`, label);
    s.put(`H${row}`, unit, { color: GREY, align: 'center' });
    s.put(`I${row}`, src, { size: 9, wrap: true });
    s.put(`J${row}`, date, { size: 9, align: 'center' });
    s.note(`K${row}`, say);
    s.ws.getRow(row).height = 4 + 12 * Math.max(1, Math.ceil(say.length / 74), Math.ceil(src.length / 42));
    s.rules(row, row, 'K');
  };
  const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
  const bbg = I.asOf;
  const team = 'Team choice (assumptions.json)';
  s.header(4, ['Assumption', 'Value', '', '', '', '', '', '', '', '', '']);
  for (const [c, t, align, indent] of [['H', 'Unit', 'center', 0], ['I', 'Source', 'left', 0], ['J', 'Date', 'center', 0], ['K', 'What this row says', 'left', 1]] as const) s.put(`${c}4`, t, { bold: true, color: GREEN, fill: PALE, align, indent });

  head(5, 'Switches');
  s.input('B6', 2).dataValidation = { type: 'list', allowBlank: false, formulae: ['"1,2,3"'], showErrorMessage: true, error: '1 = bear, 2 = base, 3 = bull' };
  line(6, 'Scenario to show on the DCF sheet', '1/2/3', 'You choose', '', '1 = bear, 2 = base, 3 = bull. All three are always in the small table on the DCF sheet.');
  s.input('B7', I.waccSwitch).dataValidation = { type: 'list', allowBlank: false, formulae: ['"1,2"'], showErrorMessage: true, error: '1 = Bloomberg, 2 = our older rate' };
  line(7, 'Discount rate to use', '1/2', 'You choose', '', `1 = Bloomberg’s figure (our headline), 2 = the ${I.alt}% our first model used.`);
  for (const r of ['B6', 'B7']) s.ws.getCell(r).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7CC' } };

  head(8, 'The company today');
  s.input('B9', day(I.asOf), DAY); line(9, 'Valuation date', 'date', 'Date of the Bloomberg exports', bbg, 'The day we are valuing the share.');
  s.input('B10', I.price, USD); line(10, 'Share price', 'USD', A.priceOverride.value ? 'Team override (assumptions.json)' : 'Bloomberg DES', bbg, 'What one share costs today.');
  s.input('B11', I.shares, '0.0'); line(11, 'Shares outstanding', 'bn', 'Bloomberg DES', bbg, 'How many shares the company is split into.');
  s.input('B12', I.mktCap, BN); line(12, 'Market cap', 'USD bn', 'Bloomberg DES', bbg, 'What all the shares cost together.');
  s.input('B13', I.ev, BN); line(13, 'Enterprise value (EV)', 'USD bn', 'Bloomberg DES', bbg, 'What the business costs once you take off its cash and add its debt.');
  s.calc('B14', 'B12-B13', BN); line(14, 'Net cash', 'USD bn', 'Market cap − EV', bbg, 'Cash left over after paying off all debt; it belongs to shareholders.');

  head(15, 'Discount rate and long-run growth');
  s.input('B16', I.bbgWacc / 100, PCT); line(16, 'WACC, Bloomberg', '%', 'Bloomberg WACC screen', bbg, 'The yearly return investors need for this risk; higher means future cash is worth less today.');
  s.input('B17', I.alt / 100, PCT); line(17, 'WACC, our older alternative', '%', 'Team choice (first model run, docs/PROGRESS.md)', bbg, 'The rate we used before we had Bloomberg’s. Kept so you can see how much the rate matters.');
  s.calc('B18', 'IF(B7=1,B16,B17)', PCT, { bold: true }); line(18, 'WACC used', '%', 'Follows the switch in B7', '', 'The rate the DCF uses.');
  s.input('B19', I.eqC / 100, PCT); line(19, 'Cost of equity', '%', 'Bloomberg WACC screen', bbg, 'The return shareholders need.');
  s.input('B20', I.eqW / 100, PCT); line(20, 'Share of funding from equity', '%', 'Bloomberg WACC screen', bbg, 'Almost all of NVIDIA is paid for by shareholders.');
  s.input('B21', I.debtC / 100, PCT); line(21, 'Cost of debt', '%', 'Bloomberg WACC screen', bbg, 'The rate lenders need.');
  s.input('B22', I.debtW / 100, PCT); line(22, 'Share of funding from debt', '%', 'Bloomberg WACC screen', bbg, 'Very little of NVIDIA is paid for by lenders.');
  s.calc('B23', 'B19*B20+B21*B22', PCT); line(23, 'Cross-check: WACC from its parts', '%', 'Cost × share, added up', '', `Should match B16. Bloomberg’s export stops at the ${I.eqC}% cost of equity: it has no risk-free rate or beta, so we do not guess them.`);
  s.input('B24', A.terminalGrowth.value / 100, PCT); line(24, 'Long-run growth after FY32', '%', team, bbg, 'How fast cash grows forever after FY32: about as fast as the world economy.');

  head(25, 'Revenue starting point');
  s.input('B26', I.rev27, BN); line(26, 'FY27 revenue, analyst consensus', 'USD bn', 'Bloomberg FA (Earnings)', I.fcAsOf, 'The average analyst forecast for the year ending January 2027.');
  s.input('B27', I.rev28, BN); line(27, 'FY28 revenue, analyst consensus', 'USD bn', 'Bloomberg FA (Earnings)', I.fcAsOf, 'The average analyst forecast for the year ending January 2028.');

  head(28, 'Cash margin', ['Average', ...I.marginYears]);
  ['C', 'D', 'E'].forEach((c, i) => {
    s.input(`${c}29`, I.fcfs[i], BN);
    s.input(`${c}30`, I.revs[i], BN);
    s.calc(`${c}31`, `${c}29/${c}30`, PCT);
  });
  line(29, 'Free cash flow', 'USD bn', 'Bloomberg FA', I.fcfAsOf, 'Cash left after running the business and investing in it.');
  line(30, 'Revenue', 'USD bn', 'Bloomberg FA', I.fcfAsOf, 'Sales in the year.');
  s.calc('B31', 'AVERAGE(C31:E31)', PCT, { bold: true }); line(31, 'Free cash flow margin', '%', 'Free cash flow ÷ revenue', '', 'Cents of cash kept from each dollar of sales, averaged over three years.');

  head(32, 'Scenarios: revenue growth', ['Margin shift', ...YEARS]);
  s.put('A33', 'Year ends');
  FY.forEach((c, i) => s.input(`${c}33`, new Date(Date.UTC(2028 + i, 0, 31)), 'd mmm yy'));
  line(33, 'Year ends', 'date', 'NVIDIA’s year ends in late January', '', 'We count each year’s cash as arriving on 31 January, so FY28 cash arrives in January 2028.');
  const bear = A.scenarios.bear;
  if (bear.fy28 !== 'flat' || A.scenarios.base.fy28 !== 'consensus' || A.scenarios.bull.fy28 !== 'consensus') throw new Error('Scenario shape changed in assumptions.json: update xlsx.ts.');
  ['bear', 'base', 'bull'].forEach((n, i) => s.input(`B${34 + i}`, A.scenarios[n].marginShift / 100, '+0.0%;-0.0%;0.0%'));
  [0, ...bear.growth].forEach((g: number, i) => s.input(`${FY[i]}34`, g / 100, PCT));
  s.calc('C35', 'B27/B26-1', PCT);
  FY.slice(1).forEach((c, i) => s.calc(`${c}35`, `${FY[i]}35+($B$24-$C$35)/4`, PCT));
  FY.forEach((c) => s.calc(`${c}36`, `${c}35`, PCT));
  const S = A.scenarios;
  line(34, `1  ${S.bear.label}`, '%', team, bbg, S.bear.why);
  line(35, `2  ${S.base.label}`, '%', 'FY28 consensus, then a straight line', I.fcAsOf, `${S.base.why} Each year drops by the same step: a quarter of the gap.`);
  line(36, `3  ${S.bull.label}`, '%', team, bbg, S.bull.why);
  s.finish(4, 'K36');
}

// ---------- DCF ----------
function buildDcf(s: Sheet, I: In) {
  s.title('DCF', '');
  s.put('A2', 'To change the scenario: Inputs, cell B6', { color: GREY });
  s.calc('B1', `CHOOSE(Inputs!B6,${['bear', 'base', 'bull'].map((n) => `"${I.A.scenarios[n].label}"`).join(',')})`, undefined, { bold: true, align: 'left' });
  s.put('F1', 'WACC', { align: 'right' }); s.calc('G1', 'Inputs!B18', PCT, { bold: true }); s.note('H1', 'The discount rate, from Inputs.');
  s.put('F2', 'Long-run growth', { align: 'right' }); s.calc('G2', 'Inputs!B24', PCT, { bold: true }); s.note('H2', 'Growth after FY32, from Inputs.');
  const row = (n: number, label: string, say: string, o: Opt = {}) => { s.put(`A${n}`, label, o); s.note(`H${n}`, say); };
  s.header(4, ['USD bn unless it says otherwise', 'FY27', ...YEARS, 'What this row says']);
  FY.forEach((c, i) => {
    const prev = i ? FY[i - 1] : 'B';
    s.calc(`${c}5`, `(Inputs!${c}33-Inputs!$B$9)/365.25`, '0.00');
    s.calc(`${c}6`, `CHOOSE(Inputs!$B$6,Inputs!${c}34,Inputs!${c}35,Inputs!${c}36)`, PCT);
    s.calc(`${c}7`, `${prev}7*(1+${c}6)`, BN);
    s.calc(`${c}8`, 'Inputs!$B$31+CHOOSE(Inputs!$B$6,Inputs!$B$34,Inputs!$B$35,Inputs!$B$36)', PCT);
    s.calc(`${c}9`, `${c}7*${c}8`, BN, { bold: true });
    s.calc(`${c}10`, `1/(1+$G$1)^${c}5`, '0.000');
    s.calc(`${c}11`, `${c}9*${c}10`, BN, { bold: true });
  });
  s.calc('B7', 'Inputs!B26', BN);
  row(5, 'Years from today', 'How long we wait for each year’s cash, counted from the valuation date.');
  row(6, 'Revenue growth', 'How much sales grow that year, taken from the chosen scenario on Inputs.');
  row(7, 'Revenue', 'Last year’s sales × (1 + growth); FY27 is the analyst consensus.');
  row(8, 'Free cash flow margin', 'Cash kept from each dollar of sales: the three-year average plus the scenario’s shift.');
  row(9, 'Free cash flow', 'Revenue × margin: the cash the business produces that year.');
  row(10, 'Discount factor', 'What $1 in that year is worth today: 1 ÷ (1 + WACC) ^ years.');
  row(11, 'Present value', 'Free cash flow × discount factor: that year’s cash in today’s money.');

  s.header(12, ['From cash to one share', '', '', '', '', '', '', '']);
  const step = (n: number, label: string, f: string, fmt: string, say: string, o: Opt = {}) => { row(n, label, say, { bold: o.bold }); s.calc(`C${n}`, f, fmt, o); };
  step(13, 'Five years of cash, today’s money', 'SUM(C11:G11)', BN, 'Adds up the five present values above.');
  step(14, 'Terminal value at FY32', 'G9*(1+G2)/(G1-G2)', BN, 'All cash after FY32, as one sum: next year’s cash ÷ (WACC − long-run growth).');
  step(15, 'Terminal value, today’s money', 'C14*G10', BN, 'The terminal value × FY32’s discount factor.');
  step(16, 'Enterprise value (EV)', 'C13+C15', BN, 'What the business is worth: five years of cash plus everything after.', { bold: true, top: true });
  step(17, '+ Net cash', 'Inputs!B14', BN, 'Add the cash the company already holds, after debt.');
  step(18, 'Equity value', 'C16+C17', BN, 'What all the shares together are worth.', { top: true });
  step(19, '÷ Shares outstanding (bn)', 'Inputs!B11', '0.0', 'How many shares that is split between.');
  step(20, 'Value per share (USD)', 'C18/C19', USD, 'Our answer for this scenario.', { bold: true, top: true });
  s.ws.getCell('C20').fill = s.ws.getCell('A20').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALE } };
  s.ws.getCell('B20').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALE } };
  step(21, 'Share price today (USD)', 'Inputs!B10', USD, 'What you would pay.');
  step(22, 'Value compared with price', 'C20/C21-1', '+0.0%;-0.0%', 'Above zero: worth more than it costs. Below zero: too expensive.', { bold: true });
  step(23, 'Terminal value as % of EV', 'C15/C16', PCT, 'How much of the answer rests on the years after FY32, which nobody can forecast well.');

  s.header(25, ['All three scenarios at once', 'Cash margin', ...YEARS, 'What this row says']);
  const NAMES = ['Bear', 'Base', 'Bull'];
  NAMES.forEach((n, i) => {
    const r = 26 + i;
    const ir = 34 + i;
    s.put(`A${r}`, `${n}: free cash flow`);
    s.calc(`B${r}`, `Inputs!$B$31+Inputs!B${ir}`, PCT);
    s.calc(`C${r}`, `Inputs!$B$26*$B${r}*(1+Inputs!C${ir})`, BN);
    FY.slice(1).forEach((c, k) => s.calc(`${c}${r}`, `${FY[k]}${r}*(1+Inputs!${c}${ir})`, BN));
  });
  s.note('H26', 'Same sum as above: FY27 revenue × margin, grown each year by that scenario’s growth.');
  s.note('H27', 'The margin never changes inside a scenario, so cash grows as fast as sales.');
  s.note('H28', 'Bull has base’s sales and a bigger margin.');
  s.header(30, ['The three answers', 'EV', 'Per share', 'Price', 'vs price', 'Terminal %', '', 'What this row says']);
  NAMES.forEach((n, i) => {
    const r = 31 + i;
    const f = 26 + i;
    s.put(`A${r}`, n, { bold: true });
    s.calc(`B${r}`, `C${f}*C$10+D${f}*D$10+E${f}*E$10+F${f}*F$10+G${f}*G$10+G${f}*(1+$G$2)/($G$1-$G$2)*G$10`, BN);
    s.calc(`C${r}`, `(B${r}+Inputs!$B$14)/Inputs!$B$11`, USD, { bold: true });
    s.calc(`D${r}`, 'Inputs!$B$10', USD);
    s.calc(`E${r}`, `C${r}/D${r}-1`, '+0.0%;-0.0%', { bold: true });
    s.calc(`F${r}`, `G${f}*(1+$G$2)/($G$1-$G$2)*G$10/B${r}`, PCT);
  });
  s.note('H31', 'EV: each year’s cash × its discount factor, plus the terminal value × FY32’s factor.');
  s.note('H32', 'Per share: (EV + net cash) ÷ shares. Terminal %: the part of EV that comes after FY32.');
  s.note('H33', 'The row for the scenario shown must equal C20; the Checks sheet tests that it does.');
  for (let n = 3; n <= 33; n++) s.ws.getRow(n).height = 15.5;
  for (const n of [3, 24, 29]) s.ws.getRow(n).height = 6;
  s.rules(5, 11, 'H'); s.rules(13, 19, 'H'); s.rules(21, 23, 'H'); s.rules(26, 28, 'H'); s.rules(31, 33, 'H');
  s.finish(4, 'H33');
}

// ---------- Sensitivity ----------
function buildSensitivity(s: Sheet, I: In) {
  s.title('Sensitivity', 'Base case: what one share is worth if the discount rate or long-run growth is different.');
  const cols = AT.grid.cols;
  s.header(4, ['Taken from the other sheets', ...YEARS, 'What this row says']);
  s.put('A5', 'Base free cash flow (USD bn)'); s.put('A6', 'Years from today');
  cols.forEach((c, i) => { s.calc(`${c}5`, `DCF!${FY[i]}27`, BN); s.calc(`${c}6`, `DCF!${FY[i]}5`, '0.00'); });
  s.note('G5', 'The base case’s cash each year; it stays base whichever scenario is showing.');
  s.note('G6', 'How long we wait for it.');
  s.put('A7', 'Net cash (USD bn)'); s.calc('B7', 'Inputs!B14', BN); s.note('G7', 'Added at the end, as on the DCF sheet.');
  s.put('A8', 'Shares outstanding (bn)'); s.calc('B8', 'Inputs!B11', '0.0'); s.note('G8', 'Divided by at the end, as on the DCF sheet.');
  s.put('A9', 'Share price today (USD)'); s.calc('B9', 'Inputs!B10', USD); s.note('G9', 'Compare every number in the table with this.');

  s.header(11, ['Value per share (USD)', '', '', '', '', '', '']);
  s.put('B12', 'Discount rate (WACC)  →', { bold: true });
  s.put('A13', 'Long-run growth  ↓', { bold: true });
  I.sens.x.forEach((x, i) => {
    const w = parseFloat(x);
    const o: Opt = { bold: true, fill: PALE, align: 'center' };
    if (w === I.bbgWacc) s.calc(`${cols[i]}13`, 'Inputs!B16', PCT, o);
    else s.input(`${cols[i]}13`, w / 100, PCT, o);
  });
  Object.keys(I.sens.series).forEach((name, j) => {
    const r = AT.grid.top + j;
    s.input(`A${r}`, parseFloat(name.match(/([\d.]+)%/)![1]) / 100, PCT, { bold: true, fill: PALE });
    cols.forEach((c) => {
      const cash = cols.map((k) => `$${k}$5/(1+${c}$13)^$${k}$6`).join('+');
      s.calc(`${c}${r}`, `(${cash}+$F$5*(1+$A${r})/(${c}$13-$A${r})/(1+${c}$13)^$F$6+$B$7)/$B$8`, USD, { size: 12, align: 'center' });
    });
    s.ws.getRow(r).height = 26;
  });
  s.note('G13', 'Four rates to try, and Bloomberg’s own rate in the last column (our headline).');
  s.note('G14', 'Each cell is the whole DCF on one line: five years of cash ÷ (1 + WACC) ^ years,');
  s.note('G15', 'plus the terminal value brought back the same way, plus net cash, ÷ shares.');
  s.note('G16', 'Green: worth more than today’s price. Red: worth less.');
  const box = { style: 'medium' as const, color: { argb: GREEN } };
  const hl = cols[I.sens.x.findIndex((x) => parseFloat(x) === I.bbgWacc)];
  const hr = AT.grid.top + Object.keys(I.sens.series).findIndex((k) => k.includes(` ${I.A.terminalGrowth.value}%`));
  s.ws.getCell(`${hl}${hr}`).border = { top: box, bottom: box, left: box, right: box };
  s.ws.getCell(`${hl}${hr}`).font = { name: 'Arial', size: 12, bold: true };
  const paint = (argb: string) => ({ fill: { type: 'pattern' as const, pattern: 'solid' as const, bgColor: { argb } } });
  s.ws.addConditionalFormatting({
    ref: `B14:F16`,
    rules: [
      { type: 'expression', priority: 1, formulae: ['B14>=$B$9'], style: paint('FFD5EBB8') },
      { type: 'expression', priority: 2, formulae: ['B14<$B$9'], style: paint('FFF9D9D6') },
    ],
  });
  s.put('A18', 'How to read it', { bold: true, color: GREEN });
  s.put('A19', 'Left to right, investors demand a higher return, so the same cash is worth less today. Top to bottom, cash grows faster forever, so it is worth more.');
  s.put('A20', 'The boxed cell is our headline. Growth here only changes the years after FY32; the five years of cash above stay as they are on the DCF sheet.');
  s.put('A21', 'This table is the base case only. For the bear case at a lower rate, set the discount rate switch on Inputs to 2 and read the DCF sheet.', { bold: true });
  s.rules(5, 9, 'G');
  s.finish(4, 'G21');
}

// ---------- Checks ----------
function buildChecks(s: Sheet, I: In) {
  s.title('Checks', 'Does the spreadsheet agree with the app, and do the sums hold together?');
  s.put('A3', 'Largest gap allowed', { color: GREY });
  s.input('B3', 0.01, '0.00');
  s.header(4, ['Same answers as the app (published inputs)', 'Spreadsheet', 'App', 'Gap', 'OK?', 'What this row says']);
  let r = 5;
  const check = (label: string, f: string, want: number | { f: string }, fmt: string, say: string, gap?: string) => {
    s.put(`A${r}`, label);
    s.calc(`B${r}`, f, fmt);
    if (typeof want === 'number') s.put(`C${r}`, want, { fmt, align: 'right', color: GREY });
    else s.calc(`C${r}`, want.f, fmt);
    s.calc(`D${r}`, gap ?? `ABS(B${r}-C${r})`, '0.000');
    s.calc(`E${r}`, `D${r}<=$B$3`, undefined, { bold: true, align: 'center' });
    s.note(`F${r}`, say);
    r++;
  };
  const val = (x: string) => I.app.value[I.app.valueX.indexOf(x)];
  const v = 'From model_valuation.json, the numbers on our slides.';
  check('Share price (USD)', 'Inputs!B10', val('Share price today'), USD, v);
  const T = AT.table;
  for (const [n, row] of Object.entries(T)) check(`${n[0].toUpperCase()}${n.slice(1)} value per share (USD)`, `DCF!C${row}`, val(`${n[0].toUpperCase()}${n.slice(1)} case`), USD, v);
  for (const [n, row] of Object.entries(T)) check(`${n[0].toUpperCase()}${n.slice(1)} enterprise value (USD bn)`, `DCF!B${row}`, I.app.ev[n], '#,##0.00', 'From valuation.csv, the app’s model printed out.');
  check('Net cash (USD bn)', 'Inputs!B14', I.app.netCash, '0.00', 'From valuation.csv.');
  check('Base cash margin (%)', 'Inputs!B31*100', I.app.margin, '0.00', 'From valuation.csv, in percentage points.');
  const path = (n: string) => I.app.paths.series[n][I.app.paths.x.indexOf('FY32')]!;
  for (const n of ['Bear', 'Base'] as const) { const row = n === 'Bear' ? 26 : 27; check(`${n} FY32 revenue (USD bn)`, `DCF!G${row}/DCF!B${row}`, path(n), '#,##0.00', 'From model_revenue_paths.json; cash ÷ margin gives revenue back.'); }
  check('Base growth per year, FY28 to FY32 (%)', '((DCF!G27/DCF!B27/Inputs!B26)^(1/5)-1)*100', I.app.implied, '0.00', 'From model_implied_growth.json: the steady yearly rate that gets to FY32 revenue.');
  const gs = Object.keys(I.sens.series);
  const last = AT.grid.cols.length - 1;
  const corner = (j: number, i: number) => check(`Sensitivity: WACC ${I.sens.x[i]}, growth ${gs[j].match(/([\d.]+)%/)![0]}`, `Sensitivity!${AT.grid.cols[i]}${AT.grid.top + j}`, I.sens.series[gs[j]][i]!, USD, 'From model_sensitivity.json.');
  corner(0, 0); corner(0, last); corner(1, 1); corner(1, last); corner(2, 0); corner(2, last);
  check('Bloomberg’s WACC equals its parts (percentage points)', 'Inputs!B16*100', { f: 'Inputs!B23*100' }, '0.00', 'Cost of equity and debt, each × its share of funding.');
  const lastApp = r - 1;
  s.put(`A${r}`, 'All of the above agree', { bold: true, top: true });
  s.calc(`D${r}`, `MAX(D5:D${lastApp})`, '0.000', { top: true });
  s.calc(`E${r}`, `D${r}<=$B$3`, undefined, { bold: true, align: 'center', top: true });
  s.note(`F${r}`, 'Change an input and some turn FALSE: you have left the published answer. That is fine.');
  const appRow = r;
  r += 1;
  s.header(r, ['Sums hold together (whatever the inputs)', 'Left side', 'Right side', 'Gap', 'OK?', 'What this row says']);
  const firstSum = ++r;
  check('Discount rate is above long-run growth', 'Inputs!B18', { f: 'Inputs!B24' }, PCT, 'If it is not, the terminal value formula breaks.', `IF(B${r}>C${r},0,1)`);
  check('Present values add up to EV', 'SUM(DCF!C11:G11)+DCF!C15', { f: 'DCF!C16' }, BN, 'Five years of cash plus the terminal value, both in today’s money.');
  check('Terminal value × (WACC − growth) = next year’s cash', 'DCF!C14*(Inputs!B18-Inputs!B24)', { f: 'DCF!G9*(1+Inputs!B24)' }, BN, 'Runs the terminal value formula backwards.');
  check('Shares × value − net cash = EV', 'DCF!C20*DCF!C19-DCF!C17', { f: 'DCF!C16' }, BN, 'Walks back from one share to the whole business.');
  check('Main DCF equals its row in the three-scenario table', 'DCF!C20', { f: `CHOOSE(Inputs!B6,DCF!C${T.bear},DCF!C${T.base},DCF!C${T.bull})` }, USD, 'Two ways of doing the sum give the same answer.');
  check('Base growth lands on long-run growth in FY32 (%)', 'Inputs!G35*100', { f: 'Inputs!B24*100' }, '0.00', 'The straight line ends where we said it ends.');
  check('Bull ≥ base ≥ bear (bull and bear shown)', `DCF!C${T.bull}`, { f: `DCF!C${T.bear}` }, USD, 'The scenarios are in a sensible order.', `IF(DCF!C${T.bull}>=DCF!C${T.base},IF(DCF!C${T.base}>=DCF!C${T.bear},0,1),1)`);
  s.put(`A${r}`, 'All of the above hold', { bold: true, top: true });
  s.calc(`D${r}`, `MAX(D${firstSum}:D${r - 1})`, '0.000', { top: true });
  s.calc(`E${r}`, `D${r}<=$B$3`, undefined, { bold: true, align: 'center', top: true });
  s.note(`F${r}`, 'If one of these is FALSE, a formula is broken or an input makes no sense.');
  const paint = (argb: string, font: string) => ({ font: { color: { argb: font }, bold: true }, fill: { type: 'pattern' as const, pattern: 'solid' as const, bgColor: { argb } } });
  s.ws.addConditionalFormatting({ ref: `E5:E${r}`, rules: [
    { type: 'cellIs', operator: 'equal', priority: 1, formulae: ['TRUE'], style: paint('FFE2F0D0', GREEN) },
    { type: 'cellIs', operator: 'equal', priority: 2, formulae: ['FALSE'], style: paint('FFF9D9D6', 'FFB00020') },
  ] });
  s.rules(5, appRow - 1, 'F'); s.rules(firstSum, r - 1, 'F');
  checkRows.app = appRow;
  checkRows.sums = r;
  s.finish(4, `F${r}`);
}
const checkRows = { app: 0, sums: 0 };

// ---------- Start here ----------
function buildStart(s: Sheet, I: In) {
  const { ws, put, calc } = s;
  const T = AT.table;
  const usd = (ref: string) => `TEXT(${ref},"$0.00")`;
  const pct = (ref: string, d = 0) => `TEXT(${ref},"${d ? '0.0%' : '0%'}")`;
  const wide = (row: number, v: any, o: Opt & { h?: number } = {}) => {
    ws.mergeCells(`A${row}:F${row}`);
    put(`A${row}`, v, { wrap: true, ...o });
    ws.getRow(row).height = o.h ?? 18;
  };
  const section = (row: number, t: string) => { for (const c of 'ABCDEF') put(`${c}${row}`, '', { fill: PALE }); put(`A${row}`, t, { bold: true, color: GREEN, fill: PALE }); ws.getRow(row).height = 18; };

  s.title('NVIDIA (NVDA): what is one share worth?', '');
  put('A2', { f: `"Student stock pitch, University of Stirling. Valued on "&TEXT(Inputs!B9,"d mmmm yyyy")&"."` }, { color: GREY });
  section(4, 'The answer in one sentence');
  wide(5, { f: `"Our base case says one NVIDIA share is worth "&${usd(`DCF!C${T.base}`)}&", "&${pct(`ABS(DCF!E${T.base})`)}&IF(DCF!E${T.base}>=0," more"," less")&" than the "&${usd('Inputs!B10')}&" it costs today; if AI spending pauses it is worth "&${usd(`DCF!C${T.bear}`)}&", and with fatter margins "&${usd(`DCF!C${T.bull}`)}&"."` }, { size: 14, bold: true, h: 46 });
  ['Price today', 'Bear', 'Base', 'Bull'].forEach((n, i) => put(`${'BCDE'[i]}7`, n, { bold: true, color: GREEN, align: 'center' }));
  put('A8', 'One share (USD)', { bold: true });
  put('A9', 'Compared with today’s price');
  calc('B8', 'Inputs!B10', USD, { size: 16, bold: true, align: 'center' });
  Object.values(T).forEach((row, i) => {
    calc(`${'CDE'[i]}8`, `DCF!C${row}`, USD, { size: 16, bold: true, align: 'center', fill: i === 1 ? PALE : undefined });
    calc(`${'CDE'[i]}9`, `DCF!E${row}`, '+0%;-0%', { align: 'center', fill: i === 1 ? PALE : undefined });
  });
  ws.getRow(8).height = 28;
  put('A10', 'Discount rate and long-run growth used');
  calc('B10', `${pct('Inputs!B18', 1)}&" and "&${pct('Inputs!B24', 1)}`, undefined, { align: 'center' });
  put('A11', 'Checks');
  ws.mergeCells('B11:F11');
  calc('B11', `IF(Checks!E${checkRows.sums},IF(Checks!E${checkRows.app},"All pass: matches the numbers in our slides.","Sums hold; an input has been changed since the slides were made."),"SOMETHING IS BROKEN: see the Checks sheet.")`, undefined, { align: 'left' });

  section(13, 'Colour code');
  put('A14', 'Blue', { color: BLUE, bold: true }); put('B14', 'An input: a Bloomberg figure or a choice of ours. Change it and everything moves.');
  put('A15', 'Black', { bold: true }); put('B15', 'A formula. Do not type over it.');
  put('A16', 'Grey', { color: GREY, bold: true }); put('B16', 'A note, or (on Checks) the app’s published number, there only to compare with.');

  section(18, 'How to use it');
  ['1.  On Inputs, change the scenario switch (1 bear, 2 base, 3 bull) and watch the DCF sheet.',
    '2.  On Inputs, change any blue number, for example the share price on pitch morning.',
    '3.  Read the DCF sheet from top to bottom; the grey note on the right says what each row means.',
    '4.  On Sensitivity, see what happens if our discount rate or long-run growth is wrong.',
    '5.  Look at Checks: if a row in the lower block says FALSE, undo what you just did.',
  ].forEach((t, i) => wide(19 + i, t));

  section(25, 'What would change our mind');
  const alt = AT.grid.cols[I.sens.x.indexOf(`${I.alt}%`)];
  [
    { f: `"AI spending pauses. Our bear case is worth "&${usd(`DCF!C${T.bear}`)}&", "&${pct(`ABS(DCF!E${T.bear})`)}&IF(DCF!E${T.bear}<0," below"," above")&" today’s price."&IF(ABS(DCF!E${T.bear})>DCF!E${T.base}," That is a bigger move than the base-case upside.","")` },
    { f: `"Orders fall short. Only FY28 (sales +"&${pct('Inputs!C35')}&") is analysts’ forecast; after that our own straight-line slowdown takes sales to $"&TEXT(DCF!G27/DCF!B27,"#,##0")&"bn by FY32, "&TEXT(DCF!G27/DCF!B27/Inputs!B26,"0.0")&" times FY27."` },
    { f: `"Cash margins slip. Base keeps "&${pct('DCF!B27')}&" of sales as cash every year; competition or customers’ own chips could end that."` },
    'Power, water or regulation caps data-centre building. We have not put a number on this; its effect would look like the bear case.',
    { f: `"The discount rate. "&${pct('Inputs!B16', 1)}&" is Bloomberg’s and is strict: at "&${pct(`Sensitivity!${alt}13`)}&" base is worth "&${usd(`Sensitivity!${alt}15`)}&". "&${pct(`DCF!F${T.base}`, 1)}&" of base EV comes after FY32."` },
  ].forEach((f, i) => wide(26 + i, f));
  s.finish(2, 'F30');
}

// ---------- run ----------
async function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nvda-xlsx-'));
  try {
    const draft = path.join(tmp, 'draft.xlsx');
    await build().xlsx.writeFile(draft);
    fs.mkdirSync(path.join(tmp, 'out'));
    const [calculated] = soffice([draft], path.join(tmp, 'out'));
    await build(await load(calculated)).xlsx.writeFile(OUT);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const wb = await load(OUT);
  const d = wb.getWorksheet('DCF')!;
  console.log(`Wrote ${path.relative(ROOT, OUT)}`);
  for (const [n, r] of Object.entries(AT.table)) console.log(`  ${n.padEnd(5)} $${(shown(d.getCell(`C${r}`)) as number).toFixed(2)}  (${((shown(d.getCell(`E${r}`)) as number) * 100).toFixed(1)}% vs price)`);
}
if (process.argv[1] === import.meta.filename) await main();
