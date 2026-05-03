import { GoalBase } from './goal-base.model';
import { MatchBase } from '@app/core/api';

export interface Match extends MatchBase {
  statSourceId: number;

  homeTeamGoals?: GoalBase[];
  awayTeamGoals?: GoalBase[];
}
