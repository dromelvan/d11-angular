import { Component, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamBaseComponent } from '@app/shared/resource/team-base/team-base.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-season-stats-card',
  imports: [Card, TeamBaseComponent, IconComponent],
  templateUrl: './team-season-stats-card.component.html',
})
export class TeamSeasonStatsCardComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();
}
