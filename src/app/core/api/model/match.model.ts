import { Status } from './status.model';
import { TeamBase } from './team-base.model';
import { MatchWeekBase } from './match-week-base.model';
import { GoalBase } from './goal-base.model';

export interface Match {
  id: number;
  statSourceId: number;
  datetime: string;
  homeTeamGoalsScored: number;
  awayTeamGoalsScored: number;
  previousHomeTeamGoalsScored: number;
  previousAwayTeamGoalsScored: number;
  elapsed: string;
  status: Status;
  homeTeam: TeamBase;
  awayTeam: TeamBase;
  matchWeek: MatchWeekBase;

  homeTeamGoals?: GoalBase[];
  awayTeamGoals?: GoalBase[];
}
