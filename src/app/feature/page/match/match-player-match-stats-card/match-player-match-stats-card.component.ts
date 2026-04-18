import { Component, computed, inject, input } from '@angular/core';
import { PlayerMatchStat } from '@app/core/api';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { Lineup } from '@app/core/api/model/lineup.model';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';
import { Card } from 'primeng/card';
import { IconComponent } from '@app/shared/icon/icon.component';
import { TeamBaseComponent } from '@app/shared/resource';

interface TeamSquad {
  team: TeamBase;
  stats: PlayerMatchStat[];
  substituteIndex: number;
}

@Component({
  selector: 'app-match-player-match-stats-card',
  imports: [Card, RatingPipe, IconComponent, TeamBaseComponent],
  templateUrl: './match-player-match-stats-card.component.html',
})
export class MatchPlayerMatchStatsCardComponent {
  playerMatchStats = input<PlayerMatchStat[] | undefined>();

  protected readonly Lineup = Lineup;

  protected teamSquads = computed<TeamSquad[]>(() => {
    const stats = this.playerMatchStats();
    if (!stats?.length) return [];

    const homeTeamId = stats[0].match.homeTeam.id;
    const homeStats = stats.filter((pms) => pms.team.id === homeTeamId);
    const awayStats = stats.filter((pms) => pms.team.id !== homeTeamId);

    const squads: TeamSquad[] = [];
    if (homeStats.length)
      squads.push({
        team: homeStats[0].team,
        stats: homeStats,
        substituteIndex: homeStats.findIndex((s) => s.lineup === Lineup.SUBSTITUTE),
      });
    if (awayStats.length)
      squads.push({
        team: awayStats[0].team,
        stats: awayStats,
        substituteIndex: awayStats.findIndex((s) => s.lineup === Lineup.SUBSTITUTE),
      });
    return squads;
  });

  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  protected openDialog(playerMatchStat: PlayerMatchStat): void {
    this.dynamicDialogService.openPlayerMatchStat(playerMatchStat, this.playerMatchStats() ?? [], {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) => this.routerService.navigateToPlayer(current.player.id),
    });
  }
}
