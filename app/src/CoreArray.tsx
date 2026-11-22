import { useEffect, useRef } from 'react';

/**
 * The stage background is a GPU die: a field of tiny cores.
 * On every build a compute pass sweeps left→right, and an optional glyph (a headline figure)
 * is rendered by the cores themselves, lighting up in parallel rather than in reading order.
 */
const WAVE_MS = 900;
const LIGHT_SPREAD_MS = 700;
const LEVELS = 24;

type Sim = {
  cols: number;
  rows: number;
  pitch: number;
  mask: Uint8Array; // glyph cells
  prev: Float32Array; // glyph level at build start, fades out
  level: Float32Array;
  delay: Float32Array; // when each glyph cell switches on (ms after build)
  t0: number;
  margin: number;
  fx: Fx | null;
};

/**
 * Slide effects, drawn in a block of cores on the right of the screen (the text sits on the left).
 * cpu-gpu: a handful of big cores light one after another (a CPU), then every core in the block at once (a GPU).
 * merge72: 72 separate clusters of cores (one per GPU in an NVL72 rack) fill the gaps between them and become one block.
 * Each stage starts when the slide reaches that bullet, so it lands as it is said.
 */
type Fx = {
  kind: 'cpu-gpu' | 'merge72';
  member: Uint8Array; // 1 = part of the effect's block
  group: Int16Array; // cpu-gpu: which of the 4 CPU cores (or -1); merge72: 1 = cluster cell, 0 = gap
  jitter: Float32Array;
  stage1: number; // performance.now() when stage 1 started, or 0
  stage2: number;
};

function makeFx(kind: Fx['kind'], cols: number, rows: number): Fx {
  const member = new Uint8Array(cols * rows);
  const group = new Int16Array(cols * rows).fill(-1);
  const jitter = new Float32Array(cols * rows);
  const x0 = Math.round(cols * 0.64), x1 = Math.round(cols * 0.95);
  const y0 = Math.round(rows * 0.16), y1 = Math.round(rows * 0.84);
  const w = x1 - x0, h = y1 - y0;
  for (let i = 0; i < jitter.length; i++) jitter[i] = Math.random();
  if (kind === 'merge72') {
    const p = Math.floor(Math.min(w / 8, h / 9)); // 8 × 9 = 72 clusters
    const gap = Math.max(1, Math.round(p * 0.3));
    const bx = x0 + Math.floor((w - p * 8 + gap) / 2), by = y0 + Math.floor((h - p * 9 + gap) / 2);
    for (let y = by; y < by + p * 9 - gap; y++)
      for (let x = bx; x < bx + p * 8 - gap; x++) {
        const i = y * cols + x;
        member[i] = 1;
        group[i] = (x - bx) % p < p - gap && (y - by) % p < p - gap ? 1 : 0;
      }
  } else {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) member[y * cols + x] = 1;
    const b = Math.max(3, Math.floor(Math.min(w / 6, h / 6))); // four big, fast cores in a row
    const gap = Math.round(b / 2);
    const sx = x0 + Math.floor((w - (b * 4 + gap * 3)) / 2), sy = y0 + Math.floor((h - b) / 2);
    for (let k = 0; k < 4; k++)
      for (let y = sy; y < sy + b; y++) for (let x = sx + k * (b + gap); x < sx + k * (b + gap) + b; x++) group[y * cols + x] = k;
  }
  return { kind, member, group, jitter, stage1: 0, stage2: 0 };
}

/** Brightness 0..1 the effect adds to cell i at time now; and whether it is still moving. */
function fxLevel(f: Fx, i: number, now: number): [number, boolean] {
  if (!f.member[i]) return [0, false];
  if (f.kind === 'cpu-gpu') {
    if (f.stage2) {
      const dt = now - f.stage2 - f.jitter[i] * 60; // all at once (within 60 ms)
      if (dt < 0) return [0.08, true];
      const pulse = 0.5 + 0.5 * Math.cos((dt / 1400) * Math.PI * 2);
      return dt < 7000 ? [0.38 + 0.6 * pulse * Math.exp(-dt / 2500) + 0.12 * pulse, true] : [0.42, false];
    }
    if (f.stage1 && f.group[i] >= 0) {
      const on = Math.floor((now - f.stage1) / 320) % 4 === f.group[i]; // one job after another
      return [on ? 1 : 0.14, true];
    }
    return [0, false];
  }
  // merge72
  if (!f.stage1) return [0, false];
  if (f.group[i] === 1) {
    const dt = now - f.stage1 - 200 - f.jitter[i] * 900;
    if (dt < 0) return [0, true];
    const lvl = Math.min(0.8, dt / 200);
    if (!f.stage2) return [lvl, dt < 200];
  }
  if (!f.stage2) return [0, false];
  const dt = now - f.stage2 - (f.group[i] === 0 ? 150 + f.jitter[i] * 500 : 0);
  if (dt < 0) return [f.group[i] === 1 ? 0.8 : 0, true];
  const flash = Math.exp(-dt / 700);
  return dt < 3000 ? [Math.min(1, 0.7 + 0.3 * flash), true] : [0.7, false];
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeMask(text: string, cols: number, rows: number, margin: number, compact = false): Uint8Array {
  const c = document.createElement('canvas');
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const maxW = cols - margin * 2;
  let size = Math.round(rows * (compact ? 0.36 : 0.46));
  ctx.font = `800 ${size}px 'Archivo Variable'`;
  const w = ctx.measureText(text).width;
  if (w > maxW) size = Math.floor((size * maxW) / w);
  ctx.font = `800 ${size}px 'Archivo Variable'`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, margin, Math.round(rows * (compact ? 0.48 : 0.6)));
  const data = ctx.getImageData(0, 0, cols, rows).data;
  const mask = new Uint8Array(cols * rows);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0;
  return mask;
}

