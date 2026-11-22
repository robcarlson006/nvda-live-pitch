#!/usr/bin/env bash
# Prints the loop clock. Exit: 0 = BUILD, 3 = WRAPUP, 4 = OVER, 2 = loop not armed.
# LOOP_NOW=<epoch> overrides the time (for testing).
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 1
[ -f loop/ACTIVE ] || { echo "PHASE=INACTIVE (no loop/ACTIVE: run loop/arm.sh)"; exit 2; }
get() { grep -E "^$1=" loop/ACTIVE | head -1 | cut -d= -f2-; }
now="${LOOP_NOW:-$(date +%s)}"; dl=$(get DEADLINE_EPOCH); wr=$(get WRAPUP_EPOCH)
left=$(( (dl - now) / 60 )); wleft=$(( (wr - now) / 60 ))
if [ "$now" -ge "$dl" ]; then phase=OVER; code=4
elif [ "$now" -ge "$wr" ]; then phase=WRAPUP; code=3
else phase=BUILD; code=0; fi
clock="$(date -r "$now" '+%a %H:%M' 2>/dev/null || date -d "@$now" '+%a %H:%M')"
echo "NOW=$clock LEFT=${left}min WRAPUP_IN=${wleft}min PHASE=$phase"
exit $code
