import { useMemo, type CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import './wallstreet.css';

/**
 * "Wall Street hated it." A pixel skyscraper builds from the ground up, row by row (the idea comes from the
 * Statue of Liberty build in our FBLA nationals deck), with a skyline rising behind it. Built with the speaker:
 *   title / point 1  — the tower and skyline rise, block by block; windows flicker on once a floor is built
 *   point 2 "stock halved" — the top of the tower breaks away and falls, the lights go out, a red line crashes down
 *   point 3 "revenue stalled" — the chart builds, so the scene steps back to a faint backdrop behind it
 * It is a picture, not a chart: the tower losing its top half is a metaphor for the words on the slide, and the scene
 * draws no axis, scale or figure. The real numbers are in the slide's own chart, looked up from data/clean/.
 */

const CELL = 22; // pitch of one pixel block in the 800 × 1000 viewBox
const GAP = 3;
const GROUND = 900;

// The tower: an Art Deco setback skyscraper, as [columns wide, rows tall] from the ground up.
const TOWER: [number, number][] = [
  [14, 17],
  [10, 9],
  [6, 6],
  [2, 4],
];
// Rows from here up break away on "stock halved": a little more than half the tower, as the slide says.
const CUT = 16;

// The skyline either side: [left x, columns wide, rows tall]. Dimmer, and built just after the tower starts.
const SKYLINE: [number, number, number][] = [
  [30, 5, 12], [150, 4, 18], [248, 3, 8],
  [565, 3, 10], [645, 5, 21], [762, 2, 7],
];

type Block = { x: number; y: number; row: number; lit: boolean; delay: number; fall?: { x: number; y: number; r: number; d: number } };

/** A seeded random, so the tower is the same on every screen and every rehearsal. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function buildTower(rand: () => number): Block[] {
  const out: Block[] = [];
  let row = 0;
  for (const [cols, rows] of TOWER) {
    const left = 400 - (cols * CELL) / 2;
    for (let r = 0; r < rows; r++, row++) {
      for (let c = 0; c < cols; c++) {
        const edge = c === 0 || c === cols - 1;
        out.push({
          x: left + c * CELL,
          y: GROUND - (row + 1) * CELL,
          row,
          lit: !edge && rand() < 0.3,
          delay: 0.35 + row * 0.05 + rand() * 0.14,
          fall:
            row >= CUT
              ? { x: (rand() - 0.5) * 520, y: 260 + rand() * 520, r: (rand() - 0.5) * 220, d: (row - CUT) * -0.02 + 0.45 + rand() * 0.35 }
              : undefined,
        });
      }
    }
  }
  return out;
}

function buildSkyline(rand: () => number): Block[] {
  const out: Block[] = [];
  SKYLINE.forEach(([left, cols, rows], b) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({ x: left + c * CELL, y: GROUND - (r + 1) * CELL, row: r, lit: rand() < 0.22, delay: 0.7 + b * 0.09 + r * 0.04 + rand() * 0.1 });
      }
    }
  });
  return out;
}

// The crash: a jagged line that starts high on the left and falls away to the bottom right.
const CRASH = 'M 60 250 L 170 300 L 230 270 L 320 420 L 380 380 L 470 560 L 540 520 L 640 720 L 760 790';

export function WallStreet({ stage }: SceneProps) {
  const { tower, skyline } = useMemo(() => {
    const rand = rng(2008);
    return { tower: buildTower(rand), skyline: buildSkyline(rand) };
  }, []);
  const crashed = stage >= 2;
  const receded = stage >= 3;

  return (
    <svg className={`wall-street${crashed ? ' crashed' : ''}${receded ? ' receded' : ''}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="ws-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#76b900" stopOpacity="0" />
          <stop offset="1" stopColor="#76b900" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* A soft green glow comes up from the street as the tower rises. */}
      <rect className="ws-haze" x="0" y="420" width="800" height={GROUND - 420} fill="url(#ws-glow)" />

      <g className="ws-skyline">
        {skyline.map((b, i) => (
          <rect key={i} className={`ws-block${b.lit ? ' lit' : ''}`} x={b.x} y={b.y} width={CELL - GAP} height={CELL - GAP} style={{ '--d': `${b.delay}s` } as CSSProperties} />
        ))}
      </g>

      <g className="ws-tower">
        {tower.map((b, i) => (
          <rect
            key={i}
            className={`ws-block${b.lit ? ' lit' : ''}${b.fall ? ' top' : ''}${b.fall && crashed ? ' fall' : ''}`}
            x={b.x}
            y={b.y}
            width={CELL - GAP}
            height={CELL - GAP}
            style={
              {
                '--d': `${b.delay}s`,
                ...(b.fall && { '--fx': `${b.fall.x}px`, '--fy': `${b.fall.y}px`, '--fr': `${b.fall.r}deg`, '--fd': `${Math.max(0, b.fall.d)}s` }),
              } as CSSProperties
            }
          />
        ))}
      </g>

      {/* The street: the ground line draws first, and the tower builds up from it. */}
      <line className="ws-ground" x1="0" y1={GROUND + 1} x2="800" y2={GROUND + 1} pathLength={1} />
      <g className="ws-sign" transform={`translate(${400 - 7 * CELL - 4} ${GROUND + 26})`}>
        <rect width="128" height="34" rx="3" />
        <text x="64" y="24">WALL ST</text>
      </g>

      <path className="ws-crash" d={CRASH} pathLength={1} />
    </svg>
  );
}
