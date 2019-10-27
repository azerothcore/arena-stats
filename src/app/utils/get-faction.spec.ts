import { TestBed } from '@angular/core/testing';
import { getFaction } from './get-faction';

describe('getFaction function', () => {
  beforeEach(() => TestBed.configureTestingModule({}));


  it('should work correctly', () => {
    const hordeRaces = [2, 5, 6, 8, 9, 10];
    const allianceRaces = [1, 3, 4, 7, 11];

    for (const race of hordeRaces) {
      expect(getFaction(race)).toBe('horde');
    }

    for (const race of allianceRaces) {
      expect(getFaction(race)).toBe('alliance');
    }

    expect(getFaction(100)).toBe('');
  });
});
