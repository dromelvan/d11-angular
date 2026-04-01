import { PlayerSeasonStat } from '@app/core/api/model/player-season-stat.model';

export interface PlayerSeasonStatsResponseBody {
  page: number;
  totalPages: number;
  totalElements: number;
  playerSeasonStats: PlayerSeasonStat[];
}
