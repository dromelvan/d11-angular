import { D11MatchBase } from './d11-match-base.model';
import { Status } from './status.model';

export interface D11Match extends D11MatchBase {
  previousHomeTeamGoalsScored: number;
  previousAwayTeamGoalsScored: number;
  previousHomeTeamPoints: number;
  previousAwayTeamPoints: number;
  elapsed: string;
  status: Status;
}
