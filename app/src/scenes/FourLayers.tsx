import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import { rng } from './util.ts';
import './four-layers.css';

/**
 * NVIDIA's four layers as an isometric stack: chips, software, connections, supply.
 *
 * four-layers ("Why NVIDIA is the gold standard"):
 *   title              — an empty base plate glows on the floor
 *   1 "four layers"    — the four slabs drop in one by one, each with its own texture and label
 *   2 "at once"        — all four light together, and a bracket holds them as one: a rival must beat the whole stack
 *
 * handoff ("The best chips, software, connections and supply"): the same stack comes back, already built, so the
 * idea carries over from slide to slide (a "morph", like Magic Move). Then:
 *   1 "governments keep building" — small blocks for companies and governments appear and feed light into the stack
 *   2 "do the numbers agree"      — the stack glows and a beam rises from it: the hand-off to the numbers
 * No figures anywhere: this is a picture of the argument, not data.
 */

const CX = 330;
const W = 210; // half-width of a slab's top face
const D = W / 2; // half-depth: 2:1 isometric
const T = 40; // slab thickness
const STEP = 66;
const BASE_Y = 700; // top-face centre of the bottom slab

const LAYERS = ['Chips', 'Software', 'Connections', 'Supply'] as const;
type Layer = (typeof LAYERS)[number];

/** Maps a 100 × 100 square onto a slab's top face, so textures can be drawn flat and land in perspective. */
const topFace = (y: number) => `matrix(${W / 100} ${D / 100} ${-W / 100} ${D / 100} ${CX} ${y - D})`;

function Texture({ layer }: { layer: Layer }) {
  const rand = rng(layer.length * 97);
  switch (layer) {
    case 'Chips':
      return (
        <g className="fl-tex">
          {Array.from({ length: 36 }, (_, i) => (
            <rect key={i} x={14 + (i % 6) * 12.5} y={14 + Math.floor(i / 6) * 12.5} width="8" height="8" />
          ))}
        </g>
      );
    case 'Software':
      return (
        <g className="fl-tex">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={14 + (i % 3) * 6} y1={16 + i * 11} x2={30 + rand() * 50} y2={16 + i * 11} />
          ))}
        </g>
      );
    case 'Connections': {
      const pts = Array.from({ length: 9 }, (_, i) => [20 + (i % 3) * 30, 20 + Math.floor(i / 3) * 30]);
      return (
        <g className="fl-tex">
          {pts.flatMap(([x, y], i) => [
            i % 3 < 2 && <line key={`h${i}`} x1={x} y1={y} x2={x + 30} y2={y} />,
            i < 6 && <line key={`v${i}`} x1={x} y1={y} x2={x} y2={y + 30} />,
          ])}
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" />
          ))}
        </g>
      );
    }
    case 'Supply':
      return (
        <g className="fl-tex">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={12 + (i % 4) * 20} y={18 + Math.floor(i / 4) * 24} width="15" height="15" />
          ))}
        </g>
      );
  }
}

function Slab({ layer, k, dropAt }: { layer: Layer; k: number; dropAt: number }) {
  const y = BASE_Y - k * STEP;
  const top = `${CX},${y - D} ${CX + W},${y} ${CX},${y + D} ${CX - W},${y}`;
  const left = `${CX - W},${y} ${CX},${y + D} ${CX},${y + D + T} ${CX - W},${y + T}`;
  const right = `${CX},${y + D} ${CX + W},${y} ${CX + W},${y + T} ${CX},${y + D + T}`;
  return (
    <g className="fl-slab" style={{ '--drop': `${dropAt}s`, '--k': k } as CSSProperties}>
      <polygon points={left} className="fl-left" />
      <polygon points={right} className="fl-right" />
      <polygon points={top} className="fl-top" />
      <g transform={topFace(y)}>
        <Texture layer={layer} />
      </g>
      <g className="fl-label">
        <line x1={CX + W + 8} y1={y + T / 2} x2={CX + W + 46} y2={y + T / 2} />
        <text x={CX + W + 56} y={y + T / 2 + 10}>{layer}</text>
      </g>
    </g>
  );
}

// Companies and governments building AI: small blocks round the stack that feed it light (handoff only).
const BUYERS = [
  [70, 470], [120, 360], [610, 330], [730, 400], [60, 620], [760, 250], [180, 250], [560, 230],
] as const;

function Stack({ stage, mode }: SceneProps & { mode: 'build' | 'recap' }) {
  const built = mode === 'recap' || stage >= 1;
  const together = mode === 'build' ? stage >= 2 : stage >= 2;
  const fed = mode === 'recap' && stage >= 1;
  const topY = BASE_Y - 3 * STEP - D;
  return (
    <svg className={`four-layers ${mode}${built ? ' built' : ''}${together ? ' together' : ''}${fed ? ' fed' : ''}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="fl-floor">
          <stop offset="0" stopColor="#76b900" stopOpacity="0.35" />
          <stop offset="1" stopColor="#76b900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fl-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#76b900" stopOpacity="0.7" />
          <stop offset="1" stopColor="#76b900" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse className="fl-floor" cx={CX} cy={BASE_Y + T + 30} rx={W * 1.5} ry={D * 1.1} fill="url(#fl-floor)" />
      <polygon
        className="fl-plate"
        points={`${CX},${BASE_Y + T + 10 - D} ${CX + W + 14},${BASE_Y + T + 10} ${CX},${BASE_Y + T + 10 + D + 7} ${CX - W - 14},${BASE_Y + T + 10}`}
      />

      {fed && (
        <g className="fl-buyers">
          {BUYERS.map(([x, y], i) => (
            <g key={i} style={{ '--i': i } as CSSProperties}>
              <path className="fl-feed" d={`M ${x} ${y} Q ${(x + CX) / 2} ${Math.min(y, topY) - 40} ${CX} ${topY + 40}`} pathLength={1} />
              <rect className="fl-buyer" x={x - 14} y={y - 14} width="28" height="28" rx="3" />
            </g>
          ))}
        </g>
      )}

      {built &&
        LAYERS.map((layer, k) => <Slab key={layer} layer={layer} k={k} dropAt={mode === 'recap' ? 0.15 + k * 0.12 : 0.2 + k * 0.5} />)}

      {/* "At once": one bracket holds the whole stack. */}
      <path
        className="fl-bracket"
        d={`M ${CX - W - 30} ${BASE_Y + T} L ${CX - W - 48} ${BASE_Y + T} L ${CX - W - 48} ${topY + D} L ${CX - W - 30} ${topY + D}`}
        pathLength={1}
      />

      {mode === 'recap' && <rect className="fl-beam" x={CX - 40} y={40} width="80" height={topY - 40} fill="url(#fl-beam)" />}
    </svg>
  );
}

export function FourLayers(props: SceneProps) {
  return <Stack {...props} mode="build" />;
}

export function Handoff(props: SceneProps) {
  return <Stack {...props} mode="recap" />;
}
