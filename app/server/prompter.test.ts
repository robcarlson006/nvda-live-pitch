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

// ---- The whole current script, as the operator's teleprompter shows it ----
import { resolveText } from '../shared/schema.ts';
import { loadDatasets, loadSpine } from './state.ts';

const datasets = loadDatasets();
const spine = loadSpine(datasets);
const full: Word[] = spine.flatMap((s, si) =>
  resolveText(s.say ?? '', datasets).replace(/\*/g, '').split(/\s+/).filter(Boolean)
    .map((t, i) => ({ text: t, norm: norm(t), slide: si, style: '' as const, eos: /[.?!]["”’)]?$/.test(t), first: i === 0 })),
);
// Speech-to-text with number formatting off writes figures as words ("one hundred and fifteen point eight billion").
const spoken = (t: string) => (/\d/.test(t) ? 'one hundred and fifteen point eight billion' : t);

for (const [how, say] of [['as written', (t: string) => t], ['figures as words', spoken]] as const)
  test(`the teleprompter follows the whole current script to its last word (${how})`, () => {
    let at = -1, prev: string | null = null, lastSlide = 0;
    for (const w of full) {
      for (const h of say(w.text).split(/\s+/)) {
        const next = advance(full, at, h, prev);
        assert.ok(next >= at, 'never moves backwards');
        at = next;
        prev = h;
      }
      if (at >= 0) lastSlide = Math.max(lastSlide, full[at].slide);
    }
    assert.equal(at, full.length - 1, `ends on the last word, "${full.at(-1)!.text}"`);
    assert.equal(lastSlide, spine.length - 1);
  });

test('a common two-word pair never flings the teleprompter more than one slide ahead', () => {
  const cuda = spine.findIndex((s) => s.id === 'cuda');
  const start = full.findIndex((w) => w.slide === cuda);
  const chips = spine.findIndex((s) => s.id === 'chips');
  assert.ok(full.some((w, i) => w.slide === chips && /^data$/i.test(w.text) && /^centres/i.test(full[i + 1]?.text ?? '')), 'the chips slide says "data centres"');
  let at = start, prev: string | null = null;
  for (const h of ['in', 'data', 'centres']) { at = advance(full, at, h, prev); prev = h; }
  assert.ok(full[at].slide <= cuda + 1, `stayed within the next slide (at ${spine[full[at].slide].id})`);
});
