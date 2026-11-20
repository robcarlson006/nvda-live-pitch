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
};

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeMask(text: string, cols: number, rows: number, margin: number): Uint8Array {
  const c = document.createElement('canvas');
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const maxW = cols - margin * 2;
  let size = Math.round(rows * 0.46);
  ctx.font = `800 ${size}px 'Archivo Variable'`;
  const w = ctx.measureText(text).width;
  if (w > maxW) size = Math.floor((size * maxW) / w);
  ctx.font = `800 ${size}px 'Archivo Variable'`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, margin, Math.round(rows * 0.6));
  const data = ctx.getImageData(0, 0, cols, rows).data;
  const mask = new Uint8Array(cols * rows);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0;
  return mask;
}

export function CoreArray({ buildKey, glyph }: { buildKey: number; glyph?: string }) {
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

        const b = Math.max(wave, s.level[i]);
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
    const mask = text ? makeMask(text, cols, rows, margin) : new Uint8Array(cols * rows);
    const delay = new Float32Array(cols * rows);
    for (let i = 0; i < delay.length; i++) delay[i] = ((i % cols) / cols) * WAVE_MS * 0.6 + Math.random() * LIGHT_SPREAD_MS;
    sim.current = { cols, rows, pitch, mask, prev, level: new Float32Array(cols * rows), delay, t0: performance.now(), margin };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    build(glyph, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildKey, glyph]);

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
