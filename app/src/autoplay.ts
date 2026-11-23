import { useEffect } from 'react';
import { elementCount, type ClientMsg, type ShowState, type SpineSlide } from '../shared/schema.ts';

export const REHEARSAL_SECONDS = 9 * 60;

/** How long each beat of this slide waits before the next one: the slide's share of the run (by words in its `say` line) split over its beats. */
export function beatSeconds(spine: SpineSlide[], total = REHEARSAL_SECONDS): Map<string, number> {
  const words = (s: SpineSlide) => Math.max(8, (s.say ?? '').split(/\s+/).filter(Boolean).length);
  const sum = spine.reduce((n, s) => n + words(s), 0) || 1;
  return new Map(spine.map((s) => [s.id, (total * words(s)) / sum / Math.max(1, elementCount(s))]));
}

/**
 * Rehearsal mode: plays the whole spine by itself in about nine minutes, one beat at a time, through the same `next`
 * message a key press sends. Any manual move simply restarts the clock for the next beat, so the operator can always take over.
 */
export function useAutoplay(on: boolean, state: ShowState | null, spine: SpineSlide[], send: (m: ClientMsg) => void, onDone: () => void) {
  useEffect(() => {
    if (!on || !state || !spine.length) return;
    const last = spine[spine.length - 1];
    const atEnd = state.index === spine.length - 1 && state.reveal >= elementCount(last);
    if (atEnd) {
      const t = setTimeout(onDone, 6000); // let the finale hold, then stop
      return () => clearTimeout(t);
    }
    const slide = state.index >= 0 ? spine[state.index] : undefined;
    const wait = (slide ? beatSeconds(spine).get(slide.id) ?? 4 : 2) * 1000;
    const t = setTimeout(() => send(state.index < 0 ? { type: 'goto', index: 0 } : { type: 'next' }), wait);
    return () => clearTimeout(t);
  }, [on, state?.index, state?.reveal, state?.liveSince, spine]); // eslint-disable-line react-hooks/exhaustive-deps
}
