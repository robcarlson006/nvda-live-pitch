#!/bin/bash
# Starts the pitch app: checks keys, installs if needed, builds, stops an older copy, opens both screens in Chrome.
set -e
cd "$(dirname "$0")/app"
export PORT="${PORT:-5173}"

# Homebrew Node may be present but fail to launch (for example, a missing shared library).
# Prefer a working nvm installation before touching the presentation files or port.
if ! node --version >/dev/null 2>&1; then
  for node_bin in "$HOME"/.nvm/versions/node/*/bin/node; do
    if [ -x "$node_bin" ] && "$node_bin" --version >/dev/null 2>&1; then
      export PATH="$(dirname "$node_bin"):$PATH"
      break
    fi
  done
fi
if ! node --version >/dev/null 2>&1; then
  echo "No working Node installation found."
  exit 1
fi

if [ ! -f .env ]; then
  echo "! No app/.env: Deepgram and Anthropic are unavailable; manual slides and backup still work."
else
  for k in DEEPGRAM_API_KEY ANTHROPIC_API_KEY; do
    grep -qE "^$k=.+" .env && echo "✓ $k" || echo "! $k is empty (the app still runs, without that feature)"
  done
fi

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund
fi
npm run build >/dev/null
echo "✓ built"

# Stop an older copy of this app on the port; never anything else.
for pid in $(lsof -tnP -iTCP:$PORT -sTCP:LISTEN || true); do
  case "$(ps -o command= -p "$pid")" in
    *server/index.ts*) kill "$pid" && echo "✓ stopped the older copy" && sleep 1 ;;
    *) echo "Something else is using port $PORT: $(ps -o command= -p "$pid")"; exit 1 ;;
  esac
done

(
  until curl -so /dev/null "http://localhost:$PORT/api/datasets"; do sleep 0.3; done
  open -a "Google Chrome" "http://localhost:$PORT/stage" "http://localhost:$PORT/operator"
) &
NODE_ENV=production exec npx tsx server/index.ts
