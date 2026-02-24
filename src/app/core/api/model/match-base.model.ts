import { MatchWeekBase } from './match-week-base.model';
import { TeamBase } from './team-base.model';

export interface MatchBase {
  id: number;
  datetime: string;
  homeTeamGoalsScored: number;
  awayTeamGoalsScored: number;
  homeTeam: TeamBase;
  awayTeam: TeamBase;
  matchWeek: MatchWeekBase;
}
