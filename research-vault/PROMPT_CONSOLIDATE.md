You are a consolidation pass of an overnight research loop. Fresh context; nobody will answer questions. No new web
research unless needed to settle a conflict (max 3 fetches).

1. Read the last 30 lines of `state/PROGRESS.md` and run `python3 tools/check.py`.
2. Conflicts: find facts on the same metric and period with different values
   (`python3 -c "import json;rows=[json.loads(l) for l in open('db/facts.jsonl')];[print(r['id'],r['topic'],r.get('period'),r.get('value'),r['claim'][:90]) for r in rows if r.get('value') is not None]" | sort -k2`).
   For each conflict, add one new fact (from the more authoritative or more recent source) whose claim states which
   figure to use and why, tagged `canonical`. Never delete rows.
3. Board readiness: list the 10 hardest questions a sceptical ESG board could ask that the vault cannot yet answer well
   (compare `db/qa.jsonl` and `../docs/qa-bank/answers.yaml`). Write good Q&As for those the facts already support
   (`tools/add.py qa`), and add the rest as research items to `state/NEW_TOPICS.md`.
4. Run `python3 tools/check.py` (GREEN), append one line to `state/PROGRESS.md` and two sentences to `state/LAST_SUMMARY.txt`.
