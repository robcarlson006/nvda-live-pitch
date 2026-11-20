import type { Slide } from '../shared/schema.ts';

// M1 test slides, one per layout. Replaced by the scripted spine in docs/script/ at M5.
export const demoSlides: Slide[] = [
  {
    id: 'demo-statement',
    layout: 'statement',
    speaker: 'Rob',
    title: 'In 1993 three engineers bet that graphics would become computing.',
    bullets: [],
    sources: [],
  },
  {
    id: 'demo-number',
    layout: 'number',
    speaker: "Mi'kael",
    title: 'Revenue in a single quarter',
    bullets: [],
    stat: { datasetKey: 'nvda_revenue_quarterly', series: 'Revenue', x: 'FY27 Q3', label: 'Three months to 25 October 2026. Consensus expected $109.3bn.' },
    sources: [],
  },
  {
    id: 'demo-beat',
    layout: 'split',
    speaker: "Mi'kael",
    title: 'Revenue has beaten consensus thirteen quarters running',
    bullets: ['Up from $18bn a quarter to $116bn in three years', 'The latest quarter is preliminary'],
    chart: { type: 'line', datasetKey: 'nvda_revenue_quarterly', series: ['Revenue', 'Consensus'], highlight: 'FY27 Q3' },
    sources: [],
  },
  {
    id: 'demo-annual',
    layout: 'chart',
    speaker: "Mi'kael",
    title: 'Annual revenue grew about eightfold in four years',
    bullets: [],
    chart: { type: 'bar', datasetKey: 'nvda_revenue_annual', series: ['Revenue'], highlight: 'FY26' },
    sources: [],
  },
];
