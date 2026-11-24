import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './bubble.css';

/**
 * "And if the bubble does pop, NVIDIA is built to survive it." Built with the speaker:
 *   title                 — a bubble wobbles, full of floating blocks: grey ones (bets on ideas) and one solid green block
 *   1 "stock falls"       — the bubble pops; everything falls to the floor. The grey blocks crack; the green one lands whole
 *   2 "hardware and software" — the green block shows its two halves, chips and code, and they lock together
 *   3 "cut first"         — the grey blocks are cut away one by one, weakest first; the green block is what's left
 * A picture of the argument, with no figures. The block sizes are arbitrary and mean nothing.
 */

const FLOOR = 800;
const BUBBLE = { cx: 400, cy: 440, r: 300 };
const CORE = { x: 310, y: 450, w: 180, h: 140 };

type Bet = { x: number; y: number; s: number; rot: number; delay: number; float: number; cutAt: number };

function bets(): Bet[] {
  const rand = rng(2000);
  const spots = [
    [230, 290, 74], [470, 230, 58], [550, 360, 82], [180, 460, 54], [340, 350, 44], [560, 520, 62], [430, 610, 50], [250, 580, 66],
  ];
  // Cut order: smallest first, so the weakest go first.
  const order = spots.map((s, i) => [s[2], i] as const).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  return spots.map(([x, y, s], i) => ({
    x, y, s,
    rot: (rand() - 0.5) * 70,
    delay: rand() * 0.25,
    float: rand() * 2,
    cutAt: 0.3 + order.indexOf(i) * 0.28,
  }));
}

const DROPLETS = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  return { x: Math.cos(a), y: Math.sin(a), i };
});

export function Bubble({ stage }: SceneProps) {
  const popped = stage >= 1;
  const halves = stage >= 2;
  const cut = stage >= 3;
  const list = bets();
  return (
    <svg className={`bubble-scene${popped ? ' popped' : ''}${halves ? ' halves' : ''}${cut ? ' cut' : ''}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bb-fill" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="0.8" stopColor="#76b900" stopOpacity="0.04" />
          <stop offset="1" stopColor="#b7f04a" stopOpacity="0.22" />
        </radialGradient>
      </defs>

      <line className="bb-floor" x1="40" y1={FLOOR} x2="760" y2={FLOOR} pathLength={1} />

      {/* The bubble, and the droplets it bursts into. */}
      <g className="bb-bubble">
        <circle cx={BUBBLE.cx} cy={BUBBLE.cy} r={BUBBLE.r} fill="url(#bb-fill)" className="bb-skin" />
        <path className="bb-sheen" d={`M ${BUBBLE.cx - 210} ${BUBBLE.cy - 110} A ${BUBBLE.r - 40} ${BUBBLE.r - 40} 0 0 1 ${BUBBLE.cx - 60} ${BUBBLE.cy - 245}`} />
      </g>
      {popped && (
        <g className="bb-burst">
          {DROPLETS.map((d) => (
            <circle
              key={d.i}
              cx={BUBBLE.cx + d.x * BUBBLE.r}
              cy={BUBBLE.cy + d.y * BUBBLE.r}
              r={d.i % 3 === 0 ? 7 : 4}
              style={{ '--bx': `${d.x * 120}px`, '--by': `${d.y * 120 + 60}px` } as CSSProperties}
            />
          ))}
        </g>
      )}

      {/* The bets: they float in the bubble, fall when it pops, and are cut away weakest first. */}
      {list.map((b, i) => (
        <g
          key={i}
          className="bb-fall"
          style={{ '--drop': `${FLOOR - (b.y + b.s)}px`, '--rot': `${b.rot}deg`, '--fd': `${b.delay}s`, '--cut': `${b.cutAt}s` } as CSSProperties}
        >
          <g className="bb-float" style={{ '--fl': `${b.float}s` } as CSSProperties}>
            <rect className="bb-bet" x={b.x} y={b.y} width={b.s} height={b.s} rx="3" />
            <path className="bb-crack" d={`M ${b.x + b.s * 0.3} ${b.y} L ${b.x + b.s * 0.5} ${b.y + b.s * 0.45} L ${b.x + b.s * 0.35} ${b.y + b.s}`} />
          </g>
        </g>
      ))}

      {/* NVIDIA: one solid block, hardware and software, that lands whole. */}
      <g className="bb-fall core" style={{ '--drop': `${FLOOR - (CORE.y + CORE.h)}px`, '--rot': '0deg', '--fd': '0.12s' } as CSSProperties}>
        <g className="bb-float" style={{ '--fl': '0.6s' } as CSSProperties}>
          <g className="bb-half left">
            <rect x={CORE.x} y={CORE.y} width={CORE.w / 2} height={CORE.h} rx="4" />
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} className="bb-chip" x={CORE.x + 14 + (i % 3) * 24} y={CORE.y + 28 + Math.floor(i / 3) * 32} width="16" height="16" />
            ))}
          </g>
          <g className="bb-half right">
            <rect x={CORE.x + CORE.w / 2} y={CORE.y} width={CORE.w / 2} height={CORE.h} rx="4" />
            {Array.from({ length: 5 }, (_, i) => (
              <line key={i} className="bb-code" x1={CORE.x + CORE.w / 2 + 16 + (i % 2) * 10} y1={CORE.y + 28 + i * 22} x2={CORE.x + CORE.w / 2 + 44 + ((i * 13) % 26)} y2={CORE.y + 28 + i * 22} />
            ))}
          </g>
          <text className="bb-tag left" x={CORE.x - 40} y={CORE.y + CORE.h / 2 + 10}>Hardware</text>
          <text className="bb-tag right" x={CORE.x + CORE.w + 40} y={CORE.y + CORE.h / 2 + 10}>Software</text>
        </g>
      </g>
    </svg>
  );
}
