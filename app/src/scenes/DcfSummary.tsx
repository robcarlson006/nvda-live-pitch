import type { CSSProperties, ReactNode } from 'react';
import { Figures } from '../Figures.tsx';
import { lookup, type Dataset } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './dcf.css';

/**
 * "The DCF on one page": every headline output of the valuation, as a dashboard that assembles one tile per point said.
 *   1 Assumptions — WACC, terminal growth, forecast period, revenue CAGR, EBIT margin
 *   2 Cash flows  — each year's free cash flow (outline) shrinks to its present value (solid); PV of FCFs, PV of terminal
 *                   value, and a ring filled to the terminal value's share of EV
 *   3 Value       — enterprise value, net debt (none: net cash), equity value, ÷ diluted shares
 *   4 Answer      — implied share price against the dated share price, the upside, and all three discount rates on one scale
 * Every figure is a lookup into data/clean (model_dcf_summary, model_dcf_inputs, model_dcf_detail, model_three_rates).
 */
const FC_YEARS = ['FY28', 'FY29', 'FY30', 'FY31', 'FY32'];
const RATE_X = ['15.4% Bloomberg', '14.45% Google Finance', '10.55% industry (Damodaran)'];

const raw = (ds: Dataset | undefined, series: string, x: string) => ds?.series[series]?.[ds.x.indexOf(x)] ?? null;

function Row({ label, value, at, motion, note }: { label: string; value?: string; at: number; motion: boolean; note?: string }) {
  return (
    <div className="ds-row" style={{ '--d': `${at}s` } as CSSProperties}>
      <span className="ds-label">{label}</span>
      <span className="ds-value">{value ? <Figures text={value} at={at} motion={motion} /> : '…'}</span>
      {note && <span className="ds-note">{note}</span>}
    </div>
  );
}

function Tile({ n, title, className = '', children }: { n: number; title: string; className?: string; children: ReactNode }) {
  return (
    <section className={`ds-tile ${className}`}>
      <p className="ds-tile-head"><span className="ds-n">{n}</span>{title}</p>
      {children}
    </section>
  );
}

