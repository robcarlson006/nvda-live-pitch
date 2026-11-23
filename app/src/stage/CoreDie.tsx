import { useEffect, useRef, type RefObject } from 'react';
import { createEngine, type Engine } from '../cores/engine.ts';

/**
 * The GPU die behind every scene: the same grid of green-lit cores the stage always had (cores/engine.ts, WebGL2).
 * Every beat sends a compute wave across it; the room's voice wakes cores from the bottom edge; `dim` fades it for the finale.
 * If WebGL is missing or lost, `onFail` is called and the particle backdrop takes over, so the stage never goes blank.
 */
export function CoreDie({ pulse, dim, calm, level, onFail }: { pulse: number; dim: number; calm: boolean; level: RefObject<{ level: number }>; onFail: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const eng = useRef<Engine | null>(null);
  const lastPulse = useRef(-1);
  const calmRef = useRef(calm);
  calmRef.current = calm;

  useEffect(() => {
    let e: Engine | null = null;
    try {
      e = createEngine(cv.current!, onFail);
    } catch {
      e = null;
    }
    if (!e) return onFail();
    eng.current = e;
    e.calm(calmRef.current);
    e.set([], { instant: true });
    const t = setInterval(() => e?.level(level.current?.level ?? 0), 60);
    return () => {
      clearInterval(t);
      e?.dispose();
      eng.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    eng.current?.calm(calm);
  }, [calm]);
  useEffect(() => {
    if (lastPulse.current === pulse) return;
    lastPulse.current = pulse;
    try {
      eng.current?.set([], { wave: true });
    } catch {
      onFail();
    }
  }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={cv} aria-hidden style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', opacity: 1 - dim, transition: 'opacity 1.4s ease', pointerEvents: 'none' }} />;
}
