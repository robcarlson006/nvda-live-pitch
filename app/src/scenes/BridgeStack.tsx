import type { CSSProperties } from 'react';
import { lookup, type Dataset } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './dcf.css';

/**
 * "From cash flow to value per share": one bar, built from its parts as they are said, instead of a waterfall of
 * separate bars (where net cash was an unreadable sliver).
 *   1 five years of cash   — the bottom section (PV of FY28–32 cash flow) grows and lights green
 *   2 everything after     — the terminal-value section stacks on top; a bracket marks the enterprise value, and a ring
 *                            shows how much of it comes after FY32
 *   3 no net debt          — net cash caps the bar (thin, so it gets its own callout); the whole bar is equity value
 *   4 divide by the shares — a line runs from the bar to one share: the implied value against today's price
 * Section heights are to scale (model_dcf_summary, USD tn); every label is a lookup.
 */
const BAR = { x: 110, w: 190, base: 900, h: 700 };

const raw = (ds: Dataset | undefined, s: string) => ds?.series[s]?.[0] ?? null;

export function BridgeStack({ stage, datasets = {} }: SceneProps) {
  const sum = datasets.model_dcf_summary;
  const pvF = raw(sum, 'PV of FCFs');
  const pvT = raw(sum, 'PV of terminal value');
  const eq = raw(sum, 'Equity value');
  const ev = raw(sum, 'Enterprise value');
  const share = raw(sum, 'Terminal value share of EV');
  const implied = raw(sum, 'Implied share price');
  const price = raw(sum, 'Share price');
  if (pvF == null || pvT == null || eq == null || ev == null) return null;
  const px = (v: number) => (v / eq) * BAR.h;
  const yF = BAR.base - px(pvF);
  const yT = yF - px(pvT);
  const yTop = BAR.base - BAR.h;
  const S = (s: string) => lookup(datasets, 'model_dcf_summary', s, 'value') ?? '';
  const netCash = lookup(datasets, 'model_dcf_inputs', 'Net cash', 'value') ?? '';
  const R = 15.9;
  const C = 2 * Math.PI * R;
  const lx = BAR.x + BAR.w + 40; // label column
  const on = (k: number) => (stage === k ? ' now' : stage > k ? ' done' : '');

  return (
    <svg className={`bridge-stack s${Math.min(stage, 4)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <rect className="bs-frame" x={BAR.x} y={yTop} width={BAR.w} height={BAR.h} rx="4" />
      <line className="bs-axis" x1={BAR.x - 30} y1={BAR.base} x2={BAR.x + BAR.w + 30} y2={BAR.base} />

      {stage >= 1 && (
        <g className={`bs-seg f${on(1)}`}>
          <rect x={BAR.x} y={yF} width={BAR.w} height={px(pvF)} />
          <text className="bs-lab" x={lx} y={yF + px(pvF) / 2 - 6}>Five years of cash, FY28–32</text>
          <text className="bs-val" x={lx} y={yF + px(pvF) / 2 + 30}>{S('PV of FCFs')}</text>
        </g>
      )}
      {stage >= 2 && (
        <g className={`bs-seg t${on(2)}`}>
          <rect x={BAR.x} y={yT} width={BAR.w} height={px(pvT)} />
          <text className="bs-lab" x={lx} y={yT + px(pvT) / 2 - 6}>Everything after FY32</text>
          <text className="bs-val" x={lx} y={yT + px(pvT) / 2 + 30}>{S('PV of terminal value')}</text>
          <path className="bs-bracket" d={`M ${BAR.x - 22} ${BAR.base} h -16 V ${yT} h 16`} />
          <text className="bs-ev" x={BAR.x - 50} y={(yT + BAR.base) / 2} transform={`rotate(-90 ${BAR.x - 50} ${(yT + BAR.base) / 2})`}>Enterprise value {S('Enterprise value')}</text>
          {share != null && (
            <g className="bs-ring" transform={`translate(${lx} ${yT + 40})`}>
              <circle cx="40" cy="40" r={R * 2.2} className="bs-ring-bg" />
              <circle cx="40" cy="40" r={R * 2.2} className="bs-ring-fg" style={{ '--len': `${(share / 100) * C * 2.2}`, '--c': `${C * 2.2}` } as CSSProperties} />
              <text className="bs-ring-pct" x="100" y="36">{S('Terminal value share of EV')}</text>
              <text className="bs-ring-cap" x="100" y="66">of the value comes after FY32</text>
            </g>
          )}
        </g>
      )}
      {stage >= 3 && (
        <g className={`bs-seg c${on(3)}`}>
          <rect x={BAR.x} y={yTop} width={BAR.w} height={Math.max(6, yT - yTop)} />
          <path className="bs-callout" d={`M ${BAR.x + BAR.w} ${yTop + 3} L ${lx - 10} ${yTop - 40}`} />
          <text className="bs-lab" x={lx} y={yTop - 66}>+ Net cash (no net debt)</text>
          <text className="bs-val" x={lx} y={yTop - 32}>{netCash}</text>
          <text className="bs-total" x={BAR.x + BAR.w / 2} y={yTop - 24}>Equity {S('Equity value')}</text>
        </g>
      )}
      {stage >= 4 && implied != null && price != null && (
        <g className="bs-share">
          <rect className="bs-share-box" x={lx - 10} y={540} width={440} height={212} rx="10" />
          <text className="bs-lab" x={lx + 10} y={578}>÷ {S('Diluted shares')} diluted shares</text>
          <text className="bs-per" x={lx + 10} y={642}>{S('Implied share price')}</text>
          <text className="bs-lab" x={lx + 10} y={684}>a share, against {S('Share price')} today</text>
          <text className="bs-up" x={lx + 10} y={726}>+{S('Upside')} upside</text>
        </g>
      )}
    </svg>
  );
}
