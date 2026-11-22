import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatValue, type Dataset, type Slide } from '../shared/schema.ts';

const GREEN = '#76b900';
const DIM_GREEN = '#2f4a05';
const OTHERS = ['#8d9388', '#d9dccf', '#5d6358'];
const FAINT = '#9aa193';
const FONT = "'Archivo Variable', system-ui, sans-serif";

/** Only the x values from range[0] to range[1], e.g. FY05–FY13. */
function inRange(ds: Dataset, range?: [string, string]): Dataset {
  if (!range) return ds;
  const a = ds.x.indexOf(range[0]);
  const b = ds.x.indexOf(range[1]);
  if (a < 0 || b < a) return ds;
  return { ...ds, x: ds.x.slice(a, b + 1), series: Object.fromEntries(Object.entries(ds.series).map(([k, v]) => [k, v.slice(a, b + 1)])) };
}

/** Renders any dataset by key. Numbers come only from the dataset; the slide just names series. */
export function Chart({ spec, dataset: full }: { spec: NonNullable<Slide['chart']>; dataset: Dataset }) {
  const el = useRef<HTMLDivElement>(null);
  const dataset = inRange(full, spec.range);

  useEffect(() => {
    const chart = echarts.init(el.current!, undefined, { renderer: 'canvas' });
    const vh = Math.min(window.innerHeight, window.innerWidth * 0.5625) / 100; // same unit as --u in styles.css
    // A long unit is in the caption already: repeating it on every bar makes labels collide.
    const fmt = (v: number) => (dataset.unit.length > 12 ? (Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 10) / 10 || Math.round(v * 100) / 100).toLocaleString('en-GB') : formatValue(v, dataset.unit));
    const isBar = spec.type !== 'line';
    const hiIdx = spec.highlight ? dataset.x.indexOf(spec.highlight) : isBar ? dataset.x.length - 1 : -1;
    const cell = Math.round(vh * 0.9);
    const n = dataset.x.length;
    const price = dataset.x.indexOf('Share price today'); // a valuation chart: everything is judged against the price
    const ref = price >= 0 ? (dataset.series[spec.series[0]]?.[price] ?? null) : null;
    const barColor = (v: number | null, j: number) => (ref != null && j === hiIdx && v != null && v < ref && j !== price ? '#f0a22e' : j === hiIdx ? GREEN : ref == null ? DIM_GREEN : j === price ? '#d9dccf' : v != null && v < ref ? '#c9821b' : DIM_GREEN);
    const stagger = Math.min(160, 1000 / n); // the whole chart builds in about a second, however many bars

    const series = spec.series.map((name, i) => {
      const values = dataset.series[name];
      if (spec.type === 'stackedBar') {
        // ECharts can't stack pictorial bars, so stacked charts use plain bars in the same colours.
        const color = i === 0 ? GREEN : ['#4a5045', '#6b7166', '#8d9388', '#b4b9ae'][(i - 1) % 4];
        return { name, type: 'bar', stack: 'total', data: values, barCategoryGap: '28%', itemStyle: { color }, animationDuration: 1600, animationDelay: (j: number) => j * stagger };
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
          animationDuration: 1600,
          animationDelay: (j: number) => j * stagger,
          markLine: ref == null ? undefined : { silent: true, symbol: 'none', animationDelay: 1500, lineStyle: { color: '#f4f6f1', width: vh * 0.3, type: [vh * 0.9, vh * 0.6] }, label: { show: false }, data: [{ yAxis: ref }] },
          data: values.map((v, j) => ({
            value: v,
            itemStyle: { color: spec.series.length > 1 ? (i === 0 ? GREEN : OTHERS[i - 1]) : barColor(v, j) },
            label: {
              show: spec.series.length === 1 && (n <= 8 || j === hiIdx), // long series: label only the highlight
              position: 'top',
              distance: vh,
              formatter: () => (v == null ? '' : fmt(v)),
              color: j === hiIdx ? '#f4f6f1' : FAINT,
              fontSize: j === hiIdx ? vh * 4 : vh * 2.6,
              fontWeight: j === hiIdx ? 700 : 500,
              fontFamily: FONT,
            },
          })),
        };
      }
      const color = i === 0 ? GREEN : OTHERS[(i - 1) % OTHERS.length];
      return {
        name,
        type: 'line',
        data: values,
        symbol: 'none',
        lineStyle: { width: i === 0 ? vh * 0.75 : vh * 0.2, color, type: i === 0 ? 'solid' : [vh * 0.8, vh * 0.6] },
        animationDuration: 2400,
        animationEasing: 'linear',
        // Direct labels at the line ends instead of a legend.
        endLabel: { show: true, formatter: '{a}', color, fontSize: vh * 2.2, fontFamily: FONT, fontWeight: i === 0 ? 650 : 450, distance: vh },
        markPoint:
          i === 0 && hiIdx >= 0
            ? {
                symbol: 'rect',
                symbolSize: vh * 1.6,
                itemStyle: { color: GREEN },
                label: { position: dataset.unit === '%' ? 'bottom' : 'left', distance: vh * 1.2, color: '#f4f6f1', fontSize: vh * 3.2, fontWeight: 700, fontFamily: FONT, formatter: () => fmt(values[hiIdx] ?? 0) },
                data: [{ coord: [hiIdx, values[hiIdx]] }],
              }
            : undefined,
      };
    });

    chart.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: FONT },
      grid: { left: 0, right: isBar ? (n > 10 ? vh * 7 : 0) : vh * 14, top: vh * 6, bottom: 0, containLabel: true },
      legend: isBar && spec.series.length > 1 ? { top: 0, left: 0, textStyle: { color: '#b4b9ae', fontSize: vh * 2 }, icon: 'rect' } : undefined,
      xAxis: {
        type: 'category',
        data: dataset.x,
        boundaryGap: isBar,
        axisLine: { show: !isBar, lineStyle: { color: '#262a23' } },
        axisTick: { show: false },
        axisLabel: { color: FAINT, fontSize: n <= 5 && Math.max(...dataset.x.map((l) => l.length)) <= 10 ? vh * 2.5 : vh * 1.95, overflow: 'break', width: n <= 5 ? el.current!.clientWidth / n - vh : undefined, margin: vh * 1.4, interval: isBar && n <= 14 ? 0 : 'auto' },
      },
      yAxis: {
        type: 'value',
        show: !isBar,
        max: dataset.unit === '%' && !isBar ? 100 : undefined, interval: dataset.unit === '%' && !isBar ? 25 : undefined,
        splitNumber: 3,
        splitLine: { lineStyle: { color: '#1b1f19' } },
        axisLabel: { color: FAINT, fontSize: vh * 1.9 },
      },
      // The highlight's label isn't animated by ECharts, so add the highlight once the line has drawn.
      series: series.map((s) => ({ ...s, markPoint: undefined })),
    });
    const highlight = setTimeout(() => chart.setOption({ series }), 2400);

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(highlight);
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [JSON.stringify(spec), full.key]); // every server broadcast sends a fresh (equal) spec object; only redraw when it really changes

  return <div ref={el} style={{ width: '100%', height: '100%' }} />;
}
