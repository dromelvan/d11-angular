import { D11TeamBase } from './d11-team-base.model';
import { MatchWeekBase } from './match-week-base.model';

export interface D11MatchBase {
  id: number;
  datetime: string;
  homeTeamGoalsScored: number;
  awayTeamGoalsScored: number;
  homeTeamPoints: number;
  awayTeamPoints: number;
  homeD11Team: D11TeamBase;
  awayD11Team: D11TeamBase;
  matchWeek: MatchWeekBase;
}
