import { ArenaPointsMultiplier } from 'config';
import { ArenaTeamMember } from '../types/arena-team-member.type';
import { ArenaTeam } from '../types/arena-team.type';

export function getNextArenaPoints(rating: ArenaTeamMember['personalRating'], type: ArenaTeam['type']): number {
  /**
   * formula sources
   * wowwiki-archive https://wowwiki-archive.fandom.com/wiki/Arena_point_calculator#:~:text=If%20%5BRating%5D>1500,a%20fives%20team
   * azerothcore https://github.com/azerothcore/azerothcore-wotlk/blob/master/src/server/game/Battlegrounds/ArenaTeam.cpp#L652
   */

  const keyMultiplier = type === 4 ? `t3v3soloQ` : `t${type}v${type}`;
  let ARENA_POINTS_BASE = 344;

  if (rating > 1500) {
    ARENA_POINTS_BASE = 1511.26 / (1.0 + 1639.28 * Math.exp(-0.00412 * rating));
  }

  return Math.round(ARENA_POINTS_BASE * ArenaPointsMultiplier[keyMultiplier]);
}
