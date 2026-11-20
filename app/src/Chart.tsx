import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatValue, type Dataset, type Slide } from '../shared/schema.ts';

const GREEN = '#76b900';
const DIM_GREEN = '#2f4a05';
const OTHERS = ['#8d9388', '#d9dccf', '#5d6358'];
const FAINT = '#7a8174';
const FONT = "'Archivo Variable', system-ui, sans-serif";

/** Renders any dataset by key. Numbers come only from the dataset; the slide just names series. */
export function Chart({ spec, dataset }: { spec: NonNullable<Slide['chart']>; dataset: Dataset }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(el.current!, undefined, { renderer: 'canvas' });
    const vh = window.innerHeight / 100;
    const fmt = (v: number) => formatValue(v, dataset.unit);
    const isBar = spec.type !== 'line';
    const hiIdx = spec.highlight ? dataset.x.indexOf(spec.highlight) : isBar ? dataset.x.length - 1 : -1;
    const cell = Math.round(vh * 0.9);

    const series = spec.series.map((name, i) => {
      const values = dataset.series[name];
      if (spec.type === 'stackedBar') {
        // ECharts can't stack pictorial bars, so stacked charts use plain bars in the same colours.
        const color = i === 0 ? GREEN : ['#4a5045', '#6b7166', '#8d9388', '#b4b9ae'][(i - 1) % 4];
        return { name, type: 'bar', stack: 'total', data: values, barCategoryGap: '28%', itemStyle: { color }, animationDuration: 1600, animationDelay: (j: number) => j * 120 };
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
          animationDelay: (j: number) => j * 160,
          data: values.map((v, j) => ({
            value: v,
            itemStyle: { color: spec.series.length > 1 ? (i === 0 ? GREEN : OTHERS[i - 1]) : j === hiIdx ? GREEN : DIM_GREEN },
            label: {
              show: spec.series.length === 1,
              position: 'top',
              distance: vh,
              formatter: () => (v == null ? '' : fmt(v)),
              color: j === hiIdx ? '#f4f6f1' : FAINT,
              fontSize: j === hiIdx ? vh * 3 : vh * 1.9,
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
        lineStyle: { width: i === 0 ? vh * 0.45 : vh * 0.2, color, type: i === 0 ? 'solid' : [vh * 0.8, vh * 0.6] },
        animationDuration: 2400,
        animationEasing: 'linear',
        // Direct labels at the line ends instead of a legend.
        endLabel: { show: true, formatter: '{a}', color, fontSize: vh * 1.9, fontFamily: FONT, fontWeight: i === 0 ? 650 : 450, distance: vh },
        markPoint:
          i === 0 && hiIdx >= 0
            ? {
                symbol: 'rect',
                symbolSize: vh * 1.6,
                itemStyle: { color: GREEN },
                label: { position: 'left', distance: vh * 1.2, color: '#f4f6f1', fontSize: vh * 3.2, fontWeight: 700, fontFamily: FONT, formatter: () => fmt(values[hiIdx] ?? 0) },
                data: [{ coord: [hiIdx, values[hiIdx]] }],
              }
            : undefined,
      };
    });

    chart.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: FONT },
      grid: { left: 0, right: isBar ? 0 : vh * 14, top: vh * 5, bottom: 0, containLabel: true },
      legend: isBar && spec.series.length > 1 ? { top: 0, left: 0, textStyle: { color: '#b4b9ae', fontSize: vh * 1.8 }, icon: 'rect' } : undefined,
      xAxis: {
        type: 'category',
        data: dataset.x,
        boundaryGap: isBar,
        axisLine: { show: !isBar, lineStyle: { color: '#262a23' } },
        axisTick: { show: false },
        axisLabel: { color: FAINT, fontSize: vh * 1.6, margin: vh * 1.4, interval: isBar ? 0 : 'auto' },
      },
      yAxis: {
        type: 'value',
        show: !isBar,
        splitNumber: 3,
        splitLine: { lineStyle: { color: '#1b1f19' } },
        axisLabel: { color: FAINT, fontSize: vh * 1.5 },
      },
      series,
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [spec, dataset]);

  return <div ref={el} style={{ width: '100%', height: '100%' }} />;
}
