import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SpineSlide } from './schema.ts';
import { pace, panicMessages, slideSeconds } from './pace.ts';

const sl = (id: string, words: number, optional = false) => ({ id, title: id, bullets: [], say: Array(words).fill('w').join(' '), optional, sources: [] }) as unknown as SpineSlide;
const spine = [sl('a', 25), sl('b', 250, true), sl('c', 50, true), sl('d', 100)]; // 10 s, 100 s, 20 s, 40 s

test('slide length is words at 150 a minute', () => assert.equal(slideSeconds(sl('x', 150)), 60));

test('on time: nothing is suggested', () => {
  const p = pace(spine, { index: 0, skipped: [] }, 0, 300);
  assert.equal(p.plannedLeft, 170);
  assert.equal(p.over, -130);
  assert.deepEqual(p.suggest, []);
});

test('behind: suggests the fewest optional slides ahead, longest first, never the current one or skipped ones', () => {
  const p = pace(spine, { index: 1, skipped: [] }, 100, 200); // 100 s left, 160 s of script: 60 over
  assert.equal(p.over, 60);
  assert.deepEqual(p.suggest, [{ id: 'c', seconds: 20 }], 'only c is optional and ahead; it is not enough, and we say so by suggesting all there is');
  assert.ok(!p.suggest.some((s) => s.id === 'b'), 'not the slide on now');
  const q = pace(spine, { index: 0, skipped: ['b'] }, 100, 150); // 50 s left, 70 s of script: 20 over
  assert.deepEqual(q.suggest, [{ id: 'c', seconds: 20 }]);
});

test('panic key stops following speech and goes to standby, as plain local messages', () => {
  assert.deepEqual(panicMessages(), [{ type: 'autoCue', on: false }, { type: 'clear' }]);
});
