import type { Slide } from '../shared/schema.ts';

// M1 test slides. Replaced by the scripted spine in docs/script/ at M5.
export const demoSlides: Slide[] = [
  {
    id: 'demo-beat',
    speaker: "Mi'kael",
    kicker: 'Financials',
    title: 'Thirteen quarters. Thirteen beats.',
    bullets: [
      'Revenue has beaten analyst consensus every quarter since FY24 Q3',
      'Quarterly revenue up from $18bn to $116bn in three years',
      'FY27 Q3 is preliminary',
    ],
    chart: { type: 'line', datasetKey: 'nvda_revenue_quarterly', series: ['Revenue', 'Consensus'], highlight: 'FY27 Q3' },
    sources: [],
  },
  {
    id: 'demo-annual',
    speaker: "Mi'kael",
    kicker: 'Financials',
    title: 'From gaming chips to the engine of AI',
    bullets: ['Annual revenue up about 8x in four fiscal years', 'FY26: $216bn'],
    chart: { type: 'bar', datasetKey: 'nvda_revenue_annual', series: ['Revenue'], highlight: 'FY26' },
    sources: [],
  },
  {
    id: 'demo-why',
    speaker: 'Rob',
    kicker: 'Why NVIDIA',
    title: 'It started with a bet on graphics',
    bullets: ['Text-only slide test', 'Each line builds in as it is spoken'],
    sources: [],
  },
];
