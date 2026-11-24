# Prompt for Claude Code: a camera that follows our voices (zooms + Magic-Move transitions)

Paste everything below the line into Claude Code, opened in the `nvda-live-pitch` folder.

---

The pitch is **tomorrow (Wed 25 Nov)**. I want the stage to feel like a camera that follows our voices. As we speak, the screen should zoom and move to exactly the thing we are talking about (a number on a chart, a bullet, the headline figure), then ease back out. Slide-to-slide changes should flow into each other like Canva's "Magic Move", but better. Whenever someone looks up, what is on screen should match the words coming out of our mouths. This is meant to make us stand out, so go big. But the board is sceptical and ESG-focused, so it must stay clear, on-theme and reliable.

**Read first:** `CLAUDE.md`, `docs/PROGRESS.md`, `docs/script/spine.yaml` (its header comments explain cues and zooms), `app/shared/schema.ts` (`Step`, `zoomAt`), `app/server/state.ts` (YAML parser, zoom validation, reveal), `app/server/director.ts`, `app/server/cues.ts`, `app/src/Stage.tsx`, `Chart.tsx`, `CoreArray.tsx`, `useShow.ts`, `Operator.tsx`, `styles.css`. Note what already exists: chart zoom into one x value (`ZOOM = 2.1` in `Chart.tsx`), per-element cues, the `.past` dimming of earlier bullets, the slow `drift` push-in, and `framer-motion` in `package.json`. Build on these. Don't start over.

## 0. Back up first (non-negotiable, before any edit)
- Commit the current state as "pre-motion backup" and tag it `pre-motion-backup`. Keep `.env` untracked, and never print or change its contents.
- Make a one-command restore I can run on the morning of the pitch (for example `./restore-pre-motion.sh`). It must bring back the exact current deck, work offline with no `npm install`, and rebuild `app/dist`. **Test it**: restore, load `/stage`, confirm it works, then return to the new work.
- Add a **runtime kill-switch**: `?motion=off` on the stage URL, plus a Motion on/off toggle and hotkey on the operator panel. Off must behave exactly like today's deck. The setting must survive a refresh.

## 1. The rules that keep it from being confusing
1. **One focus at a time.** The default shot is "wide" (the whole slide). Each move lands on exactly what is being said, then returns to wide, or goes straight to the next target when the two are close (chart point to chart point).
2. **Speech drives it.** A move starts when its cue fires (the existing cue mechanism), lasts about 0.9 to 1.3 seconds, and uses a cinematic slow-in, slow-out ease (no bounce, no overshoot). Starting on the cue means a late cue still looks intentional.
3. **Always legible.** About 2.2x maximum on chart points. For bullets and headline numbers use a gentle lean-in of 1.08 to 1.15x, not a big zoom. The target and its label stay fully inside the screen with margin. Never crop the source line. Text and charts stay sharp when magnified (render at enough resolution).
4. **Spotlight, don't clutter.** The thing in focus stays bright. Other bullets and series dim (extend the existing `.past` behaviour). No blur, because projectors smear it.
5. **Pacing budget.** About 3 camera moves per slide at most. No move in the first second of a slide. Short slides may get none. Decide per slide from the length of its `say` text.
6. **Keep the theme.** Pure black, silicon-grey cores, NVIDIA green only where cores are "computing", Archivo, and the chunky stepped text reveals (the "pass over the cores" look). The *camera* is smooth. The *text reveals* stay stepped. No new colours, cards, gradients or glows.
7. **Projector-safe.** Animate only transform and opacity. No layout thrash. Target 60 fps at 1920x1080 on my laptop, and measure it.

## 2. The camera engine
Replace the per-slide `drift` animation with one virtual camera that every slide shares. Keep a very slow ambient drift only while the camera is idle at wide, so the screen is never quite still. Target types:
- **Chart point:** `x` value, optionally with `series`. Push the *whole slide camera* toward the chart (so on a `split` slide the chart can take over most of the screen), magnify around that bar or point, and add a ring, the exact value label, and dimming of other bars and series. Extend the current zoom in `Chart.tsx`. Keep it as the base.
- **Chart range:** `from` and `to` x values (for example FY22 to FY26), to frame a stretch of a line or a run of bars.
- **Bullet:** lean in on bullet `i`: slightly larger, brighter, with a small camera pan toward it. The others sit at the dimmed level.
- **Headline figure** (`number` layout and `stat`): push in on the figure drawn by the cores.
- **Core-array moment:** for slides with an `effect` (`cpu-gpu`, `merge72`, `spread`), let the camera move with the story, for example pushing in on the few CPU cores, then pulling out as thousands of GPU cores light up.
- **Wide:** return to the whole slide.
- **Depth:** the `CoreArray` background should move a little slower than the foreground (parallax), so the camera feels like it has depth.

