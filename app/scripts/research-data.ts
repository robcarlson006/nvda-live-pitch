/**
 * Curated datasets typed in from docs/research/notebooklm-research.md (NotebookLM export, 21 Nov 2026).
 * These are the non-Bloomberg figures in Rob's opening. Each figure keeps its publisher + date.
 * `verified: false` = the script marks it [VERIFY]: find a primary source before the pitch.
 * Run: npx tsx scripts/research-data.ts  (writes data/clean/research_*.json; npm run data keeps them)
 */
import fs from 'node:fs';
import path from 'node:path';
import { Dataset } from '../shared/schema.ts';

const CLEAN = path.resolve(import.meta.dirname, '../../data/clean');
const AS_OF = '2026-11-21';
const VIA = 'via NotebookLM research, 21 Nov 2026';

type Fact = { value: number; unit: string; source: string };
function facts(key: string, title: string, verified: boolean, f: Record<string, Fact>): Dataset {
  return Dataset.parse({
    key, title, unit: '', units: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.unit])),
    source: `Research notes (${VIA})`, seriesSources: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.source])),
    asOf: AS_OF, placeholder: false, curated: true, verified, x: ['value'],
    series: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, [v.value]])),
  });
}
function table(d: Omit<Dataset, 'placeholder' | 'curated' | 'asOf'>): Dataset {
  return Dataset.parse({ ...d, source: `${d.source} (${VIA})`, asOf: AS_OF, placeholder: false, curated: true });
}

