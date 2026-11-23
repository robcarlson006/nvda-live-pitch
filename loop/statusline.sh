#!/usr/bin/env bash
# Claude Code statusLine command. Saves your plan-usage numbers to loop/usage.json so the Stop hook can
# pause the loop near the limit. Also prints a short status line. Never fails the UI.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" 2>/dev/null || true
LOOP_STATUS_INPUT="$(cat)" node - <<'JS' 2>/dev/null || echo "loop"
const fs = require('fs');
let j = {};
try { j = JSON.parse(process.env.LOOP_STATUS_INPUT || '{}'); } catch (e) {}
const rl = j.rate_limits || {};
const f = rl.five_hour || null, w = rl.seven_day || null;
if (f || w) {
  const out = { saved: Math.floor(Date.now() / 1000), five_hour: f, seven_day: w };
  try { fs.mkdirSync('loop', { recursive: true }); fs.writeFileSync('loop/usage.json.tmp', JSON.stringify(out)); fs.renameSync('loop/usage.json.tmp', 'loop/usage.json'); } catch (e) {}
}
const p = (x) => (x && typeof x.used_percentage === 'number') ? Math.round(x.used_percentage) + '%' : 'n/a';
console.log('loop | 5h ' + p(f) + ' | 7d ' + p(w));
JS
