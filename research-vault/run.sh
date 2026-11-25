#!/bin/bash
# NVDA overnight research loop (GPT via Codex). One FRESH `codex exec` per item; this script owns the clock, model choice,
# checks, rollback and the morning summary. GPT can only write inside research-vault/ (Codex sandbox, checked at start).
#   Start:      caffeinate -dims bash research-vault/run.sh        (or: bash research-vault/start.sh  → runs in background)
#   Stop early: touch research-vault/state/STOP
#   Steer:      write notes in research-vault/state/FEEDBACK.md (every iteration reads it first)
set -u
VAULT="$(cd "$(dirname "$0")" && pwd)"; cd "$VAULT" || exit 1
source config.env
STATE=state; LOGS=state/logs; SNAP=state/snapshots; mkdir -p "$LOGS" "$SNAP"
PROGRESS=$STATE/PROGRESS.md; touch "$PROGRESS" "$STATE/TRIED.txt" "$STATE/NEW_TOPICS.md"
PY=/usr/bin/python3
log() { echo "[$(date '+%a %H:%M:%S')] $*" | tee -a "$LOGS/loop.log"; }
run_with_timeout() { local mins=$1 out=$2; shift 2; "$@" > "$out" 2>&1 & local pid=$!
  ( exec >/dev/null 2>&1; sleep $((mins*60)); kill -TERM $pid; sleep 15; kill -KILL $pid ) & local wd=$!
  wait $pid; local rc=$?; kill $wd 2>/dev/null; wait $wd 2>/dev/null; return $rc; }
