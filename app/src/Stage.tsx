import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Dataset, Slide } from '../shared/schema.ts';
import { Chart } from './Chart.tsx';
import { useDatasets, useShow } from './useShow.ts';

const ease = [0.16, 1, 0.3, 1] as const;

export function Stage() {
  const { state, connected } = useShow();
  const datasets = useDatasets();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stage">
      <div className="stage-grid" />
      <div className="stage-glow" />
      <header className="stage-top">
        <span className="brand">
          <b>NVIDIA</b> · NVDA
        </span>
        <span className={`live ${connected ? '' : 'off'}`}>● {connected ? 'LIVE BUILD' : 'RECONNECTING'}</span>
      </header>

      <AnimatePresence mode="wait">
        {state?.live ? (
          <SlideView key={state.liveSince} slide={state.live} datasets={datasets} />
        ) : (
          <motion.div key="idle" className="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="idle-mark">NVIDIA</div>
            <div className="idle-sub">Standing by</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlideView({ slide, datasets }: { slide: Slide; datasets: Record<string, Dataset> }) {
  const bulletStart = 0.5;
  const chartAt = bulletStart + slide.bullets.length * 0.45 + 0.2;
  const dataset = slide.chart ? datasets[slide.chart.datasetKey] : undefined;
  const sources = [...slide.sources, ...(dataset ? [`${dataset.source} (as of ${dataset.asOf})`] : [])];
  const [showChart, setShowChart] = useState(false);

  // Mount the chart only when its turn comes, so ECharts' draw-in animation plays in sequence.
  useEffect(() => {
    const t = setTimeout(() => setShowChart(true), chartAt * 1000);
    return () => clearTimeout(t);
  }, [chartAt]);

  return (
    <motion.main className={`slide ${slide.chart ? 'with-chart' : 'text-only'}`} exit={{ opacity: 0, y: -20, filter: 'blur(8px)', transition: { duration: 0.4 } }}>
      <motion.div className="build-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: chartAt + 1.5, ease: 'linear' }} />
      <section className="slide-text">
        {slide.kicker && (
          <motion.div className="kicker" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease }}>
            {slide.kicker}
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease }}>
          {slide.title}
        </motion.h1>
        <ul>
          {slide.bullets.map((b, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: bulletStart + i * 0.45, duration: 0.6, ease }}>
              {b}
            </motion.li>
          ))}
        </ul>
      </section>

      {slide.chart && (
        <motion.section className="slide-chart" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: chartAt, duration: 0.8, ease }}>
          {dataset && showChart ? (
            <>
              <div className="chart-title">
                {dataset.title} · {dataset.unit}
                {dataset.placeholder && <span className="placeholder">PLACEHOLDER DATA</span>}
              </div>
              <div className="chart-body">
                <Chart spec={slide.chart} dataset={dataset} />
              </div>
            </>
          ) : (
            !dataset && <div className="chart-missing">Data not available for this chart</div>
          )}
        </motion.section>
      )}

      {sources.length > 0 && (
        <motion.footer className="sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: chartAt + 0.8 }}>
          Source: {sources.join(' · ')}
          {slide.speaker && <span className="speaker">{slide.speaker}</span>}
        </motion.footer>
      )}
    </motion.main>
  );
}
