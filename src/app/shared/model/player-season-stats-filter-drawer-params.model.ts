import { PlayerSeasonStatsSearchParams } from './player-season-stats-search-params.model';

export type PlayerSeasonStatsFilterDrawerParams = Omit<PlayerSeasonStatsSearchParams, 'seasonId'>;
