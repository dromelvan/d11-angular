import { Season } from './season.model';
import { TeamBase } from './team-base.model';

export interface TeamSeasonStat {
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
  team: TeamBase;
  season: Season;
}
