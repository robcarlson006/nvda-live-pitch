import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { Dataset, Slide } from '../shared/schema.ts';

const GREEN = '#76b900';
const MUTED = ['#8a8f98', '#4fc3f7', '#ffb74d', '#ba68c8'];

/** Renders any dataset by key. Numbers come only from the dataset; the slide just names series. */
export function Chart({ spec, dataset }: { spec: NonNullable<Slide['chart']>; dataset: Dataset }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(el.current!, undefined, { renderer: 'canvas' });
    const isBar = spec.type !== 'line';
    const hiIdx = spec.highlight ? dataset.x.indexOf(spec.highlight) : -1;

    chart.setOption({
      backgroundColor: 'transparent',
      animationDuration: 2200,
      animationEasing: 'cubicOut',
      grid: { left: 8, right: 24, top: 48, bottom: 8, containLabel: true },
      legend: spec.series.length > 1 ? { top: 0, left: 0, textStyle: { color: '#cfd3da', fontSize: 16 }, itemGap: 24 } : undefined,
      xAxis: {
        type: 'category',
        data: dataset.x,
        axisLine: { lineStyle: { color: '#2a2f36' } },
        axisTick: { show: false },
        axisLabel: { color: '#8a8f98', fontSize: 14 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1a1e23' } },
        axisLabel: { color: '#8a8f98', fontSize: 14 },
      },
      series: spec.series.map((name, i) => {
        const color = i === 0 ? GREEN : MUTED[(i - 1) % MUTED.length];
        const data = dataset.series[name].map((v, j) =>
          isBar && hiIdx >= 0 ? { value: v, itemStyle: { opacity: j === hiIdx ? 1 : 0.45 } } : v,
        );
        return isBar
          ? {
              name,
              type: 'bar',
              data,
              stack: spec.type === 'stackedBar' ? 'total' : undefined,
              barMaxWidth: 56,
              itemStyle: { color, borderRadius: spec.type === 'stackedBar' ? 0 : [4, 4, 0, 0] },
              animationDelay: (j: number) => j * 90,
            }
          : {
              name,
              type: 'line',
              data,
              smooth: 0.3,
              symbol: 'circle',
              symbolSize: i === 0 ? 8 : 5,
              lineStyle: { width: i === 0 ? 4 : 2, color, type: i === 0 ? 'solid' : 'dashed', shadowBlur: i === 0 ? 18 : 0, shadowColor: GREEN },
              itemStyle: { color },
              areaStyle:
                i === 0
                  ? { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(118,185,0,0.35)' }, { offset: 1, color: 'rgba(118,185,0,0)' }]) }
                  : undefined,
              markPoint:
                i === 0 && hiIdx >= 0
                  ? {
                      symbol: 'circle',
                      symbolSize: 16,
                      itemStyle: { color: GREEN, shadowBlur: 24, shadowColor: GREEN },
                      label: { position: 'left', distance: 12, color: '#fff', fontSize: 20, fontWeight: 700, formatter: (p: { value: number }) => p.value.toFixed(1) },
                      data: [{ coord: [hiIdx, dataset.series[name][hiIdx]], value: dataset.series[name][hiIdx] }],
                    }
                  : undefined,
            };
      }),
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
