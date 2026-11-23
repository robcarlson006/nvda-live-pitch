import type { ReactNode } from 'react';
import { color } from './tokens.ts';

export type Pt = { label: string; v: number | null };
export type Mark = { i: number; node: ReactNode; dx?: number; dy?: number; align?: 'left' | 'right' | 'center'; show?: boolean };

type Props = {
  pts: Pt[];
  box: { x: number; y: number; w: number; h: number };
  i0: number; // x index at the left edge (fractional while it zooms)
  i1: number; // x index at the right edge
  ymax: number;
  draw: number; // index the line has been drawn to (fractional); everything after it is not there yet
  ticks: number[]; // x indices that get a label
  tickMin?: number; // ticks right of this fraction of the line's width only show once drawn
  marks?: Mark[];
  shade?: { v: (number | null)[]; draw: number; opacity?: number };
  stroke?: number;
  line?: string;
  dim?: number; // 0..1: fade the whole chart back (a panel is in front of it)
};

/**
 * A line chart drawn from a view window, so it can zoom and extend as it is animated by its scene.
 * Plain SVG at fixed pixel sizes: nothing reflows, nothing resizes. Numbers come in as `pts`, already looked up.
 * The line is clipped to its box; a head dot rides the end of the drawn line; marks are HTML labels pinned to data points.
 */
export function LineChart({ pts, box, i0, i1, ymax, draw, ticks, marks = [], shade, stroke = 9, line = color.green, dim = 0 }: Props) {
  const { x, y, w, h } = box;
  const px = (i: number) => ((i - i0) / (i1 - i0)) * w;
  const py = (v: number) => h - (v / ymax) * h;
  const upto = (arr: (number | null)[], d: number): [number, number][] => {
    const out: [number, number][] = [];
    for (let k = 0; k <= Math.min(Math.floor(d), arr.length - 1); k++) if (arr[k] != null) out.push([px(k), py(arr[k]!)]);
    const k = Math.floor(d);
    const f = d - k;
    if (f > 0 && k + 1 < arr.length && arr[k] != null && arr[k + 1] != null) out.push([px(d), py(arr[k]! + (arr[k + 1]! - arr[k]!) * f)]);
    return out;
  };
  const vals = pts.map((p) => p.v);
  const main = upto(vals, draw);
  const path = main.map(([a, b], k) => `${k ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join('');
  const head = main.at(-1);
  const area = main.length > 1 ? `${path}L${main.at(-1)![0].toFixed(1)} ${h}L${main[0][0].toFixed(1)} ${h}Z` : '';
  const sh = shade ? upto(shade.v, shade.draw) : [];
  const shPath = sh.length > 1 ? sh.map(([a, b], k) => `${k ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join('') + `L${sh.at(-1)![0].toFixed(1)} ${h}L${sh[0][0].toFixed(1)} ${h}Z` : '';
  const id = `lc${Math.round(x)}${Math.round(y)}`;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h + 70, opacity: 1 - dim * 0.82, transition: 'opacity .5s' }}>
      <svg width={w} height={h + 70} style={{ overflow: 'visible', position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <clipPath id={id}><rect x={-4} y={-40} width={w + 8} height={h + 44} /></clipPath>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={line} stopOpacity="0.28" /><stop offset="1" stopColor={line} stopOpacity="0" /></linearGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color.green} stopOpacity={shade?.opacity ?? 0.5} /><stop offset="1" stopColor={color.green} stopOpacity="0.06" /></linearGradient>
        </defs>
        <line x1={0} x2={w} y1={h} y2={h} stroke={color.faint} strokeWidth={2} />
        {ticks.map((i) => {
          const tx = px(i);
          if (tx < -2 || tx > w + 2) return null;
          return (
            <g key={i}>
              <line x1={tx} x2={tx} y1={h} y2={h + 12} stroke={color.faint} strokeWidth={2} />
              <text x={tx} y={h + 48} textAnchor="middle" fill={color.dim} fontSize={30} fontWeight={560}>{pts[i]?.label}</text>
            </g>
          );
        })}
        <g clipPath={`url(#${id})`}>
          {shPath && <path d={shPath} fill={`url(#${id}s)`} />}
          {area && !shPath && <path d={area} fill={`url(#${id}g)`} />}
          {path && <path d={path} fill="none" stroke={shPath ? color.ink : line} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" style={{ filter: shPath ? undefined : 'drop-shadow(0 0 12px rgba(118,185,0,.55))' }} />}
        </g>
        {head && <circle cx={head[0]} cy={head[1]} r={stroke * 1.25} fill={shPath ? color.ink : line} style={{ filter: 'drop-shadow(0 0 14px rgba(118,185,0,.8))' }} />}
      </svg>
      {marks.map((m, k) => {
        const v = vals[m.i];
        if (v == null || m.show === false || draw < m.i - 0.001) return null;
        const mx = px(m.i) + (m.dx ?? 0);
        const my = py(v) + (m.dy ?? -26);
        if (mx < -50 || mx > w + 50) return null;
        const a = m.align ?? 'center';
        return (
          <div key={k} style={{ position: 'absolute', left: mx, top: my, transform: `translate(${a === 'left' ? '0' : a === 'right' ? '-100%' : '-50%'}, -100%)`, whiteSpace: 'nowrap' }}>
            {m.node}
          </div>
        );
      })}
    </div>
  );
}
