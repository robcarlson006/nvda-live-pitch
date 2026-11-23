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
export const SHEETS = ['Start here', 'Financials', 'Inputs', 'Simple DCF', 'DCF', 'Sensitivity', 'Reverse DCF', 'Peers', 'Checks'];
/** Where the Simple DCF's answer sits (and how many different formulas the sheet may hold). */
export const SIMPLE = { value: 'B31', max: 30 } as const;
/** The two appendix sheets: each at most this many formulas (Rob: simple enough to read in one sitting). */
export const APPENDIX_MAX_FORMULAS = 15;
/** Row of the Reverse DCF growth table, and where the answers sit. */
export const RD = { top: 8, bottom: 13, price: 'B16', implied: 'B17', base: 'B18', gap: 'B19' } as const;
export const PEERS = { eps: 'B12', pe: 'B13', median: 'B14', value: 'B16' } as const;
/** Functions a first-year student knows. TEXT is for the sentences on Start here only. */
export const ALLOWED = ['SUM', 'IF', 'CHOOSE', 'MAX', 'ABS', 'AVERAGE', 'ROUND'];
/** Extra words allowed on one sheet only: the median of four peers. */
export const EXTRA: Record<string, string[]> = { 'Start here': ['TEXT'], Peers: ['MEDIAN'] };
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
  // The second discount rate: the semiconductor-industry average (Damodaran, Jan 2026) in assumptions.json, or the team's own number if one is set.
  const alt: number = typeof A.wacc.value === 'number' ? A.wacc.value : A.altWacc.value;
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
    eps27: num(des, /Est EPS\s+([\d.]+)/),
    peers: (() => {
      const pe = clean('peers_pe'), gr = clean('peers_growth'), om = clean('peers_operating_margin');
      return pe.x.map((name, i) => ({ name, pe: pe.series['Forward P/E'][i]!, growth: gr.series['EPS growth'][gr.x.indexOf(name)]!, margin: om.series['Operating margin'][om.x.indexOf(name)]!, asOf: pe.asOf! }));
    })(),
    app: {
      value: clean('model_valuation').series['Value per share'] as number[], valueX: clean('model_valuation').x,
      paths: clean('model_revenue_paths'), implied: clean('model_implied_growth').series['Growth per year'][1]!, priced: clean('model_implied_growth').series['Growth per year'][0]!,
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
  buildFinancials(sheet('Financials', [46, 11, 11, 11, 11, 11, 11, 11, 66], 100), I);
  buildInputs(sheet('Inputs', [40, 13, 9.5, 9.5, 9.5, 9.5, 9.5, 8, 37, 12, 62], 90), I);
  buildSimple(sheet('Simple DCF', [50, 12, 12, 12, 12, 12, 12, 70], 100), I);
  buildDcf(sheet('DCF', [34, 13, 12, 12, 12, 12, 12, 80], 90), I);
  buildSensitivity(sheet('Sensitivity', [34, 13, 13, 13, 13, 13, 62]), I);
  buildReverse(sheet('Reverse DCF', [52, 15, 15, 4, 4, 4, 4, 70], 100), I);
  buildPeers(sheet('Peers', [44, 14, 16, 12, 16, 74], 100), I);
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
  s.input('B7', I.waccSwitch).dataValidation = { type: 'list', allowBlank: false, formulae: ['"1,2"'], showErrorMessage: true, error: '1 = Bloomberg, 2 = semiconductor-industry average' };
  line(7, 'Discount rate to use', '1/2', 'You choose', '', `1 = Bloomberg’s figure (our headline), 2 = the ${I.alt}% average for US semiconductor companies.`);
  for (const r of ['B6', 'B7']) s.ws.getCell(r).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7CC' } };

  head(8, 'The company today');
  s.input('B9', day(I.asOf), DAY); line(9, 'Valuation date', 'date', 'Date of the Bloomberg exports', bbg, 'The day we are valuing the share.');
  s.input('B10', I.price, USD); line(10, 'Share price', 'USD', A.priceOverride.value ? `Team override: ${A.priceOverride.source}` : 'Bloomberg DES', A.priceOverride.value ? A.priceOverride.asOf : bbg, 'What one share costs today. On pitch morning type that morning’s price here.');
  s.input('B11', I.shares, '0.0'); line(11, 'Shares outstanding', 'bn', 'Bloomberg DES', bbg, 'How many shares the company is split into.');
  s.input('B12', I.mktCap, BN); line(12, 'Market cap', 'USD bn', 'Bloomberg DES', bbg, 'What all the shares cost together.');
  s.input('B13', I.ev, BN); line(13, 'Enterprise value (EV)', 'USD bn', 'Bloomberg DES', bbg, 'What the business costs once you take off its cash and add its debt.');
  s.calc('B14', 'B12-B13', BN); line(14, 'Net cash', 'USD bn', 'Market cap − EV', bbg, 'Cash left over after paying off all debt; it belongs to shareholders.');

  head(15, 'Discount rate and long-run growth');
  s.input('B16', I.bbgWacc / 100, PCT); line(16, 'WACC, Bloomberg', '%', 'Bloomberg WACC screen', bbg, 'The yearly return investors need for this risk; higher means future cash is worth less today.');
  s.input('B17', I.alt / 100, '0.0#%'); line(17, 'WACC, semiconductor-industry average', '%', 'Damodaran (NYU Stern), US semiconductors, Jan 2026', 'Jan 2026', 'Average cost of capital of 66 US chip companies, rivals included: a more usual rate than Bloomberg’s. Shows how much the rate matters.');
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


// ---------- Financials (simplified) ----------
/** Five years of results in plain numbers. Every blue figure is a Bloomberg export (data/clean); everything black is a sum or a ratio of them. */
function buildFinancials(s: Sheet, I: In) {
  const rev = clean('nvda_revenue_annual'), seg = clean('nvda_segments_annual'), mar = clean('nvda_margins_annual'), fcf = clean('nvda_fcf_annual');
  const eps = clean('nvda_eps_quarterly'), ev = clean('peers_ev_ebitda');
  const at = (d: Dataset, name: string, x: string) => { const v = d.series[name][d.x.indexOf(x)]; if (v == null) throw new Error(`${d.key}: no ${name} for ${x}`); return v; };
  const past = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
  const col = (i: number) => 'BCDEFGH'[i];
  s.title('Financials', 'Appendix to the DCF. Five years of results, simplified. Blue = Bloomberg figure; black = a sum or ratio of those.');
  const R = { rev: 13, growth: 14, dc: 15, dcShare: 16, other: 17, gm: 18, om: 19, op: 20, fcf: 21, fcfm: 22 };

  s.header(4, ['At a glance: FY26 (year to January 2026)', '', '', '', '', '', '', '', 'What this row says']);
  const glance = (n: number, label: string, f: string, fmt: string, say: string) => { s.put(`A${n}`, label); s.calc(`B${n}`, f, fmt, { bold: true }); s.note(`I${n}`, say); };
  glance(5, 'Sales (USD bn)', `F${R.rev}`, BN, 'Everything NVIDIA sold in the year.');
  glance(6, 'Sales growth on the year before', `F${R.growth}`, PCT, 'How much bigger sales were than a year earlier.');
  glance(7, 'Share of sales from Data Center', `F${R.dcShare}`, PCT, 'Data Center is the AI chip business.');
  glance(8, 'Operating margin', `F${R.om}`, PCT, 'Cents of profit from each dollar of sales, before interest and tax.');
  glance(9, 'Free cash flow (USD bn)', `F${R.fcf}`, BN, 'Cash left after running the business and investing in it. This is what the DCF discounts.');
  glance(10, 'Analysts’ sales forecast for FY27 (USD bn)', `G${R.rev}`, BN, 'The average analyst forecast for the year ending January 2027.');
  s.rules(5, 10, 'I');

  s.header(12, ['USD bn unless it says otherwise', ...past, 'FY27E', 'FY28E', 'What this row says']);
  const row = (n: number, label: string, say: string, o: Opt = {}) => { s.put(`A${n}`, label, { bold: o.bold }); s.note(`I${n}`, say); };
  const each = (n: number, f: (c: string, p: string) => string, fmt: string, from = 0, to = 4, o: Opt = {}) => { for (let i = from; i <= to; i++) s.calc(`${col(i)}${n}`, f(col(i), col(i - 1)), fmt, o); };
  row(R.rev, 'Sales', 'Total revenue. FY27E and FY28E are analysts’ average forecast, from Inputs.', { bold: true });
  past.forEach((y, i) => s.input(`${col(i)}${R.rev}`, at(rev, 'Revenue', y), BN, { bold: true }));
  s.calc(`G${R.rev}`, 'Inputs!B26', BN, { bold: true }); s.calc(`H${R.rev}`, 'Inputs!B27', BN, { bold: true });
  row(R.growth, 'Sales growth', 'This year’s sales ÷ last year’s − 1.');
  each(R.growth, (c, p) => `${c}${R.rev}/${p}${R.rev}-1`, PCT, 1, 6);
  row(R.dc, 'Data Center sales', 'Chips and systems for AI and cloud data centres.');
  past.forEach((y, i) => s.input(`${col(i)}${R.dc}`, at(seg, 'Data Center', y), BN));
  row(R.dcShare, 'Data Center as a share of sales', 'Data Center sales ÷ total sales: how much of NVIDIA is now the AI business.');
  each(R.dcShare, (c) => `${c}${R.dc}/${c}${R.rev}`, PCT);
  row(R.other, 'Everything else (gaming, design, cars, other)', 'Total sales − Data Center.');
  each(R.other, (c) => `${c}${R.rev}-${c}${R.dc}`, BN);
  row(R.gm, 'Gross margin', 'Cents left from each dollar of sales after the cost of making the chips.');
  past.forEach((y, i) => s.input(`${col(i)}${R.gm}`, at(mar, 'Gross margin', y) / 100, PCT));
  row(R.om, 'Operating margin', 'Cents of profit from each dollar of sales after all running costs, before interest and tax.');
  past.forEach((y, i) => s.input(`${col(i)}${R.om}`, at(mar, 'Operating margin', y) / 100, PCT));
  row(R.op, 'Operating profit', 'Sales × operating margin.');
  each(R.op, (c) => `${c}${R.rev}*${c}${R.om}`, BN);
  row(R.fcf, 'Free cash flow', 'Cash left after running the business and investing in it.', { bold: true });
  past.forEach((y, i) => s.input(`${col(i)}${R.fcf}`, at(fcf, 'Free cash flow', y), BN, { bold: true }));
  row(R.fcfm, 'Free cash flow margin', 'Free cash flow ÷ sales. The DCF keeps the FY24 to FY26 average.');
  each(R.fcfm, (c) => `${c}${R.fcf}/${c}${R.rev}`, PCT);
  s.rules(13, 22, 'I');

  const q = eps.x.slice(-4);
  s.header(24, ['Profit per share (USD): the last four quarters', 'Actual', 'Expected', 'Beat by', '', '', '', '', 'What this row says']);
  q.forEach((x, i) => {
    const n = 25 + i;
    s.put(`A${n}`, x.replace(/^(FY\d+) (Q\d)$/, '$2 of $1'));
    s.input(`B${n}`, at(eps, 'EPS', x), USD);
    s.input(`C${n}`, at(eps, 'Consensus', x), USD);
    s.calc(`D${n}`, `B${n}/C${n}-1`, '+0.0%;-0.0%');
  });
  s.note('I25', 'Actual: adjusted profit per share reported. Expected: analysts’ average before.');
  s.note('I26', 'Beat by: actual ÷ expected − 1. Above zero: better than analysts thought.');
  s.note('I27', 'A habit of beating is not a promise it continues.');
  s.note('I28', 'Quarters run to January, April, July and October; “Q3 of FY27” ended in October 2026.');
  s.rules(25, 28, 'I');

  s.header(30, ['Cost against rivals: EV ÷ EBITDA', 'Multiple', '', '', '', '', '', '', 'What this row says']);
  ev.x.forEach((name, i) => {
    const n = 31 + i;
    s.put(`A${n}`, name, { bold: i === 0 });
    s.input(`B${n}`, at(ev, 'EV/EBITDA', name), '0.0"x"');
  });
  s.note('I31', 'Years of operating cash profit the whole business costs. Lower = cheaper.');
  s.note('I32', 'AMD is very high, which pulls the average of the four up.');
  s.note('I33', 'Intel: low profits now, so the multiple is not telling much.');
  s.note('I34', 'Broadcom: the closest to NVIDIA in size and margin.');
  s.note('I35', 'TSMC: NVIDIA’s chip maker.');
  s.put('A36', 'Average of the four rivals'); s.calc('B36', 'AVERAGE(B32:B35)', '0.0"x"'); s.note('I36', 'A plain average of AMD, Intel, Broadcom and TSMC.');
  s.put('A37', 'NVIDIA compared with that average', { bold: true }); s.calc('B37', 'B31/B36-1', '+0%;-0%', { bold: true }); s.note('I37', 'Below zero: cheaper than its rivals on this measure (forward, Bloomberg).');
  s.rules(31, 37, 'I');

  s.header(39, ['Where these numbers come from', '', '', '', '', '', '', '', '']);
  const src = (n: number, d: Dataset, what: string) => { s.ws.mergeCells(`A${n}:I${n}`); s.put(`A${n}`, `${what}: ${d.source}, as of ${d.asOf}.`, { size: 9, color: GREY, wrap: true }); };
  src(40, rev, 'Sales'); src(41, seg, 'Data Center'); src(42, mar, 'Margins'); src(43, fcf, 'Free cash flow'); src(44, eps, 'Profit per share'); src(45, ev, 'EV ÷ EBITDA');
  s.ws.mergeCells('A46:I46'); s.put('A46', 'FY27E and FY28E sales are the analysts’ consensus on the Inputs sheet. Year ends late January: FY26 ended in January 2026.', { size: 9, color: GREY, wrap: true });
  for (let n = 5; n <= 37; n++) s.ws.getRow(n).height = 16;
  s.finish(4, 'I46');
}

// ---------- Simple DCF ----------
/**
 * The DCF as you would do it on paper: base case, five whole years, discount each year by (1 + rate) ^ year number.
 * Same inputs as the DCF sheet (they are linked, not retyped), so the two cannot drift apart.
 */
function buildSimple(s: Sheet, I: In) {
  s.title('Simple DCF', 'The whole valuation on one page: base case, five whole years. Follow it from top to bottom.');
  const row = (n: number, label: string, say: string, o: Opt = {}) => { s.put(`A${n}`, label, { bold: o.bold }); s.note(`H${n}`, say); };
  const one = (n: number, label: string, f: string, fmt: string, say: string, o: Opt = {}) => { row(n, label, say, o); s.calc(`B${n}`, f, fmt, o); };

  s.header(4, ['Step 1: what we assume', 'Value', '', '', '', '', '', 'What this row says']);
  one(5, 'Sales now, FY27 (USD bn)', 'Inputs!B26', BN, 'Analysts’ forecast for the year ending January 2027: our starting point.');
  one(6, 'Free cash flow margin', 'Inputs!B31+Inputs!B35', PCT, 'Cents of cash kept per dollar of sales: the FY24 to FY26 average.');
  one(7, 'Discount rate (WACC)', 'Inputs!B18', PCT, 'The yearly return investors need. Cash far away is worth less today.');
  one(8, 'Growth after Year 5, forever', 'Inputs!B24', PCT, 'About the speed of the world economy.');
  one(9, 'Net cash (USD bn)', 'Inputs!B14', BN, 'Cash minus debt. It belongs to shareholders.');
  one(10, 'Shares (bn)', 'Inputs!B11', '0.0', 'How many shares the company is split into.');
  one(11, 'Share price today (USD)', 'Inputs!B10', USD, 'What one share costs.');
  s.rules(5, 11, 'H');

  s.header(13, ['Step 2: five years of cash', 'Now', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'What this row says']);
  const Y = ['C', 'D', 'E', 'F', 'G'];
  const YR = ['FY28', 'FY29', 'FY30', 'FY31', 'FY32'];
  row(14, 'Financial year', 'NVIDIA’s year ends in late January, so FY28 is the year to January 2028.');
  s.put('B14', 'FY27', { align: 'right' });
  Y.forEach((c, i) => s.put(`${c}14`, YR[i], { align: 'right' }));
  row(15, 'Year number', 'How many whole years we wait for that year’s cash.');
  Y.forEach((c, i) => s.input(`${c}15`, i + 1, '0'));
  row(16, 'Sales growth', 'Analysts for FY28, then a straight line down to the long-run growth rate (Inputs, base case).');
  Y.forEach((c, i) => s.calc(`${c}16`, `Inputs!${FY[i]}35`, PCT));
  row(17, 'Sales (USD bn)', 'Last year’s sales × (1 + growth).');
  s.calc('B17', 'B5', BN);
  Y.forEach((c, i) => s.calc(`${c}17`, `${i ? Y[i - 1] : 'B'}17*(1+${c}16)`, BN));
  row(18, 'Free cash flow (USD bn)', 'Sales × free cash flow margin: the cash the business produces.', { bold: true });
  Y.forEach((c) => s.calc(`${c}18`, `${c}17*$B$6`, BN, { bold: true }));
  row(19, 'Discount factor', 'What $1 in that year is worth today: 1 ÷ (1 + WACC) ^ year number.');
  Y.forEach((c) => s.calc(`${c}19`, `1/(1+$B$7)^${c}15`, '0.000'));
  row(20, 'Present value (USD bn)', 'Free cash flow × discount factor: that year’s cash in today’s money.', { bold: true });
  Y.forEach((c) => s.calc(`${c}20`, `${c}18*${c}19`, BN, { bold: true }));
  s.rules(14, 20, 'H');

  s.header(22, ['Step 3: from cash to one share', 'Value', '', '', '', '', '', 'What this row says']);
  one(23, 'Five years of cash, in today’s money', 'SUM(C20:G20)', BN, 'Add up the five present values.');
  one(24, 'All the cash after Year 5, in one sum', 'G18*(1+B8)/(B7-B8)', BN, 'Year 5 cash × (1 + growth) ÷ (WACC − growth): the terminal value, as at Year 5.');
  one(25, 'That sum, in today’s money', 'B24*G19', BN, 'Times Year 5’s discount factor.');
  one(26, 'Enterprise value', 'B23+B25', BN, 'What the business is worth: five years of cash plus everything after.', { bold: true, top: true });
  one(27, '+ Net cash', 'B9', BN, 'Add the cash it already holds, after debt.');
  one(28, 'Equity value', 'B26+B27', BN, 'What all the shares together are worth.', { top: true });
  one(29, '÷ Shares (bn)', 'B10', '0.0', 'Split between all the shares.');
  s.put('A30', '');
  one(31, 'Value per share (USD)', 'B28/B29', USD, 'Our answer, the paper way.', { bold: true, top: true });
  for (const c of ['A', 'B']) s.ws.getCell(`${c}31`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALE } };
  one(32, 'Share price today (USD)', 'B11', USD, 'What you would pay.');
  one(33, 'Value compared with price', 'B31/B32-1', '+0.0%;-0.0%', 'Above zero: worth more than it costs. Below zero: too expensive.', { bold: true });
  one(34, 'Share of value that comes after Year 5', 'B25/B26', PCT, 'How much of the answer rests on the years nobody can forecast.');
  s.rules(23, 29, 'H'); s.rules(31, 34, 'H');

  s.header(36, ['Step 4: compare with the detailed DCF', 'Value', '', '', '', '', '', 'What this row says']);
  one(37, 'Detailed DCF, base case (USD)', `DCF!C${AT.table.base}`, USD, 'The DCF sheet, which counts the exact dates.');
  one(38, 'Simple DCF compared with detailed', 'B31/B37-1', '+0.0%;-0.0%', 'A little higher: here Year 1 is exactly 1 year away; the real wait is longer.', { bold: true });
  s.ws.mergeCells('A40:H40');
  s.put('A40', 'Which to quote? The DCF sheet is our headline: it counts the real dates. This sheet is the same method done on paper, for anyone who wants to check the logic with a calculator.', { size: 9, color: GREY, wrap: true });
  s.ws.getRow(40).height = 28;
  for (let n = 5; n <= 38; n++) s.ws.getRow(n).height = 16;
  s.ws.getRow(21).height = 6; s.ws.getRow(30).height = 6;
  s.rules(37, 38, 'H');
  s.finish(4, 'H40');
}

