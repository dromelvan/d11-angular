import { SeasonBase } from './season-base.model';

export interface MatchWeekBase {
  id: number;
  matchWeekNumber: number;
  season: SeasonBase;
}
