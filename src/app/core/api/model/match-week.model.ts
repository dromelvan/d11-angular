import { Status } from './status.model';
import { MostValuablePlayer } from './most-valuable-player.model';
import { MatchWeekBase } from './match-week-base.model';

export interface MatchWeek extends MatchWeekBase {
  date: string;
  elapsed: number;
  status: Status;
  mostValuablePlayer?: MostValuablePlayer;
}