export function DcfSummary({ stage, motion, datasets = {} }: SceneProps) {
  const S = (series: string) => lookup(datasets, 'model_dcf_summary', series, 'value');
  const I = (series: string) => lookup(datasets, 'model_dcf_inputs', series, 'value');
  const detail = datasets.model_dcf_detail;
  const rates = datasets.model_three_rates;
  const asOf = datasets.model_dcf_inputs?.asOf;
  const dated = asOf ? new Date(`${asOf}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  // Tile 2: free cash flow and its present value per year, scaled to the largest cash flow.
  const fcf = FC_YEARS.map((y) => raw(detail, y, 'Free cash flow') ?? 0);
  const pv = FC_YEARS.map((y) => raw(detail, y, 'Present value of cash flow') ?? 0);
  const fmax = Math.max(...fcf) || 1;
  const tvShare = raw(datasets.model_dcf_summary, 'Terminal value share of EV', 'value');
  const R = 15.9;
  const C = 2 * Math.PI * R;

  // Tile 4: the three values per share and today's price on one scale.
  const price = raw(datasets.model_dcf_summary, 'Share price', 'value');
  const vals = RATE_X.map((x) => raw(rates, 'Value per share', x));
  const top = Math.max(...vals.map((v) => v ?? 0), price ?? 0) * 1.08 || 1;
  const pos = (v: number) => `${(v / top) * 100}%`;
  const upside = S('Upside');

  return (
    <div className={`ds s${Math.min(stage, 4)}`}>
      {stage >= 1 && (
        <Tile n={1} title="Assumptions">
          <Row label="WACC (discount rate)" value={I('WACC, US semiconductor industry average')} at={0.3} motion={motion} note="US chip-industry average" />
          <Row label="Terminal growth" value={I('Terminal growth (our choice)')} at={0.5} motion={motion} note="a year, after FY32" />
          <Row label="Forecast period" value={S('Forecast period')} at={0.7} motion={motion} note="FY28 to FY32" />
          <Row label="Revenue growth (CAGR)" value={S('Revenue CAGR, FY27–32')} at={0.9} motion={motion} note="a year, FY27 to FY32" />
          <Row label="EBIT margin" value={S('EBIT margin, FY26')} at={1.1} motion={motion} note="operating profit, FY26" />
        </Tile>
      )}

      {stage >= 2 && (
        <Tile n={2} title="Cash flows">
          <div className="ds-flows">
            {FC_YEARS.map((y, i) => (
              <div key={y} className="ds-flow" style={{ '--d': `${0.3 + i * 0.12}s` } as CSSProperties}>
                <span className="ds-fcf" style={{ height: `${(fcf[i] / fmax) * 100}%` }} />
                <span className="ds-pv" style={{ height: `${(pv[i] / fmax) * 100}%`, '--d2': `${1.1 + i * 0.12}s` } as CSSProperties} />
                <span className="ds-yr">{y}</span>
              </div>
            ))}
          </div>
          <p className="ds-key"><span className="k-fcf" /> free cash flow <span className="k-pv" /> worth today</p>
          <Row label="PV of FCFs" value={S('PV of FCFs')} at={1.6} motion={motion} />
          <Row label="PV of terminal value" value={S('PV of terminal value')} at={1.8} motion={motion} />
          {tvShare != null && (
            <figure className="ds-ring" style={{ '--d': '2.1s' } as CSSProperties}>
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r={R} className="ds-ring-bg" />
                <circle cx="20" cy="20" r={R} className="ds-ring-fg" style={{ '--len': `${(tvShare / 100) * C}`, '--c': `${C}` } as CSSProperties} />
              </svg>
              <figcaption>
                <span className="ds-ring-pct"><Figures text={S('Terminal value share of EV') ?? ''} at={2.1} motion={motion} /></span>
                <span className="ds-ring-cap">of enterprise value comes after FY32</span>
              </figcaption>
            </figure>
          )}
        </Tile>
      )}

      {stage >= 3 && (
        <Tile n={3} title="From value to one share">
          <Row label="Enterprise value" value={S('Enterprise value')} at={0.3} motion={motion} />
          <Row label="− Net debt" value={I('Net cash')} at={0.6} motion={motion} note="none: this is net cash, so it is added" />
          <Row label="= Equity value" value={S('Equity value')} at={0.9} motion={motion} />
          <Row label="÷ Diluted shares" value={S('Diluted shares')} at={1.2} motion={motion} note="incl. staff options and awards" />
        </Tile>
      )}

      {stage >= 4 && (
        <Tile n={4} title="The answer" className="ds-answer">
          <div className="ds-answer-top">
            <div className="ds-big" style={{ '--d': '0.3s' } as CSSProperties}>
              <span className="ds-big-num"><Figures text={S('Implied share price') ?? ''} at={0.3} motion={motion} /></span>
              <span className="ds-big-cap">implied value per share</span>
            </div>
            <div className="ds-vs" style={{ '--d': '0.9s' } as CSSProperties}>
              <span className="ds-vs-num">{S('Share price')}</span>
              <span className="ds-vs-cap">share price, {dated}</span>
            </div>
            <div className="ds-up" style={{ '--d': '1.4s' } as CSSProperties}>
              <span className="ds-up-num"><Figures text={upside ? `+${upside}` : ''} at={1.4} motion={motion} /></span>
              <span className="ds-up-cap">upside</span>
            </div>
          </div>
          {price != null && (
            <div className="ds-meter">
              <span className="ds-track" />
              <span className="ds-fill" style={{ left: pos(price), width: `calc(${pos((vals[2] ?? price) - price)})` }} />
              <span className="ds-tick today" style={{ left: pos(price) }}><i />today</span>
              {RATE_X.map((x, i) => vals[i] != null && (
                <span key={x} className={`ds-tick rate${i === 2 ? ' head' : ''}${i === 1 ? ' up' : ''}`} style={{ left: pos(vals[i]!), '--d': `${2 + i * 0.25}s` } as CSSProperties}>
                  <i />
                  <b>{lookup(datasets, 'model_three_rates', 'Value per share', x)}</b>
                  {x.split(' ')[0]}
                </span>
              ))}
            </div>
          )}
        </Tile>
      )}
    </div>
  );
}
