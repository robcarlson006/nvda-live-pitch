import { icon, type IconName } from '../../shared/icons.ts';
import { lookup, tokenRefs, type Dataset, type Slide } from '../../shared/schema.ts';
import { ROWS, type Cell } from './engine.ts';

/**
 * What the cores draw for a slide at a given point of its build. Pure: the numbers come only from the datasets.
 * `frames` are shown one after another, `every` ms apart (the last one stays, unless `loop`).
 */
export type Scene = { frames: Cell[][]; every?: number; loop?: boolean };
type Sets = Record<string, Dataset>;
type Box = { x: number; y: number; w: number; h: number };

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c.getContext('2d', { willReadFrequently: true })!;
};
const cellsOf = (ctx: CanvasRenderingContext2D, ox: number, oy: number, more: Partial<Cell> = {}): Cell[] => {
  const { width: w, height: h } = ctx.canvas;
  const px = ctx.getImageData(0, 0, w, h).data;
  const out: Cell[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 110) out.push({ x: Math.floor(ox) + x + 0.5, y: Math.floor(oy) + y + 0.5, ...more });
  return out;
};

/** Text drawn by the cores, as big as fits. */
export function textCells(text: string, cols: number, o: { left: number; baseline: number; size: number; maxW: number; more?: Partial<Cell> }): Cell[] {
  const ctx = canvas(cols, ROWS);
  const font = (s: number) => (ctx.font = `800 ${s}px 'Archivo Variable'`);
  font(o.size);
  const w = ctx.measureText(text).width;
  if (w > o.maxW) font(Math.floor((o.size * o.maxW) / w));
  ctx.fillStyle = '#fff';
  ctx.fillText(text, o.left, o.baseline);
  return cellsOf(ctx, 0, 0, o.more);
}

function iconCells(name: IconName, b: Box, more: Partial<Cell> = {}): Cell[] {
  const size = Math.floor(Math.min(b.w, b.h));
  const ctx = canvas(size, size);
  const { s, f } = icon(name) as { s?: string; f?: string };
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = ctx.fillStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.lineCap = ctx.lineJoin = 'round';
  if (s) ctx.stroke(new Path2D(s));
  if (f) ctx.fill(new Path2D(f));
  return cellsOf(ctx, b.x + (b.w - size) / 2, b.y + (b.h - size) / 2, more);
}

const block = (x: number, y: number, w: number, h: number, more: Partial<Cell>): Cell[] => {
  const out: Cell[] = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out.push({ x: Math.floor(x) + i + 0.5, y: Math.floor(y) + j + 0.5, ...more });
  return out;
};

const right = (cols: number): Box => ({ x: cols * 0.62, y: 20, w: cols * 0.32, h: 64 });

/** A handful of big fast cores, one job after another; then thousands at once. */
function cpuGpu(cols: number, reveal: number): Scene {
  const b = right(cols);
  const four = (hot: number) => [0, 1, 2, 3].flatMap((k) => block(b.x + k * 16, b.y + 26, 12, 12, { b: k === hot ? 1 : 0.18, tone: k === hot ? 0 : 2 }));
  if (reveal < 2) return { frames: [[]] };
  if (reveal === 2) return { frames: [0, 1, 2, 3].map(four), every: 520, loop: true };
  return { frames: [block(b.x, b.y, Math.floor(b.w), b.h, { b: 1, d: 0 }), block(b.x, b.y, Math.floor(b.w), b.h, { b: 0.62 })], every: 900 };
}

/** 72 clusters (one per GPU in the rack), then the gaps close and they are one chip. */
function merge72(cols: number, reveal: number): Scene {
  const b = right(cols);
  const out: Cell[] = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) out.push(...block(b.x + c * 7, b.y + r * 7, 4, 4, { b: 0.85 }));
  if (reveal < 2) return { frames: [out] };
  return { frames: [block(b.x, b.y, 8 * 7 - 3, 9 * 7 - 3, { b: 0.72 })] };
}

