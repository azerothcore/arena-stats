import { ArenaFightMember } from './arena-fight-member.interface';

export interface ArenaFightLog {
  fight_id: number;
  time: string;
  type: number;
  level: number;
  winner_name: string;
  loser_name: string;
  winner_faction: string;
  loser_faction: string;
  winner_members: (ArenaFightMember | null)[];
  loser_members: (ArenaFightMember | null)[];
}