// ---------- Reverse DCF (appendix) ----------
/**
 * What yearly sales growth, FY28 to FY32, does today's share price already assume? A DCF cannot be turned round in one formula, so this
 * does what you would do by hand: value the share at six growth rates, then see where the price falls between two of them.
 * Eleven short formulas, three of them repeated down the table.
 */
function buildReverse(s: Sheet, I: In) {
  s.title('Reverse DCF', 'Appendix. Instead of asking what a share is worth, ask what growth today’s price already needs.');
  s.header(4, ['How it works', '', '', '', '', '', '', '']);
  s.put('A5', 'Method: value one share if sales grew by the same percentage every year FY28 to FY32, with the same cash margin, discount rate, long-run growth, net cash and share count as the DCF sheet.', { size: 9, color: GREY, wrap: true });
  s.ws.mergeCells('A5:H5'); s.ws.getRow(5).height = 28;
  s.header(7, ['Sales growth, every year (you can change these)', 'Value per share', 'Price falls between this row and the next, at', '', '', '', '', 'What this row says']);
  s.ws.getRow(7).height = 42; s.ws.getCell('C7').alignment = { wrapText: true, horizontal: 'right', vertical: 'middle' }; s.ws.getCell('B7').alignment = { wrapText: true, horizontal: 'right', vertical: 'middle' };
  const rows = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45];
  const t = (c: string) => `DCF!${c}$5`;
  rows.forEach((g, i) => {
    const r = RD.top + i;
    s.input(`A${r}`, g, '0%');
    // one share: five years of cash + the terminal value, then net cash, ÷ shares (the DCF sheet's own steps in one line)
    const grown = (k: number, c: string) => `(1+$A${r})^${k}/(1+DCF!$G$1)^${t(c)}`;
    const years = ['C', 'D', 'E', 'F', 'G'].map((c, k) => grown(k + 1, c)).join('+');
    s.calc(`B${r}`, `(Inputs!$B$26*DCF!$B$27*(${years}+(1+$A${r})^5*(1+DCF!$G$2)/(DCF!$G$1-DCF!$G$2)/(1+DCF!$G$1)^${t('G')})+Inputs!$B$14)/Inputs!$B$11`, USD);
    if (i < rows.length - 1) s.calc(`C${r}`, `IF(B${r}<=$B$16,IF(B${r + 1}>$B$16,A${r}+($B$16-B${r})/(B${r + 1}-B${r})*(A${r + 1}-A${r}),0),0)`, '0.0%;-0.0%;"-"');
  });
  s.note('H8', 'Each row is a full DCF in one line: five years of cash, plus everything after FY32, plus net cash, divided by shares.');
  s.note('H9', 'More growth, more cash, higher value: the column rises as you go down.');
  s.note('H10', 'We look for the two rows whose values sit either side of today’s price.');
  s.note('H11', 'Between them we draw a straight line to find where the price falls (the next block shows the answer).');
  s.note('H12', 'Only one cell in this column is not zero.');
  s.header(15, ['The answer', '', '', '', '', '', '', 'What this row says']);
  const line = (ref: string, label: string, f: string, fmt: string, say: string, o: Opt = {}) => { const n = ref.slice(1); s.put(`A${n}`, label, { bold: o.bold }); s.calc(ref, f, fmt, o); s.note(`H${n}`, say); };
  line(RD.price, 'Share price today (USD)', 'Inputs!B10', USD, 'What one share costs, from Inputs.');
  line(RD.implied, 'Growth the price already needs, a year, FY28 to FY32', `SUM(C${RD.top}:C${RD.bottom - 1})`, '0.0%;-0.0%;"outside table"', 'Read off the table above: the steady yearly growth at which one share is worth exactly the price.', { bold: true });
  line(RD.base, 'Our base case grows, a year, FY28 to FY32', '(DCF!G27/(Inputs!B26*DCF!B27))^(1/5)-1', PCT, 'Base-case FY32 sales ÷ FY27 sales, taken to the fifth root: the same kind of steady yearly rate, for comparison.');
  line(RD.gap, 'Does the table reach the price?', `IF(${RD.implied}=0,"No: change the blue growth rates in column A","Yes")`, undefined, 'If the price or the discount rate moves a lot, the table may not reach it; then the answer above says “outside table” and you widen column A. Base minus price-implied growth is our room for error.', { bold: true });
  s.ws.getCell('B17').fill = s.ws.getCell('A17').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: PALE } };
  s.put('A21', 'Read it like this: “At Bloomberg’s discount rate the market is already paying for the growth shown in B17. If you think NVIDIA will grow faster than that for five years, the share is cheap; slower, expensive.” It says nothing about whether the growth is likely.', { size: 9, color: GREY, wrap: true });
  s.ws.mergeCells('A21:H21'); s.ws.getRow(21).height = 40;
  for (let n = 8; n <= 13; n++) s.ws.getRow(n).height = 16;
  s.rules(8, 13, 'H'); s.rules(16, 19, 'H');
  s.finish(4, 'H21');
}