/** One tile per percent, the looked-up share lit. */
function waffle(slide: Slide, data: Sets, cols: number): Scene {
  const v = slide.stat && data[slide.stat.datasetKey]?.series[slide.stat.series]?.[data[slide.stat.datasetKey].x.indexOf(slide.stat.x)];
  if (v == null || v < 0 || v > 100) return { frames: [[]] };
  const x0 = cols * 0.62, out: Cell[] = [];
  for (let i = 0; i < 100; i++) out.push(...block(x0 + (i % 10) * 6, 18 + (9 - Math.floor(i / 10)) * 6, 4, 4, i < Math.round(v) ? { b: 0.95 } : { b: 0.3, tone: 2 }));
  return { frames: [out] };
}

/** Every tile is the same number of chips; the ones that came back go dark. */
function tiles(slide: Slide, data: Sets, cols: number): Scene {
  const num = (k: string, s: string, x: string) => data[k]?.series[s]?.[data[k].x.indexOf(x)] ?? null;
  const st = slide.stat, ref = st && tokenRefs(st.label)[0];
  const part = st && num(st.datasetKey, st.series, st.x), total = ref && num(ref.key, ref.series, ref.x);
  if (!part || !total || part > total) return { frames: [[]] };
  const n = 250, back = Math.round((part / total) * n), x0 = cols * 0.545, y0 = 58;
  const at = (i: number, more: Partial<Cell>) => block(x0 + (i % 25) * 3, y0 + Math.floor(i / 25) * 3, 2, 2, more);
  const ids = Array.from({ length: n }, (_, i) => i);
  return { frames: [ids.flatMap((i) => at(i, { b: 0.9 })), ids.flatMap((i) => at(i, i < n - Math.max(1, n - back) ? { b: 0.4, tone: 2, d: i * 5 } : { b: 1 }))], every: 1700 };
}

/** Two multiples side by side, to the same scale, from zero. */
function compare(slide: Slide, data: Sets, cols: number): Scene {
  const num = (k: string, s: string, x: string) => data[k]?.series[s]?.[data[k].x.indexOf(x)] ?? null;
  const ref = tokenRefs(slide.title)[0], st = slide.stat;
  const a = ref && num(ref.key, ref.series, ref.x), b = st && num(st.datasetKey, st.series, st.x);
  if (!a || !b) return { frames: [[]] };
  const H = 62, top = Math.max(a, b), h = (v: number) => Math.max(1, Math.round((v / top) * H));
  const bar = (x: number, v: number, more: Partial<Cell>) => block(x, 90 - h(v), 22, h(v), more);
  const xa = cols * 0.6, xb = xa + 36;
  const say = (t: string | undefined, x: number, base: number, size: number, more: Partial<Cell>) => (t ? textCells(t, cols, { left: x, baseline: base, size, maxW: 40, more }) : []);
  return {
    frames: [[
      ...bar(xa, a, { b: 0.75, tone: 2 }), ...bar(xb, b, { b: 1 }),
      ...say(lookup(data, ref!.key, ref!.series, ref!.x), xa, 89 - h(a), 15, { tone: 1 }), ...say(lookup(data, st!.datasetKey, st!.series, st!.x), xb, 89 - h(b), 13, { tone: 1 }),
    ]],
  };
}

