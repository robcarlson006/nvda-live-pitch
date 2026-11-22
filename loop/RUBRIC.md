# RUBRIC: scoring the stage

Score each slide (and the finale, and each transition) **from screenshots you have actually opened** (and `perf.json`).
Six criteria, 0–2 each, total /10. Be harsh: a 10 is rare, a typical decent web slide is a 4. Write the one-line reason.

| # | Criterion | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | **Legible at 10 m, one idea** | cluttered / small text / two ideas | readable but busy | one clear idea; key text huge; instant to read |
| 2 | **Motion with purpose** | decorative, or none | some motion explains | every movement guides the eye or marks a point; build order = speaking order |
| 3 | **Wow / not templated** | looks like an AI/PowerPoint template | polished but generic | a memorable beat specific to *this* pitch (compute, loop pedal, cores) |
| 4 | **Restraint and consistency** | clashing styles, > 3 things moving | mostly consistent | one palette (black, silicon grey, NVIDIA green as signal), one type family, consistent easing, ≤ 3 things moving at once |
| 5 | **Data integrity visible** | clipped label / wrong unit / no source / truncated axis | correct but sloppy | right figure and unit, source line, honest axes (bars from zero), labels never collide |
| 6 | **Safe on the day** | janky, flashing, or fails under throttle | OK under budget | meets perf budget, no flashing > 3 Hz, effect failure degrades quietly, readable on a washed-out projector |

**Audience adjustments.** The board is sceptical and ESG-focused. ESG and Q&A slides: calm confidence, no triumphal motion, bad
news shown plainly. The opening and the close may be theatrical; the middle must be credible.

**Rules for scoring.** A score may only rise if you can point at the specific visible change. Re-shoot after every change and compare
before/after side by side. The independent reviewer re-scores blind; take the lower number. A slide that regresses on perf
is not an improvement, however nice it looks. Keep a per-slide table in `loop/shots/<run>/scores.md` and summarise in STATE.md.
