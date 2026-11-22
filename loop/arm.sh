#!/usr/bin/env bash
# Arms the overnight loop. Run ONCE from the main pitch folder:
#     bash loop/arm.sh --checkpoint            # deadline 23:55 tonight
#     bash loop/arm.sh --checkpoint --until 23:30
#     bash loop/arm.sh --dry-run               # show what it would do, change nothing
# It: (1) commits your current work as a checkpoint (needs --checkpoint if the tree is dirty),
#     (2) makes a separate git worktree on a new branch OUTSIDE iCloud, so this folder stays untouched and demo-able,
#     (3) copies node_modules (APFS clone, no extra disk) and app/.env into it,
#     (4) installs the permissions + Stop hook there, and writes loop/ACTIVE with the deadline.
set -euo pipefail
CHECKPOINT=0; DRY=0; UNTIL="23:55"; WRAP_MIN=30
while [ $# -gt 0 ]; do case "$1" in
  --checkpoint) CHECKPOINT=1;; --dry-run) DRY=1;; --until) UNTIL="$2"; shift;;
  *) echo "unknown option $1"; exit 1;; esac; shift; done
MAIN="$(cd "$(dirname "$0")/.." && pwd)"; cd "$MAIN"
DAY="$(date +%Y-%m-%d)"; BRANCH="loop/$DAY"; WT="${LOOP_WORKTREE:-$HOME/Developer/nvidia-pitch-loop}"
say() { printf '%s\n' "$*"; }
run() { if [ $DRY -eq 1 ]; then say "  would run: $*"; else "$@"; fi; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { say "Not a git repo."; exit 1; }
[ -e "$WT" ] && { say "$WT already exists. Remove it (git worktree remove) or set LOOP_WORKTREE=<other path>."; exit 1; }
git show-ref --verify --quiet "refs/heads/$BRANCH" && { say "Branch $BRANCH already exists. Pick another day/branch or delete it."; exit 1; }

# deadline: today at $UNTIL (local time), wrap-up starts $WRAP_MIN minutes before
read -r DL WR < <(node -e '
  const [h,m]=process.argv[1].split(":").map(Number); const d=new Date(); d.setHours(h,m,0,0);
  const dl=Math.floor(d/1000); console.log(dl, dl-Number(process.argv[2])*60);' "$UNTIL" "$WRAP_MIN")
NOW=$(date +%s); [ "$DL" -gt "$NOW" ] || { say "Deadline $UNTIL is already past."; exit 1; }
say "Deadline $UNTIL local ($(( (DL-NOW)/60 )) min from now); wrap-up starts $WRAP_MIN min before."

if [ -n "$(git status --porcelain)" ]; then
  say "Uncommitted work in $MAIN:"; git status --short | sed 's/^/    /'
  [ $CHECKPOINT -eq 1 ] || { say "Re-run with --checkpoint to commit it as a checkpoint first (the loop branches from your latest commit)."; exit 1; }
  run git add -A
  if [ $DRY -eq 0 ] && git diff --cached --name-only | grep -Eq '(^|/)\.env$'; then say "A .env file is staged. Aborting."; git reset -q; exit 1; fi
  run git commit -q -m "Checkpoint before overnight loop ($DAY)"
fi
BASE="$(git rev-parse HEAD)"; [ $DRY -eq 1 ] && say "  (base would be the commit after the checkpoint)"
run git tag -f loop-base
run git worktree add -b "$BRANCH" "$WT" HEAD

if [ $DRY -eq 0 ]; then
  BASE="$(git -C "$WT" rev-parse HEAD)"
  cp -Rc "$MAIN/app/node_modules" "$WT/app/node_modules" 2>/dev/null || cp -R "$MAIN/app/node_modules" "$WT/app/node_modules" 2>/dev/null || (cd "$WT/app" && npm ci --no-audit --no-fund)
  [ -f "$MAIN/app/.env" ] && { cp "$MAIN/app/.env" "$WT/app/.env"; chmod 600 "$WT/app/.env"; }
  mkdir -p "$WT/.claude"; cp "$WT/loop/settings.template.json" "$WT/.claude/settings.local.json"
  EXC="$(git -C "$WT" rev-parse --git-path info/exclude)"; case "$EXC" in /*) ;; *) EXC="$WT/$EXC";; esac
  printf '%s\n' '.claude/settings.local.json' 'loop/ACTIVE' 'loop/STOP' 'loop/.blocks' 'loop/shots/' 'loop/eval-spend.json' >> "$EXC"
  cat > "$WT/loop/ACTIVE" <<ACT
BASE=$BASE
BRANCH=$BRANCH
START_EPOCH=$NOW
WRAPUP_EPOCH=$WR
DEADLINE_EPOCH=$DL
MAX_BLOCKS=300
ACT
else
  say "  would copy node_modules + app/.env, install settings + Stop hook, write loop/ACTIVE in $WT"
fi
cat <<DONE

Armed. Your main folder is untouched. The loop works in:
    $WT   (branch $BRANCH)

Now (plugged in, lid OPEN: a sleeping Mac stops the loop):
    cd "$WT" && caffeinate -dims claude
and paste the prompt from loop/KICKOFF.md (between the --- lines).

Check on it ~10 minutes in: make sure Claude Code isn't sitting on a permission prompt.
In the morning: read $WT/loop/MORNING.md. To keep the work:  cd "$MAIN" && git merge $BRANCH
To abandon it: do nothing (or: git worktree remove "$WT").
Stop it early any time: touch $WT/loop/STOP
Don't rehearse from the worktree's server while the loop runs; use this main folder.
DONE
