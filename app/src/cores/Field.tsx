import { useEffect, useRef, useState, type RefObject } from 'react';
import type { Dataset, Slide } from '../../shared/schema.ts';
import { CoreArray } from '../CoreArray.tsx';
import { createEngine, type Engine } from './engine.ts';
import { closing, replay, sceneFor, textCells, type Scene } from './scenes.ts';

type Props = { buildKey: number; slide: Slide | null; reveal: number; datasets: Record<string, Dataset>; asking: boolean; seen: Slide[]; calm: boolean; live: RefObject<{ level: number }>; glyph?: string };

/** The core field. If WebGL is missing, lost, or throws, the older canvas version takes over by itself. */
export function Field(p: Props) {
  const [broken, setBroken] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);
  const eng = useRef<Engine | null>(null);
  const [size, setSize] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const last = useRef(0);

  useEffect(() => {
    if (broken) return;
    eng.current = createEngine(cv.current!, () => setBroken(true));
    if (!eng.current) return setBroken(true);
    last.current = 0;
    const t = setInterval(() => eng.current?.level(p.live.current?.level ?? 0), 60);
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => (clearTimeout(rt), (rt = setTimeout(() => setSize((n) => n + 1), 200)));
    window.addEventListener('resize', onResize);
    return () => (clearInterval(t), clearTimeout(rt), window.removeEventListener('resize', onResize), eng.current?.dispose());
  }, [broken, size]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    clearInterval(timer.current);
    const e = eng.current;
    if (!e || broken) return;
    e.calm(p.calm);
    let gone = false;
    void document.fonts.load("800 100px 'Archivo Variable'").catch(() => {}).then(() => {
      if (gone) return;
      const fresh = last.current !== p.buildKey;
      last.current = p.buildKey;
      try {
        let sc: Scene;
        if (p.asking) sc = { frames: [textCells('?', e.cols, { left: e.cols * 0.68, baseline: 86, size: 92, maxW: e.cols * 0.3 })] };
        else if (p.slide?.id === 'built-live') sc = replay(p.seen, p.datasets, e.cols);
        else if (p.slide?.id === 'close') sc = closing(p.reveal, e.cols);
        else sc = sceneFor(p.slide, p.reveal, p.datasets, e.cols);
        let n = 0;
        e.set(sc.frames[0], { wave: fresh });
        if (sc.frames.length > 1 && !(p.calm && sc.loop))
          timer.current = setInterval(() => {
            n++;
            if (n >= sc.frames.length && !sc.loop) return clearInterval(timer.current);
            try {
              e.set(sc.frames[n % sc.frames.length], { dur: 420, spread: 160 });
            } catch {
              clearInterval(timer.current);
            }
          }, sc.every ?? 600);
      } catch (err) {
        console.warn(`cores: ${(err as Error).message}`); // an effect must never break the stage
      }
    });
    return () => {
      gone = true;
      clearInterval(timer.current);
    };
  }, [p.buildKey, p.reveal, p.asking, p.calm, broken, size, Object.keys(p.datasets).length]); // eslint-disable-line react-hooks/exhaustive-deps

  const eff = p.slide?.effect;
  if (broken) return <CoreArray buildKey={p.buildKey} glyph={p.asking ? '?' : p.glyph} compact={!!p.slide?.bullets.length} effect={eff === 'cpu-gpu' || eff === 'merge72' ? eff : undefined} reveal={p.reveal} />;
  return <canvas key={size} ref={cv} className="core-array" aria-hidden />;
}
