import { Component, inject, input } from '@angular/core';
import { D11TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamBaseComponent } from '@app/shared/resource/d11-team-base/d11-team-base.component';

@Component({
  selector: 'app-d11-team-season-stats',
  imports: [D11TeamBaseComponent, IconComponent],
  templateUrl: './d11-team-season-stats.component.html',
})
export class D11TeamSeasonStatsComponent {
  d11TeamSeasonStats = input.required<D11TeamSeasonStat[]>();

  private routerService = inject(RouterService);

  protected navigateToD11Team(stat: D11TeamSeasonStat): void {
    this.routerService.navigateToD11Team(stat.d11Team.id, stat.season.id);
  }
}
