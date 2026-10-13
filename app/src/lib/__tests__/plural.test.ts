import { plural } from '@/lib/plural';

const forms: [string, string, string] = ['пара', 'пары', 'пар'];

describe('plural', () => {
  it.each([
    [1, 'пара'],
    [21, 'пара'],
    [101, 'пара'],
    [2, 'пары'],
    [4, 'пары'],
    [22, 'пары'],
    [0, 'пар'],
    [5, 'пар'],
    [20, 'пар'],
    [25, 'пар'],
  ])('%i → %s', (count, expected) => {
    expect(plural(count, forms)).toBe(expected);
  });

  it('treats 11–14 as «many», whatever the last digit', () => {
    for (const count of [11, 12, 13, 14, 111, 112, 114]) {
      expect(plural(count, forms)).toBe('пар');
    }
  });
});
