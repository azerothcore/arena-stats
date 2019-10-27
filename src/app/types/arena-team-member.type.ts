export class ArenaTeamMember {
  arenaTeamId: number;
  guid: number;
  weekGames: number;
  weekWins: number;
  weekLosses?: number;
  weekNeeded?: number;
  seasonGames: number;
  seasonWins: number;
  seasonLosses?: number;
  personalRating: number;
  matchmakerRating: number;
  name: string;
  class: number;
  race: number;
  gender: number;
  faction?: string;
}