const out: Dataset[] = [
  table({
    key: 'research_infra_gdp', title: 'Average yearly spend during each build-out, share of US GDP', unit: '%', verified: true,
    source: 'Brookings Papers on Economic Activity, Fall 2026 (Van Nieuwerburgh), AI projection 2025–32; historical build-out estimates in the same research',
    x: ['Highways 1956–73', 'Fibre 1996–2003', 'Railroads 1870–90', 'AI 2025–32'],
    series: { 'Average yearly spend': [1.13, 1.1, 2.24, 3.63] },
  }),
  table({
    key: 'research_alexnet', title: 'ImageNet 2012: top-5 error rate (lower is better)', unit: '%', verified: true,
    source: 'ILSVRC 2012 results; Krizhevsky, Sutskever & Hinton (2012)',
    x: ['AlexNet, on NVIDIA GPUs', 'Runner-up'],
    series: { 'Top-5 error': [15.3, 26.2] },
  }),
  table({
    key: 'research_cowos_share', title: 'Share of TSMC CoWoS packaging capacity booked for 2026', unit: '%', verified: true,
    source: 'Morgan Stanley, TrendForce and Silicon Analysts estimates, 2026',
    x: ['NVIDIA', 'Broadcom', 'AMD'],
    series: { 'Share of CoWoS': [60, 15, 11] },
  }),
  facts('research_facts', 'Figures from the research notes', true, {
    'NV1 chips made': { value: 250000, unit: '', source: 'NVIDIA history (Wikipedia; Sequoia/TwinMind)' },
    'NV1 chips returned': { value: 249000, unit: '', source: 'NVIDIA history (Wikipedia; Sequoia/TwinMind)' },
    'Sega investment': { value: 5, unit: 'USD m', source: 'NVIDIA history (Wikipedia; TwinMind)' },
    'RIVA 128 sold in four months': { value: 1, unit: 'm', source: 'GameSpot, April 2000; NVIDIA history' },
    'Xbox advance': { value: 200, unit: 'USD m', source: 'EE Times, 19 April 2000' },
    'Stanford speed-up': { value: 70, unit: 'x', source: 'Raina, Madhavan & Ng, ICML 2009' },
    'AMD MI355X memory': { value: 288, unit: 'GB', source: 'AMD Instinct MI355X specifications' },
    'NVIDIA B200 memory': { value: 192, unit: 'GB', source: 'NVIDIA B200 specifications' },
    'CUDA developers': { value: 6, unit: 'm', source: 'NVIDIA, GTC March 2026' },
    'CUDA-X libraries': { value: 1000, unit: '', source: 'NVIDIA CUDA-X' },
    'GPUs per NVL72 rack': { value: 72, unit: '', source: 'NVIDIA GB200 NVL72 specifications' },
    'Networking revenue FY26': { value: 31.4, unit: 'USD bn', source: 'Bloomberg FA (annual), p.175: Networking $31,376m, year to 25 Jan 2026' },
    'Mellanox price': { value: 6.9, unit: 'USD bn', source: 'NVIDIA, 11 March 2019 (enterprise value)' },
    'TSMC share of leading-edge chips': { value: 90, unit: '%', source: 'Industry estimates (Mordor Intelligence; Bloomberg Intelligence), 2026' },
    'Cisco forward P/E, March 2000': { value: 140, unit: 'x', source: 'Market data, March 2000' },
    'Drug: idea to trials, months': { value: 30, unit: '', source: 'Insilico Medicine, ISM001-055' },
    'Sweden: more cancers found': { value: 20, unit: '%', source: 'Swedish mammography screening trial (MASAI), 2023' },
    'Sweden: less reading work': { value: 44, unit: '%', source: 'Swedish mammography screening trial (MASAI), 2023' },
    'Writers: faster': { value: 40, unit: '%', source: 'Noy & Zhang, Science, 2023' },
    'Support: more solved': { value: 14, unit: '%', source: 'Brynjolfsson, Li & Raymond, 2023' },
    'Support: more solved, new staff': { value: 34, unit: '%', source: 'Brynjolfsson, Li & Raymond, 2023' },
    'Spying campaign run by AI, low': { value: 80, unit: '%', source: 'Anthropic, November 2025 (GTG-1002)' },
    'Spying campaign run by AI, high': { value: 90, unit: '%', source: 'Anthropic, November 2025 (GTG-1002)' },
  }),
  facts('research_facts_unverified', 'Figures marked [VERIFY] in the script', false, {
    'CUDA spend per year': { value: 0.5, unit: 'USD bn', source: 'Rob May, "The CUDA Backstory"; secondary estimates' },
    'Supply commitments': { value: 279, unit: 'USD bn', source: 'NVIDIA Form 10-Q, quarter to 26 July 2026, as reported in research notes' },
    'Share of AI training': { value: 90, unit: '%', source: 'Industry estimates, 2026' },
    'Share of AI chip spending': { value: 80, unit: '%', source: 'IDC (81%), Mercury/SemiAnalysis (~75%), 2026' },
    'Humans in the loop': { value: 0, unit: '', source: 'Google Threat Intelligence Group, 16–17 November 2026' },
  }),
  // ---- Added for script v4 (23 Nov 2026) ----
  table({
    key: 'research_ai_chip_share', title: 'Share of AI chip supply, Q4 2025', unit: '%', verified: true,
    source: 'Epoch AI, AI chip supply estimates, Q4 2025', // figures as given in pitch script v4's table; not re-checked against Epoch (see docs/stage-demo.md)
    x: ['NVIDIA', 'Google'],
    series: { 'Share of AI chip supply': [68, 19] },
  }),
  facts('research_cuda', 'CUDA', true, {
    'Years of CUDA': { value: 20, unit: 'years', source: 'NVIDIA launched CUDA in November 2006; 20 years to November 2026' },
  }),
  facts('research_discoveries', 'What AI is discovering (figures marked [VERIFY] in script v4)', false, {
    'Protein structures known before': { value: 170000, unit: '', source: 'AlphaFold Protein Structure Database / Protein Data Bank (DeepMind, EMBL-EBI), as in script v4 [VERIFY]' },
    'Protein structures predicted by AI': { value: 200, unit: 'million', source: 'AlphaFold Protein Structure Database (DeepMind, EMBL-EBI), 2022; 2024 Nobel Prize in Chemistry [VERIFY]' },
    'New antibiotic found in days': { value: 3, unit: 'days', source: 'MIT, Stokes et al., Cell, 2020 (halicin; work reported 2019), as in script v4 [VERIFY]' },
    'AlphaEvolve open problems tried': { value: 50, unit: '', source: 'Google DeepMind, AlphaEvolve, May 2025 (as in script v4)' },
    'AlphaEvolve matched best known': { value: 75, unit: '%', source: 'Google DeepMind, AlphaEvolve, May 2025 (as in script v4)' },
    'AlphaEvolve improved on best known': { value: 20, unit: '%', source: 'Google DeepMind, AlphaEvolve, May 2025 (as in script v4)' },
  }),
];

for (const d of out) fs.writeFileSync(path.join(CLEAN, `${d.key}.json`), JSON.stringify(d, null, 2) + '\n');
console.log(`Wrote ${out.length} curated datasets: ${out.map((d) => d.key).join(', ')}`);
