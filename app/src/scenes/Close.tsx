import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './close.css';

/**
 * "The AI industry runs on infrastructure NVIDIA built." The pitch's last picture, calling back to two earlier ones:
 *   title                   — NVIDIA's four layers slide in as the ground, and a pixel city of AI builds on top of them,
 *                             with the Wall Street tower (the one that lost its top half) rebuilt whole in the middle
 *   1 "hardware and software" — the four layers light, bottom to top, and the light rises up into the city
 *   2 "a buy"               — the tower's crown lights up green: the pitch ends where Wall Street once walked away
 * A picture, not data: building heights and window counts are arbitrary.
 */

const CELL = 22;
const GAP = 3;
const GROUND = 740;
const STRATA = ['Supply', 'Connections', 'Software', 'Chips'] as const; // top to bottom; chips are the foundation

// The Wall Street tower again: [columns wide, rows tall], from the ground up.
const TOWER: [number, number][] = [[14, 13], [10, 7], [6, 5], [2, 4]];
const CROWN_FROM = 20; // rows from here up are the crown that lights on "a buy"
// The rest of the city: [left x, columns, rows].
const CITY: [number, number, number][] = [
  [20, 4, 9], [116, 5, 14], [236, 3, 6], [545, 4, 11], [645, 3, 17], [725, 3, 8],
];

type Block = { x: number; y: number; d: number; lit: boolean; crown?: boolean; city?: boolean };

function blocks(): Block[] {
  const rand = rng(2026);
  const out: Block[] = [];
  CITY.forEach(([left, cols, rows], b) => {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      out.push({ x: left + c * CELL, y: GROUND - (r + 1) * CELL, d: 1.1 + b * 0.08 + r * 0.04 + rand() * 0.1, lit: rand() < 0.3, city: true });
  });
  let row = 0;
  for (const [cols, rows] of TOWER) {
    const left = 400 - (cols * CELL) / 2;
    for (let r = 0; r < rows; r++, row++) for (let c = 0; c < cols; c++)
      out.push({ x: left + c * CELL, y: GROUND - (row + 1) * CELL, d: 1 + row * 0.05 + rand() * 0.1, lit: c > 0 && c < cols - 1 && rand() < 0.34, crown: row >= CROWN_FROM });
  }
  return out;
}

export function Close({ stage }: SceneProps) {
  const city = blocks();
  return (
    <svg className={`close-scene s${Math.min(stage, 2)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cl-rise" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#76b900" stopOpacity="0.35" />
          <stop offset="1" stopColor="#76b900" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* The light rising from the layers into the city (step 1). */}
      <rect className="cl-rise" x="0" y="340" width="800" height={GROUND - 340} fill="url(#cl-rise)" />

      <g className="cl-city">
        {city.map((b, i) => (
          <rect
            key={i}
            className={`cl-block${b.lit ? ' lit' : ''}${b.crown ? ' crown' : ''}${b.city ? ' city' : ''}`}
            x={b.x}
            y={b.y}
            width={CELL - GAP}
            height={CELL - GAP}
            style={{ '--d': `${b.d}s`, '--w': `${(GROUND - b.y) / 900}s` } as CSSProperties}
          />
        ))}
      </g>

      {/* The ground the city stands on: NVIDIA's four layers. */}
      <g className="cl-strata">
        {STRATA.map((name, k) => {
          const y = GROUND + 8 + k * 50;
          const fromBottom = STRATA.length - 1 - k;
          return (
            <g key={name} className="cl-stratum" style={{ '--k': k, '--b': fromBottom } as CSSProperties}>
              <rect x="0" y={y} width="800" height="42" rx="3" />
              <text x="20" y={y + 29}>{name}</text>
            </g>
          );
        })}
      </g>

      {/* "A buy": a beacon on the tower's crown. */}
      <g className="cl-beacon">
        <circle cx="400" cy={GROUND - (TOWER.reduce((n, [, r]) => n + r, 0) + 1) * CELL + 6} r="10" />
        <circle className="cl-ring" cx="400" cy={GROUND - (TOWER.reduce((n, [, r]) => n + r, 0) + 1) * CELL + 6} r="10" />
      </g>
    </svg>
  );
}
