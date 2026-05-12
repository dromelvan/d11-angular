import { Component, computed, inject, input } from '@angular/core';
import { D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamBaseComponent } from '@app/shared/resource';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';

@Component({
  selector: 'app-d11-team-player-match-stats',
  imports: [RatingPipe, IconComponent, D11TeamBaseComponent],
  templateUrl: './d11-team-player-match-stats.component.html',
})
export class D11TeamPlayerMatchStatsComponent {
  d11Team = input.required<D11TeamBase>();
  stats = input.required<PlayerMatchStat[]>();

  protected filteredStats = computed<PlayerMatchStat[]>(() => {
    const d11TeamId = this.d11Team().id;
    return this.stats()
      .filter((pms) => pms.d11Team.id === d11TeamId)
      .sort((a, b) => {
        const sortOrderDiff = a.position.sortOrder - b.position.sortOrder;
        if (sortOrderDiff !== 0) return sortOrderDiff;
        return a.player.lastName.localeCompare(b.player.lastName);
      });
  });

  protected readonly Lineup = Lineup;

  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  protected openDialog(playerMatchStat: PlayerMatchStat): void {
    this.dynamicDialogService.openPlayerMatchStat(playerMatchStat, this.filteredStats(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
