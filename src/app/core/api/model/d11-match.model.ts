import { GoalBase } from './goal-base.model';
import { D11MatchBase } from './d11-match-base.model';

export interface D11Match extends D11MatchBase {
  homeTeamGoals?: GoalBase[];
  awayTeamGoals?: GoalBase[];
}
