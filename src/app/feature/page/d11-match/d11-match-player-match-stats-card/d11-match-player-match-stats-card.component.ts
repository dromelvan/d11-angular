import { Component, computed, inject, input } from '@angular/core';
import { D11Match, D11TeamBase, PlayerMatchStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { Card } from 'primeng/card';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamBaseComponent } from '@app/shared/resource';

interface D11TeamSquad {
  d11Team: D11TeamBase;
  stats: PlayerMatchStat[];
}

@Component({
  selector: 'app-d11-match-player-match-stats-card',
  imports: [Card, RatingPipe, IconComponent, D11TeamBaseComponent],
  templateUrl: './d11-match-player-match-stats-card.component.html',
})
export class D11MatchPlayerMatchStatsCardComponent {
  d11Match = input<D11Match | undefined>();
  playerMatchStats = input<PlayerMatchStat[] | undefined>();

  protected readonly Lineup = Lineup;

  protected sortedPlayerMatchStats = computed<PlayerMatchStat[]>(() =>
    this.teamSquads().flatMap((squad) => squad.stats),
  );

  protected teamSquads = computed<D11TeamSquad[]>(() => {
    const stats = this.playerMatchStats();
    const d11Match = this.d11Match();
    if (!stats?.length || !d11Match) return [];

    const homeD11TeamId = d11Match.homeD11Team.id;
    const sorted = [...stats].sort((a, b) => {
      const aOrder = a.d11Team.id === homeD11TeamId ? 0 : 1;
      const bOrder = b.d11Team.id === homeD11TeamId ? 0 : 1;
      const teamDiff = aOrder - bOrder;
      if (teamDiff !== 0) return teamDiff;

      const sortOrderDiff = a.position.sortOrder - b.position.sortOrder;
      if (sortOrderDiff !== 0) return sortOrderDiff;

      return a.player.lastName.localeCompare(b.player.lastName);
    });

    const homeStats = sorted.filter((pms) => pms.d11Team.id === homeD11TeamId);
    const awayStats = sorted.filter((pms) => pms.d11Team.id !== homeD11TeamId);

    const squads: D11TeamSquad[] = [];
    if (homeStats.length) squads.push({ d11Team: homeStats[0].d11Team, stats: homeStats });
    if (awayStats.length) squads.push({ d11Team: awayStats[0].d11Team, stats: awayStats });
    return squads;
  });

  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  protected openDialog(playerMatchStat: PlayerMatchStat): void {
    this.dynamicDialogService.openPlayerMatchStat(playerMatchStat, this.sortedPlayerMatchStats(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
