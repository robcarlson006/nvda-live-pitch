import type { CSSProperties } from 'react';
import { lookup } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './legacy.css';

/**
 * "Three: connections." From chips to a network:
 *   1 NVLink   — the rack's chips (count from research_facts) sit apart, NVLink lines join them, and they close into one
 *                giant chip outline
 *   2 Mellanox — the giant chip becomes one rack among several; networking cables light up between the racks
 *   3 revenue  — two bars to scale: what NVIDIA paid for Mellanox (2019) and what networking earned in one year (FY26)
 * The chip count and both money figures are lookups; rack count in step 2 is illustrative.
 */
const COLS = 9;
const CHIP = { x: 190, y: 150, px: 46 };

export function Connections({ stage, datasets = {} }: SceneProps) {
  const facts = datasets.research_facts;
  const n = Math.round(facts?.series['GPUs per NVL72 rack']?.[facts.x.indexOf('value')] ?? 72);
  const rows = Math.ceil(n / COLS);
  const paid = facts?.series['Mellanox price']?.[0] ?? null;
  const unv = datasets.research_facts_unverified;
  const net = unv?.series['Networking revenue FY26']?.[0] ?? null;
  const W = COLS * CHIP.px;
  const H = rows * CHIP.px;
  const top = Math.max(paid ?? 0, net ?? 0) || 1;
  const barH = (v: number) => (v / top) * 180;

  return (
    <svg className={`connections s${Math.min(stage, 3)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      {/* 1. One rack of chips, joined into one giant chip */}
      <g className="cn-rack">
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} className="cn-chip" x={CHIP.x + (i % COLS) * CHIP.px} y={CHIP.y + Math.floor(i / COLS) * CHIP.px} width={CHIP.px - 12} height={CHIP.px - 12} rx="4" style={{ '--d': `${0.1 + (i % COLS) * 0.03 + Math.floor(i / COLS) * 0.03}s` } as CSSProperties} />
        ))}
        {stage >= 1 && (
          <>
            {Array.from({ length: rows }, (_, r) => (
              <line key={`h${r}`} className="cn-link" pathLength={1} x1={CHIP.x} y1={CHIP.y + r * CHIP.px + (CHIP.px - 12) / 2} x2={CHIP.x + W - 12} y2={CHIP.y + r * CHIP.px + (CHIP.px - 12) / 2} style={{ '--k': r } as CSSProperties} />
            ))}
            {Array.from({ length: COLS }, (_, c) => (
              <line key={`v${c}`} className="cn-link" pathLength={1} x1={CHIP.x + c * CHIP.px + (CHIP.px - 12) / 2} y1={CHIP.y} x2={CHIP.x + c * CHIP.px + (CHIP.px - 12) / 2} y2={CHIP.y + H - 12} style={{ '--k': c * 0.5 } as CSSProperties} />
            ))}
            <rect className="cn-giant" x={CHIP.x - 14} y={CHIP.y - 14} width={W + 16} height={H + 16} rx="12" />
            <text className="cn-cap" x={CHIP.x - 14} y={CHIP.y + H + 46}>{n} chips act as one giant chip</text>
          </>
        )}
      </g>

      {/* 2. Racks wired together: the Mellanox networking */}
      {stage >= 2 && (
        <g className="cn-net">
          {[0, 1, 2, 3].map((k) => (
            <g key={k} className="cn-mini" style={{ '--k': k } as CSSProperties}>
              <rect x={110 + k * 160} y={620} width={110} height={70} rx="8" />
              {Array.from({ length: 6 }, (_, j) => <rect key={j} className="cn-mini-chip" x={122 + k * 160 + (j % 3) * 30} y={632 + Math.floor(j / 3) * 26} width="22" height="18" rx="2" />)}
            </g>
          ))}
          {[0, 1, 2].map((k) => (
            <path key={k} className="cn-cable" pathLength={1} d={`M ${220 + k * 160} 655 C ${245 + k * 160} 600, ${245 + k * 160} 600, ${270 + k * 160} 655`} style={{ '--k': k } as CSSProperties} />
          ))}
          <text className="cn-cap" x={110} y={730}>Mellanox: the network between the racks</text>
        </g>
      )}

      {/* 3. What it cost, against what it earns: to scale */}
      {stage >= 3 && paid != null && net != null && (
        <g className="cn-money">
          <line className="cn-base" x1={110} y1={990} x2={690} y2={990} />
          {[
            { v: paid, label: 'Paid, 2019', text: lookup(datasets, 'research_facts', 'Mellanox price', 'value'), x: 200, hi: false },
            { v: net, label: 'Earned in FY26', text: lookup(datasets, 'research_facts_unverified', 'Networking revenue FY26', 'value'), x: 470, hi: true },
          ].map((b, k) => (
            <g key={b.label} className={`cn-bar${b.hi ? ' hi' : ''}`} style={{ '--k': k } as CSSProperties}>
              <rect x={b.x} y={990 - barH(b.v)} width={130} height={barH(b.v)} rx="4" />
              <text className="cn-bar-val" x={b.x + 65} y={990 - barH(b.v) - 14}>{b.text}</text>
              <text className="cn-bar-lab" x={b.x + 65} y={990 - barH(b.v) - 50}>{b.label}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
