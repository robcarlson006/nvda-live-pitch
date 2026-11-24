import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './first-gpu.css';

/**
 * "1999: the world's first GPU." A chip builds itself, then a track runs through the milestones the slide names:
 *   title                       — the chip's pins draw in and its die fills pixel by pixel, then the track reaches 1999
 *   1 "nvidia for xbox"         — the track runs on to 2000, and a games console appears
 *   2 "company of the year"     — on to 2007, and a pixel star
 *   3 "could have stopped"      — the track reaches a stop... and a faint dashed path keeps going off the edge:
 *                                 the bet the next slide (CUDA) is about
 * The only figures are the years the slide itself shows. The console is a generic shape, not any company's design.
 */

const CHIP = { cx: 400, cy: 300, s: 300 };
const DIE = 8;
const TRACK_Y = 760;
const STOPS = [
  { x: 110, year: '1999' },
  { x: 310, year: '2000' },
  { x: 510, year: '2007' },
] as const;
const END_X = 640;

// A five-point star in pixels, for "company of the year".
const STAR = ['...X...', '...X...', '..XXX..', 'XXXXXXX', '.XXXXX.', '..XXX..', '.XX.XX.', 'XX...XX'];

export function FirstGpu({ stage }: SceneProps) {
  const rand = rng(1999);
  const die = Array.from({ length: DIE * DIE }, (_, i) => ({ r: Math.floor(i / DIE), c: i % DIE, d: 0.7 + Math.floor(i / DIE) * 0.07 + rand() * 0.25 }));
  const pin = CHIP.s / 12;
  const pins = Array.from({ length: 10 }, (_, i) => CHIP.cx - CHIP.s / 2 + pin * (i + 1.5));
  const reached = stage >= 3 ? END_X : STOPS[Math.min(stage, 2)].x;
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

      {/* 2000: a games console (generic). */}
      {stage >= 1 && (
        <g className="fg-icon" transform={`translate(${STOPS[1].x} ${TRACK_Y - 90})`}>
          <rect x="-58" y="-34" width="116" height="62" rx="10" className="fg-box" />
          <rect x="-40" y="-14" width="52" height="6" rx="3" className="fg-slot" />
          <circle cx="34" cy="-2" r="9" className="fg-btn" />
          <rect x="-50" y="28" width="16" height="8" className="fg-foot" />
          <rect x="34" y="28" width="16" height="8" className="fg-foot" />
        </g>
      )}

      {/* 2007: a pixel star. */}
      {stage >= 2 && (
        <g className="fg-icon star" transform={`translate(${STOPS[2].x - 49} ${TRACK_Y - 150})`}>
          {STAR.flatMap((row, r) =>
            [...row].map((ch, c) =>
              ch === 'X' ? <rect key={`${r}-${c}`} x={c * 14} y={r * 14} width="12" height="12" style={{ '--d': `${(r + c) * 0.04}s` } as CSSProperties} /> : null,
            ),
          )}
        </g>
      )}

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
