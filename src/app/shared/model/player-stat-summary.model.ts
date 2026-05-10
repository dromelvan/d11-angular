import { D11TeamBase, TeamBase } from '@app/core/api';
import { Position } from '@app/core/api/model/position.model';

export interface PlayerStatSummary {
  ranking: number;
  points: number;
  formMatchPoints: number[];
  pointsPerAppearance: number;
  goals: number;
  goalAssists: number;
  ownGoals: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  manOfTheMatch: number;
  sharedManOfTheMatch: number;
  rating: number;
  gamesStarted: number;
  gamesSubstitute: number;
  minutesPlayed: number;
  fee?: number;
  position: Position;
  team: TeamBase;
  d11Team: D11TeamBase;
}
