import { D11TeamSeasonStat } from './d11-team-season-stat.model';
import { PlayerSeasonStat } from './player-season-stat.model';
import { Season } from './season.model';
import { TeamSeasonStat } from './team-season-stat.model';

export interface SeasonWinners {
  season: Season;
  d11TeamSeasonStat: D11TeamSeasonStat;
  teamSeasonStat: TeamSeasonStat;
  playerSeasonStat: PlayerSeasonStat;
}
