import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findSlide } from '../shared/router.ts';
import { loadDatasets, loadSpine } from './state.ts';

const spine = loadSpine(loadDatasets());
const id = (q: string) => { const h = findSlide(q, spine); return h ? spine[h.index].id : null; };
const jumps = (q: string) => findSlide(q, spine)?.explicit ?? false;

test('Q&A requests for our own slides find the slide, with no AI', () => {
  assert.equal(id('Can we see the DCF again?'), 'dcf-worksheet');
  assert.equal(jumps('Can we see the DCF again?'), true);
  assert.equal(id('show me the five year DCF'), 'dcf-worksheet');
  assert.equal(id('go back to the DCF summary'), 'dcf-summary');
  assert.equal(id('show the priced in slide'), 'reverse-dcf');
  assert.equal(id('pull up the three discount rates'), 'three-rates');
  assert.equal(id('go back to the bear case'), 'bear-case');
  assert.equal(id('show the space race'), 'space-race');
  assert.equal(id('can you show the emissions comparison'), 'emissions-peers');
  assert.equal(id('back to the governance slide'), 'governance');
});

test('slide numbers, in digits or words, jump straight there', () => {
  assert.deepEqual(findSlide('go back to slide 20', spine), { index: 19, score: 99, explicit: true, alternatives: [] });
  assert.equal(findSlide('slide twenty one please', spine)?.index, 20);
  assert.equal(findSlide('show slide number five', spine)?.index, 4);
});

test('a question that only touches a slide is offered, not jumped to; the rest of the DCF run comes as alternatives', () => {
  const h = findSlide("What's your price target?", spine)!;
  assert.equal(spine[h.index].id, 'dcf-summary');
  assert.equal(h.explicit, false);
  const alts = h.alternatives.map((i) => spine[i].id);
  for (const a of ['dcf-worksheet', 'three-rates', 'reverse-dcf']) assert.ok(alts.includes(a), `${a} offered`);
});

test('questions about things no slide covers find nothing', () => {
  assert.equal(id('what about water use in their data centres'), null);
  assert.equal(id('what do you think about inflation and interest rates'), null);
});

test('a question about a subject is not a request to jump ("Huang’s return", "back")', () => {
  assert.equal(jumps("Isn't Jensen Huang's return a governance risk?"), false);
  assert.equal(id("Isn't Jensen Huang's return a governance risk?"), 'governance', 'still offered as a card');
  assert.equal(jumps('can you pull up the bear case'), true);
  assert.equal(jumps('could we look at the dcf summary again'), true);
});

test('the teleprompter marks each trigger where it is said, preferring the first phrase listed', async () => {
  const { cueMarks } = await import('../shared/cueMarks.ts');
  const s = spine.find((x) => x.id === 'already-doing')!;
  const say = s.say!.replace(/\*/g, '');
  const marked = cueMarks(say, s.cues, s.elementCues).map((m) => [m.step, say.slice(m.start, m.end)]);
  assert.deepEqual(marked, [[-1, 'delivering results'], [0, 'science'], [1, 'healthcare'], [2, 'John Deere'], [3, 'Ecolab']]);
});
