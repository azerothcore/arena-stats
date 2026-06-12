import { ArenaFightMember } from './arena-fight-member.interface';

export interface ArenaFightLog {
  fight_id: number;
  time: string;
  type: number;
  level: number;
  duration: number;
  winner: number;
  loser: number;
  winner_tr: number;
  winner_mmr: number;
  winner_tr_change: number;
  loser_tr: number;
  loser_mmr: number;
  loser_tr_change: number;
  winner_name: string;
  loser_name: string;
  winner_faction: string;
  loser_faction: string;
  winner_members: (ArenaFightMember | null)[];
  loser_members: (ArenaFightMember | null)[];
}