/** Four slabs, stacking up as they are named. */
function layers(cols: number, lit: number): Scene {
  const ctx0 = { x: cols * 0.64, y: 18 };
  const frames = Array.from({ length: lit + 1 }, (_, n) => {
    const out: Cell[] = [];
    for (let k = 0; k < n; k++) {
      const ctx = canvas(62, 30);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(31, 0), ctx.lineTo(62, 11), ctx.lineTo(31, 22), ctx.lineTo(0, 11), ctx.closePath();
      ctx.fill();
      out.push(...cellsOf(ctx, ctx0.x, ctx0.y + (3 - k) * 16, { b: 0.45 + 0.17 * k, tone: 0 }));
      const edge = canvas(62, 30);
      edge.fillStyle = '#fff';
      edge.beginPath();
      edge.moveTo(0, 12.5), edge.lineTo(31, 23.5), edge.lineTo(62, 12.5), edge.lineTo(62, 15.5), edge.lineTo(31, 26.5), edge.lineTo(0, 15.5), edge.closePath();
      edge.fill();
      out.push(...cellsOf(edge, ctx0.x, ctx0.y + (3 - k) * 16, { b: 0.95, tone: 1 }));
    }
    // a nearer slab hides what is behind it
    const seen = new Map<number, Cell>();
    for (const c of out) seen.set(c.y * 1000 + c.x, c);
    return [...seen.values()];
  });
  return { frames: frames.slice(1), every: 420 };
}

/** The last slide: AI, the chip under it, then the name. */
export const closing = (reveal: number, cols: number): Scene => ({
  frames: [reveal >= 3 ? textCells('NVIDIA', cols, { left: cols * 0.58, baseline: 64, size: 40, maxW: cols * 0.37, more: { b: 1 } }) : iconCells(reveal === 2 ? 'chip' : 'brain', right(cols))],
});

export function sceneFor(slide: Slide | null, reveal: number, data: Sets, cols: number): Scene {
  if (!slide) return { frames: [textCells('NVIDIA', cols, { left: cols * 0.06, baseline: 65, size: 50, maxW: cols * 0.88 })] };
  const base: Cell[] = [];
  let pic: Scene = { frames: [[]] };
  if (slide.layout === 'number' && slide.stat) {
    const v = lookup(data, slide.stat.datasetKey, slide.stat.series, slide.stat.x);
    const pts = slide.bullets.length > 0;
    if (v) base.push(...textCells(v, cols, { left: cols * 0.06, baseline: pts ? 45 : 63, size: pts ? 38 : 50, maxW: cols * (pts && (slide.effect || slide.icons) && slide.effect !== 'tiles' ? 0.5 : 0.88) }));
  }
  const b = right(cols);
  if (slide.effect === 'cpu-gpu') pic = cpuGpu(cols, reveal);
  else if (slide.effect === 'merge72') pic = merge72(cols, reveal);
  else if (slide.effect === 'waffle') pic = waffle(slide, data, cols);
  else if (slide.effect === 'tiles') pic = tiles(slide, data, cols);
  else if (slide.effect === 'compare') pic = compare(slide, data, cols);
  else if (slide.effect === 'layers') pic = layers(cols, 4);
  else if (slide.icons?.length) {
    const ic = slide.icons;
    if (slide.effect === 'morph') pic = { frames: [iconCells(ic[Math.min(ic.length, Math.max(1, reveal)) - 1], b)] };
    else if (ic.length === 1) pic = { frames: [iconCells(ic[0], b)] };
    else {
      const w = b.w / ic.length;
      pic = { frames: ic.map((_, n) => ic.slice(0, n + 1).flatMap((k, i) => iconCells(k, { x: b.x + i * w, y: 30, w: w - 3, h: 44 }))), every: 450 };
    }
  }
  return { ...pic, frames: pic.frames.map((f) => [...base, ...f]) };
}

/** The finale: every layer of the pitch so far, played back small, one after another. */
export function replay(seen: Slide[], data: Sets, cols: number): Scene {
  const parts = seen.filter((s) => s.effect || s.icons?.length || s.stat).slice(-14);
  if (!parts.length) return { frames: [[]] };
  const shrink = (cs: Cell[]) => cs.map((c) => ({ ...c, x: cols * 0.615 + c.x * 0.36, y: 26 + c.y * 0.5, s: 0.5 }));
  return { frames: parts.map((s) => shrink(sceneFor(s, 9, data, cols).frames.at(-1)!)), every: 950, loop: true };
}
