import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11Match, D11TeamBase, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { D11MatchHeaderCardComponent } from '@app/feature/card/d11-match-header-card/d11-match-header-card.component';
import { D11TeamPlayerMatchStatsComponent } from '@app/feature/component/d11-team-player-match-stats/d11-team-player-match-stats.component';

@Component({
  selector: 'app-d11-match-page',
  imports: [D11MatchHeaderCardComponent, D11TeamPlayerMatchStatsComponent],
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
    const d11Teams: D11TeamBase[] = d11Match ? [d11Match.homeD11Team, d11Match.awayD11Team] : [];

    return {
      d11Match,
      playerMatchStats,
      d11Teams,
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
