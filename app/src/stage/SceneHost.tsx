import { AnimatePresence, motion } from 'framer-motion';
import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { resolveText, slideSources, type Slide } from '../../shared/schema.ts';
import { Backdrop } from './Backdrop.tsx';
import { CoreDie } from './CoreDie.tsx';
import { Words, type Datasets } from './primitives.tsx';
import { SCENES } from './scenes/index.ts';
import { dur, ease, H, W } from './tokens.ts';
import './stage.css';

/** If a scene throws, only that scene goes missing and the title is shown plainly, so the show goes on. */
class Safe extends Component<{ children: ReactNode; title: string; at: string }, { bad: string | null }> {
  state = { bad: null as string | null };
  static getDerivedStateFromError = () => ({ bad: 'x' });
  componentDidCatch(e: Error) {
    console.warn(`stage scene: ${e.message}`);
    this.setState({ bad: this.props.at });
  }
  componentDidUpdate() {
    if (this.state.bad && this.state.bad !== 'x' && this.state.bad !== this.props.at) this.setState({ bad: null });
  }
  render() {
    return this.state.bad ? (
      <div className="sx-center" style={{ padding: '0 160px' }}>
        <h1 className="sx-h1">{this.props.title}</h1>
      </div>
    ) : (
      this.props.children
    );
  }
}

/** The numbers and text on a slide are resolved here, once: scenes only ever see looked-up values. */
export function resolveSlide(s: Slide, datasets: Datasets): Slide {
  const r = (t: string) => resolveText(t, datasets);
  return { ...s, title: r(s.title), bullets: s.bullets.map(r), stat: s.stat && { ...s.stat, label: r(s.stat.label) }, sources: slideSources(s, datasets) };
}

export const hasScene = (s: Slide | null | undefined): s is Slide & { scene: string } => !!s?.scene && s.scene in SCENES;

/** The whole stage for a scripted slide: fixed 1920×1080 canvas scaled to the window, particle backdrop, one scene on top. */
export function SceneHost({ slide, reveal, datasets, calm, live, dim = 0 }: { slide: Slide & { scene: string }; reveal: number; datasets: Datasets; calm: boolean; live: RefObject<{ level: number }>; dim?: number }) {
  const [k, setK] = useState(() => Math.min(innerWidth / W, innerHeight / H));
  useEffect(() => {
    const on = () => setK(Math.min(innerWidth / W, innerHeight / H));
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  // one ripple through the backdrop for every beat and every new slide
  const pulse = useRef(0);
  const seen = useRef('');
  const key = `${slide.id}:${reveal}`;
  if (seen.current !== key) {
    seen.current = key;
    pulse.current++;
  }
  const [noGl, setNoGl] = useState(false);
  const dimNow = slide.scene === 'finale' ? 1 : dim;
  const resolved = resolveSlide(slide, datasets);
  const Scene = SCENES[slide.scene].Component;
  return (
    <div className="sx">
      {!noGl && <CoreDie pulse={pulse.current} dim={dimNow} calm={calm} level={live} onFail={() => setNoGl(true)} />}
      <div className="sx-frame" style={{ transform: `translate(${-W * k * 0.5}px, ${-H * k * 0.5}px) scale(${k})` }}>
        {noGl && <Backdrop pulse={pulse.current} dim={dimNow} calm={calm} level={live} />}
        <AnimatePresence>
          <motion.div
            key={slide.scene}
            className="sx-scene"
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: dur.beat, delay: 0.3, ease: ease.out } }}
            exit={{ opacity: 0, scale: 0.99, filter: 'blur(8px)', transition: { duration: dur.exit, ease: ease.in } }}
          >
            <Safe title={resolved.title} at={slide.id}>
              <Scene slide={resolved} beat={reveal} datasets={datasets} calm={calm} />
            </Safe>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { Words };
