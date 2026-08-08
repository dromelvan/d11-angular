import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Match, PlayerMatchStat, Status, TeamBase } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { sortByTeam } from '@app/shared/util/player-match-stat-util';
import { matchEvents } from '@app/shared/util/match-events.util';
import { MatchEvent } from '@app/shared/model';
import { PRIMARY } from '@app/app.theme';
import { MatchHeroComponent } from '@app/feature/hero/match-hero/match-hero.component';
import { MatchEventsSectionComponent } from '@app/feature/section/match-events-section/match-events-section.component';
import { TeamPlayerMatchStatsSectionComponent } from '@app/feature/section/team-player-match-stats-section/team-player-match-stats-section.component';
import { HeroContainerComponent } from '@app/feature/hero/hero-container/hero-container.component';

@Component({
  selector: 'app-match-page',
  imports: [
    MatchHeroComponent,
    MatchEventsSectionComponent,
    TeamPlayerMatchStatsSectionComponent,
    HeroContainerComponent,
  ],
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
    const teams: TeamBase[] = match ? [match.homeTeam, match.awayTeam] : [];

    return { match, playerMatchStats, teams };
  });
  protected isLoading = computed(
    () => this.rxMatch.isLoading() || this.rxPlayerMatchStats.isLoading(),
  );
  protected backgroundColor = computed(() => this.rxMatch.value()?.homeTeam.colour ?? PRIMARY);
  protected matchEventsList = computed<MatchEvent[]>(() => {
    const match = this.rxMatch.value();
    if (!match) return [];
    return matchEvents(match, this.rxPlayerMatchStats.value());
  });

  private matchApiService = inject(MatchApiService);
  private loadingService = inject(LoadingService);
  private pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.loadingService.register(destroyRef, this.isLoading);
    this.pageContextService.register(destroyRef, {
      title: computed(() => {
        const number = this.rxMatch.value()?.matchWeek.matchWeekNumber;
        return number !== undefined ? `Match Week ${number}` : undefined;
      }),
      subtitle: computed(() => {
        const name = this.rxMatch.value()?.matchWeek.season.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: this.backgroundColor,
    });
  }

  protected getTeamStats(teamId: number): PlayerMatchStat[] {
    return (this.model().playerMatchStats ?? []).filter((pms) => pms.team.id === teamId);
  }
}
