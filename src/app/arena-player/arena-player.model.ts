import { Player } from '../search-player/search-player.model';

export interface ArenaTeamData {
  arenaTeamId: number;
  weekGames: number;
  weekWins: number;
  seasonGames: number;
  seasonWins: number;
  personalRating: number;
  arenaTeamName: string;
  arenaType: number;
}

export interface CharacterArenaStats {
  guid: number;
  slot: number;
  matchMakerRating: number;
  maxMMR: number;
}

export interface PlayerArenaTeams {
  playerData: Player;
  arenaTeamsData: ArenaTeamData[];
  characterArenaStats: CharacterArenaStats[];
}
