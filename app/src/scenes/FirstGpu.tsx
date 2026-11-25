import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './first-gpu.css';

/**
 * "1999: the world's first GPU." A chip builds itself, then a track runs on from 1999:
 *   title                       — the chip's pins draw in and its die fills pixel by pixel, then the track reaches 1999
 *   1 "could have stopped"      — the track runs to a stop... and a faint dashed path keeps going off the edge:
 *                                 the bet the next slide (CUDA) is about
 * The Xbox (2000) and Forbes (2007) milestones were cut from the script on 25 Nov, so the track no longer stops there.
 * The only figure is the year the slide itself shows.
 */

const CHIP = { cx: 400, cy: 300, s: 300 };
const DIE = 8;
const TRACK_Y = 760;
const STOPS = [{ x: 110, year: '1999' }] as const;
const END_X = 640;

export function FirstGpu({ stage: points }: SceneProps) {
  const stage = points >= 1 ? 3 : 0; // one point now: "they could have stopped there" runs the track to the stop
  const rand = rng(1999);
  const die = Array.from({ length: DIE * DIE }, (_, i) => ({ r: Math.floor(i / DIE), c: i % DIE, d: 0.7 + Math.floor(i / DIE) * 0.07 + rand() * 0.25 }));
  const pin = CHIP.s / 12;
  const pins = Array.from({ length: 10 }, (_, i) => CHIP.cx - CHIP.s / 2 + pin * (i + 1.5));
  const reached = stage >= 3 ? END_X : STOPS[0].x;
  const half = CHIP.s / 2;

  return (
    <svg className={`first-gpu s${Math.min(stage, 3)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      {/* The chip: substrate, pins round all four sides, then the die fills in. */}
      <g className="fg-chip">
        <rect className="fg-sub" x={CHIP.cx - half} y={CHIP.cy - half} width={CHIP.s} height={CHIP.s} rx="14" />
        {pins.map((p, i) => (
          <g key={i} className="fg-pins" style={{ '--d': `${0.25 + i * 0.03}s` } as CSSProperties}>
            <line x1={p} y1={CHIP.cy - half} x2={p} y2={CHIP.cy - half - 26} />
            <line x1={p} y1={CHIP.cy + half} x2={p} y2={CHIP.cy + half + 26} />
            <line x1={CHIP.cx - half} y1={p - CHIP.cx + CHIP.cy} x2={CHIP.cx - half - 26} y2={p - CHIP.cx + CHIP.cy} />
            <line x1={CHIP.cx + half} y1={p - CHIP.cx + CHIP.cy} x2={CHIP.cx + half + 26} y2={p - CHIP.cx + CHIP.cy} />
          </g>
        ))}
        {die.map(({ r, c, d }, i) => (
          <rect
            key={i}
            className="fg-cell"
            x={CHIP.cx - 100 + c * 25}
            y={CHIP.cy - 100 + r * 25}
            width="22"
            height="22"
            style={{ '--d': `${d}s` } as CSSProperties}
          />
        ))}
        <text className="fg-gpu" x={CHIP.cx} y={CHIP.cy + 22}>GPU</text>
      </g>

      {/* The track. */}
      <line className="fg-rail" x1="60" y1={TRACK_Y} x2={END_X} y2={TRACK_Y} />
      {/* The lit part of the track runs on to each milestone: a dash that grows along the rail. */}
      <line className="fg-run" x1="60" y1={TRACK_Y} x2={END_X} y2={TRACK_Y} pathLength={1} style={{ strokeDashoffset: 1 - (reached - 60) / (END_X - 60) }} />
      {stage >= 3 && <path className="fg-beyond" d={`M ${END_X} ${TRACK_Y} C ${END_X + 60} ${TRACK_Y}, ${END_X + 80} ${TRACK_Y - 120}, 820 ${TRACK_Y - 230}`} pathLength={1} />}

      {STOPS.map((s, i) => (
        <g key={s.year} className={`fg-stop${stage >= i ? ' on' : ''}`}>
          <circle cx={s.x} cy={TRACK_Y} r="13" />
          <text x={s.x} y={TRACK_Y + 52}>{s.year}</text>
        </g>
      ))}

      {/* "They could have stopped there": a stop at the end of the line... */}
      {stage >= 3 && (
        <g className="fg-end" transform={`translate(${END_X} ${TRACK_Y})`}>
          <line x1="0" y1="0" x2="0" y2="-74" />
          <rect x="0" y="-74" width="58" height="34" rx="3" />
          <text x="29" y="-50">STOP</text>
        </g>
      )}
    </svg>
  );
}
