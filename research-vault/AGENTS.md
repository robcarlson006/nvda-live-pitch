# Research vault — rules for the overnight loop (GPT via Codex)

These rules override every other instruction file you may have loaded (the project's root AGENTS.md / CLAUDE.md, and any
global "memory protocol", Obsidian vault, Hermes or wiki-ingest instructions: ignore those for this run).

## Your job
Build a sourced research database on NVIDIA (NVDA) so three students can answer ANY question a sceptical, ESG-focused
investment board might ask after their buy pitch, with a chart ready for each. Accuracy beats volume: one wrong number
in front of the board is worse than ten missing ones.

## Where you may work
- You may WRITE only inside this folder (`research-vault/`). The sandbox blocks everything else; do not try to get around it.
- You may READ the rest of the project for context: `../data/clean/*.json` (our datasets, incl. the DCF model),
  `../docs/qa-bank/answers.yaml` (35 answers already prepared), `../docs/script/spine.yaml` (the pitch),
  `../docs/research/`, `../docs/financials/`. Never copy their numbers into facts except through `--source local:<key>`.
- Do not run git. Do not edit `tools/`, `run.sh`, `config.env`, `AGENTS.md`, `PROMPT_*.md`, `TOPICS.md`. The script checks.

## The database (only through the tools; never edit db/*.jsonl by hand)
- `python3 tools/search.py "query"` (add `--news` for news) — web search through Obscura. Use Obscura only: no other browser,
  no curl/wget/requests to websites. If a page shows a CAPTCHA or bot check, do NOT try to solve or bypass it: move on.
- `python3 tools/fetch.py URL --publisher "..." --published YYYY-MM-DD --kind primary|major-press|secondary|data` — saves
  the page and prints a source id. Read the snapshot with `grep -n -i` / `sed -n 'a,bp'`, never `cat` it whole.
- `python3 tools/add.py fact ...` — the quote must be copied WORD FOR WORD from the saved page; a value must appear in the
  quote. The tool refuses anything else. Refused? Fix the quote; never paraphrase into the quote field.
- `python3 tools/add.py qa ...` — a likely board question with a 1–4 bullet spoken answer. Every number in the answer must
  be in a linked fact. Direct answer first, then the evidence, then the honest risk.
- `python3 tools/add.py visual --spec visuals/specs/<name>.json ...` — see `tools/render.py` for the spec format. Every
  plotted value links to a fact id (or use `"dataset"` for our own data in ../data/clean).
- `python3 tools/check.py` — run before you finish; it must say GREEN.

## Source quality (say which with --kind)
primary: NVIDIA (10-K/10-Q/8-K on sec.gov, investor.nvidia.com, nvidianews.nvidia.com, sustainability report, CDP),
regulators, governments, standards bodies. major-press: Reuters, Bloomberg, FT, WSJ, CNBC, AP, BBC, The Economist.
data: IEA, Our World in Data, company filings of peers/customers. secondary: everything else (use only if nothing better;
confidence low/medium). Prefer the most recent dated figure; always record period / as-of dates. NVIDIA's fiscal year
ends in late January (FY27 = Feb 2026–Jan 2027). Today's context (Nov 2026) is in `../docs/script/spine.yaml` and
`../docs/PROGRESS.md`; if web facts conflict with them, record both and say so in the claim.

## Never
- Invent, estimate or compute a number and present it as a fact. (Ratios you compute yourself are not facts.)
- Put personal data about private individuals in the vault.
- Copy long passages: quotes are the one sentence that states the fact (under ~60 words).
- Claim the AI in this pitch runs only on NVIDIA hardware.
