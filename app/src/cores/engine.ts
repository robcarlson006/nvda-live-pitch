/**
 * The stage is a GPU die. Every lit core is a particle on a 108-row grid; a slide is a target arrangement of cores,
 * and changing slide (or reaching the next point) sends the cores flying from the old arrangement to the new one.
 * All motion runs on the GPU (WebGL2, no libraries): the CPU only works when the target changes.
 */
export const ROWS = 108; // 10 px a core at 1080p
export const MAX = 14_000;

export type Tone = 0 | 1 | 2 | 3; // green · white · silicon grey · amber (bad news)
/** A lit core: position in grid units (the centre of a cell is n + 0.5), brightness 0..1, tone, size 0..1, extra delay in ms. */
export type Cell = { x: number; y: number; b?: number; tone?: Tone; s?: number; d?: number };

const BG_VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const BG_FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uPitch, uTime, uWave, uLevel, uCalm;
out vec4 o;
float h(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y-gl_FragCoord.y);
  vec2 c = floor(px/uPitch), f = fract(px/uPitch);
  float on = step(.14,f.x)*step(f.x,.86)*step(.14,f.y)*step(f.y,.86);
  vec3 col = vec3(.062,.073,.058);
  vec2 n = px/uRes;
  float dt = uWave - n.x*900. - n.y*140.;
  float w = exp(-(dt/120.)*(dt/120.))*.42*step(-300.,dt);
  float r = h(c);
  // the room's voice: the louder it is, the more resting cores flicker awake, spreading up from the bottom edge
  float reach = uLevel*(1.15-n.y*.15);
  float lit = smoothstep(1.-.10*reach,1.,h(c+floor(uTime*1.6+r*5.)))*uLevel*.55;
  // a slow tide, so the die is never quite dead
  float tide = uCalm*.016*(.5+.5*sin(c.x*.06+c.y*.035-uTime*.45))*step(.35,r);
  col = mix(col, vec3(.463,.725,0.), clamp(w+lit+tide,0.,1.));
  o = vec4(col*on,1.);
}`;
const P_VS = `#version 300 es
in vec2 a0, a1; in vec3 c0, c1; in vec2 sz; in float dl, sd; in vec2 b01;
uniform vec2 uRes; uniform float uPitch, uT, uDur, uTime, uLevel, uSpeed;
out vec3 vC; out float vB, vS;
void main(){
  float t = clamp((uT-dl)/uDur,0.,1.);
  float e = t<.5 ? 4.*t*t*t : 1.-pow(-2.*t+2.,3.)/2.;
  vec2 d = a1-a0; float len = length(d);
  vec2 nrm = len>.001 ? vec2(-d.y,d.x)/len : vec2(0.);
  float arc = sin(3.14159*e)*(sd-.5)*min(len,60.)*.45;
  vec2 pos = mix(a0,a1,e) + nrm*arc;
  float fly = smoothstep(.5,6.,len)*sin(3.14159*t);
  float b = mix(b01.x,b01.y,e);
  b *= 1. - .07*uSpeed*(.5+.5*sin(uTime*(1.2+sd*1.6)+sd*40.));      // computing, not flashing
  b += uLevel*.10*step(.02,b01.y);
  vB = clamp(b + fly*.35*max(b01.x,b01.y),0.,1.25);
  vC = mix(mix(c0,c1,e), vec3(.86,1.,.62), fly*.55);
  vS = mix(sz.x,sz.y,e);
  vec2 n = pos*uPitch/uRes*2.-1.;
  gl_Position = vB<.012 ? vec4(2.,2.,0.,1.) : vec4(n.x,-n.y,0.,1.);
  gl_PointSize = uPitch*3.;
}`;
const P_FS = `#version 300 es
precision highp float;
in vec3 vC; in float vB, vS; out vec4 o;
void main(){
  vec2 q = abs(gl_PointCoord-.5)*3.;                 // in cells, 0 at the centre
  float half_ = .40*vS;
  float core = step(max(q.x,q.y),half_);
  float g = length(q); float halo = exp(-g*g*3.2)*.10*vB*vS;
  float a = core>0. ? min(1.,.06+vB) : halo;
  o = vec4(vC*(core>0. ? min(vB,1.15) : halo), core>0. ? a : 0.);   // halos add light, cores cover what is behind them
}`;

const TONES: [number, number, number][] = [[0.49, 0.77, 0.02], [0.93, 0.95, 0.92], [0.36, 0.39, 0.34], [0.91, 0.62, 0.16]];

export type Engine = {
  cols: number;
  /** Re-arrange the cores. `wave` also runs a compute pass over the resting field (use for a new slide). */
  set(cells: Cell[], opts?: { dur?: number; spread?: number; wave?: boolean; instant?: boolean }): void;
  level(v: number): void;
  calm(on: boolean): void; // true = kill all non-essential motion
  dispose(): void;
};

export function createEngine(cv: HTMLCanvasElement, onLost: () => void): Engine | null {
  const gl = cv.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = (v: string, f: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, v));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
    return p;
  };
  let bg: WebGLProgram, pt: WebGLProgram;
  try {
    bg = prog(BG_VS, BG_FS);
    pt = prog(P_VS, P_FS);
  } catch (e) {
    console.warn(`cores: ${(e as Error).message}`);
    return null;
  }
  const u = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);

  const W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  const pitch = cv.height / ROWS;
  const cols = cv.width / pitch;

  // ---- buffers: one interleaved float array, 18 floats a particle
  const F = 18; // a0(2) a1(2) c0(3) c1(3) sz(2) dl sd b01(2) pad(2)
  const data = new Float32Array(MAX * F);
  for (let i = 0; i < MAX; i++) {
    const o = i * F, x = Math.random() * cols, y = Math.random() * ROWS;
    data[o] = data[o + 2] = x;
    data[o + 1] = data[o + 3] = y;
    data.set(TONES[0], o + 4);
    data.set(TONES[0], o + 7);
    data[o + 10] = data[o + 11] = 1;
    data[o + 13] = Math.random();
  }
  const quad = gl.createVertexArray()!;
  gl.bindVertexArray(quad);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const qp = gl.getAttribLocation(bg, 'p');
  gl.enableVertexAttribArray(qp);
  gl.vertexAttribPointer(qp, 2, gl.FLOAT, false, 0, 0);

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  const attr = (n: string, size: number, off: number) => {
    const l = gl.getAttribLocation(pt, n);
    if (l < 0) return;
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, size, gl.FLOAT, false, F * 4, off * 4);
  };
  attr('a0', 2, 0), attr('a1', 2, 2), attr('c0', 3, 4), attr('c1', 3, 7), attr('sz', 2, 10), attr('dl', 1, 12), attr('sd', 1, 13), attr('b01', 2, 14);

  let t0 = -1e9, waveAt = -1e9, dur = 650, end = 0, level = 0, levelTo = 0, quiet = false, raf = 0, skip = false, dead = false;
  const start = performance.now();

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  /** Freeze every particle where it is right now, so an interrupted flight carries on from mid-air. */
  const freeze = (now: number) => {
    const T = now - t0;
    for (let i = 0; i < MAX; i++) {
      const o = i * F;
      const t = Math.min(1, Math.max(0, (T - data[o + 12]) / dur)), e = ease(t);
      const x0 = data[o], y0 = data[o + 1], dx = data[o + 2] - x0, dy = data[o + 3] - y0, len = Math.hypot(dx, dy);
      const arc = e > 0 && e < 1 ? Math.sin(Math.PI * e) * (data[o + 13] - 0.5) * Math.min(len, 60) * 0.45 : 0;
      data[o] = x0 + dx * e + (len > 0.001 ? (-dy / len) * arc : 0);
      data[o + 1] = y0 + dy * e + (len > 0.001 ? (dx / len) * arc : 0);
      for (let k = 0; k < 3; k++) data[o + 4 + k] += (data[o + 7 + k] - data[o + 4 + k]) * e;
      data[o + 10] += (data[o + 11] - data[o + 10]) * e;
      data[o + 14] += (data[o + 15] - data[o + 14]) * e;
    }
  };

  const key = (x: number, y: number) => Math.round(x * 4) * 4096 + Math.round(y * 4);
  const set: Engine['set'] = (cells, opts = {}) => {
    const now = performance.now();
    freeze(now);
    const spread = opts.spread ?? 320;
    if (cells.length > MAX) cells = cells.slice(0, MAX);
    const owner = new Map<number, number[]>(); // where each lit particle is heading now
    const lit: number[] = [], idle: number[] = [];
    for (let i = 0; i < MAX; i++) {
      const o = i * F;
      if (data[o + 15] > 0.01) {
        const k = key(data[o + 2], data[o + 3]);
        const l = owner.get(k);
        l ? l.push(i) : owner.set(k, [i]);
        lit.push(i);
      } else idle.push(i);
    }
    const taken = new Uint8Array(MAX);
    const left: Cell[] = [];
    const put = (i: number, c: Cell, stay: boolean) => {
      const o = i * F;
      taken[i] = 1;
      data[o + 2] = c.x;
      data[o + 3] = c.y;
      data.set(TONES[c.tone ?? 0], o + 7);
      data[o + 11] = c.s ?? 1;
      data[o + 15] = c.b ?? 1;
      data[o + 12] = opts.instant ? 0 : (c.d ?? (stay ? 0 : (c.x / cols) * spread * 0.6 + data[o + 13] * spread * 0.4));
    };
    for (const c of cells) {
      const i = owner.get(key(c.x, c.y))?.pop(); // a core already there stays put
      if (i != null) put(i, c, true);
      else left.push(c);
    }
    // The rest fly: matched roughly left-to-right with noise, so a shape pours into the next one instead of exploding.
    const pool = lit.filter((i) => !taken[i]).map((i) => ({ i, k: data[i * F] + (Math.random() - 0.5) * 40 })).sort((a, b) => a.k - b.k).map((p) => p.i);
    const todo = left.map((c) => ({ c, k: c.x + (Math.random() - 0.5) * 40 })).sort((a, b) => a.k - b.k).map((p) => p.c);
    const n = todo.length;
    for (let j = 0; j < n; j++) {
      const i = pool.length ? pool[Math.floor((j * pool.length) / Math.max(n, pool.length))] : undefined;
      if (i !== undefined && !taken[i]) put(i, todo[j], false);
      else {
        const f = idle.pop();
        if (f === undefined) break;
        // a resting core near its target wakes up and drifts in
        const o = f * F, a = Math.random() * 6.283, r = 6 + Math.random() * 26;
        data[o] = todo[j].x + Math.cos(a) * r;
        data[o + 1] = todo[j].y + Math.sin(a) * r;
        data[o + 14] = 0;
        put(f, todo[j], false);
      }
    }
    for (const i of lit)
      if (!taken[i]) {
        const o = i * F, a = data[o + 13] * 6.283;
        data[o + 2] = data[o] + Math.cos(a) * 14;
        data[o + 3] = data[o + 1] + Math.sin(a) * 14;
        data[o + 15] = 0;
        data[o + 12] = opts.instant ? 0 : data[o + 13] * spread * 0.5;
      }
    dur = opts.instant || quiet ? 1 : (opts.dur ?? 700);
    t0 = now;
    if (opts.wave && !quiet) waveAt = now;
    end = now + dur + spread + 1200;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  };

  const uBg = { res: u(bg, 'uRes'), pitch: u(bg, 'uPitch'), time: u(bg, 'uTime'), wave: u(bg, 'uWave'), level: u(bg, 'uLevel'), calm: u(bg, 'uCalm') };
  const uPt = { res: u(pt, 'uRes'), pitch: u(pt, 'uPitch'), t: u(pt, 'uT'), dur: u(pt, 'uDur'), time: u(pt, 'uTime'), level: u(pt, 'uLevel'), speed: u(pt, 'uSpeed') };
  const frame = () => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    skip = !skip;
    if (now > end && skip) return; // at rest: half rate
    level += (levelTo - level) * 0.12;
    const time = quiet ? 0 : (now - start) / 1000;
    gl.viewport(0, 0, cv.width, cv.height);
    gl.disable(gl.BLEND);
    gl.useProgram(bg);
    gl.uniform2f(uBg.res, cv.width, cv.height);
    gl.uniform1f(uBg.pitch, pitch);
    gl.uniform1f(uBg.time, time);
    gl.uniform1f(uBg.wave, Math.min(1e6, now - waveAt));
    gl.uniform1f(uBg.level, quiet ? 0 : level);
    gl.uniform1f(uBg.calm, quiet ? 0 : 1);
    gl.bindVertexArray(quad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(pt);
    gl.uniform2f(uPt.res, cv.width, cv.height);
    gl.uniform1f(uPt.pitch, pitch);
    gl.uniform1f(uPt.t, now - t0);
    gl.uniform1f(uPt.dur, dur);
    gl.uniform1f(uPt.time, time);
    gl.uniform1f(uPt.level, quiet ? 0 : level);
    gl.uniform1f(uPt.speed, quiet ? 0 : 1);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.POINTS, 0, MAX);
  };
  raf = requestAnimationFrame(frame);
  cv.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    if (!dead) (dead = true), cancelAnimationFrame(raf), onLost();
  });

  return {
    cols,
    set,
    level: (v) => (levelTo = v),
    calm: (on) => (quiet = on),
    dispose: () => {
      dead = true;
      cancelAnimationFrame(raf);
    },
  };
}
