import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import './recommendation.css';

/**
 * "Our recommendation: Buy." The position, sized on a picture of the whole portfolio:
 *   title                — a 10 × 10 grid builds: the portfolio, one square per percent
 *   1 "three percent"    — three squares light green (our NVDA position) inside a dashed row of ten: our limit for one stock
 *   2 "all three rates"  — three markers rise above a line marked today's price: the base case is above it at every rate
 *   3 "bear case"        — a red outline round the three squares: the most the portfolio can lose is this position
 *   4 "we would add"     — the rest of the limit row glows faintly (room to add, if the signals hold), with a way out to sell
 * The 3 and 10 are the slide's own words (a 3% position; a 10% single-stock limit): they are the board's sizing, not
 * market data. The markers in step 2 sit at an equal height on purpose: the picture says "above", the points give the
 * values. The red outline is true by construction: a long position can't lose more than its own size.
 */

const N = 10;
const PX = 46;
const GRID = { x: 170, y: 170 };
const POSITION = 3;
const LIMIT = 10;

export function Recommendation({ stage }: SceneProps) {
  const cellX = (i: number) => GRID.x + (i % N) * PX;
  const cellY = (i: number) => GRID.y + Math.floor(i / N) * PX;
  return (
    <svg className={`rec-scene s${Math.min(stage, 4)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <text className="rec-head" x={GRID.x - 8} y={GRID.y - 72}>Our portfolio, one square per percent</text>

      <g className="rec-grid">
        {Array.from({ length: N * N }, (_, i) => (
          <rect
            key={i}
            className={`${i < POSITION ? 'nvda' : ''}${i >= POSITION && i < LIMIT ? ' room' : ''}`}
            x={cellX(i)}
            y={cellY(i)}
            width={PX - 6}
            height={PX - 6}
            rx="4"
            style={{ '--d': `${0.2 + (Math.floor(i / N) + (i % N)) * 0.025}s`, '--k': i } as CSSProperties}
          />
        ))}
      </g>

      {/* Step 1: the position and the single-stock limit. */}
      <rect className="rec-limit" x={GRID.x - 8} y={GRID.y - 8} width={LIMIT * PX + 4} height={PX + 4} rx="8" />
      <g className="rec-note limit">
        <text x={GRID.x + LIMIT * PX - 6} y={GRID.y - 22}>our limit for one stock</text>
      </g>
      <g className="rec-note nvda">
        <text x={GRID.x - 4} y={GRID.y - 22}>NVDA</text>
      </g>

      {/* Step 3: the most at risk. */}
      <rect className="rec-risk" x={GRID.x - 5} y={GRID.y - 5} width={POSITION * PX - 2} height={PX - 2} rx="6" />
      <g className="rec-note risk">
        <text x={GRID.x - 4} y={GRID.y + PX + 34}>the most we can lose: this position</text>
      </g>

      {/* Step 2: above today's price, at all three rates. Equal heights: this shows "above", not by how much. */}
      <g className="rec-rates">
        <line className="rec-price" x1={GRID.x} y1="860" x2={GRID.x + N * PX - 6} y2="860" />
        <text className="rec-price-label" x={GRID.x + N * PX - 6} y="896">today's price</text>
        {[0, 1, 2].map((k) => {
          const x = GRID.x + 70 + k * 150;
          return (
            <g key={k} className="rec-rate" style={{ '--k': k } as CSSProperties}>
              <line x1={x} y1="860" x2={x} y2="762" />
              <path d={`M ${x - 16} 778 L ${x} 756 L ${x + 16} 778`} />
            </g>
          );
        })}
        <text className="rec-rates-label" x={GRID.x} y="728">our base case, at each discount rate</text>
      </g>

      {/* Step 4: room to add, and a way out. */}
      <g className="rec-note add">
        <text x={GRID.x + POSITION * PX + 8} y={GRID.y + PX / 2 + 8}>+ room to add</text>
      </g>
    </svg>
  );
}
