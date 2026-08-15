import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11Match, D11TeamBase, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { sortByD11Team } from '@app/shared/util/player-match-stat.util';
import { d11MatchEvents } from '@app/shared/util/match-events.util';
import { MatchEvent } from '@app/shared/model';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { PRIMARY } from '@app/app.theme';
import { HeroContainerComponent } from '@app/feature/hero/hero-container/hero-container.component';
import { D11MatchHeroComponent } from '@app/feature/hero/d11-match-hero/d11-match-hero.component';
import { MatchEventsSectionComponent } from '@app/feature/section/match-events-section/match-events-section.component';
import { D11TeamPlayerMatchStatsSectionComponent } from '@app/feature/section/d11-team-player-match-stats-section/d11-team-player-match-stats-section.component';

@Component({
  selector: 'app-d11-match-page',
  imports: [
    HeroContainerComponent,
    D11MatchHeroComponent,
    MatchEventsSectionComponent,
    D11TeamPlayerMatchStatsSectionComponent,
  ],
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
      d11Match && this.rxPlayerMatchStats.value()
        ? sortByD11Team(d11Match, this.rxPlayerMatchStats.value()!)
        : undefined;
    const d11Teams: D11TeamBase[] = d11Match ? [d11Match.homeD11Team, d11Match.awayD11Team] : [];

    return { d11Match, playerMatchStats, d11Teams };
  });

  protected isLoading = computed(
    () => this.rxD11Match.isLoading() || this.rxPlayerMatchStats.isLoading(),
  );
  protected backgroundColor = computed(() => PRIMARY);
  protected d11MatchEventsList = computed<MatchEvent[]>(() => {
    const d11Match = this.rxD11Match.value();
    if (!d11Match) return [];
    return d11MatchEvents(d11Match, this.rxPlayerMatchStats.value());
  });

  private d11MatchApiService = inject(D11MatchApiService);
  private loadingService = inject(LoadingService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.loadingService.register(destroyRef, this.isLoading);
    this.pageContextService.register(destroyRef, {
      title: computed(() => {
        const number = this.rxD11Match.value()?.matchWeek.matchWeekNumber;
        return number !== undefined ? `Match Week ${number}` : undefined;
      }),
      subtitle: computed(() => {
        const name = this.rxD11Match.value()?.matchWeek.season.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: this.backgroundColor,
    });
  }

  protected getD11TeamStats(d11TeamId: number): PlayerMatchStat[] {
    return (this.model().playerMatchStats ?? []).filter((pms) => pms.d11Team.id === d11TeamId);
  }
}
