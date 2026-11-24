import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatValue, type Dataset, type Slide } from '../shared/schema.ts';

const GREEN = '#76b900';
const DIM_GREEN = '#2f4a05';
const OTHERS = ['#8d9388', '#d9dccf', '#5d6358'];
const FAINT = '#7a8174';
const FONT = "'Archivo Variable', system-ui, sans-serif";

/** Only the x values from range[0] to range[1], e.g. FY05–FY13, minus any the slide excludes. */
function inRange(ds: Dataset, range?: [string, string], exclude: string[] = []): Dataset {
  let a = 0;
  let b = ds.x.length - 1;
  if (range) {
    const ra = ds.x.indexOf(range[0]);
    const rb = ds.x.indexOf(range[1]);
    if (ra >= 0 && rb >= ra) [a, b] = [ra, rb];
  }
  const keep = ds.x.map((x, i) => i >= a && i <= b && !exclude.includes(x));
  return { ...ds, x: ds.x.filter((_, i) => keep[i]), series: Object.fromEntries(Object.entries(ds.series).map(([k, v]) => [k, v.filter((_, i) => keep[i])])) };
}

/** Waterfall: where each bar starts. Steps add to a running total; `totals` are full bars from zero (and reset the total). */
export function waterfallBases(x: string[], values: (number | null)[], totals: string[] = []): number[] {
  let run = 0;
  return x.map((name, i) => {
    const v = values[i] ?? 0;
    if (totals.includes(name)) {
      run = v;
      return 0;
    }
    const base = v >= 0 ? run : run + v;
    run += v;
    return base;
  });
}

const ZOOM = 2.1; // how far a zoom step magnifies the chart
const ZOOM_MS = 1300;

/**
 * Renders any dataset by key. Numbers come only from the dataset; the slide just names series.
 * `zoom` (an x value) magnifies the chart around that bar or point and makes it the highlight, as the presenter talks about it.
 */
