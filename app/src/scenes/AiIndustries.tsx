import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';

/**
 * "AI is already delivering results": a board of industries beside the slide's three spoken examples.
 * The grid boots dim; each spoken example lights its tile in green as it is said; then the rest of the board lights
 * in a wave, so the room sees how many industries AI is already moving.
 *
 * Every tile is a checked item from docs/research/ai-breakthroughs-50.md (marked ✓ there, 24 Nov 2026), worded without
 * figures. Only one tile claims NVIDIA hardware (John Deere's See & Spray), because it is the only one the research
 * ties to NVIDIA directly. Several others (e.g. DeepMind's) ran on other chips: don't add "on NVIDIA" to them.
 */
type Tile = { industry: string; text: string; source: string; nvidia?: boolean };

// The first three are the slide's own spoken points, in order: they light as each one is said.
const SPOKEN: Tile[] = [
  { industry: 'Chemistry', text: 'A Nobel Prize for AI that predicts and designs proteins', source: 'Nobel Prize in Chemistry 2024' },
  { industry: 'Drug discovery', text: 'A lung-disease drug, from idea to clinical trials', source: 'Deck research (see slide source)' },
  { industry: 'Cancer screening', text: 'Breast screening in Sweden finds more cancers', source: 'Deck research (see slide source)' },
];

const MORE: Tile[] = [
  { industry: 'Farming', text: 'See & Spray sprays only the weeds', source: 'John Deere; NVIDIA developer blog', nvidia: true },
  { industry: 'Transport', text: 'Driverless cars crash less often than human drivers', source: 'IIHS, Jul 2026' },
  { industry: 'Archaeology', text: 'Read a scroll burnt by Vesuvius, without unrolling it', source: 'Live Science, Jun 2026' },
  { industry: 'Wildfires', text: 'Cameras spot fires before the first 911 call', source: 'Microsoft; Climate Central' },
  { industry: 'Aviation', text: 'Pilots steer around warming contrails', source: 'Google Research; AP, Mar 2026' },
  { industry: 'Medicine', text: 'New antibiotics against drug-resistant bacteria', source: 'MIT News, Aug 2025' },
  { industry: 'Energy', text: 'A battery material that needs less lithium', source: 'Microsoft; IEEE Spectrum' },
  { industry: 'Mining', text: 'A major high-grade copper find in Zambia', source: 'KoBold Metals' },
  { industry: 'Space', text: 'New planets found in Kepler telescope data', source: 'NASA ExoMiner' },
];

const COLS = 3;

export function AiIndustries({ stage }: SceneProps) {
  const tiles = [...SPOKEN, ...MORE];
  return (
    <div className={`ai-board${stage >= SPOKEN.length ? ' all-lit' : ''}`}>
      {tiles.map((t, i) => {
        const spoken = i < SPOKEN.length;
        const state = spoken ? (i < stage ? (i === stage - 1 ? 'now' : 'said') : 'idle') : stage >= SPOKEN.length ? 'lit' : 'idle';
        const row = Math.floor(i / COLS), col = i % COLS;
        return (
          <article
            key={t.industry}
            className={`ai-tile ${state}${t.nvidia ? ' nvidia' : ''}`}
            style={{ '--boot': `${0.35 + (row + col) * 0.08}s`, '--wave': `${0.9 + (row - 1 + col) * 0.16}s` } as CSSProperties}
          >
            <p className="ai-industry">
              {t.industry}
              {t.nvidia && <span className="ai-nv">NVIDIA GPUs</span>}
            </p>
            <p className="ai-text">{t.text}</p>
            <p className="ai-source">{t.source}</p>
          </article>
        );
      })}
    </div>
  );
}
