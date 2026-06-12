import { ArenaFightMember } from './arena-fight-member.interface';

// View of an ArenaFightLog from one team's perspective
export interface ArenaTeamFight {
  fight_id: number;
  time: string;
  type: number;
  duration: number;
  won: boolean;
  team_rating: number;
  team_mmr: number;
  rating_change: number;
  opponent_id: number;
  opponent_name: string;
  team_members: ArenaFightMember[];
  opponent_members: ArenaFightMember[];
}
