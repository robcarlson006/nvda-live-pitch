import { motion as m } from 'framer-motion';
import type { CSSProperties } from 'react';
import './effects.css';

/**
 * Section openers: when the talk passes to the next speaker, a full-bleed card with one big word plays before that
 * section's first slide builds. Keyed by spine slide id (the section's first slide), so the script needs no change.
 * Only plays moving forward into the section, and never with motion off.
 */
export const SECTIONS: Record<string, { kicker: string; word: string; line: string }> = {
  'last-quarter': { kicker: 'Part two · Panshul', word: 'Numbers.', line: 'Do the numbers agree?' },
  'space-race': { kicker: 'Part three · Mi’kael', word: 'Future.', line: 'Responsibility, and our recommendation' },
};
export const CARD_MS = 1900;

export function SectionCard({ kicker, word, line }: { kicker: string; word: string; line: string }) {
  return (
    <div className="section-card">
      <p className="sc-kicker">{kicker}</p>
      <h1 className="sc-word" aria-label={word}>
        {[...word].map((ch, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties}>{ch}</span>
        ))}
      </h1>
      <span className="sc-rule" />
      <p className="sc-line">{line}</p>
    </div>
  );
}

/**
 * Chapter trackers: a small row of steps that stays on screen across a run of slides (the four layers; the DCF walk),
 * so it is carried over from slide to slide instead of fading out and back in, and the highlight glides to the step
 * now being talked about (a Magic Move). `null` for an active step = the overview slide, where every step is lit.
 */
export const CHAPTERS: { key: string; ids: (string | null)[]; labels: string[] }[] = [
  { key: 'layers', ids: ['chips', 'software', 'connections', 'supply'], labels: ['Chips', 'Software', 'Connections', 'Supply'] },
  { key: 'dcf', ids: ['dcf-inputs', 'dcf-drivers', 'fcf', 'dcf-worksheet', 'dcf-bridge', 'three-rates', 'dcf-summary', 'reverse-dcf'], labels: ['Inputs', 'Drivers', 'Cash flow', 'Discounting', 'Value', 'Three rates', 'Summary', 'Priced in'] },
];
// Overview slides that show a chapter with every step lit, just before its first step.
const OVERVIEW: Record<string, string> = { 'four-layers': 'layers' };

export function chapterFor(id: string | undefined): { key: string; labels: string[]; active: number } | null {
  if (!id) return null;
  if (OVERVIEW[id]) {
    const c = CHAPTERS.find((x) => x.key === OVERVIEW[id])!;
    return { key: c.key, labels: c.labels, active: -1 };
  }
  for (const c of CHAPTERS) {
    const i = c.ids.indexOf(id);
    if (i >= 0) return { key: c.key, labels: c.labels, active: i };
  }
  return null;
}

export function ChapterRail({ labels, active, motion }: { labels: string[]; active: number; motion: boolean }) {
  return (
    <m.nav
      className="chapter-rail"
      aria-hidden="true"
      initial={motion ? { opacity: 0, y: -14 } : false}
      animate={{ opacity: 1, y: 0, transition: { duration: motion ? 0.8 : 0, ease: [0.16, 1, 0.3, 1], delay: motion ? 0.3 : 0 } }}
      exit={{ opacity: 0, y: -14, transition: { duration: motion ? 0.4 : 0 } }}
    >
      {labels.map((l, i) => (
        <span key={l} className={`cr-step${active === -1 ? ' all' : i === active ? ' on' : i < active ? ' done' : ''}`}>
          {i === active && <m.span layoutId="chapter-pill" className="cr-pill" transition={{ duration: motion ? 0.9 : 0, ease: [0.65, 0, 0.35, 1] }} />}
          <span className="cr-label">{l}</span>
        </span>
      ))}
    </m.nav>
  );
}
