import { Component, computed, inject, input } from '@angular/core';
import { PlayerSeasonStat, POSITION_IDS, Season } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { D11TeamImgComponent, PlayerImgComponent } from '@app/shared/img';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-team-player-season-stats-card',
  imports: [Card, D11TeamImgComponent, PlayerImgComponent, RatingPipe],
  templateUrl: './team-player-season-stats-card.component.html',
})
export class TeamPlayerSeasonStatsCardComponent {
  playerSeasonStats = input.required<PlayerSeasonStat[]>();
  season = input<Season | undefined>();

  protected grouped = computed(() => {
    const stats = this.playerSeasonStats();
    const groups: { label: string; ids: number[] }[] = [
      { label: 'Goalkeepers', ids: [POSITION_IDS.KEEPER] },
      { label: 'Defenders', ids: [POSITION_IDS.DEFENDER, POSITION_IDS.FULL_BACK] },
      { label: 'Midfielders', ids: [POSITION_IDS.MIDFIELDER] },
      { label: 'Forwards', ids: [POSITION_IDS.FORWARD] },
    ];
    return groups
      .map((group) => ({
        label: group.label,
        stats: stats
          .filter((stat) => group.ids.includes(stat.position.id))
          .sort((a, b) => b.points - a.points),
      }))
      .filter((group) => group.stats.length > 0);
  });

  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  protected openDialog(playerSeasonStat: PlayerSeasonStat): void {
    this.dynamicDialogService.openPlayerSeasonStat(playerSeasonStat, this.playerSeasonStats(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
