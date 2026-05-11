import { Component, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { TeamSeasonStatsComponent } from '@app/feature/component/team-season-stats/team-season-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-season-stats-card',
  imports: [Card, TeamSeasonStatsComponent],
  templateUrl: './team-season-stats-card.component.html',
})
export class TeamSeasonStatsCardComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();
}
