import { D11TeamBase } from './d11-team-base.model';
import { Season } from './season.model';

export interface D11TeamSeasonStat {
  id: number;
  winCount: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  formPoints: number;
  formMatchPoints: number[];
  ranking: number;
  previousRanking: number;
  d11Team: D11TeamBase;
  season: Season;
}
