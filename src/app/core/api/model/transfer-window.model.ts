import { MatchWeekBase } from './match-week-base.model';
import { Status } from './status.model';
import { TransferDay } from './transfer-day.model';
import { TransferWindowPositionCount } from './transfer-window-position-count.model';
import { SeasonBase } from '@app/core/api';

export interface TransferWindow {
  id: number;
  transferWindowNumber: number;
  draft: boolean;
  status: Status;
  datetime: string;
  matchWeek: MatchWeekBase;
  season: SeasonBase;
  transferDays?: TransferDay[];
  transferWindowPositionCounts?: TransferWindowPositionCount[];
}
