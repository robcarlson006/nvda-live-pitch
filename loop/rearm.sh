#!/usr/bin/env bash
# Re-arms the loop for another overnight run, CONTINUING last night's worktree and branch (loop/2026-11-22).
#   bash "$HOME/Documents/Nvidia stock pitch/loop/rearm.sh"              # deadline 05:45, wrap-up from 05:20
#   bash ".../loop/rearm.sh" --until 05:30 --limit 90
# Set LOOP_WORKTREE if the worktree isn't ~/Developer/nvidia-pitch-loop. Only machinery files are copied in:
# last night's LOOP.md, BOARD.md, STATE.md, NEEDS_ROB.md, check.sh and all code are left exactly as they are.
set -euo pipefail
UNTIL="05:45"; WRAP_MIN=25; LIMIT_PCT=95
while [ $# -gt 0 ]; do case "$1" in
  --until) UNTIL="$2"; shift;; --limit) LIMIT_PCT="$2"; shift;; *) echo "unknown option $1"; exit 1;; esac; shift; done
SRC="$(cd "$(dirname "$0")" && pwd)"
WT="${LOOP_WORKTREE:-$HOME/Developer/nvidia-pitch-loop}"
say() { printf '%s\n' "$*"; }
[ -e "$WT/.git" ] || { say "No worktree at $WT. Set LOOP_WORKTREE=<path>."; exit 1; }
BRANCH="$(git -C "$WT" rev-parse --abbrev-ref HEAD)"
case "$BRANCH" in loop/*) ;; *) say "Worktree is on '$BRANCH', not a loop/* branch. Aborting."; exit 1;; esac

read -r DL WR < <(node -e '
  const [h,m]=process.argv[1].split(":").map(Number); const d=new Date(); d.setHours(h,m,0,0);
  let dl=Math.floor(d/1000); const now=Math.floor(Date.now()/1000); if (dl<=now+600) dl+=86400;
  console.log(dl, dl-Number(process.argv[2])*60);' "$UNTIL" "$WRAP_MIN")
NOW=$(date +%s)
say "Branch $BRANCH. Deadline $UNTIL ($(( (DL-NOW)/60 )) min from now); wrap-up from $WRAP_MIN min before. Pause at ${LIMIT_PCT}% usage."

EXC="$(git -C "$WT" rev-parse --git-path info/exclude)"; case "$EXC" in /*) ;; *) EXC="$WT/$EXC";; esac
for p in .claude/settings.local.json loop/ACTIVE loop/STOP loop/.blocks loop/shots/ loop/eval-spend.json loop/eval-spend-run1.json loop/usage.json loop/usage.json.tmp loop/PAUSED loop/FINAL_WRAP loop/ACTIVE.tmp; do
  grep -qxF "$p" "$EXC" 2>/dev/null || echo "$p" >> "$EXC"; done
if [ -n "$(git -C "$WT" status --porcelain)" ]; then
  say "Uncommitted work in the worktree; committing it as a checkpoint:"; git -C "$WT" status --short | sed 's/^/    /' | head -12
  git -C "$WT" add -A
  if git -C "$WT" diff --cached --name-only | grep -Eq '(^|/)\.env$'; then say "A .env file is staged. Aborting."; git -C "$WT" reset -q; exit 1; fi
  git -C "$WT" commit -q -m "Checkpoint before overnight run 2"
fi

mkdir -p "$WT/loop" "$WT/.claude"
for f in CARD.md NEXT.md KICKOFF_RUN2.md stop-hook.sh statusline.sh settings.template.json rearm.sh; do cp "$SRC/$f" "$WT/loop/$f"; done
chmod +x "$WT/loop/stop-hook.sh" "$WT/loop/statusline.sh" "$WT/loop/rearm.sh"

node - "$WT/loop/settings.template.json" "$WT/.claude/settings.local.json" <<'JS'
const fs = require('fs'); const [tpl, cur] = process.argv.slice(2);
const t = JSON.parse(fs.readFileSync(tpl, 'utf8')); let c = {};
try { c = JSON.parse(fs.readFileSync(cur, 'utf8')); } catch (e) {}
const u = (a, b) => [...new Set([...(a || []), ...(b || [])])];
const cp = c.permissions || {};
const out = { ...t, permissions: { allow: u(t.permissions.allow, cp.allow), deny: u(t.permissions.deny, cp.deny) } };
fs.writeFileSync(cur, JSON.stringify(out, null, 2) + '\n');
JS

BASE="$(grep -E '^BASE=' "$WT/loop/ACTIVE" 2>/dev/null | head -1 | cut -d= -f2- || true)"
[ -n "$BASE" ] || BASE="$(git -C "$WT" rev-parse -q --verify loop-base || git -C "$WT" rev-parse HEAD)"
cd "$WT/loop"
rm -f STOP .blocks PAUSED FINAL_WRAP usage.json usage.json.tmp ACTIVE.tmp
[ -f eval-spend.json ] && mv eval-spend.json eval-spend-run1.json
cat > ACTIVE <<ACT
BASE=$BASE
BRANCH=$BRANCH
START_EPOCH=$NOW
WRAPUP_EPOCH=$WR
DEADLINE_EPOCH=$DL
MAX_BLOCKS=300
RESUME_EPOCH=0
EXTEND_MIN=0
LIMIT_PCT=$LIMIT_PCT
ACT
cd "$WT"
git add loop/CARD.md loop/NEXT.md loop/KICKOFF_RUN2.md loop/stop-hook.sh loop/statusline.sh loop/settings.template.json loop/rearm.sh
git commit -q -m "Run 2 setup: lean card, queue, usage-pause hook, Sonnet" || true
printf '\n## run 2 · %s · armed\nDeadline %s, pause at %s%% usage. Queue: loop/NEXT.md. Rules: loop/CARD.md.\n' "$(date '+%a %H:%M')" "$UNTIL" "$LIMIT_PCT" >> loop/STATE.md

cat <<DONE

Armed for run 2 in $WT (branch $BRANCH, continuing from run 1).
Now, plugged in, lid open:
    cd "$WT" && caffeinate -dims claude --model sonnet
then paste the prompt from loop/KICKOFF_RUN2.md (between the --- lines).
Check the status bar says "loop | 5h NN%": if it says n/a the usage pause can't trigger.
Stop it early: touch $WT/loop/STOP
DONE
