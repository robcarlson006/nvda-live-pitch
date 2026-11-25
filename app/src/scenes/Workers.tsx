import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import './legacy.css';

/**
 * "2006: CUDA." Workers, as a picture:
 *   1 normal processor — four big cores; a queue of jobs passes through them one after another
 *   2 graphics chip    — a field of small cores lights up all at once, in waves
 *   3 CUDA             — a code block appears and wires into the field: anyone can now put the cores to work
 *   4 free             — three gaming cards slide in, each stamped CUDA: it shipped free on every card
 * Counts of cores and jobs are illustrative only (no figures on this slide).
 */
const CPU = { x: 330, y: 190, n: 4, size: 74, gap: 22 };
const GPU = { x: 110, y: 560, cols: 24, rows: 10, px: 24 };

export function Workers({ stage }: SceneProps) {
  return (
    <svg className={`workers s${Math.min(stage, 4)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      {/* 1. A normal processor */}
      {stage >= 1 && (
        <g className="wk-cpu">
          <text className="wk-head" x={110} y={CPU.y - 50}>Processor (CPU)</text>
          {Array.from({ length: CPU.n }, (_, i) => (
            <rect key={i} className="wk-core" x={CPU.x + i * (CPU.size + CPU.gap)} y={CPU.y} width={CPU.size} height={CPU.size} rx="8" style={{ '--d': `${0.2 + i * 0.12}s`, '--k': i } as CSSProperties} />
          ))}
          {/* The queue: one job at a time slides into the cores and out the other side. */}
          {Array.from({ length: 8 }, (_, j) => (
            <rect key={j} className="wk-job" x={110} y={CPU.y + CPU.size / 2 - 11} width="22" height="22" rx="4" style={{ '--j': j } as CSSProperties} />
          ))}
          <text className="wk-cap" x={110} y={CPU.y + CPU.size + 56}>a few fast workers, one job after another</text>
        </g>
      )}

      {/* 2. A graphics chip */}
      {stage >= 2 && (
        <g className="wk-gpu">
          <text className="wk-head" x={GPU.x} y={GPU.y - 50}>Graphics chip (GPU)</text>
          {Array.from({ length: GPU.cols * GPU.rows }, (_, i) => {
            const c = i % GPU.cols;
            const r = Math.floor(i / GPU.cols);
            return <rect key={i} className="wk-cell" x={GPU.x + c * GPU.px} y={GPU.y + r * GPU.px} width={GPU.px - 6} height={GPU.px - 6} rx="2" style={{ '--w': (c + r) * 0.035 } as CSSProperties} />;
          })}
          <text className="wk-cap" x={GPU.x} y={GPU.y + GPU.rows * GPU.px + 44}>thousands of workers, all at the same time</text>
        </g>
      )}

      {/* 3. CUDA: the way in */}
      {stage >= 3 && (
        <g className="wk-cuda">
          {Array.from({ length: 6 }, (_, k) => (
            <path key={k} className="wk-wire" pathLength={1} d={`M 620 470 C 620 520, ${GPU.x + 60 + k * 100} 500, ${GPU.x + 60 + k * 100} ${GPU.y - 8}`} style={{ '--k': k } as CSSProperties} />
          ))}
          <rect className="wk-code" x={540} y={418} width={160} height={58} rx="10" />
          <text className="wk-code-t" x={620} y={456}>{'</> CUDA'}</text>
        </g>
      )}

      {/* 4. Free, on every gaming card */}
      {stage >= 4 && (
        <g className="wk-cards">
          {[0, 1, 2].map((k) => (
            <g key={k} className="wk-card" style={{ '--k': k } as CSSProperties}>
              <rect x={110 + k * 210} y={905} width={180} height={64} rx="8" />
              <circle cx={150 + k * 210} cy={937} r="18" />
              <circle cx={200 + k * 210} cy={937} r="18" />
              <text x={250 + k * 210} y={944}>CUDA</text>
            </g>
          ))}
          <text className="wk-free" x={760} y={898}>free</text>
        </g>
      )}
    </svg>
  );
}
