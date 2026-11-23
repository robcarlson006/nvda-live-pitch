import { useEffect, useRef, useState } from 'react';

export const BEAT_GAP_MS = 750; // the least time between two things appearing, whatever caused them

/**
 * Smooths what the server says is built into a build the room can follow: elements arrive one at a time, in order,
 * at least BEAT_GAP_MS apart, even if speech (or a cue run-on, or Claude) asked for several at once.
 * Going back is instant. A new slide starts from its title, so its first elements still build rather than appear.
 * (The server stays the truth; this only decides how fast the stage catches up to it.)
 */
export function usePaced(target: number, slideId: string): number {
  const [shown, setShown] = useState(target);
  const slide = useRef(slideId);
  const fresh = useRef(false);
  if (slide.current !== slideId) {
    slide.current = slideId;
    fresh.current = true;
    // a slide that arrives nearly built (the operator went back to it) is shown as it is; otherwise it builds up from its title
    if (target <= 3 && shown !== Math.min(target, 1)) setShown(Math.min(target, 1));
    else if (target > 3 && shown !== target) setShown(target);
  }
  useEffect(() => {
    if (shown > target) return setShown(target);
    if (shown === target) return;
    const t = setTimeout(() => {
      fresh.current = false;
      setShown((s) => Math.min(target, s + 1));
    }, fresh.current ? 350 : BEAT_GAP_MS);
    return () => clearTimeout(t);
  }, [shown, target, slideId]);
  return Math.min(shown, target);
}
