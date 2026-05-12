import { Component, computed, inject, input } from '@angular/core';
import { PlayerMatchStat } from '@app/core/api';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamBaseComponent } from '@app/shared/resource';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';

@Component({
  selector: 'app-team-player-match-stats',
  imports: [RatingPipe, IconComponent, TeamBaseComponent],
  templateUrl: './team-player-match-stats.component.html',
})
export class TeamPlayerMatchStatsComponent {
  team = input.required<TeamBase>();
  stats = input.required<PlayerMatchStat[]>();

  protected filteredStats = computed<PlayerMatchStat[]>(() =>
    this.stats().filter((pms) => pms.team.id === this.team().id),
  );

  protected substituteIndex = computed<number>(() =>
    this.filteredStats().findIndex((s) => s.lineup === Lineup.SUBSTITUTE),
  );

  protected readonly Lineup = Lineup;

  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  protected openDialog(playerMatchStat: PlayerMatchStat): void {
    this.dynamicDialogService.openPlayerMatchStat(playerMatchStat, this.stats(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
