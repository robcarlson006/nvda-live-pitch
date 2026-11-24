import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './returns.css';

/**
 * "The cash goes back to shareholders." Where the money goes, as a picture:
 *   title             — NVIDIA's cash (a vault of blocks), the shares, and a row of shareholders
 *   1 "last quarter"  — coins arc out of the vault: some buy shares back (those shares vanish: buybacks),
 *                       some land on the shareholders (dividends)
 *   2 "is authorized" — a dashed reserve appears under the vault: more buybacks still to use
 *   3 "excess"        — a steady stream of coins runs from the vault to the shareholders: the policy, ongoing
 * Counts of coins, shares and people are illustrative only and mean nothing. The real figures are in the slide's
 * points, looked up from data/research. Nothing here is a scale.
 */

const VAULT = { x: 170, y: 330, cols: 7, rows: 9, px: 26 };
const SHARES = { x: 500, y: 300, cols: 8, rows: 6, px: 32 };
const HOLDERS = [530, 590, 650, 710, 770].map((x) => ({ x, y: 760 }));
const ORIGIN = { x: VAULT.x + (VAULT.cols * VAULT.px) / 2, y: VAULT.y + 20 };

type Flight = { to: { x: number; y: number }; d: number; kind: 'buyback' | 'dividend'; target?: number };

function flights(): { list: Flight[]; bought: Map<number, number> } {
  const rand = rng(27);
  const bought = new Map<number, number>();
  const list: Flight[] = [];
  // Buybacks: ten shares are bought back and retired.
  const picks = new Set<number>();
  while (picks.size < 10) picks.add(Math.floor(rand() * SHARES.cols * SHARES.rows));
  [...picks].forEach((i, n) => {
    const d = 0.3 + n * 0.16;
    bought.set(i, d + 0.9);
    list.push({ kind: 'buyback', d, target: i, to: { x: SHARES.x + (i % SHARES.cols) * SHARES.px + 14, y: SHARES.y + Math.floor(i / SHARES.cols) * SHARES.px + 14 } });
  });
  // Dividends: a coin for each shareholder.
  HOLDERS.forEach((h, n) => list.push({ kind: 'dividend', d: 1.2 + n * 0.18, to: { x: h.x, y: h.y - 58 } }));
  return { list, bought };
}

function Coin({ f, loop }: { f: Flight; loop?: boolean }) {
  const dx = f.to.x - ORIGIN.x;
  const dy = f.to.y - ORIGIN.y;
  const peak = Math.min(dy, 0) - 140;
  return (
    <g className={`rt-x${loop ? ' loop' : ''}`} style={{ '--dx': `${dx}px`, '--d': `${f.d}s` } as CSSProperties}>
      <g className={`rt-y${loop ? ' loop' : ''}`} style={{ '--dy': `${dy}px`, '--peak': `${peak}px`, '--d': `${f.d}s` } as CSSProperties}>
        <g className={`rt-coin ${f.kind}${loop ? ' loop' : ''}`} style={{ '--d': `${f.d}s` } as CSSProperties}>
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="11" />
          <rect x={ORIGIN.x - 2} y={ORIGIN.y - 6} width="4" height="12" />
        </g>
      </g>
    </g>
  );
}

export function Returns({ stage }: SceneProps) {
  const { list, bought } = flights();
  const rand = rng(9);
  return (
    <svg className={`returns-scene s${Math.min(stage, 3)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <text className="rt-head" x={ORIGIN.x} y={VAULT.y - 34}>NVIDIA cash</text>
      <g className="rt-vault">
        {Array.from({ length: VAULT.cols * VAULT.rows }, (_, i) => (
          <rect
            key={i}
            x={VAULT.x + (i % VAULT.cols) * VAULT.px}
            y={VAULT.y + Math.floor(i / VAULT.cols) * VAULT.px}
            width={VAULT.px - 3}
            height={VAULT.px - 3}
            style={{ '--d': `${0.2 + (VAULT.rows - 1 - Math.floor(i / VAULT.cols)) * 0.05 + rand() * 0.12}s` } as CSSProperties}
          />
        ))}
      </g>

      <text className="rt-head" x={SHARES.x + (SHARES.cols * SHARES.px) / 2} y={SHARES.y - 34}>Shares</text>
      <g className="rt-shares">
        {Array.from({ length: SHARES.cols * SHARES.rows }, (_, i) => (
          <rect
            key={i}
            className={stage >= 1 && bought.has(i) ? 'gone' : ''}
            x={SHARES.x + (i % SHARES.cols) * SHARES.px}
            y={SHARES.y + Math.floor(i / SHARES.cols) * SHARES.px}
            width={SHARES.px - 5}
            height={SHARES.px - 5}
            rx="3"
            style={{ '--d': `${0.4 + (i % SHARES.cols) * 0.03}s`, '--gone': `${bought.get(i) ?? 0}s` } as CSSProperties}
          />
        ))}
      </g>
      {stage >= 1 && <text className="rt-tag buyback" x={SHARES.x + (SHARES.cols * SHARES.px) / 2} y={SHARES.y + SHARES.rows * SHARES.px + 44}>bought back</text>}

      <g className="rt-holders">
        {HOLDERS.map((h, i) => (
          <g key={i} style={{ '--d': `${0.6 + i * 0.08}s` } as CSSProperties}>
            <circle cx={h.x} cy={h.y - 20} r="13" />
            <path d={`M ${h.x - 22} ${h.y + 26} Q ${h.x - 22} ${h.y} ${h.x} ${h.y} Q ${h.x + 22} ${h.y} ${h.x + 22} ${h.y + 26} Z`} />
          </g>
        ))}
      </g>
      <text className="rt-head small" x="650" y="850">Shareholders</text>
      {stage >= 1 && <text className="rt-tag dividend" x="650" y="652">dividends</text>}

      {stage >= 1 && list.map((f, i) => <Coin key={i} f={f} />)}

      {/* Authorised, not yet used: a reserve drawn in outline under the vault. Its size is not to scale. */}
      {stage >= 2 && (
        <g className="rt-reserve">
          <rect x={VAULT.x - 6} y={VAULT.y + VAULT.rows * VAULT.px + 30} width={VAULT.cols * VAULT.px + 9} height="200" rx="6" />
          <text x={ORIGIN.x} y={VAULT.y + VAULT.rows * VAULT.px + 140}>still to use</text>
        </g>
      )}

      {/* The policy: the excess keeps flowing back. */}
      {stage >= 3 &&
        HOLDERS.map((h, i) => <Coin key={`s${i}`} loop f={{ kind: 'dividend', d: i * 0.36, to: { x: h.x, y: h.y - 58 } }} />)}
    </svg>
  );
}
