/**
 * The one way speech and script text are cut into words, shared by the cue matcher (server) and the teleprompter's
 * trigger highlights and the slide finder (browser), so a phrase is the same words everywhere.
 */
// Deepgram writes US spellings even in en-GB mode ("fiber", "tons"), so UK spellings in cues are mapped to them.
export const SPELLING: Record<string, string> = {
  centre: 'center', centres: 'centers', colour: 'color', fibre: 'fiber', fibres: 'fibers', tonne: 'ton', tonnes: 'tons',
  grey: 'gray', programme: 'program', programmes: 'programs', analyse: 'analyze', modelling: 'modeling', labour: 'labor', defence: 'defense',
};

export const STOP = new Set('a an the and of to is it in that this we our you on for at as so be are was its i us with by from'.split(' '));

export function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SPELLING[w] ?? w);
}
