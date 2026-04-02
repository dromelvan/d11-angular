import { PlayerSeasonStat } from './player-season-stat.model';

export interface PlayerSeasonStatPage {
  page: number;
  totalPages: number;
  totalElements: number;
  elements: PlayerSeasonStat[];
}
