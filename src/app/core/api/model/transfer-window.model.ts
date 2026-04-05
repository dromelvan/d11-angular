import { MatchWeekBase } from './match-week-base.model';
import { Status } from './status.model';
import { TransferDay } from './transfer-day.model';

export interface TransferWindow {
  id: number;
  transferWindowNumber: number;
  draft: boolean;
  status: Status;
  datetime: string;
  matchWeek: MatchWeekBase;
  transferDays?: TransferDay[];
}
