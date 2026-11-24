import assert from 'node:assert/strict';
import { test } from 'node:test';
import { splitFigures } from '../src/Figures.tsx';

// The stage counts figures up to their value. It must only pick up real quantities, and the pieces must rebuild the
// exact text the data lookup produced, so the slide always ends on the right number.
const figs = (t: string) => splitFigures(t).filter((p) => p.figure).map((p) => p.text);

test('counts up currencies, percentages and units, not years or labels', () => {
  assert.deepEqual(figs('Stock downside: -33.55%, to $101.56 per share'), ['-33.55%', '$101.56']);
  assert.deepEqual(figs('Portfolio loss: 1.01% at a 3% position'), ['1.01%', '3%']);
  assert.deepEqual(figs('In data centres, NVIDIA makes 3.4x what AMD makes'), ['3.4x']);
  assert.deepEqual(figs('$1,234.5bn of revenue'), ['$1,234.5bn']);
  assert.deepEqual(figs('2024 Nobel Prize in Chemistry'), []);
  assert.deepEqual(figs('Glassdoor 2026: #3 in the US, FY29 and Q3 FY27'), []);
});

test('the pieces always rebuild the original text', () => {
  for (const t of ['Base case above today’s price at all three rates: $391.38, $248.69 and $227.68', 'NVIDIA: 3.7% in FY26; benchmark: 12.9% in 2022', 'No figures here']) {
    assert.equal(splitFigures(t).map((p) => p.text).join(''), t);
  }
});

test('a figure knows its value and decimals, for the count-up', () => {
  const [f] = splitFigures('$1,234.5bn').filter((p) => p.figure);
  assert.equal(f.figure!.value, 1234.5);
  assert.equal(f.figure!.decimals, 1);
  assert.equal(f.figure!.sign, '$');
  assert.equal(f.figure!.suffix, 'bn');
});
