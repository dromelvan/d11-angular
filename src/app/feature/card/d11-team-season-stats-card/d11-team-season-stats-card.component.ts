import { Component, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatsComponent } from '@app/feature/component/d11-team-season-stats/d11-team-season-stats.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-season-stats-card',
  imports: [Card, D11TeamSeasonStatsComponent],
  templateUrl: './d11-team-season-stats-card.component.html',
})
export class D11TeamSeasonStatsCardComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();
}
