import { Component, inject, input } from '@angular/core';
import { TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamBaseComponent } from '@app/shared/resource/team-base/team-base.component';

@Component({
  selector: 'app-team-season-stats',
  imports: [TeamBaseComponent, IconComponent],
  templateUrl: './team-season-stats.component.html',
})
export class TeamSeasonStatsComponent {
  teamSeasonStats = input.required<TeamSeasonStat[]>();

  private routerService = inject(RouterService);

  protected navigateToTeam(stat: TeamSeasonStat): void {
    this.routerService.navigateToTeam(stat.team.id, stat.season.id);
  }
}
