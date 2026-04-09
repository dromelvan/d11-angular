import { TransferDay } from '@app/core/api/model/transfer-day.model';
import { MatchWeekBase } from '@app/core/api/model/match-week-base.model';
import { TransferWindow } from '@app/core/api/model/transfer-window.model';
import { SeasonBase } from '@app/core/api/model/season-base.model';

export interface TransferWindowResponseBody {
  transferWindow: TransferWindow;
  matchWeek: MatchWeekBase;
  season: SeasonBase;
  transferDays?: TransferDay[];
}
