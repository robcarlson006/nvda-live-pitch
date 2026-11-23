#!/usr/bin/env bash
# Claude Code Stop hook: keeps the overnight loop going until the deadline.
# Lets Claude stop when: loop not armed, loop/STOP exists, deadline passed, too many continuations,
# the circuit breaker trips (5 continuations inside 150 s), or weekly usage is at the limit.
# NEW: at LIMIT_PCT (default 95%) of the 5-hour session limit it PAUSES (sleeps inside this hook) until the
# window resets and RESUME_EPOCH (default 23:00) has passed, extends the deadline, then carries on.
# LOOP_NOW=<epoch> overrides the time; LOOP_SLEEP_STEP=<s> shortens the pause polling (for testing).
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
cat >/dev/null 2>&1 || true
[ -f loop/ACTIVE ] || exit 0
[ -f loop/STOP ] && exit 0
get() { grep -E "^$1=" loop/ACTIVE | head -1 | cut -d= -f2-; }
set_kv() { awk -v k="$1" -v v="$2" 'BEGIN{FS=OFS="="} $1==k{$2=v; f=1} {print} END{if(!f) print k"="v}' loop/ACTIVE > loop/ACTIVE.tmp && mv loop/ACTIVE.tmp loop/ACTIVE; }
fmt() { date -r "$1" '+%a %H:%M' 2>/dev/null || date -d "@$1" '+%a %H:%M'; }
now="${LOOP_NOW:-$(date +%s)}"; dl=$(get DEADLINE_EPOCH); wr=$(get WRAPUP_EPOCH); max=$(get MAX_BLOCKS)
[ -n "$dl" ] || exit 0
[ "$now" -ge "$dl" ] && { echo "loop: deadline passed, allowing stop" >&2; exit 0; }
n=$( (wc -l < loop/.blocks) 2>/dev/null || echo 0 ); n=$((n + 0))
[ "$n" -ge "${max:-300}" ] && { echo "loop: max continuations reached, allowing stop" >&2; exit 0; }
if [ "$n" -ge 5 ]; then
  fifth=$(tail -5 loop/.blocks | head -1)
  [ $((now - fifth)) -lt 150 ] && { echo "loop: circuit breaker (no real work between stops), allowing stop" >&2; exit 0; }
fi

# ---------- usage-limit pause ----------
limit=$(get LIMIT_PCT); limit=${limit:-95}
usage="$(node - <<'JS' 2>/dev/null
const fs = require('fs');
try {
  const s = fs.statSync('loop/usage.json');
  if (Date.now() - s.mtimeMs > 20 * 60 * 1000) { console.log('none'); process.exit(0); }
  const u = JSON.parse(fs.readFileSync('loop/usage.json', 'utf8'));
  const f = u.five_hour || {}, w = u.seven_day || {};
  const v = (x) => (x === undefined || x === null) ? '-' : x;
  console.log([v(f.used_percentage), v(f.resets_at), v(w.used_percentage)].join(' '));
} catch (e) { console.log('none'); }
JS
)"
[ -n "$usage" ] || usage=none
five=-; fresets=-; seven=-
[ "$usage" = none ] || read -r five fresets seven <<<"$usage"
pct_ge() { awk -v a="$1" -v b="$2" 'BEGIN{exit !(a!="-" && a+0>=b+0)}'; }
if pct_ge "$seven" "$limit"; then
  echo "loop: weekly usage ${seven}% >= ${limit}%, allowing stop (a weekly limit can't be waited out tonight)" >&2
  printf -- '- [ ] Weekly usage reached %s%%, so the loop stopped itself at %s. Resume manually when your week resets. (hook)\n' "$seven" "$(fmt "$now")" >> loop/NEEDS_ROB.md
  exit 0
fi
if pct_ge "$five" "$limit"; then
  resume=$(get RESUME_EPOCH); resume=${resume:-0}
  case "$fresets" in ''|*[!0-9]*) fresets=0;; esac
  target=$resume; [ $((fresets + 60)) -gt "$target" ] && target=$((fresets + 60))
  real=$(date +%s); [ "$target" -le "$real" ] && target=$((real + 300))
  if [ "$target" -gt $((dl - 20 * 60)) ]; then
    if [ -f loop/FINAL_WRAP ]; then echo "loop: final wrap-up already requested, allowing stop" >&2; exit 0; fi
    : > loop/FINAL_WRAP
    printf '\n## (hook) · %s · usage limit before the deadline\nUsage %s%%; it will not reset before the deadline (%s). Asked for the wrap-up now.\n' "$(fmt "$now")" "$five" "$(fmt "$dl")" >> loop/STATE.md
    echo "loop: usage ${five}%, no reset before the deadline: asking for the wrap-up now" >&2
    printf '{"decision":"block","reason":"%s"}\n' "USAGE LIMIT: you are at ${five}% of the session limit and it will not reset before the deadline. Do the wrap-up NOW with as few tokens as possible: no new features, no subagents, no screenshots. Run bash loop/check.sh --quick, commit anything green, write loop/DEMO.md and then loop/MORNING-2.md as loop/CARD.md says, git tag loop-final-2, then touch loop/STOP and stop."
    exit 0
  fi
  printf 'PAUSED at %s: usage %s%%, resuming %s\n' "$(fmt "$real")" "$five" "$(fmt "$target")" > loop/PAUSED
  printf '\n## (hook) · %s · usage pause\nSession usage reached %s%% (limit %s%%). Loop paused; resumes %s. Deadline will be extended.\n' "$(fmt "$real")" "$five" "$limit" "$(fmt "$target")" >> loop/STATE.md
  echo "loop: usage ${five}%, pausing until $(fmt "$target")" >&2
  while [ "$(date +%s)" -lt "$target" ]; do
    [ -f loop/STOP ] && { echo "loop: STOP file during pause, allowing stop" >&2; exit 0; }
    sleep "${LOOP_SLEEP_STEP:-30}"
  done
  rm -f loop/PAUSED loop/usage.json
  [ "$(date +%s)" -ge "$dl" ] && { echo "loop: deadline passed during the pause, allowing stop" >&2; exit 0; }
  ext=$(get EXTEND_MIN); ext=${ext:-120}
  newdl=$((target + ext * 60))
  if [ "$newdl" -gt "$dl" ]; then dl=$newdl; wr=$((newdl - 1800)); set_kv DEADLINE_EPOCH "$dl"; set_kv WRAPUP_EPOCH "$wr"; fi
  now=$(date +%s)
  printf '\n## (hook) · %s · usage pause over\nResumed. Deadline is now %s (wrap-up from %s).\n' "$(fmt "$now")" "$(fmt "$dl")" "$(fmt "$wr")" >> loop/STATE.md
  resumed=" Your usage window just reset after a pause; the deadline is now $(fmt "$dl"). Re-read loop/CARD.md first."
else
  resumed=""
fi
# ---------------------------------------

echo "$now" >> loop/.blocks
left=$(( (dl - now) / 60 ))
if [ "$now" -ge "$wr" ]; then phase=WRAPUP; else phase=BUILD; fi
reason="LOOP ACTIVE (run 2): ${left} min to the deadline, phase ${phase}. Do not stop.${resumed} Run 'bash loop/clock.sh', then read loop/CARD.md, the top open item of loop/NEXT.md and the last 15 lines of loop/STATE.md (not LOOP.md or BOARD.md), and do the next round: exactly one slice. In WRAPUP, do the wrap-up in CARD.md; when it is fully done run 'touch loop/STOP' and stop."
printf '{"decision":"block","reason":"%s"}\n' "$reason"
exit 0
