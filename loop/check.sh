#!/usr/bin/env bash
# The gate. Exit 0 only if everything that must stay true is true.
#   bash loop/check.sh            full gate (typecheck, tests, build, guards, spreadsheet reconcile)
#   bash loop/check.sh --quick    typecheck + tests + guards
#   bash loop/check.sh --baseline record today's test count as the floor (run once, in PV-0)
set -u
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 1
ROOT="$PWD"; MODE="${1:-full}"; fail=0
ok()  { printf '✓ %s\n' "$*"; }
bad() { printf '✗ %s\n' "$*"; fail=1; }
warn(){ printf '! %s\n' "$*"; }
BASE="$(grep -E '^BASE=' loop/ACTIVE 2>/dev/null | head -1 | cut -d= -f2-)"
[ -n "$BASE" ] || BASE="$(git rev-parse -q --verify loop-base 2>/dev/null || true)"
LOG="$(mktemp -d)"

cd app || exit 1
if npm run -s typecheck >"$LOG/tc" 2>&1; then ok typecheck; else bad typecheck; tail -25 "$LOG/tc"; fi
npm test >"$LOG/test" 2>&1; tcode=$?
N="$(grep -E '^(# |ℹ )tests [0-9]+' "$LOG/test" | grep -oE '[0-9]+$' | tail -1)"
if [ $tcode -eq 0 ]; then ok "tests pass (${N:-?} run)"; else bad "tests failing"; grep -E '(not ok|✖|fail)' "$LOG/test" | head -20; fi
cd "$ROOT"
if [ "$MODE" = "--baseline" ]; then echo "${N:-0}" > loop/baseline-tests.txt; ok "baseline test count recorded: ${N:-0}"; exit $fail; fi
if [ -f loop/baseline-tests.txt ] && [ -n "${N:-}" ]; then
  B="$(cat loop/baseline-tests.txt)"
  [ "$N" -ge "$B" ] && ok "test count ${N} ≥ baseline ${B}" || bad "test count fell: ${N} < baseline ${B} (tests must not be removed)"
else warn "no test-count baseline yet (run: bash loop/check.sh --baseline)"; fi

if [ -n "$BASE" ]; then
  git diff --quiet "$BASE" -- data/bloomberg-raw && ok "bloomberg-raw untouched" || bad "data/bloomberg-raw was modified"
  git diff --quiet "$BASE" -- app/.env 2>/dev/null; git ls-files --error-unmatch app/.env >/dev/null 2>&1 && bad "app/.env is tracked by git"
  removed="$(git diff "$BASE" -U0 -- docs/script/spine.yaml | grep -E '^-[[:space:]]+(say|speaker):' || true)"
  [ -z "$removed" ] && ok "no say:/speaker: line removed or changed in spine.yaml" || { bad "say:/speaker: lines changed in spine.yaml (the presenters' words are off limits)"; echo "$removed" | head -5; }
  skips="$(git diff "$BASE" -U0 -- 'app/**/*.test.ts' | grep -E '^\+.*(\.skip\(|\.only\(|[^a-z]todo\()' || true)"
  [ -z "$skips" ] && ok "no .skip/.only added to tests" || { bad "test skip/only added"; echo "$skips" | head -5; }
  keys="$(git diff "$BASE" -U0 | grep -E '^\+' | grep -E 'sk-ant-[A-Za-z0-9_-]{10,}|(ANTHROPIC|DEEPGRAM|FINNHUB)_API_KEY=[^[:space:]]+' || true)"
  [ -z "$keys" ] && ok "no keys in the diff" || bad "possible API key in the diff (do not commit it)"
else warn "no BASE commit known: skipped diff guards"; fi

if [ -f app/scripts/xlsx-check.ts ]; then
  (cd app && npx tsx scripts/xlsx-check.ts >"$LOG/xlsx" 2>&1) && ok "spreadsheet reconciles to the model" || { bad "spreadsheet does not reconcile"; tail -20 "$LOG/xlsx"; }
else warn "spreadsheet reconcile not built yet (PV-M3)"; fi

if [ "$MODE" != "--quick" ]; then
  (cd app && npm run -s build >"$LOG/build" 2>&1) && ok "production build" || { bad "build failed"; tail -25 "$LOG/build"; }
fi
[ $fail -eq 0 ] && echo "GATE: PASS" || echo "GATE: FAIL"
exit $fail
