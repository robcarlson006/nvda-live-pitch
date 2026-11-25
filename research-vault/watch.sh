#!/bin/bash
# Live view of the overnight loop (read-only). Run: bash research-vault/watch.sh   · Ctrl-C to quit.
V="$(cd "$(dirname "$0")" && pwd)"; L="$V/state/logs"
G=$'\e[38;5;112m'; D=$'\e[2m'; B=$'\e[1m'; R=$'\e[0m'
bar() { local p=$1 w=46 f; f=$((p*w/100)); printf '%s' "$G"; [ $f -gt 0 ] && printf '█%.0s' $(seq 1 $f); printf '%s' "$D"; [ $f -lt $w ] && printf '░%.0s' $(seq 1 $((w-f))); printf '%s %3d%%' "$R" "$p"; }
while :; do
  clear
  START=$(grep -m1 ' start · ' "$L/loop.log" 2>/dev/null)
  S=$(stat -f %m "$L/preflight-gpt-6.2-sol.log" 2>/dev/null || date +%s)
  RE=$(echo "$START" | sed -n 's/.*research until \([0-9:]*\).*/\1/p'); VE=$(echo "$START" | sed -n 's/.*visuals until \([0-9:]*\).*/\1/p')
  NOW=$(date +%s); RES=$(date -j -f %H:%M "$RE" +%s 2>/dev/null); VIS=$(date -j -f %H:%M "$VE" +%s 2>/dev/null)
  [ -n "$RES" ] && [ "$RES" -lt "$S" ] && RES=$((RES+86400)); [ -n "$VIS" ] && [ "$VIS" -lt "$S" ] && VIS=$((VIS+86400))
  echo "${B}${G}NVDA research vault${R} · $(date '+%H:%M:%S') · $(pgrep -f 'research-vault/run.sh|bash run.sh' >/dev/null && echo "${G}running${R}" || echo "stopped")"
  echo
  if [ -n "$RES" ]; then
    pr=$(( (NOW-S)*100/(RES-S) )); [ $pr -gt 100 ] && pr=100; [ $pr -lt 0 ] && pr=0
    pv=0; [ "$NOW" -gt "$RES" ] && pv=$(( (NOW-RES)*100/(VIS-RES) )); [ $pv -gt 100 ] && pv=100
    printf 'Research (until %s)  ' "$RE"; bar $pr; echo
    printf 'Visuals  (until %s)  ' "$VE"; bar $pv; echo
  fi
  echo
  for t in sources facts qa visuals; do printf '%s%-8s%s %s\n' "$B" "$t" "$R" "$(wc -l < "$V/db/$t.jsonl" | tr -d ' ')"; done
  echo; echo "${B}Loop${R}"; tail -n 6 "$L/loop.log" 2>/dev/null | cut -c1-170
  CUR=$(ls -t "$L"/iter-*.log 2>/dev/null | grep -v '\.last' | head -1)
  if [ -n "$CUR" ]; then
    echo; echo "${B}GPT right now${R} ${D}($(basename "$CUR"))${R}"
    grep -E 'tools/(search|fetch|add)\.py|^(F|Q|V|S)[0-9]{4}|REFUSED|GREEN|RED' "$CUR" | tail -n 12 | cut -c1-170
  fi
  echo; echo "${D}Latest facts${R}"; tail -n 4 "$V/db/facts.jsonl" 2>/dev/null | /usr/bin/python3 -c "import sys,json;[print(' ',r['id'],r['claim'][:140]) for r in map(json.loads,sys.stdin)]"
  sleep 5
done
