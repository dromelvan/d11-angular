import { Status } from './status.model';
import { MostValuablePlayer } from './most-valuable-player.model';
import { MatchWeekBase } from './match-week-base.model';
import { Season } from '@app/core/api';

export interface MatchWeek extends MatchWeekBase {
  date: string;
  elapsed: number;
  status: Status;
  season: Season;
  mostValuablePlayer?: MostValuablePlayer;
}
