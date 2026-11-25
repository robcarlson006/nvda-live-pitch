# Research vault (overnight GPT loop)

A sourced database of everything we could find on NVIDIA, with a ready chart for as much of it as possible, so we can
answer any board question. Built overnight by GPT (Codex) in this folder only; nothing else in the project is touched.

**Morning:** open `gallery.html` (every chart, searchable) and `INDEX.md` (every fact, with its source). The loop's own
report is `state/MORNING_SUMMARY.md`.

## How it is organised
| File | What |
|---|---|
| `db/sources.jsonl` | every page read: URL, publisher, date, and a saved snapshot in `cache/pages/` |
| `db/facts.jsonl` | one fact per row: claim, value/unit/period, source id, **the exact sentence quoted from the saved page** |
| `db/qa.jsonl` | expected board questions with a 1–4 bullet spoken answer, linked to its facts and visuals |
| `db/visuals.jsonl` | every chart: spec (`visuals/specs/`), image (`visuals/svg/`), linked facts and Q&As |
| `vault.sqlite`, `catalog.json`, `INDEX.md`, `gallery.html` | rebuilt from db/ after every iteration |

Why trust it: rows only go in through `tools/add.py`, which refuses a quote that is not word for word on the saved page,
a value that is not in its quote, a Q&A number that is not in a linked fact, and a chart value that is not a fact (or our
own `data/clean` data). `tools/check.py` re-checks everything after each iteration; a red iteration is rolled back.

## The loop
- Phase 1, research (6 h): one topic from `TOPICS.md` per iteration (then the loop's own follow-ups). Quick sweeps on
  `gpt-6-luna`, careful research on `gpt-6.1-terra`; every 5th iteration is a consolidation pass (conflicting figures,
  questions we still can't answer). Web access is through Obscura only (`tools/search.py`, `tools/fetch.py`).
- Phase 2, visuals (2 h): `gpt-6.2-sol` works through `VISUALS.md` (DCF pack, three rates, reverse DCF, ESG, …).
- Before either phase, `tools/baseline.py` makes a themed chart for every dataset in `data/clean` (all DCF steps included).
- Usage limits: on a 5-hour limit it waits 20 min and retries; on a weekly limit it stops. Times are in `config.env`.

Start: `bash research-vault/start.sh` · Watch: `tail -f research-vault/state/logs/loop.log` ·
Stop: `touch research-vault/state/STOP` · Steer: write in `research-vault/state/FEEDBACK.md`.
Keep the laptop plugged in, lid open.
