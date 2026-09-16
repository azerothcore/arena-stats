import { ArenaRatingModifiers } from 'config';
import { getRatingChange } from './get-rating-change';

const { winRatingModifier1: win1, winRatingModifier2: win2, loseRatingModifier: lose } = ArenaRatingModifiers;

describe('getRatingChange function', () => {
  it('should use the full win modifier below 1000 rating', () => {
    const result = getRatingChange(97, 14, true, 0);
    expect(result.winChance).toBeCloseTo(0.573, 3);
    expect(result.kFactor).toBe(win1);
    expect(result.rawChange).toBeCloseTo(win1 * (1 - result.winChance), 6);
    expect(result.expectedChange).toBe(Math.ceil(result.rawChange));
  });

  it('should round the loss towards zero', () => {
    const result = getRatingChange(14, 97, false, 0);
    expect(result.winChance).toBeCloseTo(0.427, 3);
    expect(result.kFactor).toBe(lose);
    expect(result.rawChange).toBeCloseTo(-lose * result.winChance, 6);
    expect(result.expectedChange).toBe(Math.trunc(result.rawChange));
  });

  it('should scale the win modifier between 1000 and 1300 rating', () => {
    const result = getRatingChange(1150, 1150, true, 0);
    expect(result.kFactor).toBe(win1 * 0.75);
    expect(result.expectedChange).toBe(Math.ceil(win1 * 0.375));
  });

  it('should use the second win modifier from 1300 rating', () => {
    const result = getRatingChange(1300, 1300, true, 0);
    expect(result.kFactor).toBe(win2);
    expect(result.expectedChange).toBe(Math.ceil(win2 / 2));
  });

  it('should return 0 instead of -0 for a tiny loss', () => {
    expect(Object.is(getRatingChange(0, 3000, false, 0).expectedChange, 0)).toBe(true);
  });
});