// ---------- Peers (appendix) ----------
/**
 * NVIDIA's price-to-earnings ratio against AMD, Intel, Broadcom and TSMC, and what the peers' multiple would make one share worth.
 * The ratios are Bloomberg's (typed in blue, dated); everything else is a formula.
 */
function buildPeers(s: Sheet, I: In) {
  s.title('Peers', 'Appendix. Is NVIDIA cheap or dear next to its rivals, and what would their multiple make one share worth?');
  s.header(4, ['Company', 'Forward P/E', 'Expected EPS growth', 'PEG', 'Operating margin', 'What this row says']);
  I.peers.forEach((p, i) => {
    const r = 5 + i;
    s.put(`A${r}`, p.name, { bold: i === 0 });
    if (i === 0) s.calc(`B${r}`, 'B13', '0.0"x"'); else s.input(`B${r}`, p.pe, '0.0"x"');
    s.input(`C${r}`, p.growth / 100, '0%');
    s.calc(`D${r}`, `B${r}/(C${r}*100)`, '0.00');
    s.input(`E${r}`, p.margin / 100, '0%');
  });
  s.note('F5', 'NVIDIA: today’s price (Inputs) ÷ this year’s expected profit per share (row 12), so it moves with the price. The other four are Bloomberg, 20 Nov 2026.');
  s.note('F6', 'AMD: lots of growth expected, so a high multiple.');
  s.note('F7', 'Intel: little growth expected, yet a high multiple (profits are low now).');
  s.note('F8', 'Broadcom: the closest to NVIDIA in size and margin.');
  s.note('F9', 'TSMC: NVIDIA’s chip maker, and the cheapest of the four.');
  s.header(11, ['What the peers imply', 'Value', '', '', '', 'What this row says']);
  const line = (n: number, label: string, f: string | number, fmt: string, say: string, o: Opt = {}) => {
    s.put(`A${n}`, label, { bold: o.bold });
    typeof f === 'number' ? s.input(`B${n}`, f, fmt) : s.calc(`B${n}`, f, fmt, o);
    s.note(`F${n}`, say);
  };
  line(12, 'NVIDIA expected profit per share this year (USD)', I.eps27, USD, 'Bloomberg DES, year to January 2027.');
  line(13, 'NVIDIA forward P/E at today’s price', 'Inputs!B10/B12', '0.0"x"', 'Share price ÷ expected profit per share; moves if you change the price on Inputs.');
  line(14, 'Median of the four peers’ forward P/E', 'MEDIAN(B6:B9)', '0.0"x"', 'The middle of AMD, Intel, Broadcom and TSMC (with four, the average of the middle two).');
  line(15, 'NVIDIA compared with that median', 'B13/B14-1', '+0%;-0%', 'Below zero: NVIDIA is cheaper than its peers on this year’s profit.', { bold: true });
  line(16, 'One share at the peer median P/E (USD)', 'B14*B12', USD, 'Peer median multiple × NVIDIA’s profit per share: what a share would cost if NVIDIA were priced like its peers.', { bold: true });
  line(17, 'That compared with today’s price', 'B16/Inputs!B10-1', '+0%;-0%', 'It is high because AMD and Intel carry very high multiples. Do not lean on it: see the next two rows.');
  line(18, 'One share at TSMC’s multiple (USD)', 'B9*B12', USD, 'TSMC is the closest and cheapest comparable, so this is the cautious peer cross-check.');
  line(19, 'One share at the peers’ median PEG (USD)', 'MEDIAN(D6:D9)*C5*100*B12', USD, 'Allows for growth: the peers’ median P/E-per-point-of-growth × NVIDIA’s growth × its profit per share.');
  line(20, 'Our DCF base case (USD)', `DCF!C${AT.table.base}`, USD, 'For comparison. The DCF is our main answer; the peer lines are only a cross-check.');
  s.put('A22', 'Two figures for NVIDIA’s P/E exist. The research notes quote about 22.7x; Bloomberg, which we use, gave 14.1x at its 20 Nov price; row 13 recalculates it at the price on Inputs. We cannot rebuild 22.7x from any file we hold, so it stays out of the numbers. Compare row 5 with the four rivals under it: the lower it sits, the cheaper NVIDIA looks on this year’s profit. That says nothing about whether the profits will last.', { size: 9, color: GREY, wrap: true });
  s.ws.mergeCells('A22:F22'); s.ws.getRow(22).height = 54;
  for (let n = 5; n <= 20; n++) s.ws.getRow(n).height = 18;
  s.rules(5, 9, 'F'); s.rules(12, 20, 'F');
  s.finish(4, 'F22');
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
    if (w === I.bbgWacc) s.calc(`${cols[i]}13`, 'Inputs!B16', '0.0#%', o);
    else s.input(`${cols[i]}13`, w / 100, '0.0#%', o);
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
  check('Growth the share price implies (%)', `'Reverse DCF'!${RD.implied}*100`, I.app.priced, '0.00', 'From model_implied_growth.json. The sheet reads it off its table by straight-line steps, so allow up to 0.1 percentage points.', `ABS(B${r}-C${r})/10`);
  check('Peers: value per share at the peer median P/E (USD)', `Peers!${PEERS.value}`, val('Peer P/E check'), USD, 'From model_valuation.json, the bar on our valuation slide.');
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
  check('Simple DCF is within 10% of the detailed base case', `'Simple DCF'!${SIMPLE.value}`, { f: `DCF!C${T.base}` }, USD, 'Whole years instead of exact dates: a little higher, never far away.', `IF(ABS(B${r}/C${r}-1)<=0.1,0,1)`);
  check('Base growth lands on long-run growth in FY32 (%)', 'Inputs!G35*100', { f: 'Inputs!B24*100' }, '0.00', 'The straight line ends where we said it ends.');
  check('Bull ≥ base ≥ bear (bull and bear shown)', `DCF!C${T.bull}`, { f: `DCF!C${T.bear}` }, USD, 'The scenarios are in a sensible order.', `IF(DCF!C${T.bull}>=DCF!C${T.base},IF(DCF!C${T.base}>=DCF!C${T.bear},0,1),1)`);
  check('Share price is inside the Reverse DCF table', 'Inputs!B10', { f: `'Reverse DCF'!B${RD.top}` }, USD, 'If you change the price a lot, the table may no longer reach it; widen the blue growth rates in column A.', `IF(B${r}>=C${r},IF(B${r}<'Reverse DCF'!B${RD.bottom},0,1),1)`);
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
  const pct = (ref: string, d = 0) => `TEXT(${ref},"${d === 2 ? '0.0#%' : d ? '0.0%' : '0%'}")`;
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
  ['1.  Financials: five years of results in plain numbers (sales, margins, cash).',
    '2.  Simple DCF: the whole valuation on one page, base case, whole years. Start here if DCFs are new to you.',
    '3.  On Inputs, change the scenario switch (1 bear, 2 base, 3 bull), or any blue number, for example the share price on pitch morning.',
    '4.  DCF: the detailed version we quote (exact dates, three scenarios). Each grey note says what its row means.',
    '5.  Sensitivity: what happens if our discount rate or long-run growth is wrong.',
    '6.  Checks: if a row in the lower block says FALSE, undo what you just did.',
    '7.  Appendix: Reverse DCF (what growth the price already assumes) and Peers (NVIDIA’s P/E against four rivals).',
  ].forEach((t, i) => wide(19 + i, t));

  section(27, 'What would change our mind');
  const alt = AT.grid.cols[I.sens.x.indexOf(`${I.alt}%`)];
  [
    { f: `"AI spending pauses. Our bear case is worth "&${usd(`DCF!C${T.bear}`)}&", "&${pct(`ABS(DCF!E${T.bear})`)}&IF(DCF!E${T.bear}<0," below"," above")&" today’s price."&IF(ABS(DCF!E${T.bear})>DCF!E${T.base}," That is a bigger move than the base-case upside.","")` },
    { f: `"Orders fall short. Only FY28 (sales +"&${pct('Inputs!C35')}&") is analysts’ forecast; after that our own straight-line slowdown takes sales to $"&TEXT(DCF!G27/DCF!B27,"#,##0")&"bn by FY32, "&TEXT(DCF!G27/DCF!B27/Inputs!B26,"0.0")&" times FY27."` },
    { f: `"Cash margins slip. Base keeps "&${pct('DCF!B27')}&" of sales as cash every year; competition or customers’ own chips could end that."` },
    'Power, water or regulation caps data-centre building. We have not put a number on this; its effect would look like the bear case.',
    { f: `"The discount rate. "&${pct('Inputs!B16', 1)}&" is Bloomberg’s and is strict: at "&${pct(`Sensitivity!${alt}13`, 2)}&" base is worth "&${usd(`Sensitivity!${alt}15`)}&". "&${pct(`DCF!F${T.base}`, 1)}&" of base EV comes after FY32."` },
  ].forEach((f, i) => wide(28 + i, f));
  s.finish(2, 'F32');
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
