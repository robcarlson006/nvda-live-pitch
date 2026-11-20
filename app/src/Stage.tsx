import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { formatValue, type Dataset, type Slide } from '../shared/schema.ts';
import { Chart } from './Chart.tsx';
import { CoreArray } from './CoreArray.tsx';
import { useDatasets, useShow } from './useShow.ts';

// Everything is revealed by the same left-to-right compute pass the core array runs.
const TITLE_AT = 0.25;
const POINTS_AT = 1.2;
const POINT_GAP = 0.7;

function statValue(slide: Slide, datasets: Record<string, Dataset>): string | undefined {
  const s = slide.stat;
  const ds = s && datasets[s.datasetKey];
  if (!s || !ds) return undefined;
  const v = ds.series[s.series]?.[ds.x.indexOf(s.x)];
  return v == null ? undefined : formatValue(v, ds.unit);
}

export function Stage() {
  const { state } = useShow();
  const datasets = useDatasets();
  const slide = state?.live ?? null;
  const glyph = slide ? (slide.layout === 'number' ? statValue(slide, datasets) : undefined) : 'NVIDIA';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stage">
      <CoreArray buildKey={state?.liveSince ?? 0} glyph={glyph} />
      {slide && <SlideView key={state!.liveSince} slide={slide} datasets={datasets} figure={glyph} />}
    </div>
  );
}

function Reveal({ at, children, className, as: Tag = 'div' }: { at: number; children: ReactNode; className?: string; as?: 'div' | 'h1' | 'p' }) {
  return (
    <Tag className={`reveal ${className ?? ''}`} style={{ '--at': `${at}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}

function SlideView({ slide, datasets, figure }: { slide: Slide; datasets: Record<string, Dataset>; figure?: string }) {
  const dataset = slide.chart ? datasets[slide.chart.datasetKey] : undefined;
  const statDs = slide.stat ? datasets[slide.stat.datasetKey] : undefined;
  const chartAt = POINTS_AT + slide.bullets.length * POINT_GAP;
  const sources = [...new Set([...slide.sources, ...[dataset, statDs].filter(Boolean).map((d) => `${d!.source}, as of ${d!.asOf}`)])];
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChartReady(true), chartAt * 1000);
    return () => clearTimeout(t);
  }, [chartAt]);

  const points = slide.bullets.map((b, i) => (
    <Reveal key={i} as="p" className="point" at={POINTS_AT + i * POINT_GAP}>
      {b}
    </Reveal>
  ));

  const chart = slide.chart && (
    <figure className="chart">
      {dataset ? (
        chartReady && (
          <>
            <figcaption>
              {dataset.title}, {dataset.unit}
              {dataset.placeholder && <span className="placeholder">Placeholder data</span>}
            </figcaption>
            <div className="chart-body">
              <Chart spec={slide.chart} dataset={dataset} />
            </div>
          </>
        )
      ) : (
        <figcaption>No data loaded for this chart yet</figcaption>
      )}
    </figure>
  );

  return (
    <main className={`slide layout-${slide.layout}`}>
      {slide.layout === 'statement' && (
        <>
          <h1 className="statement">
            {slide.title.split(' ').map((w, i) => (
              <span key={i}>
                <span className="word" style={{ '--at': `${TITLE_AT + i * 0.09}s` } as CSSProperties}>
                  {w}
                </span>{' '}
              </span>
            ))}
          </h1>
          <div className="points">{points}</div>
        </>
      )}

      {slide.layout === 'number' && (
        <>
          <span className="sr-only">{figure}</span>
          <div className="number-text">
            <Reveal as="h1" at={1.3}>
              {slide.title}
            </Reveal>
            {slide.stat && (
              <Reveal as="p" className="point" at={1.7}>
                {slide.stat.label}
              </Reveal>
            )}
          </div>
        </>
      )}

      {slide.layout === 'split' && (
        <>
          <div className="text">
            <Reveal as="h1" at={TITLE_AT}>
              {slide.title}
            </Reveal>
            <div className="points">{points}</div>
          </div>
          {chart}
        </>
      )}

      {slide.layout === 'chart' && (
        <>
          <Reveal as="h1" at={TITLE_AT}>
            {slide.title}
          </Reveal>
          <div className="points">{points}</div>
          {chart}
        </>
      )}

      {sources.length > 0 && (
        <Reveal className="sources" at={Math.max(chartAt, 1.8) + 0.6}>
          Source: {sources.join('; ')}
        </Reveal>
      )}
    </main>
  );
}
