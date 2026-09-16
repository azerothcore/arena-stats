import { ArenaRatingModifiers } from 'config';

export interface RatingChangeBreakdown {
  won: boolean;
  ownRating: number;
  opponentMmr: number;
  winChance: number;
  kFactor: number;
  kFactorExplanation: string;
  rawChange: number;
  expectedChange: number;
  recordedChange: number;
}

/**
 * Mirrors ArenaTeam::GetChanceAgainst and ArenaTeam::GetRatingMod
 * https://github.com/azerothcore/azerothcore-wotlk/blob/master/src/server/game/Battlegrounds/ArenaTeam.cpp
 * The team rating is compared against the opponent MMR, both taken before the match.
 */
export function getRatingChange(ownRating: number, opponentMmr: number, won: boolean, recordedChange: number): RatingChangeBreakdown {
  const winChance = 1 / (1 + Math.pow(10, (opponentMmr - ownRating) / 650));
  const { winRatingModifier1: win1, winRatingModifier2: win2, loseRatingModifier: lose } = ArenaRatingModifiers;

  let kFactor: number;
  let kFactorExplanation: string;
  if (!won) {
    kFactor = lose;
    kFactorExplanation = `lose modifier`;
  } else if (ownRating < 1000) {
    kFactor = win1;
    kFactorExplanation = `team rating below 1000`;
  } else if (ownRating < 1300) {
    kFactor = win1 / 2 + ((win1 / 2) * (1300 - ownRating)) / 300;
    kFactorExplanation = `${win1 / 2} + ${win1 / 2} × (1300 − ${ownRating}) / 300, team rating between 1000 and 1299`;
  } else {
    kFactor = win2;
    kFactorExplanation = `team rating 1300 or higher`;
  }

  const rawChange = won ? kFactor * (1 - winChance) : -kFactor * winChance;

  return {
    won,
    ownRating,
    opponentMmr,
    winChance,
    kFactor,
    kFactorExplanation,
    rawChange,
    // + 0 turns the -0 produced by Math.ceil(-0.x) into 0
    expectedChange: Math.ceil(rawChange) + 0,
    recordedChange,
  };
}
