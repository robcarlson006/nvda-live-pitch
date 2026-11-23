// Design tokens for the stage, in code. The CSS twin is stage.css (same names). Read design.md first.
// The stage is drawn on a fixed 1920×1080 canvas and scaled to the window, so every size below is in canvas pixels.

export const W = 1920;
export const H = 1080;

export const color = {
  bg: '#000000',
  ink: '#f4f6f1', // primary text
  dim: '#b4b9ae', // secondary text, footnotes (contrast 10:1 on black)
  faint: '#7a8174', // grid, ticks
  grid: '#1b1f19',
  core: '#2b3028', // quiet bars, particles
  green: '#76b900', // NVIDIA green: the one accent, used for what is being said right now
  greenDeep: '#436b0d',
  amber: '#f0a22e', // risk / bear / returned: always paired with a label or a minus sign, never colour alone
} as const;

// Motion. Each ▸ cue is one beat: it eases in over 300–700 ms, then holds.
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number], // fast start, long settle: the default for anything that arrives
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number], // anything that travels between two places
  in: [0.7, 0, 0.84, 0] as [number, number, number, number], // anything that leaves
};
export const dur = { beat: 0.6, quick: 0.35, draw: 1.8, slow: 3.2, count: 1.4, exit: 0.45 };

/** Same curves as plain functions, for the rAF tweens that drive charts. */
export const fn = {
  out: (t: number) => 1 - Math.pow(1 - t, 4),
  inOut: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  linear: (t: number) => t,
};

export const type = { display: 190, h1: 116, h2: 76, body: 46, label: 32, foot: 24 }; // px at 1920 wide
export const MARGIN = 120;
