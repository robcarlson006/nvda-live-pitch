#!/usr/bin/env bash
# Claude Code Stop hook: keeps the overnight loop going until the deadline.
# Lets Claude stop when: loop not armed, loop/STOP exists, deadline passed, too many continuations,
# or the circuit breaker trips (5 continuations inside 150 s = the model is not doing real work).
# LOOP_NOW=<epoch> overrides the time (for testing).
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
cat >/dev/null 2>&1 || true
[ -f loop/ACTIVE ] || exit 0
[ -f loop/STOP ] && exit 0
get() { grep -E "^$1=" loop/ACTIVE | head -1 | cut -d= -f2-; }
now="${LOOP_NOW:-$(date +%s)}"; dl=$(get DEADLINE_EPOCH); wr=$(get WRAPUP_EPOCH); max=$(get MAX_BLOCKS)
[ -n "$dl" ] || exit 0
[ "$now" -ge "$dl" ] && { echo "loop: deadline passed, allowing stop" >&2; exit 0; }
n=$( (wc -l < loop/.blocks) 2>/dev/null || echo 0 ); n=$((n + 0))
[ "$n" -ge "${max:-300}" ] && { echo "loop: max continuations reached, allowing stop" >&2; exit 0; }
if [ "$n" -ge 5 ]; then
  fifth=$(tail -5 loop/.blocks | head -1)
  [ $((now - fifth)) -lt 150 ] && { echo "loop: circuit breaker (no real work between stops), allowing stop" >&2; exit 0; }
fi
echo "$now" >> loop/.blocks
left=$(( (dl - now) / 60 ))
if [ "$now" -ge "$wr" ]; then phase=WRAPUP; else phase=BUILD; fi
reason="LOOP ACTIVE: ${left} min to the deadline, phase ${phase}. Do not stop. Run 'bash loop/clock.sh', re-read loop/LOOP.md, then the end of loop/STATE.md and loop/BOARD.md, and do the next iteration. In WRAPUP, finish the wrap-up checklist in LOOP.md; when it is fully done run 'touch loop/STOP' and stop."
printf '{"decision":"block","reason":"%s"}\n' "$reason"
exit 0
