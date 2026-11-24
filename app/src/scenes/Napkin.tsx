import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng, sketch } from './util.ts';
import './napkin.css';

/**
 * "1993. A booth at Denny's." The idea, sketched on a diner napkin. Built with the speaker:
 *   title             — a napkin lands on the table, coffee ring and all, and a pen writes "the idea:"
 *   1 "every pc"      — a 3D wireframe cube is sketched in pen, then a PC screen is drawn around it
 *   2 "video games"   — a pixel game controller pops out of the napkin in green, and an arrow says it pays for the 3D
 * Pen on paper is the point: everything else in the deck is digital, and this is where it started.
 * No figures: the only year (1993) is the slide's own.
 */

const INK = 'napkin-ink';

// The wireframe cube: a front square and a back square, joined at the corners.
const F = { x: 318, y: 352, s: 100 };
const B = { dx: 44, dy: -38 };
const CUBE = [
  sketch(F.x, F.y, F.x + F.s, F.y), sketch(F.x + F.s, F.y, F.x + F.s, F.y + F.s), sketch(F.x + F.s, F.y + F.s, F.x, F.y + F.s), sketch(F.x, F.y + F.s, F.x, F.y),
  sketch(F.x + B.dx, F.y + B.dy, F.x + F.s + B.dx, F.y + B.dy, 3), sketch(F.x + F.s + B.dx, F.y + B.dy, F.x + F.s + B.dx, F.y + F.s + B.dy, 3),
  sketch(F.x, F.y, F.x + B.dx, F.y + B.dy, 2), sketch(F.x + F.s, F.y, F.x + F.s + B.dx, F.y + B.dy, 2), sketch(F.x + F.s, F.y + F.s, F.x + F.s + B.dx, F.y + F.s + B.dy, 2),
];
// The screen around it, and its stand.
const SCREEN = [
  sketch(222, 290, 528, 286, 5), sketch(528, 286, 532, 508, 4), sketch(532, 508, 226, 514, 5), sketch(226, 514, 222, 290, 4),
  sketch(360, 514, 350, 552, 2), sketch(410, 512, 420, 552, 2), sketch(310, 554, 460, 552, 3),
];

// A game controller in pixels: X body, D d-pad, B buttons.
const PAD = [
  '..XXXXXXXXX..',
  '.XXXXXXXXXXX.',
  'XXDXXXXXXXBXX',
  'XDDDXXXXXBXBX',
  'XXDXXXXXXXBXX',
  'XXXXX...XXXXX',
  '.XXX.....XXX.',
];
const PX = 20;
const PAD_AT = { x: 420, y: 720 };

export function Napkin({ stage }: SceneProps) {
  const rand = rng(1993);
  const pixels = PAD.flatMap((row, r) =>
    [...row].map((ch, c) => (ch === '.' ? null : { x: PAD_AT.x + c * PX, y: PAD_AT.y + r * PX, kind: ch, d: 0.15 + (r + c) * 0.035 + rand() * 0.12 })),
  ).filter((p) => p !== null);

  return (
    <svg className={`napkin-scene s${Math.min(stage, 2)}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="napkin-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g className="napkin-sheet">
        <g transform="rotate(-5 400 430)">
          <rect x="140" y="150" width="520" height="560" rx="6" fill="#ebe7da" filter="url(#napkin-shadow)" />
          {/* The folds a napkin keeps. */}
          <path d="M 400 154 L 401 706" className="napkin-fold" />
          <path d="M 144 430 L 656 428" className="napkin-fold" />
          {/* A coffee ring from the booth. */}
          <circle cx="572" cy="226" r="58" className="napkin-ring" />
          <circle cx="578" cy="232" r="52" className="napkin-ring faint" />

          <text x="190" y="232" className="napkin-hand napkin-title">the idea:</text>
          <path d={sketch(188, 246, 340, 242, 3)} className={`${INK} napkin-underline`} pathLength={1} />

          {stage >= 1 && (
            <g className="napkin-pc">
              {CUBE.map((d, i) => (
                <path key={`c${i}`} d={d} className={INK} pathLength={1} style={{ '--d': `${0.1 + i * 0.16}s` } as CSSProperties} />
              ))}
              {SCREEN.map((d, i) => (
                <path key={`s${i}`} d={d} className={`${INK} thin`} pathLength={1} style={{ '--d': `${1.6 + i * 0.12}s` } as CSSProperties} />
              ))}
              <text x="372" y="606" className="napkin-hand napkin-label" style={{ '--d': '2.4s' } as CSSProperties}>3D, on every PC</text>
            </g>
          )}

          {stage >= 2 && (
            <g className="napkin-pays">
              <path d="M 600 628 C 612 560, 600 500, 548 456" className={`${INK} arrow`} pathLength={1} style={{ '--d': '1.1s' } as CSSProperties} />
              <path d={`${sketch(552, 482, 546, 455, 1)} ${sketch(546, 455, 574, 458, 1)}`} className={`${INK} arrow`} pathLength={1} style={{ '--d': '1.8s' } as CSSProperties} />
              <text x="636" y="660" className="napkin-hand napkin-label small" style={{ '--d': '2s' } as CSSProperties}>games pay</text>
              <text x="636" y="690" className="napkin-hand napkin-label small" style={{ '--d': '2.2s' } as CSSProperties}>for it</text>
            </g>
          )}
        </g>
      </g>

      {/* The controller is digital: it breaks out of the paper in green pixels. */}
      {stage >= 2 && (
        <g className="napkin-pad" transform="rotate(6 550 790)">
          {pixels.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width={PX - 2} height={PX - 2} className={`pad-px ${p.kind}`} style={{ '--d': `${p.d}s` } as CSSProperties} />
          ))}
        </g>
      )}
    </svg>
  );
}
