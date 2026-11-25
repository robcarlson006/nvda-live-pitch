import type { CSSProperties } from 'react';
import { lookup } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './recommendation.css';

/**
 * "Our recommendation: Buy." The position, sized on a picture of the whole portfolio:
 *   title                — a 10 × 10 grid builds: the portfolio, one square per percent
 *   1 "three percent"    — three squares light green (our NVDA position) inside a dashed row of ten: our limit for one stock
 *   2 "all three rates"  — value per share at each discount rate, as bars to scale, against a dashed line at today's price
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

const RATE_X = ['10.55% industry (Damodaran)', '14.45% Google Finance', '15.4% Bloomberg'];
const BARS = { x: 290, y: 700, gap: 64, h: 40, w: 400 };

export function Recommendation({ stage, datasets = {} }: SceneProps) {
  const rates = datasets.model_three_rates;
  const raw = (x: string) => rates?.series['Value per share']?.[rates.x.indexOf(x)] ?? null;
  const price = datasets.model_dcf_inputs?.series['Share price']?.[0] ?? null;
  const top = Math.max(...RATE_X.map((x) => raw(x) ?? 0)) || 1;
  const scale = (v: number) => (v / top) * BARS.w;
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

      {/* Step 2: value per share at each discount rate, to scale, against a dashed line at today's price. */}
      {price != null && (
        <g className="rec-rates">
          <text className="rec-rates-label" x={GRID.x} y={BARS.y - 30}>Value per share at each discount rate</text>
          {RATE_X.map((x, k) => {
            const v = raw(x) ?? 0;
            const y = BARS.y + k * BARS.gap;
            return (
              <g key={x} className="rec-rate" style={{ '--k': k } as CSSProperties}>
                <text className="rec-rate-name" x={GRID.x} y={y + 26}>{x.split(' ')[0]}</text>
                <rect x={BARS.x} y={y} width={scale(v)} height={BARS.h} rx="4" style={{ '--k': k } as CSSProperties} />
                <text className="rec-rate-val" x={BARS.x + scale(v) + 12} y={y + 28}>{lookup(datasets, 'model_three_rates', 'Value per share', x)}</text>
              </g>
            );
          })}
          <line className="rec-price" x1={BARS.x + scale(price)} y1={BARS.y - 14} x2={BARS.x + scale(price)} y2={BARS.y + 3 * BARS.gap} />
          <text className="rec-price-label" x={BARS.x + scale(price)} y={BARS.y + 3 * BARS.gap + 30}>today {lookup(datasets, 'model_dcf_inputs', 'Share price', 'value')}</text>
        </g>
      )}

      {/* Step 4: room to add, and a way out. */}
      <g className="rec-note add">
        <text x={GRID.x + POSITION * PX + 8} y={GRID.y + PX / 2 + 8}>+ room to add</text>
      </g>
    </svg>
  );
}
