import type { CSSProperties } from 'react';
import { lookup, type Dataset } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './dcf.css';

/**
 * "Our base case in three numbers" — the drivers behind the DCF, one beat per point said:
 *   1 forecast period — a run of years; FY27 (now, not counted) in grey, the five forecast years light up green
 *   2 revenue CAGR    — base-case revenue bars grow on those years and an arc draws over them, labelled with the CAGR
 *   3 margins         — one dollar of sales splits into operating profit (EBIT margin) and the cash we value (FCF margin)
 * Bar heights and bar widths are drawn from the datasets (model_revenue_paths, model_dcf_summary); every label is a
 * lookup, so nothing on screen is typed.
 */
const YEARS = ['FY27', 'FY28', 'FY29', 'FY30', 'FY31', 'FY32'];
const X0 = 70;
const STEP = 116;
const W = 78;
const BASE = 560; // revenue baseline
const H = 360; // tallest bar
const MONEY = { x: 70, y: 800, w: 660, h: 64 };

const raw = (ds: Dataset | undefined, series: string, x: string) => ds?.series[series]?.[ds.x.indexOf(x)] ?? null;

export function DcfDrivers({ stage, datasets = {} }: SceneProps) {
  const paths = datasets.model_revenue_paths;
  const sum = datasets.model_dcf_summary;
  const rev = YEARS.map((y) => raw(paths, 'Base', y));
  const max = Math.max(...rev.map((v) => v ?? 0)) || 1;
  const top = (i: number) => BASE - ((rev[i] ?? 0) / max) * H;
  const cx = (i: number) => X0 + i * STEP + W / 2;
  const ebit = raw(sum, 'EBIT margin, FY26', 'value');
  const fcf = raw(sum, 'Free-cash-flow margin', 'value');
  const L = (series: string) => lookup(datasets, 'model_dcf_summary', series, 'value') ?? '';

  return (
    <svg className={`dcf-drivers s${Math.min(stage, 3)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      {/* 1. The forecast period */}
      {stage >= 1 && (
        <g className="dd-years">
          <line className="dd-axis" x1={X0 - 20} y1={BASE} x2={X0 + 5 * STEP + W + 20} y2={BASE} />
          {YEARS.map((y, i) => (
            <g key={y} className={i === 0 ? 'dd-now' : 'dd-fc'} style={{ '--d': `${0.2 + i * 0.16}s` } as CSSProperties}>
              <rect className="dd-slot" x={X0 + i * STEP} y={BASE - H - 20} width={W} height={H + 20} rx="6" />
              <text className="dd-year" x={cx(i)} y={BASE + 40}>{y}</text>
            </g>
          ))}
          <text className="dd-note" x={cx(0)} y={BASE + 72}>now</text>
          <path className="dd-bracket" d={`M ${X0 + STEP} ${BASE + 64} v 14 H ${X0 + 5 * STEP + W} v -14`} />
          <text className="dd-bracket-label" x={(X0 + STEP + X0 + 5 * STEP + W) / 2} y={BASE + 116}>
            {L('Forecast period')} of forecast, FY28 to FY32
          </text>
        </g>
      )}

      {/* 2. Revenue growth, compounded */}
      {stage >= 2 && paths && (
        <g className="dd-growth">
          {YEARS.map((y, i) => (
            <rect key={y} className={`dd-bar${i === 0 ? ' now' : ''}`} x={X0 + i * STEP + 8} y={top(i)} width={W - 16} height={BASE - top(i)} style={{ '--d': `${0.15 + i * 0.14}s` } as CSSProperties} />
          ))}
          <text className="dd-val" x={cx(0)} y={top(0) - 14}>{lookup(datasets, 'model_revenue_paths', 'Base', 'FY27')}</text>
          <text className="dd-val hi" x={cx(5)} y={top(5) - 14}>{lookup(datasets, 'model_revenue_paths', 'Base', 'FY32')}</text>
          <path className="dd-arc" pathLength={1} d={`M ${cx(0)} ${top(0) - 46} Q ${cx(1)} ${top(5) - 150} ${cx(5) - 10} ${top(5) - 48}`} />
          <g className="dd-cagr">
            <text className="dd-cagr-num" x={cx(1) + 10} y={top(5) - 84}>{L('Revenue CAGR, FY27–32')}</text>
            <text className="dd-cagr-cap" x={cx(1) + 10} y={top(5) - 50}>a year, compounded</text>
          </g>
        </g>
      )}

      {/* 3. Out of each dollar of sales */}
      {stage >= 3 && ebit != null && fcf != null && (
        <g className="dd-money">
          <text className="dd-head" x={MONEY.x} y={MONEY.y - 92}>Each $1 of sales</text>
          <rect className="dd-dollar" x={MONEY.x} y={MONEY.y} width={MONEY.w} height={MONEY.h} rx="6" />
          <text className="dd-dollar-label" x={MONEY.x + MONEY.w - 16} y={MONEY.y + 42}>$1</text>
          <rect className="dd-ebit" x={MONEY.x} y={MONEY.y} width={(ebit / 100) * MONEY.w} height={MONEY.h} rx="6" />
          <rect className="dd-fcf" x={MONEY.x} y={MONEY.y} width={(fcf / 100) * MONEY.w} height={MONEY.h} rx="6" />
          <g className="dd-tag ebit">
            <line x1={MONEY.x + (ebit / 100) * MONEY.w} y1={MONEY.y - 40} x2={MONEY.x + (ebit / 100) * MONEY.w} y2={MONEY.y} />
            <text x={MONEY.x + (ebit / 100) * MONEY.w} y={MONEY.y - 50} textAnchor="end">
              <tspan className="n">{L('EBIT margin, FY26')}</tspan> operating profit (EBIT), FY26
            </text>
          </g>
          <g className="dd-tag fcf">
            <line x1={MONEY.x + (fcf / 100) * MONEY.w} y1={MONEY.y + MONEY.h} x2={MONEY.x + (fcf / 100) * MONEY.w} y2={MONEY.y + MONEY.h + 30} />
            <text x={MONEY.x} y={MONEY.y + MONEY.h + 64}>
              <tspan className="n">{L('Free-cash-flow margin')}</tspan> kept as cash: what we value
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
