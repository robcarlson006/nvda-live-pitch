/**
 * One command to change the share price everywhere: the app's slides, the data behind them, and the spreadsheet.
 *   npm run price -- 164.39     set the price from the command line
 *   npm run price               use whatever is typed in the spreadsheet (Inputs, cell B10), after you save it
 * It writes the price into data/model/assumptions.json (the one place the app reads it), rebuilds the data,
 * rebuilds the spreadsheet, then runs the spreadsheet checks. Run from app/.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { load, OUT } from './xlsx.ts';

const ROOT = path.resolve(import.meta.dirname, '../..');
const FILE = path.join(ROOT, 'data/model/assumptions.json');
const A = JSON.parse(fs.readFileSync(FILE, 'utf8'));

let price = Number(process.argv[2]);
if (!process.argv[2]) {
  if (!fs.existsSync(OUT)) { console.error('No spreadsheet to read. Give the price: npm run price -- 164.39'); process.exit(1); }
  const cell = (await load(OUT)).getWorksheet('Inputs')!.getCell('B10');
  price = Number(cell.value);
  console.log(`Read $${price} from the spreadsheet (Inputs, B10).`);
}
if (!Number.isFinite(price) || price < 10 || price > 1000) {
  console.error(`That does not look like a share price: ${process.argv[2] ?? price}. Try: npm run price -- 164.39`);
  process.exit(1);
}

const now = new Date();
A.priceOverride = {
  ...A.priceOverride,
  value: price,
  source: `Team, typed ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
  asOf: now.toISOString().slice(0, 10),
};
fs.writeFileSync(FILE, JSON.stringify(A, null, 2) + '\n');
console.log(`Price set to $${price}. Rebuilding the data, then the spreadsheet...`);
for (const script of ['data', 'xlsx', 'xlsx-check']) {
  const r = spawnSync('npm', ['run', '--silent', script], { stdio: 'inherit', cwd: path.join(ROOT, 'app') });
  if (r.status !== 0) {
    console.error(`\n"npm run ${script}" failed. The price is saved in assumptions.json; fix the error above and rerun.`);
    process.exit(r.status ?? 1);
  }
}
console.log(`\nDone. Restart the app server (or let it reload) so the slides show $${price}.`);
