/** A seeded random, so a scene looks the same on every screen and in every rehearsal. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/** A hand-drawn line: a slight bow, so the stroke looks like pen on paper rather than a ruler. */
export function sketch(x1: number, y1: number, x2: number, y2: number, bow = 4) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  return `M ${x1} ${y1} Q ${mx + nx * bow} ${my + ny * bow} ${x2} ${y2}`;
}
