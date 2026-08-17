import { PlayerSeasonStatSort } from '@app/core/api';

export interface PlayerSeasonStatsSearchParams {
  seasonId: number;
  dummy: boolean | undefined;
  positionIds: number[];
  sort: PlayerSeasonStatSort | null;
}
