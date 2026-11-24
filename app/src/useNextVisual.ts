import { useEffect } from 'react';
import type { ShowState, SpineSlide } from '../shared/schema.ts';

/** Warm the only stage assets that are fetched on demand. Chart code and data are already loaded. */
export function useNextVisual(state: ShowState | null, spine: SpineSlide[]) {
  const next = state ? spine.slice(state.index + 1).find((slide) => !state.skipped.includes(slide.id)) : undefined;
  const video = !state?.backup && next?.video?.file;
  const backupPage = state?.backup && next ? spine.indexOf(next) + 1 : 0;

  useEffect(() => {
    if (backupPage) {
      const image = new Image();
      image.src = `/fallback/slide-${String(backupPage).padStart(2, '0')}.jpg`;
      return;
    }
    if (!video) return;
    // Use the media element so the browser can issue the same ranged reads as playback.
    const preload = document.createElement('video');
    preload.preload = 'auto';
    preload.src = `/media/${encodeURIComponent(video)}`;
    return () => {
      preload.removeAttribute('src');
      preload.load();
    };
  }, [video, backupPage]);
}