hit_limit() { tail -n 25 "$1" 2>/dev/null | grep -qiE "usage limit|hit your .*limit|try again (at|in)|limit (reached|will reset)|rate limit"; }
weekly_limit() { tail -n 25 "$1" 2>/dev/null | grep -qiE "weekly|this week"; }
codex_run() {  # codex_run <model> <effort> <prompt-file> <header> <outfile> <timeout-min>
  run_with_timeout "$6" "$5" codex exec -C "$VAULT" -m "$1" -c model_reasoning_effort="$2" "${CODEX_FLAGS[@]}" -o "$5.last" "$4

$(cat "$3")"; }
# Fingerprint of the project OUTSIDE the vault (git-tracked changes), to report if anything changed there during an iteration.
outside() { git -C "$VAULT/.." status --porcelain -- . ':(exclude)research-vault' 2>/dev/null | md5; }
snapshot() { rm -rf "$SNAP/db"; cp -R db "$SNAP/db"; }
restore() { rm -rf db; cp -R "$SNAP/db" db; }
check() { $PY tools/check.py > "$LOGS/check-$ITER.txt" 2>&1; }

# Next research item: first TOPICS.md line (then NEW_TOPICS.md) not yet tried. Prints "ID model topic-text".
next_topic() { $PY - <<'P'
import re, os
tried = set(open('state/TRIED.txt').read().split())
lines = [l for l in open('TOPICS.md') if l.startswith('- T')]
extra = [l for l in open('state/NEW_TOPICS.md') if l.startswith('- ')][:60]
for n, l in enumerate(extra, 1):
    lines.append(f'- N{n:03d} ' + l[2:])
for l in lines:
    m = re.match(r'- (\w+) \[(luna|terra)\] (.*)', l.strip())
    if m and m.group(1) not in tried:
        print(m.group(1), m.group(2), m.group(3)); break
P
}
next_visual() { $PY - <<'P'
import re
tried = set(open('state/TRIED.txt').read().split())
for l in open('VISUALS.md'):
    m = re.match(r'- (V\d+) (.*)', l.strip())
    if m and m.group(1) not in tried:
        print(m.group(1), m.group(2)); break
P
}

# ---------- preflight: models answer, sandbox holds ----------
for M in "$LUNA_MODEL" "$TERRA_MODEL" "$VISUAL_MODEL"; do
  run_with_timeout 4 "$LOGS/preflight-$M.log" codex exec -C "$VAULT" -m "$M" -c model_reasoning_effort=low "${CODEX_FLAGS[@]}" "Reply with exactly: PREFLIGHT_OK"
  grep -q PREFLIGHT_OK "$LOGS/preflight-$M.log" || { log "preflight FAILED for $M (see $LOGS/preflight-$M.log). Fix config.env and restart."; tail -5 "$LOGS/preflight-$M.log"; exit 1; }
done
$PY tools/check.py > "$LOGS/check-start.txt" 2>&1 || { log "vault is RED before starting; see $LOGS/check-start.txt"; exit 1; }
$PY tools/baseline.py >> "$LOGS/loop.log" 2>&1   # a themed chart for every dataset in data/clean, before any model runs

START=$(date +%s); RESEARCH_END=$((START + RESEARCH_HOURS*3600)); END=$((RESEARCH_END + VISUAL_HOURS*3600))
rm -f "$STATE/STOP"; ITER=0; FAILS=0; RIT=0
log "start · research until $(date -r $RESEARCH_END '+%H:%M') on $LUNA_MODEL/$TERRA_MODEL · visuals until $(date -r $END '+%H:%M') on $VISUAL_MODEL"
echo "- $(date '+%a %H:%M') · loop started · research until $(date -r $RESEARCH_END '+%H:%M'), visuals until $(date -r $END '+%H:%M')" >> "$PROGRESS"

while :; do
  NOW=$(date +%s); ITER=$((ITER+1))
  [ -f "$STATE/STOP" ] && { log "STOP file"; break; }
  [ "$NOW" -ge "$END" ] && { log "time is up"; break; }
  [ "$FAILS" -ge "$MAX_CONSECUTIVE_FAILS" ] && { log "$FAILS failures in a row: stopping to save usage"; break; }
  [ "$(df -Pk . | awk 'NR==2{print int($4/1048576)}')" -lt "$MIN_FREE_GB" ] && { log "low disk"; break; }

  if [ "$NOW" -lt "$RESEARCH_END" ]; then
    PHASE=research; LEFT=$((RESEARCH_END-NOW)); RIT=$((RIT+1))
    if [ $((RIT % CONSOLIDATE_EVERY)) -eq 0 ]; then
      ITEM="C$RIT"; MODEL=$TERRA_MODEL; EFFORT=$CONSOLIDATE_EFFORT; PROMPT=PROMPT_CONSOLIDATE.md; TEXT="Consolidation pass"
    else
      NT=$(next_topic); [ -z "$NT" ] && { log "research queue empty: moving to visuals"; RESEARCH_END=$NOW; ITER=$((ITER-1)); continue; }
      ITEM=${NT%% *}; REST=${NT#* }; TIER=${REST%% *}; TEXT=${REST#* }; PROMPT=PROMPT_RESEARCH.md
      if [ "$TIER" = luna ]; then MODEL=$LUNA_MODEL; EFFORT=$LUNA_EFFORT; else MODEL=$TERRA_MODEL; EFFORT=$TERRA_EFFORT; fi
    fi
  else
    PHASE=visuals; LEFT=$((END-NOW)); MODEL=$VISUAL_MODEL; EFFORT=$VISUAL_EFFORT; PROMPT=PROMPT_VISUAL.md
    NV=$(next_visual)
    if [ -n "$NV" ]; then ITEM=${NV%% *}; TEXT=${NV#* }
    else ITEM="VF$ITER"; TEXT="Free pass: find the topics in db/facts.jsonl with the most facts and no visual, and the Q&As with no visual; make the best charts for them."; fi
  fi
  TMO=$ITER_TIMEOUT_MIN; [ $((LEFT/60)) -lt "$TMO" ] && TMO=$((LEFT/60))
  if [ "$TMO" -lt 8 ]; then  # too little time for a useful iteration: end this phase
    if [ "$PHASE" = research ]; then RESEARCH_END=$NOW; ITER=$((ITER-1)); continue; else break; fi
  fi

  snapshot; BEFORE_OUT=$(outside); rm -f "$STATE/LAST_SUMMARY.txt"
  log "iteration $ITER · $PHASE · $ITEM · $MODEL/$EFFORT · timeout ${TMO}m"
  HDR="Time now $(date '+%a %d %b %H:%M'). Phase: $PHASE. Iteration $ITER. Timeout ${TMO} min.
YOUR ITEM: $ITEM — $TEXT"
  codex_run "$MODEL" "$EFFORT" "$PROMPT" "$HDR" "$LOGS/iter-$ITER.log" "$TMO"

  if hit_limit "$LOGS/iter-$ITER.log" && [ ! -s "$STATE/LAST_SUMMARY.txt" ]; then
    check || restore
    if weekly_limit "$LOGS/iter-$ITER.log"; then log "weekly usage limit: stopping"; echo "- $(date '+%H:%M') · stopped: weekly usage limit" >> "$PROGRESS"; break; fi
    log "usage limit; waiting ${LIMIT_WAIT_MIN}m"; echo "- $(date '+%H:%M') · usage limit, waiting ${LIMIT_WAIT_MIN} min" >> "$PROGRESS"
    sleep $((LIMIT_WAIT_MIN*60)); ITER=$((ITER-1)); [ "$PHASE" = research ] && [ "$ITEM" != "C$RIT" ] && RIT=$((RIT-1)); continue
  fi
  echo "$ITEM" >> "$STATE/TRIED.txt"
  [ "$BEFORE_OUT" != "$(outside)" ] && { log "NOTE: files outside research-vault changed during iteration $ITER (another session or person?). Logged, not touched."; echo "- $(date '+%H:%M') · note: project files outside the vault changed during $ITEM (not by the sandboxed loop, which cannot write there)" >> "$PROGRESS"; }

  if ! check; then  # rows are only added through tools/add.py, so red means a hand edit: roll the iteration back
    restore; log "check RED: rolled back $ITEM ($(grep -m1 ' - ' "$LOGS/check-$ITER.txt"))"
    echo "- $(date '+%H:%M') · $ITEM · ROLLED BACK (check red)" >> "$PROGRESS"; FAILS=$((FAILS+1)); continue
  fi
  ADDED=$($PY - <<'P'
import os
def n(p): return sum(1 for _ in open(p)) if os.path.exists(p) else 0
print(sum(n(f'db/{t}.jsonl') for t in ('facts','qa','visuals')) - sum(n(f'state/snapshots/db/{t}.jsonl') for t in ('facts','qa','visuals')))
P
)
  if [ "${ADDED:-0}" -le 0 ]; then log "no new rows"; FAILS=$((FAILS+1)); else FAILS=0; fi
  $PY tools/build.py >> "$LOGS/loop.log" 2>&1
  log "kept $ITEM · +$ADDED rows · $(head -1 "$LOGS/check-$ITER.txt") · $(head -c 160 "$STATE/LAST_SUMMARY.txt" 2>/dev/null | tr '\n' ' ')"
done

# ---------- morning summary (script-written, no tokens) ----------
$PY tools/build.py >> "$LOGS/loop.log" 2>&1; $PY tools/check.py > "$LOGS/check-final.txt" 2>&1; FINAL=$(tail -1 "$LOGS/check-final.txt")
{ echo "# Research vault — morning summary ($(date '+%a %d %b %H:%M'))"; echo
  echo "Final check: **$FINAL** · $(head -1 "$LOGS/check-final.txt")"; echo "$(sed -n 2p "$LOGS/check-final.txt")"; echo
  echo "Open \`research-vault/gallery.html\` (every chart, searchable) and \`research-vault/INDEX.md\` (every fact with its source)."; echo
  echo "## Progress"; cat "$PROGRESS"; echo
  echo "## Follow-ups the loop suggested"; tail -30 "$STATE/NEW_TOPICS.md"; } > "$STATE/MORNING_SUMMARY.md"
log "end · wrote $STATE/MORNING_SUMMARY.md"
osascript -e 'display notification "Research loop finished. Open research-vault/gallery.html" with title "NVDA research vault"' 2>/dev/null || true
