# Stage design system (script v4)

The stage is a GPU die. That is the idea: the whole screen is a grid of small cores, and the slide is what the die is computing.

## Look
- **Black, quiet, projector-safe.** Background `#000`; ink `#f4f6f1`; secondary text `#b4b9ae` (10:1 on black); grid and ticks `#7a8174`.
- **NVIDIA green `#76b900` is the one accent**, used for what is being said right now (the NVIDIA bar, the line being drawn, the number just revealed). Not decoration.
- **Amber `#f0a22e` is risk** (bear case, "returned", the minus on −81%). Always paired with a label or a sign, never colour alone.
- **The die behind everything** (`CoreDie.tsx`, engine in `src/cores/engine.ts`): a grid of 10 px cores at 1080p. Each beat runs a compute wave across it; the room's voice wakes cores from the bottom edge; it fades to nothing for the finale. If WebGL is missing or lost, `Backdrop.tsx` (a particle field) takes over so the stage is never blank.
- **Bars are made of cores.** Every solid bar carries the `cells` texture (tokens.ts), so charts look like part of the die.
- **Type:** Archivo Variable (width axis). Display 190, h1 116, h2 76, body 46, label 32, footnote 24 (px at 1920 wide). Big and few words.

## Canvas
Everything is drawn on a fixed 1920×1080 frame and scaled to the window (`SceneHost`), so a 1280×720 laptop and a 4K projector show the same layout. The die canvas alone fills the real window.

## Motion
- One cue = one **beat**: ease in over 300–700 ms (`dur.beat` 0.6 s), then hold. Staggers 60–100 ms. Nothing moves while nothing is being said.
- Curves: `ease.out` for arrivals, `ease.inOut` for anything travelling between two places, `ease.in` for exits.
- Charts are driven by `useTween` (rAF), so every beat works **forwards and backwards**: stepping back un-builds.
- Numbers count up (`CountUp`); lines draw; bars grow; words rise out of a mask (`Words`).
- **Morphs between slides** keep the scene mounted when slides share a `scene:` name: the revenue line (cuda → alexnet) flattens, then explodes to FY26; the $31 bar (bear-bars → bear-alone) returns large and alone.
- No jitter, reflow or flash: fonts preload, sizes are fixed, and the stage ignores `prefers-reduced-motion` (the operator view respects it).

## Rules the code enforces
1. **No typed numbers.** Scenes look figures up by dataset key (`get`, `fmt`); `checkSlide` rejects digits in slide text.
2. **Every figure shows a source** footnote (`Source`), with its date. A short hand-written `text` is allowed for long model sources.
3. **Missing data says so** (`Missing`): "Data missing", never a made-up bar.
4. A scene that throws shows its title plainly (`Safe`); the show goes on.

## Adding a scene
1. Write the component in `scenes/{rob,panshul,mikael}.tsx`: props `{slide, beat, datasets, calm}`; derive everything from `beat`.
2. Register it in `scenes/index.ts`; give the slide `scene: <name>` in `docs/script/spine.yaml`.
3. Add its figures through `app/scripts/*` with source and `asOf`.
4. `npm test` (checks every slide has a registered scene) and `npm run shoot`.
