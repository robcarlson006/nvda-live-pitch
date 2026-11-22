import { type Dataset, type ShowState, type SpineSlide } from '../shared/schema.ts';
import { accept, type Director, type Verdict } from './director.ts';
import { evidence } from './evidence.ts';
import { liveGo, livePoints } from './state.ts';

/**
 * Live mode, joined up: speech goes to the Director, its verdicts move the deck.
 * Used by the server and, unchanged, by the follow-eval, so what is measured is what runs on the day.
 */
export type FollowDeps = {
  get(): ShowState;
  set(s: ShowState, why: 'slide' | 'points'): void;
  spine(): SpineSlide[];
  datasets: Map<string, Dataset>;
  tangent(heard: string): void;
  log?(line: string): void;
};

const HOLD_MS = 4_000; // after a person moves the deck, leave it where they put it for a moment

export class Follow {
  private held = 0;
  private running = false;
  constructor(
    readonly director: Director,
    private d: FollowDeps,
    private clock: () => number = Date.now,
  ) {}

  active(s = this.d.get()): boolean {
    return s.follow === 'live' && s.autoCue && s.mode === 'script';
  }

  hear(text: string, final: boolean) {
    if (!this.active()) return;
    this.director.hear(text, final);
    void this.tick();
  }

  /** A person moved the deck: what was said before that no longer counts, and the deck stays put for a few seconds. */
  manual() {
    this.director.mark();
    this.held = this.clock() + HOLD_MS;
  }

  /** Cheap to call often: does nothing unless there is enough new speech. */
  async tick(): Promise<void> {
    if (this.running || !this.active() || !this.director.ready(this.clock())) return;
    this.running = true;
    try {
      const at = this.d.get().liveSince;
      const v = await this.director.look(this.d.get(), this.d.spine(), this.d.datasets);
      const s = this.d.get();
      if (!v || !this.active(s)) return;
      if (s.liveSince !== at) return this.director.clearVotes(); // the deck moved while Claude was thinking: that verdict is about the past
      this.apply(v, s);
    } catch (e) {
      this.d.log?.((e as Error).message); // whatever happens, the show goes on
    } finally {
      this.running = false;
    }
  }

  private apply(v: Verdict, s: ShowState) {
    const spine = this.d.spine();
    const votes = this.director.vote(v.action === 'slide' ? `slide:${v.slide}` : v.action);
    this.d.log?.(`${v.action}${v.slide ? ` ${v.slide}` : ''} +${v.covered} (${votes}) ${this.director.ms} ms`);
    const backed = v.action === 'slide' && evidence(this.director.recent(22), spine)?.id === v.slide;
    // Two moves in quick succession need more than one opinion: one sentence must never run the deck forward.
    if (v.action === 'slide' && this.director.sinceMove < 9 && !backed && votes < 2) return;
    if (!accept(v, s, spine, votes, backed)) return;
    if (v.action === 'tangent') return this.d.tangent(this.director.recent());
    if (v.action === 'slide' && this.clock() < this.held) return;
    const out = v.action === 'slide' ? liveGo(s, spine, v.slide!, v.covered) : livePoints(s, spine, v.covered);
    if (out === s) return;
    if (v.action === 'slide') this.director.moved();
    this.d.set(out, v.action === 'slide' ? 'slide' : 'points');
  }
}

/** Slide cue words are the safety net in live mode: on only while Claude can't be reached. */
export const cueSlides = (s: ShowState, directorError: string | null, hasKey: boolean) => s.follow !== 'live' || !!directorError || !hasKey;
