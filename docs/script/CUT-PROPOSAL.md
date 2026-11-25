# Proposal: a shorter pitch (25 Nov 2026) — applied 25 Nov, with changes (see docs/PROGRESS.md and TIMING.md)

## Why
The current `spine.yaml` is **40 slides and about 2,360 spoken words** (each `{{figure}}` counted as five spoken words,
e.g. "three hundred and eighty-nine dollars"). At 150 words a minute that is **about 15½ minutes**, not the 8.9 in
`TIMING.md` (that count predates the design pass and the DCF slides). The cuts below bring it to **about 1,400 words /
28 slides ≈ 9½ minutes**, with the three speakers more even. Nothing is lost: every cut slide is already a prepared
Q&A answer, or a ready chart in `research-vault/gallery.html`, so we can pull it up if asked.

Order: **non-essential first, then our weakest points.** Words saved are approximate.

## Tier 1 — non-essential (cut first)
| # | Slide | Speaker | Action | Saves | Where it lives instead |
|---|---|---|---|---:|---|
| 6 | `revenue-long` | Rob | **Cut** (already optional) | 24 | chart `nvda_revenue_annual` in the vault |
| 31 | `space-race` | Mi'kael | **Cut** — an analogy, no evidence | 46 | — |
| 22 | `dcf-drivers` | Panshul | **Cut** — the same three numbers are on `dcf-summary` | 54 | vault chart |
| 23 | `fcf` | Panshul | **Cut** — `dcf-summary` says "then the cash flows" | 50 | vault chart `nvda_fcf_annual`, `model_fcf_forecast` |
| 24 | `dcf-worksheet` | Panshul | **Cut** — method detail; keep for Q&A | 50 | vault table `model_dcf_detail` |
| 25 | `dcf-bridge` | Panshul | **Cut** — `dcf-summary` covers EV → equity → per share. *Keep one line:* "about three quarters of the value is the terminal value" (move it into `dcf-summary`) | 113 | vault waterfall `model_dcf_bridge` |
| 19 | `returns` | Panshul | **Cut** | 57 | Q&A bank: *"Is NVIDIA just buying back shares…"* |
| 32 | `already-doing` | Mi'kael | **Cut** — nice, but not part of the investment case | 77 | — |
| 1–2 | `founding` + `first-gpu` | Rob | **Merge into one slide.** Keep: Denny's 1993, "nobody starts a serious company to play games", GeForce 256 in 1999. Cut: the Xbox advance and the Forbes 2007 sentence | ~50 | — |
| 4 | `wall-street` | Rob | **Trim** to: "Wall Street hated it. The stock more than halved in 2008. NVIDIA held on anyway." Cut: "CUDA made the chips bigger and pricier… Revenue stalled for years." | ~20 | — |
| 5 | `alexnet` | Rob | **Trim**: cut the Andrew Ng / Stanford sentence; keep AlexNet on two gaming cards and "AI had found CUDA" | ~29 | — |
| 21 | `dcf-inputs` | Panshul | **Trim** to one sentence: "Every input is Bloomberg, Google Finance or Damodaran at NYU; the only choice that is ours is [terminal growth] long-run growth." | ~48 | slide still shows every input |

## Tier 2 — our weakest points (cut next)
| # | Slide | Speaker | Why it is weak in front of *this* board | Action | Saves |
|---|---|---|---|---|---:|
| 13–14 | `bubble`, `if-it-pops` | Rob | Compares a *projected* AI build-out with *realised* past booms, and the punchline ("the biggest America has seen") argues **for** the bubble. Invites the fight we don't need. | **Cut both**; answer it in Q&A (*"Isn't this an AI bubble?"* is prepared) | 129 |
| 33 | `open-ai` | Mi'kael | Hugging Face is "pending approval", and funding customers invites the **circular-money** question. | **Cut**; Q&A *"Isn't this circular…"* is prepared | 63 |
| 10 | `connections` | Rob | "Networking made [figure] last year" is an **unverified** figure (amber on the operator panel). | **Cut that sentence** (keep NVLink + Mellanox) | ~12 |
| 12 | `catch-up` | Rob | "About [~80%] of AI chip spending" is **unverified**. | **Cut that sentence** | ~15 |
| 36 | `people` | Mi'kael | Turnover benchmark is a different year and sector; Bloomberg's Social score **fell 6.29 → 3.63** — rankings invite that comparison. | **Trim** to the turnover line only | ~66 |
| 15 | `handoff` | Rob | "The only way to stop NVIDIA is to stop innovation" is an overclaim a sceptic will pounce on. | **Cut that sentence** | ~10 |
| 20 | `peers` | Panshul | Two P/E numbers on one slide confuse (now explained on screen). | **Trim**: say only the forward P/E and "cheapest of the five"; trailing P/E stays on screen | ~23 |
| 38 | `emissions-peers` | Mi'kael | Per-$ emissions flatter a fabless company; we already say so, which is right. | **Keep**, trim the opening clause | ~15 |
| 39 | `recommendation` | Mi'kael | "Base case above today's price at all three rates" repeats `three-rates`. | **Trim** that sentence | ~12 |

## Result
| | Now | Proposed |
|---|---:|---:|
| Slides | 40 | 28 |
| Spoken words (figures ×5) | ~2,360 | ~1,400 |
| Time at 150 wpm | ~15½ min | ~9½ min |
| Rob / Panshul / Mi'kael | 842 / 953 / 567 words | ~550 / ~560 / ~290 words |

The running order after the cuts: founding (merged) → cuda → wall-street → alexnet → four-layers → chips → software →
connections → supply → catch-up → handoff · last-quarter → beats → guidance → peers → dcf-inputs → dcf-summary →
three-rates → reverse-dcf → bear-case → ai-ended · beyond-hyperscalers → governance → people → renewables →
emissions-peers → recommendation → close.

## If we still need more time
1. Merge `bear-case` and `ai-ended` into one "two downside cases" slide (~45 words saved).
2. Merge `last-quarter` into `beats` (~25 words).
3. Drop `four-layers` and let `chips` open with "NVIDIA leads in four layers" (~25 words).

## How to apply (once the team agrees)
Mark the cut slides `optional: true` first (they can be switched off live on the operator panel and switched back on),
rehearse once with the mic, then delete them from `spine.yaml` and rebuild the backup deck. Re-time with a real run.
