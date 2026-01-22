import { FactionType } from '../utils/get-faction';

export interface FightStats {
  fight: Fight;
  memberStats: MemberStats[];
  fight_id_next: number | null;
  fight_id_previous: number | null;
}

export interface Fight {
  fight_id: number;
  time: string;
  type: number;
  duration: number;
  winner: number;
  winner_tr: number;
  winner_mmr: number;
  winner_tr_change: number;
  loser: number;
  loser_tr: number;
  loser_mmr: number;
  loser_tr_change: number;
  currOnline: number;
  winner_team_name: string;
  winner_captain_race: number;
  loser_team_name: string;
  loser_captain_race: number;
  winner_faction?: FactionType;
  loser_faction?: FactionType;
}

export interface MemberStats {
  fight_id: number;
  member_id: number;
  name: string;
  guid: number;
  team: number;
  account: number;
  ip: string;
  damage: number;
  heal: number;
  kblows: number;
  race: number;
  gender: number;
  class: number;
  level: number;
  faction?: FactionType;
}
