import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Match, PlayerMatchStat, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { MatchHeaderCardComponent } from '@app/feature/page/match/match-header-card/match-header-card.component';
import { MatchPlayerMatchStatsCardComponent } from '@app/feature/page/match/match-player-match-stats-card/match-player-match-stats-card.component';
import { sortByTeam } from '@app/shared/util/player-match-stat-util';

@Component({
  selector: 'app-match-page',
  imports: [MatchHeaderCardComponent, MatchPlayerMatchStatsCardComponent],
  templateUrl: './match-page.component.html',
})
export class MatchPageComponent {
  matchId = input.required({ transform: numberAttribute });

  protected readonly Status = Status;

  protected rxMatch = rxResource<Match, number>({
    params: () => this.matchId(),
    stream: ({ params }) => this.matchApiService.getById(params),
  });
  protected rxPlayerMatchStats = rxResource<PlayerMatchStat[], number>({
    params: () => this.matchId(),
    stream: ({ params }) => this.matchApiService.getPlayerMatchStatsByMatchId(params),
  });

  protected model = computed(() => {
    const match = this.rxMatch.value();

    const playerMatchStats =
      match && this.rxPlayerMatchStats.value()
        ? sortByTeam(this.rxPlayerMatchStats.value()!)
        : undefined;

    return {
      match,
      playerMatchStats,
    };
  });
  protected isLoading = computed(
    () => this.rxMatch.isLoading() || this.rxPlayerMatchStats.isLoading(),
  );

  private matchApiService = inject(MatchApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }
}
