import { Component, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamBaseComponent } from '@app/shared/resource/d11-team-base/d11-team-base.component';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-season-stats-card',
  imports: [Card, D11TeamBaseComponent, IconComponent],
  templateUrl: './d11-team-season-stats-card.component.html',
})
export class D11TeamSeasonStatsCardComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();
}
