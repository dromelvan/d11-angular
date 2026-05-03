import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11Match, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { D11MatchHeaderCardComponent } from '@app/feature/page/d11-match/d11-match-header-card/d11-match-header-card.component';
import { D11MatchPlayerMatchStatsCardComponent } from '@app/feature/page/d11-match/d11-match-player-match-stats-card/d11-match-player-match-stats-card.component';

@Component({
  selector: 'app-d11-match-page',
  imports: [D11MatchHeaderCardComponent, D11MatchPlayerMatchStatsCardComponent],
  templateUrl: './d11-match-page.component.html',
})
export class D11MatchPageComponent {
  d11MatchId = input.required({ transform: numberAttribute });

  protected readonly Status = Status;

  protected rxD11Match = rxResource<D11Match, number>({
    params: () => this.d11MatchId(),
    stream: ({ params }) => this.d11MatchApiService.getById(params),
  });
  protected rxPlayerMatchStats = rxResource<PlayerMatchStat[], number>({
    params: () => this.d11MatchId(),
    stream: ({ params }) => this.d11MatchApiService.getPlayerMatchStatsByD11MatchId(params),
  });

  protected model = computed(() => {
    const d11Match = this.rxD11Match.value();
    const playerMatchStats =
      d11Match && this.rxPlayerMatchStats.value() ? this.rxPlayerMatchStats.value() : undefined;

    return {
      d11Match,
      playerMatchStats,
    };
  });

  protected isLoading = computed(
    () => this.rxD11Match.isLoading() || this.rxPlayerMatchStats.isLoading(),
  );

  private d11MatchApiService = inject(D11MatchApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }
}
