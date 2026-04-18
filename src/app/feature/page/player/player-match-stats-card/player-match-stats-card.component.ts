import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { PlayerApiService, PlayerMatchStat, PlayerSeasonStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoadingService } from '@app/core/loading/loading.service';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { MatchBaseComponent } from '@app/shared/resource/match-base/match-base.component';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RouterService } from '@app/core/router/router.service';

@Component({
  selector: 'app-player-match-stats',
  imports: [Card, DatePipe, RatingPipe, MatchBaseComponent],
  templateUrl: './player-match-stats-card.component.html',
})
export class PlayerMatchStatsCardComponent {
  playerSeasonStat = input.required<PlayerSeasonStat>();

  protected rxPlayerMatchStats = rxResource({
    params: () => {
      const playerId = this.playerSeasonStat().player.id;
      const seasonId = this.playerSeasonStat().season.id;

      return { playerId, seasonId };
    },
    stream: ({ params }) =>
      this.playerApiService.getPlayerMatchStatsByPlayerIdAndSeasonId(
        params.playerId,
        params.seasonId,
      ),
  });

  protected playerMatchStats = computed(() => this.rxPlayerMatchStats.value());
  protected isLoading = computed(() => this.rxPlayerMatchStats.isLoading());
  protected readonly Lineup = Lineup;

  private playerApiService = inject(PlayerApiService);
  private loadingService = inject(LoadingService);
  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected openDialog(playerMatchStat: PlayerMatchStat): void {
    this.dynamicDialogService.openPlayerMatchStat(playerMatchStat, this.playerMatchStats() ?? [], {
      label: 'Match details',
      icon: 'match',
      onClick: (current) => this.routerService.navigateToMatch(current.match.id),
    });
  }
}
