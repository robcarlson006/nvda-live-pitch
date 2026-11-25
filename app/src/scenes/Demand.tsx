import type { CSSProperties } from 'react';
import { lookup } from '../../shared/schema.ts';
import type { SceneProps } from './index.tsx';
import './demand.css';
import { parseBuyer, parseConcentration, type Buyer } from './parse.ts';

/**
 * "Demand beyond the hyperscalers": NVIDIA on the left, its buyers on the right. The hyperscalers are there from the
 * start; each "Label: detail" point the speaker says adds a new kind of buyer with its own stream from NVIDIA, so the
 * picture follows the script.
 *
 * Bloomberg splits Data Center revenue into hyperscalers vs AI clouds, industrial & enterprise (nvda_dc_customer_mix),
 * so those two streams are drawn to scale: their thickness is their share of last quarter's revenue. The examples
 * (public compute, specialist cloud) are part of the second group and have no separate figure, so they stay thin.
 *
 * A point about customer concentration ("… made up 44% of … revenue") is shown honestly as a ring: the percentage is
 * read from the point's own text, which was looked up from data/clean/ before it reached the stage.
 */
const SLOT_Y = [13, 38, 63, 88]; // % down the scene for each buyer card, in the order they are said
const MIX = 'nvda_dc_customer_mix';
const HYPER = 'Hyperscalers';
const ACIE = 'AI clouds, industrial & enterprise';

export function Demand({ points = [], datasets = {} }: SceneProps) {
  const mix = datasets[MIX];
  const shareOf = (x: string) => mix?.series['Share of revenue']?.[mix.x.indexOf(x)] ?? null;
  const hyperShare = lookup(datasets, MIX, 'Share of revenue', HYPER);
  const hyperGrowth = lookup(datasets, MIX, 'Growth on a year ago', HYPER);
  const first: Buyer = { label: 'Hyperscalers', detail: hyperShare ? `${hyperShare} of revenue last quarter${hyperGrowth ? `, up ${hyperGrowth} in a year` : ''}` : 'The largest cloud companies' };
  const buyers: Buyer[] = [first, ...points.map(parseBuyer).filter((b): b is Buyer => !!b)].slice(0, SLOT_Y.length);
  // Stroke width (px) to scale with the share of revenue; examples without their own figure are thin.
  const widthFor = (b: Buyer, i: number) => {
    const s = i === 0 ? shareOf(HYPER) : /ai clouds/i.test(b.label) ? shareOf(ACIE) : null;
    return s == null ? 2.4 : Math.max(3, s * 0.36);
  };
  const conc = points.map(parseConcentration).find((c) => !!c) ?? null;
  const R = 15.9; // ring radius, in the 0–100 box
  const C = 2 * Math.PI * R;

  return (
    <div className={`dm${conc ? ' has-conc' : ''}`}>
      <svg className="dm-streams" viewBox="0 0 100 100" preserveAspectRatio="none">
        {buyers.map((b, i) => (
          <path key={b.label} className={`dm-stream${i === 0 ? ' first' : ''}${widthFor(b, i) > 2.4 ? ' sized' : ''}`} d={`M 16 50 C 32 50, 30 ${SLOT_Y[i]}, 48 ${SLOT_Y[i]}`} pathLength={1} style={{ strokeWidth: widthFor(b, i) } as CSSProperties} />
        ))}
        {buyers.map((b, i) => (
          <path key={`f-${b.label}`} className="dm-pulse" d={`M 16 50 C 32 50, 30 ${SLOT_Y[i]}, 48 ${SLOT_Y[i]}`} style={{ '--k': i } as CSSProperties} />
        ))}
      </svg>

      <div className="dm-source">
        <span className="dm-chip">NVIDIA</span>
      </div>

      {buyers.map((b, i) => (
        <article key={b.label} className={`dm-buyer${i === 0 ? ' first' : ' new'}`} style={{ top: `${SLOT_Y[i]}%` }}>
          <p className="dm-label">{b.label}</p>
          <p className="dm-detail">{b.detail}</p>
        </article>
      ))}

      {conc && (
        <figure className="dm-conc">
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r={R} className="dm-ring-bg" />
            <circle cx="20" cy="20" r={R} className="dm-ring" style={{ '--len': `${(conc.pct / 100) * C}`, '--c': `${C}` } as CSSProperties} />
          </svg>
          <figcaption>
            <span className="dm-pct">{conc.text}</span>
            <span className="dm-cap">{conc.caption}</span>
          </figcaption>
        </figure>
      )}
    </div>
  );
}