export function Chart({ spec, dataset: full, zoom = null }: { spec: NonNullable<Slide['chart']>; dataset: Dataset; zoom?: string | null }) {
  const el = useRef<HTMLDivElement>(null);
  const live = useRef<{ chart: echarts.ECharts; restyle: (hi: number) => void; point: (i: number) => [number, number] | null; born: number } | null>(null);
  const dataset = inRange(full, spec.range, spec.exclude);

  useEffect(() => {
    // Drawn at a higher resolution than the screen, so a zoom stays sharp.
    const chart = echarts.init(el.current!, undefined, { renderer: 'canvas', devicePixelRatio: Math.max(2, window.devicePixelRatio || 1) * ZOOM });
    const vh = Math.min(window.innerHeight, window.innerWidth * 0.5625) / 100; // same unit as --u in styles.css
    const fmt = (v: number, series?: string) => formatValue(v, (series && dataset.units?.[series]) || dataset.unit);
    const isBar = spec.type !== 'line';
    const isFall = spec.type === 'waterfall';
    const baseHi = spec.highlight ? dataset.x.indexOf(spec.highlight) : isBar ? dataset.x.length - 1 : -1;
    const cell = Math.round(vh * 0.9);
    const n = dataset.x.length;
    const stagger = Math.min(160, 1000 / n); // the whole chart builds in about a second, however many bars

    const refValue = spec.refLine ? dataset.series[spec.refLine.series]?.find((v) => v != null) ?? null : null;
    const refLine =
      refValue != null
        ? {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#f4f6f1', width: Math.max(1, vh * 0.22), type: [vh * 0.9, vh * 0.6] },
            label: { position: 'insideEndTop', color: '#f4f6f1', fontSize: vh * 2.5, fontFamily: FONT, formatter: () => `${spec.refLine!.series}: ${fmt(refValue, spec.refLine!.series)}` },
            data: [{ yAxis: refValue }],
            animationDuration: 900,
          }
        : undefined;

    const makeSeries = (hiIdx: number): any[] => {
      if (isFall) {
        // Waterfall in the core-stack style: an invisible base lifts each step onto the running total;
        // the step itself is a bar whose stripes read as stacked cores.
        const name = spec.series[0];
        const values = dataset.series[name];
        const bases = waterfallBases(dataset.x, values, spec.totals);
        const gap = Math.max(2, Math.round(cell * 0.35));
        return [
          { name: '_base', type: 'bar', stack: 'fall', silent: true, data: bases, itemStyle: { color: 'transparent' }, barCategoryGap: '28%', animation: false },
          {
            name,
            type: 'bar',
            stack: 'fall',
            barCategoryGap: '28%',
            animationDuration: 1200,
            animationDelay: (j: number) => j * 220,
            data: values.map((v, j) => ({
              value: v == null ? null : Math.abs(v),
              itemStyle: {
                color: j === hiIdx ? GREEN : spec.totals?.includes(dataset.x[j]) ? '#4a6a12' : DIM_GREEN,
                decal: { symbol: 'rect', dashArrayX: [1, 0], dashArrayY: [gap, cell], color: '#000', symbolSize: 1, rotation: 0 },
              },
              label: {
                show: true,
                position: 'top',
                distance: vh,
                formatter: () => (v == null ? '' : fmt(v, name)),
                color: j === hiIdx ? '#f4f6f1' : '#9aa094',
                fontSize: j === hiIdx ? vh * 3.4 : vh * 2.6,
                fontWeight: 500,
                fontFamily: FONT,
              },
            })),
          },
        ];
      }
      return spec.series.map((name, i) => {
      const values = dataset.series[name];
      if (spec.type === 'stackedBar') {
        // ECharts can't stack pictorial bars, so stacked charts use plain bars in the same colours.
        const color = i === 0 ? GREEN : ['#4a5045', '#6b7166', '#8d9388', '#b4b9ae'][(i - 1) % 4];
        // A bar that holds only this one series (e.g. actual, then forecast) gets its value on top.
        // Truly stacked bars get none: the top segment's value would read as the total.
        const alone = (j: number) => values[j] != null && spec.series.every((o) => o === name || dataset.series[o]?.[j] == null);
        return {
          name,
          type: 'bar',
          stack: 'total',
          data: values.map((v, j) => ({
            value: v,
            label: {
              show: alone(j) && (n <= 12 || j === hiIdx),
              position: 'top',
              distance: vh,
              formatter: () => (v == null ? '' : fmt(v, name)),
              color: j === hiIdx ? '#f4f6f1' : '#9aa094',
              fontSize: j === hiIdx ? vh * 3.4 : vh * 2.4,
              fontWeight: 500,
              fontFamily: FONT,
            },
          })),
          barCategoryGap: '28%',
          itemStyle: { color },
          animationDuration: 1600,
          animationDelay: (j: number) => j * stagger,
        };
      }
      if (isBar) {
        // Bars are stacks of cores, matching the stage background.
        return {
          name,
          type: 'pictorialBar',
          symbol: 'rect',
          symbolRepeat: true,
          symbolSize: ['100%', cell],
          symbolMargin: Math.max(2, Math.round(cell * 0.35)),
          symbolClip: true,
          barCategoryGap: '28%',
          markLine: i === 0 ? refLine : undefined,
          animationDuration: 1600,
          animationDelay: (j: number) => j * stagger,
          data: values.map((v, j) => ({
            value: v,
            itemStyle: { color: spec.series.length > 1 ? (i === 0 ? GREEN : OTHERS[i - 1]) : j === hiIdx ? GREEN : DIM_GREEN },
            label: {
              show: spec.series.length === 1 && (n <= 8 || j === hiIdx), // long series: label only the highlight
              position: 'top',
              distance: vh,
              formatter: () => (v == null ? '' : fmt(v, name)),
              color: j === hiIdx ? '#f4f6f1' : '#9aa094',
              fontSize: j === hiIdx ? vh * 3.4 : vh * 2.6,
              fontWeight: 500,
              fontFamily: FONT,
            },
          })),
        };
      }
      const color = i === 0 ? (spec.muted ? '#d9dccf' : GREEN) : OTHERS[(i - 1) % OTHERS.length];
      return {
        name,
        type: 'line',
        data: values,
        symbol: 'none',
        lineStyle: { width: i === 0 ? vh * 0.45 : vh * 0.2, color, type: i === 0 ? 'solid' : [vh * 0.8, vh * 0.6] },
        animationDuration: 2400,
        animationEasing: 'linear',
        // Direct labels at the line ends instead of a legend.
        endLabel: { show: true, formatter: '{a}', color, fontSize: vh * 2.8, fontFamily: FONT, fontWeight: i === 0 ? 650 : 450, distance: vh },
        markPoint:
          i === 0 && hiIdx >= 0
            ? {
                symbol: 'rect',
                symbolSize: vh * 1.6,
                itemStyle: { color },
                label: { position: 'left', distance: vh * 1.2, color: '#f4f6f1', fontSize: vh * 3.4, fontWeight: 600, fontFamily: FONT, formatter: () => fmt(values[hiIdx] ?? 0, name) },
                data: [{ coord: [hiIdx, values[hiIdx]] }],
              }
            : undefined,
      };
    });
    };

    const series = makeSeries(baseHi);
    chart.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: FONT },
      grid: { left: isBar ? vh * (n > 8 ? 8 : 3) : 0, right: isBar ? vh * (n > 8 ? 8 : 3) : vh * 18, top: vh * 6, bottom: 0, containLabel: true }, // bars: room for a label wider than its bar
      legend: isBar && spec.series.length > 1 ? { top: 0, left: 0, textStyle: { color: '#b4b9ae', fontSize: vh * 2.6 }, icon: 'rect' } : undefined,
      xAxis: {
        type: 'category',
        data: dataset.x,
        boundaryGap: isBar,
        axisLine: { show: !isBar, lineStyle: { color: '#262a23' } },
        axisTick: { show: false },
        // Long category names wrap under their bar instead of running into each other.
        axisLabel: { color: '#9aa094', fontSize: vh * 2.5, lineHeight: vh * 2.9, margin: vh * 1.4, interval: isBar && n <= 14 ? 0 : 'auto', ...(isBar && n <= 8 ? { width: (el.current!.clientWidth / n) * 0.92, overflow: 'break' } : {}) },
      },
      yAxis: {
        type: 'value',
        show: !isBar,
        splitNumber: 3,
        splitLine: { lineStyle: { color: '#1b1f19' } },
        axisLabel: { color: FAINT, fontSize: vh * 2.3 },
      },
      // The highlight's label isn't animated by ECharts, so add the highlight once the line has drawn.
      series: series.map((s) => ({ ...s, markPoint: undefined })),
      // Lines with gaps (actual, then forecast) still join up where one series ends and the next begins.
      ...(spec.type === 'line' ? {} : {}),
    });
    let curHi = baseHi;
    const highlight = setTimeout(() => chart.setOption({ series: makeSeries(curHi) }), 2400);
    live.current = {
      chart,
      born: performance.now(),
      restyle: (hi) => {
        if (hi === curHi) return;
        curHi = hi;
        chart.setOption({ animation: false, series: makeSeries(hi) }); // recolour in place: the bars must not grow again
      },
      point: (i) => {
        // The value drawn at x: the first series with a value there (stacked: the top of the stack; waterfall: the top of the step).
        let v: number | null = null;
        if (isFall) {
          const vals = dataset.series[spec.series[0]];
          v = waterfallBases(dataset.x, vals, spec.totals)[i] + Math.abs(vals[i] ?? 0);
        } else if (spec.type === 'stackedBar') v = spec.series.reduce((a, s) => a + (dataset.series[s]?.[i] ?? 0), 0);
        else v = spec.series.map((s) => dataset.series[s]?.[i]).find((x) => x != null) ?? null;
        if (v == null) return null;
        const p = chart.convertToPixel({ gridIndex: 0 }, [i, v]) as number[] | undefined;
        return p && Number.isFinite(p[0]) && Number.isFinite(p[1]) ? [p[0], p[1]] : null;
      },
    };

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(highlight);
      window.removeEventListener('resize', onResize);
      live.current = null;
      chart.dispose();
    };
  }, [JSON.stringify(spec), full.key]); // every server broadcast sends a fresh (equal) spec object; only redraw when it really changes

  // Zoom: magnify around the bar or point being talked about, keeping the chart filling its box.
  useEffect(() => {
    const c = live.current;
    const box = el.current;
    if (!c || !box) return;
    const i = zoom ? dataset.x.indexOf(zoom) : -1;
    const apply = () => {
      const p = i >= 0 ? c.point(i) : null;
      if (!p) {
        box.style.transform = '';
        c.restyle(spec.highlight ? dataset.x.indexOf(spec.highlight) : spec.type !== 'line' ? dataset.x.length - 1 : -1);
        return;
      }
      const w = box.clientWidth, h = box.clientHeight;
      const lift = spec.type === 'line' ? 0 : h * 0.06; // bars: aim a little above the top, where the label is
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      const tx = clamp(w * 0.5 - ZOOM * p[0], w - ZOOM * w);
      const ty = clamp(h * 0.55 - ZOOM * (p[1] - lift), h - ZOOM * h);
      box.style.transform = `translate(${tx}px, ${ty}px) scale(${ZOOM})`;
      c.restyle(i);
    };
    // A zoom built together with its chart waits for the bars to grow first.
    const wait = Math.max(0, (spec.type === 'line' ? 2500 : 1700) - (performance.now() - c.born));
    const t = setTimeout(apply, wait);
    return () => clearTimeout(t);
  }, [zoom, JSON.stringify(spec), full.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="chart-clip">
      <div ref={el} className="chart-canvas" style={{ width: '100%', height: '100%', transformOrigin: '0 0', transition: `transform ${ZOOM_MS}ms cubic-bezier(0.6, 0, 0.2, 1)` }} />
    </div>
  );
}