type Props = { buildKey: number; glyph?: string; compact?: boolean; effect?: Fx['kind']; reveal?: number };

export function CoreArray({ buildKey, glyph, compact, effect, reveal = 0 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sim = useRef<Sim | null>(null);
  const raf = useRef(0);
  const glyphRef = useRef(glyph);
  glyphRef.current = glyph;

  const draw = () => {
    const s = sim.current;
    const cv = canvas.current;
    if (!s || !cv) return;
    const ctx = cv.getContext('2d')!;
    const t = reduced() ? 1e9 : performance.now() - s.t0;
    const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
    let busy = false;
    const now = performance.now();

    for (let y = 0; y < s.rows; y++) {
      for (let x = 0; x < s.cols; x++) {
        const i = y * s.cols + x;
        const arrive = (x / s.cols) * WAVE_MS + (y / s.rows) * 140;
        const dt = t - arrive;
        const wave = dt > -60 && dt < 500 ? Math.exp(-((dt / 110) ** 2)) * 0.42 : 0;
        if (dt < 500) busy = true;

        const target = s.mask[i] ? (t > s.delay[i] ? Math.min(1, (t - s.delay[i]) / 180) : 0) : 0;
        if (s.mask[i] && t < s.delay[i] + 200) busy = true;
        const fading = s.prev[i] * Math.max(0, 1 - t / 300);
        if (fading > 0) busy = true;
        s.level[i] = Math.max(target, fading);

        let fxl = 0;
        if (s.fx) {
          try {
            const [l, moving] = fxLevel(s.fx, i, now);
            fxl = l;
            if (moving) busy = true;
          } catch {
            s.fx = null; // an effect must never break the stage
          }
        }
        const b = Math.max(wave, s.level[i], fxl);
        buckets[Math.min(LEVELS - 1, Math.round(b * (LEVELS - 1)))].push(i);
      }
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cv.width, cv.height);
    const cell = Math.max(2, Math.round(s.pitch * 0.72));
    buckets.forEach((idx, lvl) => {
      const b = lvl / (LEVELS - 1);
      // rest: dark silicon grey; lit: NVIDIA green
      const r = Math.round(18 + b * (118 - 18));
      const g = Math.round(21 + b * (185 - 21));
      const bl = Math.round(17 + b * (0 - 17));
      ctx.fillStyle = `rgb(${r},${g},${bl})`;
      for (const i of idx) ctx.fillRect((i % s.cols) * s.pitch, Math.floor(i / s.cols) * s.pitch, cell, cell);
    });

    if (busy && !reduced()) raf.current = requestAnimationFrame(draw);
  };

  const opts = useRef({ compact, effect, reveal });
  opts.current = { compact, effect, reveal };

  /** Start the effect stages the slide has reached (stage 1 = first bullet, stage 2 = second). */
  const syncFx = () => {
    const f = sim.current?.fx;
    if (!f) return;
    const r = opts.current.reveal;
    const now = performance.now();
    const s1 = f.kind === 'merge72' ? 1 : 2;
    const s2 = f.kind === 'merge72' ? 2 : 3;
    let changed = false;
    if (r >= s1 && !f.stage1) (f.stage1 = now), (changed = true);
    if (r >= s2 && !f.stage2) (f.stage2 = now), (changed = true);
    if (changed) {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(draw);
    }
  };

  const build = async (text: string | undefined, keepPrev: boolean) => {
    const cv = canvas.current!;
    await document.fonts.load("800 100px 'Archivo Variable'");
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const pitch = Math.max(6, Math.round((innerHeight * dpr) / 96));
    const cols = Math.ceil(cv.width / pitch);
    const rows = Math.ceil(cv.height / pitch);
    const margin = Math.round(cols * 0.06);
    const old = sim.current;
    const prev = keepPrev && old && old.cols === cols ? old.level.slice() : new Float32Array(cols * rows);
    const mask = text ? makeMask(text, cols, rows, margin, opts.current.compact) : new Uint8Array(cols * rows);
    const delay = new Float32Array(cols * rows);
    for (let i = 0; i < delay.length; i++) delay[i] = ((i % cols) / cols) * WAVE_MS * 0.6 + Math.random() * LIGHT_SPREAD_MS;
    let fx: Fx | null = null;
    try {
      fx = opts.current.effect ? makeFx(opts.current.effect, cols, rows) : null;
    } catch {
      fx = null;
    }
    sim.current = { cols, rows, pitch, mask, prev, level: new Float32Array(cols * rows), delay, t0: performance.now(), margin, fx };
    syncFx();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    build(glyph, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildKey, glyph]);

  useEffect(syncFx, [reveal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResize = () => build(glyphRef.current, false);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvas} className="core-array" aria-hidden />;
}
