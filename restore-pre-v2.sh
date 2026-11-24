#!/bin/bash
# Puts the deck back exactly as it was before the v2 rebuild (git tag pre-v2-backup) and rebuilds app/dist.
# Offline: no network, no npm install. Any unsaved work is stashed first (get it back with `git stash pop`).
# To return to the v2 deck afterwards:  git checkout v2-final-pitch && (cd app && npm run build)
set -e
cd "$(dirname "$0")"
git rev-parse -q --verify refs/tags/pre-v2-backup >/dev/null || { echo "Tag pre-v2-backup not found."; exit 1; }
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git stash push -m "before restore-pre-v2 $(date +%F_%T)" >/dev/null && echo "✓ stashed unsaved changes (git stash list)"
fi
git checkout -q -B restored-pre-v2 pre-v2-backup
echo "✓ deck files restored to pre-v2-backup ($(git rev-parse --short HEAD)) on branch restored-pre-v2"
[ -d app/node_modules ] || { echo "app/node_modules is missing; cannot rebuild offline."; exit 1; }
(cd app && npx vite build --logLevel error)
echo "✓ app/dist rebuilt. Start with ./start.sh"
