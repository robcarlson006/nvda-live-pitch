import type { ClientMsg, ShowState, SpineSlide } from './schema.ts';

/** Spoken speed used to guess how long a slide takes: about 150 words a minute. */
const WORDS_PER_SECOND = 2.5;
export const PITCH_SECONDS = 540; // aim 9 minutes (10 is the hard limit)

export const slideSeconds = (s: SpineSlide) => Math.round(((s.say ?? s.title).trim().split(/\s+/).filter(Boolean).length) / WORDS_PER_SECOND);

export type Pace = {
  plannedLeft: number; // seconds of script still to speak (slides from the current one on, not skipped)
  timeLeft: number; // seconds of the pitch left
  over: number; // plannedLeft - timeLeft; > 0 means we will run out of time
  suggest: { id: string; seconds: number }[]; // ✂ slides still ahead that, dropped, would fit. Suggestion only: nothing is skipped automatically.
};

/** Time left against the script still to speak, and which optional slides to drop if we are behind. */
export function pace(spine: SpineSlide[], state: Pick<ShowState, 'index' | 'skipped'>, elapsedSec: number, total = PITCH_SECONDS): Pace {
  const from = Math.max(0, state.index);
  const ahead = spine.filter((s, i) => i >= from && !state.skipped.includes(s.id));
  const plannedLeft = ahead.reduce((t, s) => t + slideSeconds(s), 0);
  const timeLeft = Math.max(0, total - elapsedSec);
  const over = plannedLeft - timeLeft;
  const suggest: Pace['suggest'] = [];
  if (over > 0) {
    let need = over;
    // Drop the longest optional slides first, so the fewest cuts are needed. Never the slide being spoken now.
    const options = ahead.filter((s, i) => s.optional && spine.indexOf(s) > state.index).map((s) => ({ id: s.id, seconds: slideSeconds(s) })).sort((a, b) => b.seconds - a.seconds);
    for (const o of options) {
      if (need <= 0) break;
      suggest.push(o);
      need -= o.seconds;
    }
  }
  return { plannedLeft, timeLeft, over, suggest };
}

/** The panic key: stop following speech and go to the standby screen. Both are plain messages to our own server, so they work with the AI, the network and the mic all dead. */
export const panicMessages = (): ClientMsg[] => [{ type: 'autoCue', on: false }, { type: 'clear' }];
