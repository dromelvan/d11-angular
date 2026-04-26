import { MatchWeekBase } from './match-week-base.model';
import { SeasonBase } from './season-base.model';
import { TransferDay } from './transfer-day.model';
import { TransferWindowBase } from './transfer-window-base.model';

export interface Current {
  season?: SeasonBase;
  matchWeek?: MatchWeekBase;
  transferWindow?: TransferWindowBase;
  transferDay?: TransferDay;
}
