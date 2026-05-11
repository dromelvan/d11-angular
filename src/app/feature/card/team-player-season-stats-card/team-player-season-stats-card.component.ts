import { Component, input } from '@angular/core';
import { PlayerSeasonStat, Season } from '@app/core/api';
import { TeamPlayerSeasonStatsComponent } from '@app/feature/component/team-player-season-stats/team-player-season-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-player-season-stats-card',
  imports: [Card, TeamPlayerSeasonStatsComponent],
  templateUrl: './team-player-season-stats-card.component.html',
})
export class TeamPlayerSeasonStatsCardComponent {
  playerSeasonStats = input.required<PlayerSeasonStat[]>();
  season = input<Season | undefined>();
  showTeam = input<boolean>(false);
}
