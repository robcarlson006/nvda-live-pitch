#!/bin/bash
# Start the overnight loop in the background (survives closing the terminal; keeps the Mac awake while it runs).
# Keep the laptop plugged in with the lid open. Stop early: touch research-vault/state/STOP
cd "$(dirname "$0")" || exit 1
mkdir -p state/logs
nohup caffeinate -dims bash run.sh > state/logs/run.out 2>&1 &
echo "started (pid $!). Watch: tail -f research-vault/state/logs/loop.log"
