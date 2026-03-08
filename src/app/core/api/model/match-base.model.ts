import { MatchWeekBase } from './match-week-base.model';
import { TeamBase } from './team-base.model';
import { Status } from './status.model';
import { StadiumBase } from './stadium-base.model';

export interface MatchBase {
  id: number;
  datetime: string;
  homeTeamGoalsScored: number;
  awayTeamGoalsScored: number;
  elapsed: string;
  status: Status;
  homeTeam: TeamBase;
  awayTeam: TeamBase;
  matchWeek: MatchWeekBase;
  stadium: StadiumBase;
}
