import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBuyer, parseConcentration, parseGroup } from '../src/scenes/parse.ts';

// Scenes read their picture from the points as said, so they follow script edits. These are today's spine points.
test('open-ai: each "Label: names" point becomes a group of companies', () => {
  assert.deepEqual(parseGroup('Sharing open models: Hugging Face, which NVIDIA agreed to buy in September 2026, pending approval'), { label: 'Sharing open models', names: ['Hugging Face'] });
  assert.deepEqual(parseGroup('Building them: Mistral, Black Forest Labs and AI21 Labs'), { label: 'Building them', names: ['Mistral', 'Black Forest Labs', 'AI21 Labs'] });
  assert.deepEqual(parseGroup('Running them: Fireworks AI, Together AI and Replicate'), { label: 'Running them', names: ['Fireworks AI', 'Together AI', 'Replicate'] });
  assert.equal(parseGroup("More choice keeps the giants' prices and lock-in in check, and whichever model wins still needs chips"), null);
});

test('beyond-hyperscalers: buyer types and the concentration ring', () => {
  assert.deepEqual(parseBuyer('Public compute: Isambard-AI is operating in Bristol'), { label: 'Public compute', detail: 'Isambard-AI is operating in Bristol' });
  assert.equal(parseBuyer('Three direct customers still made up 44% of Q3 FY27 revenue'), null);
  assert.deepEqual(parseConcentration('Three direct customers still made up 44% of Q3 FY27 revenue'), { pct: 44, text: '44%', caption: 'Three direct customers: share of revenue' });
  assert.equal(parseConcentration('Specialist cloud: Nscale has announced NVIDIA-powered capacity'), null);
});
