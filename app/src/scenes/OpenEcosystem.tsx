import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import './open-ecosystem.css';
import { parseGroup, type Group } from './parse.ts';

/**
 * "NVIDIA is funding competition to the AI giants": NVIDIA at the centre, and around it the open-model companies it
 * backs, grouped the way the speaker groups them. Each group is read from the point itself ("Building them: Mistral,
 * Black Forest Labs and AI21 Labs" → a "Building them" cluster with three companies), so the picture follows the
 * script as it changes. As a group is said, lines draw out from NVIDIA and its companies appear. On the closing point
 * (one with no "Label: names"), a ring closes round the whole ecosystem and the links start to flow.
 *
 * The lines mean "NVIDIA backs or works with", nothing stronger: no ownership, no figures. Hugging Face stays a plain
 * node like the rest (the deal is pending approval; never draw it as owned).
 */
const HUB = { x: 400, y: 470 };
// Where each group's cluster sits, in the order the groups are said: top, lower left, lower right, then the sides.
const SLOTS = [
  { x: 400, y: 150, dir: 'row' },
  { x: 175, y: 760, dir: 'col' },
  { x: 625, y: 760, dir: 'col' },
  { x: 110, y: 420, dir: 'col' },
] as const;

function nodesFor(g: Group, slot: (typeof SLOTS)[number]) {
  const w = (n: string) => Math.max(110, n.length * 13.5 + 36);
  if (slot.dir === 'row') {
    const widths = g.names.map(w);
    const gap = 16;
    const totalW = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
    let x = slot.x - totalW / 2;
    return g.names.map((n, k) => {
      const node = { name: n, x: x + widths[k] / 2, y: slot.y, w: widths[k] };
      x += widths[k] + gap;
      return node;
    });
  }
  const step = 62;
  const y0 = slot.y - ((g.names.length - 1) * step) / 2;
  return g.names.map((n, k) => ({ name: n, x: slot.x, y: y0 + k * step, w: w(n) }));
}

export function OpenEcosystem({ points = [], total = 0 }: SceneProps) {
  const groups = points.map(parseGroup).filter((g): g is Group => !!g).slice(0, SLOTS.length);
  const closed = total > 0 && points.length >= total && points.some((p) => !parseGroup(p));

  return (
    <svg className={`oe${closed ? ' closed' : ''}`} viewBox="0 0 800 900" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="oe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* The open market: a ring that closes round everyone once the last point lands. */}
      <circle className="oe-ring" cx={HUB.x} cy={HUB.y + 10} r="372" pathLength={1} />

      {groups.map((g, gi) => {
        const slot = SLOTS[gi];
        const nodes = nodesFor(g, slot);
        const labelY = slot.dir === 'row' ? slot.y - 56 : nodes[0].y - 56;
        return (
          <g key={g.label} className="oe-group">
            {nodes.map((n, k) => {
              // A soft curve from the hub to each company.
              const mx = (HUB.x + n.x) / 2 + (n.y < HUB.y ? 0 : (n.x - HUB.x) * 0.15);
              const my = (HUB.y + n.y) / 2;
              const d = `M ${HUB.x} ${HUB.y} Q ${mx} ${my - 40} ${n.x} ${n.y}`;
              return (
                <g key={n.name} style={{ '--k': k } as CSSProperties}>
                  <path className="oe-link" d={d} pathLength={1} />
                  <path className="oe-flow" d={d} />
                </g>
              );
            })}
            <text className="oe-label" x={slot.x} y={labelY} textAnchor="middle">{g.label}</text>
            {nodes.map((n, k) => (
              <g key={n.name} className="oe-node" transform={`translate(${n.x} ${n.y})`} style={{ '--k': k } as CSSProperties}>
                <g className="oe-node-in">
                  <rect x={-n.w / 2} y={-22} width={n.w} height={44} rx={22} />
                  <text textAnchor="middle" y={7}>{n.name}</text>
                </g>
              </g>
            ))}
          </g>
        );
      })}

      {/* NVIDIA at the centre, drawn last so the links start under it. */}
      <g className="oe-hub" transform={`translate(${HUB.x} ${HUB.y})`}>
        <rect x={-78} y={-78} width={156} height={156} rx={14} className="oe-hub-glow" filter="url(#oe-glow)" />
        <rect x={-70} y={-70} width={140} height={140} rx={12} className="oe-hub-box" />
        {[-40, -14, 12, 38].map((o) => <line key={`t${o}`} x1={o} y1={-84} x2={o} y2={-70} className="oe-pin" />)}
        {[-40, -14, 12, 38].map((o) => <line key={`b${o}`} x1={o} y1={70} x2={o} y2={84} className="oe-pin" />)}
        <text textAnchor="middle" y={10} className="oe-hub-text">NVIDIA</text>
      </g>
    </svg>
  );
}
