import type { CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';
import './demand.css';
import { parseBuyer, parseConcentration, type Buyer } from './parse.ts';

/**
 * "Demand beyond the hyperscalers": NVIDIA on the left, its buyers on the right. The hyperscalers are there from the
 * start; each "Label: detail" point the speaker says adds a new kind of buyer (public compute, specialist cloud…) with
 * its own stream from NVIDIA, so the picture follows the script. All streams are the same width on purpose: we have no
 * split of sales by buyer type, so the drawing must not suggest one.
 *
 * A point about customer concentration ("… made up 44% of … revenue") is shown honestly as a ring: the percentage is
 * read from the point's own text, which was looked up from data/clean/ before it reached the stage.
 */
const SLOT_Y = [18, 44, 70]; // % down the scene for each buyer card, in the order they are said

export function Demand({ points = [] }: SceneProps) {
  const buyers: Buyer[] = [{ label: 'Hyperscalers', detail: 'The largest cloud companies' }, ...points.map(parseBuyer).filter((b): b is Buyer => !!b)].slice(0, SLOT_Y.length);
  const conc = points.map(parseConcentration).find((c) => !!c) ?? null;
  const R = 15.9; // ring radius, in the 0–100 box
  const C = 2 * Math.PI * R;

  return (
    <div className={`dm${conc ? ' has-conc' : ''}`}>
      <svg className="dm-streams" viewBox="0 0 100 100" preserveAspectRatio="none">
        {buyers.map((b, i) => (
          <path key={b.label} className={`dm-stream${i === 0 ? ' first' : ''}`} d={`M 16 50 C 32 50, 30 ${SLOT_Y[i]}, 48 ${SLOT_Y[i]}`} pathLength={1} />
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
