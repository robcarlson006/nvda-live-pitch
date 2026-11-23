import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { elementCount } from '../shared/schema.ts';
import { loadDatasets, loadSpine } from './state.ts';

const spine = loadSpine(loadDatasets()); // proves the live script v4 spine is valid against the real data
const registry = fs.readFileSync(new URL('../src/stage/scenes/index.ts', import.meta.url), 'utf8');
const registered = new Set([...registry.matchAll(/^\s*'?([\w-]+)'?: \{ Component/gm)].map((m) => m[1]));

test('script v4: 22 slides in order, three speakers, nothing optional', () => {
  assert.equal(spine.length, 22);
  assert.equal(spine[0].id, 'hook');
  assert.equal(spine[spine.length - 1].id, 'finale');
  assert.deepEqual([...new Set(spine.map((s) => s.speaker))], ['Rob', 'Panshul', "Mi'kael"]);
  assert.equal(spine.filter((s) => s.optional).length, 0);
});

test('script v4: every slide has a registered scene and at least one beat', () => {
  for (const s of spine) {
    assert.ok(s.scene && registered.has(s.scene), `slide "${s.id}" names scene "${s.scene}", which is not in scenes/index.ts`);
    assert.ok(elementCount(s) >= 1, `slide "${s.id}" has no beats`);
  }
});

test('script v4: every build step has a cue phrase, so the deck can follow speech', () => {
  for (const s of spine) assert.ok(s.cues.length > 0, `slide "${s.id}" has no cues`);
});
