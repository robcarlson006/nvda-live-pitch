import { useEffect, useState } from 'react';

/**
 * Pictures of each script slide, from the static backup deck (public/fallback, made by scripts/snap-slides.ts).
 * Looked up by slide id through pages.json, so a reordered script never shows the wrong picture; a slide with no
 * picture yet gets none (the caller shows its number instead).
 */
export function useThumbs(): (id: string) => string | null {
  const [pages, setPages] = useState<{ spine: string[]; version?: string } | null>(null);
  useEffect(() => {
    fetch('/fallback/pages.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then(setPages)
      .catch(() => {}); // no backup deck: rows simply show numbers
  }, []);
  return (id) => {
    const i = pages?.spine.indexOf(id) ?? -1;
    return i < 0 ? null : `/fallback/slide-${String(i + 1).padStart(2, '0')}.jpg${pages?.version ? `?v=${pages.version}` : ''}`;
  };
}
