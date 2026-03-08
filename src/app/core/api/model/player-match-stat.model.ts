import { Lineup } from './lineup.model';
import { MatchBase } from './match-base.model';
import { PlayerBase } from './player-base.model';
import { TeamBase } from './team-base.model';
import { D11TeamBase } from './d11-team-base.model';
import { Position } from './position.model';

export interface PlayerMatchStat {
  playedPosition: string;
  lineup: Lineup;
  substitutionOnTime: number;
  substitutionOffTime: number;
  goals: number;
  goalAssists: number;
  ownGoals: number;
  goalsConceded: number;
  yellowCardTime: number;
  redCardTime: number;
  manOfTheMatch: boolean;
  sharedManOfTheMatch: boolean;
  rating: number;
  points: number;
  player: PlayerBase;
  match: MatchBase;
  team: TeamBase;
  d11Team: D11TeamBase;
  position: Position;
}
