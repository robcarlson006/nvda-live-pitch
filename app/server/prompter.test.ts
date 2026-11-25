import assert from 'node:assert/strict';
import test from 'node:test';
import { advance, norm, same, type Word } from '../src/prompterMatch.ts';

const script = (text: string): Word[] => text.split(/\s+/).map((t) => ({ text: t, norm: norm(t), slide: 0, style: '', eos: false, first: false }));
const follow = (words: Word[], heard: string, from = -1) => {
  let at = from;
  let prev: string | null = null;
  for (const h of heard.split(/\s+/)) {
    at = advance(words, at, h, prev);
    prev = h;
  }
  return at;
};

const S = script('Three: connections. NVLink joins seventy two chips in one rack, so they act as one giant chip. In 2019, NVIDIA agreed to buy Mellanox, which links whole racks together.');
const idx = (w: string) => S.findIndex((x) => x.norm === norm(w));

test('the prompter follows each word said', () => {
  assert.equal(follow(S, 'three connections nvlink joins'), idx('joins'));
});

test('a skipped word or two: it moves on to the next word said', () => {
  assert.equal(follow(S, 'three connections joins seventy'), idx('seventy'));
});

test('a skipped sentence: two words in a row find the place further down', () => {
  const at = follow(S, 'three connections');
  assert.equal(follow(S, 'nvidia agreed', at), idx('agreed'));
});

test('a lone common word never jumps far, and it never goes backwards', () => {
  const at = follow(S, 'three connections nvlink joins');
  assert.equal(follow(S, 'the', at), at, '"the" is not near: stay put');
  assert.equal(follow(S, 'three', at), at, 'an earlier word does not move it back');
});

test('speech-to-text spellings still match', () => {
  assert.ok(same('hyperscalers', 'hyperscaler'));
  assert.ok(same('mellanox', 'melanox'));
  assert.ok(same('nvidias', norm("NVIDIA's")));
  assert.ok(!same('chips', 'ships'), 'short words must match exactly');
});