Extend the format **additively**: the `Step` union gains `focus` variants (`point`, `range`, `bullet`, `stat`, `wide`). Today's `{ zoom: <x>, cue }` and `{ zoom: all }` items in `spine.yaml` must keep working exactly as they do now (map them onto the new system). Validate targets the way `state.ts` validates zooms today (the x value must exist in the dataset, and the target must come after the chart is built), with a readable load-time error. At runtime, any motion failure must fall back to the plain static slide, never a blank or broken screen. Wrap the camera in an error boundary. Extend `director.ts`'s step descriptions so the operator panel shows what is next ("next: zoom on the FY26 bar").

## 3. Transitions: Magic Move, but better
Between consecutive slides, work out what **persists** and morph it instead of cutting. First, list which consecutive slides in `spine.yaml` share a dataset, series, number, icon or title words, so we build what we will actually use.
- **Same chart or dataset:** the chart stays and morphs. The range extends (FY05–FY13 grows to all years), series are added, the highlight moves, and a `split` chart grows to a full-screen `chart`.
- **Same or similar figure:** the number rolls or counts from the old value to the new, or the cores migrate from one glyph to the next (cores moving, not a crossfade).
- **Shared title words:** words in both titles slide from the old position to the new one (FLIP). The rest wipe in the stepped style.
- **Everything else:** exits with a stepped wipe in the direction of the camera's motion, so a slide change feels like the camera travelling across the die. New elements enter the same way.
- Optional per-slide override (for example `morph:` or `transition:`), additive, for cases where auto-detection guesses wrong.
- **Speech beats animation.** If the next slide's cue fires mid-transition, its first build must still start on time. Cancel or queue cleanly, never stall.
- Pick the mechanism (framer-motion `layoutId`, the View Transitions API, or hand-rolled FLIP) and say in the plan why. Everything must be bundled locally, with no CDN, and must work offline.

## 4. Tie it to what we say, slide by slide
Reuse the existing cue and step system. **Don't loosen cue matching.**
- For every slide in `spine.yaml` where a move helps, add focus or zoom steps, each with its **own cue** taken from words in that slide's `say` text. Use 2–5 distinctive words I will definitely say, plus the usual variants (numbers as words **and** digits, no apostrophes, 3+ alternatives).
- When a specific number is spoken ("sixty-four dollars", "twenty-four percent"), focus on that exact data point the moment the number is said.
- Skip slides where the wide shot is best. Not every slide needs a move.
- **Do not change** any `say` text, title, bullet text, existing cue, dataset or number. Only add steps and their cues. Don't add typed digits to slide text (the server refuses them anyway).
- Pick **4 to 6 signature moments** across the pitch where the motion gives the audience a "wow" that also helps them understand (candidates: 249,000 of 250,000; the CUDA bet on the revenue line; base vs bear vs the $64 stress case; the reverse DCF; the Scope 3 rise; the "built live" finale). Give these the most polish. List them in your plan so I can veto any.
- Finish with a table: slide id | each move | its cue phrase | why it helps.

## 5. Control and fallback (must still work)
Manual Next/Back/pause step through reveals *including* focus steps. One operator hotkey snaps the camera to wide at any time. The panic button and static fallback are untouched. If the mic or speech-to-text fails, clicking through still gives the full motion.

## 6. Order of work
1. **Backup (section 0)**, then post a short plan (20 lines max: mechanism, signature moments, risks) and carry on without waiting.
2. **Camera engine** with chart-point, chart-range, bullet and headline-figure focus. **Stop here** and tell me exactly which slide and which keys to press to see it.
3. **Magic-Move transitions.** Stop again so I can look.
4. **Author every slide** (section 4).
5. **Harden:** error boundary, kill-switch, frame times, rehearsal.

Keep each check-in to about 5 lines.

## 7. Done means
- `npm test` and `npm run typecheck` pass. Add tests for: old `zoom` items still parsing and behaving the same; new step validation (bad x value, a move before the chart exists); focus state at each reveal count; and which elements persist between two slides.
- A rehearsal run (`scripts/deepgram-run.ts` or `follow-eval.ts`) still takes **every slide** live and fully built by speech, and the new focus steps fire from speech. Report the fire rate and latency of each focus step. Fix misfires by changing cues, not by loosening matching.
- Frame-time numbers at 1920x1080 on the stage.
- `npm run build` has been run so `app/dist` is current, and `./start.sh` works offline.
- `docs/PROGRESS.md` and the `spine.yaml` header comments are updated, plus a one-page "how to rehearse the motion" (keys and the kill-switch).
- The backup restore has been tested.
- An honest list of anything that doesn't work, and anything I have to do by hand.

**Hard rules:** never print or edit `.env`; no new network dependencies at runtime; no hand-typed numbers; don't touch `data/clean/` or the valuation model.
