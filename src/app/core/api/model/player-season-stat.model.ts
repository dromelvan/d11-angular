import { D11TeamBase } from './d11-team-base.model';
import { PlayerBase } from './player-base.model';
import { Position } from './position.model';
import { Season } from './season.model';
import { TeamBase } from './team-base.model';

export interface PlayerSeasonStat {
  id: number;
  shirtNumber: number;
  fee: number;
  winCount?: number;
  ranking: number;
  points: number;
  formPoints: number;
  formMatchPoints: number[];
  pointsPerAppearance: number;
  goals: number;
  goalAssists: number;
  ownGoals: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  substitutionsOn: number;
  substitutionsOff: number;
  manOfTheMatch: number;
  sharedManOfTheMatch: number;
  rating: number;
  gamesStarted: number;
  gamesSubstitute: number;
  gamesDidNotParticipate: number;
  minutesPlayed: number;
  player: PlayerBase;
  season: Season;
  team: TeamBase;
  d11Team: D11TeamBase;
  position: Position;
}
