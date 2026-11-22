import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findAnswer, loadBank } from './bank.ts';
import { loadDatasets, loadSpine } from './state.ts';

const bank = loadBank(loadDatasets());

test('the bank covers the questions an ESG board asks', () => {
  assert.ok(bank.length >= 20);
  for (const id of ['wasteful', 'water', 'scope3', 'jevons', 'certificates', 'esg-mandate', 'governance', 'taiwan', 'average', 'pause']) assert.ok(bank.some((b) => b.id === id), id);
});

test('paraphrased board questions find their prepared answer', () => {
  const asked: [string, string][] = [
    ['you have just used ai for a slideshow isnt that an environmental disaster', 'wasteful'],
    ['could you tell us how much water does nvidia get through', 'water'],
    ['isnt this just the jevons paradox all over again', 'jevons'],
    ['are those renewable energy certificates or actual clean power', 'certificates'],
    ['why on earth should an esg fund own this company', 'esg-mandate'],
    ['if i take the average of your three scenarios i get less than the price', 'average'],
    ['what happens if ai spending pauses next year', 'pause'],
    ['how sensitive is this to your terminal growth assumption', 'terminal'],
    ['is all of that growth already priced in', 'priced-in'],
    ['wont google tpu chips eat their lunch', 'custom-chips'],
    ['how are you treating export controls', 'export'],
    ['how do we know the ai didnt make these numbers up', 'hallucinate'],
    ['what would change your mind about this stock', 'wrong'],
    ['what if china invades taiwan', 'taiwan'],
  ];
  for (const [q, id] of asked) assert.equal(findAnswer(bank, q)?.id, id, q);
});

test('off-topic questions never match a prepared answer', () => {
  for (const q of ['what degree are you all doing', 'how long did this take you to build', 'can you go back two slides', 'which microphone are you using', 'what did you have for lunch', 'are you nervous', 'what is the dividend yield', 'who else is in your society', 'how many employees work there', 'what is the weather like in stirling', 'how do interest rates affect the pound', 'what would you buy instead', 'tell me about tesla', 'is the stock listed in london', 'have you met the company'])
    assert.equal(findAnswer(bank, q), null, q);
});

test('every chart in a prepared answer or script slide has data to draw', () => {
  const data = loadDatasets();
  for (const s of [...bank.map((b) => b.slide), ...loadSpine(data)])
    if (s.chart) for (const n of s.chart.series) assert.ok(data.get(s.chart.datasetKey)!.series[n].some((v) => v != null), `${s.id}: ${n}`);
});
