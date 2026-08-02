import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { DatePipe, Location, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Lineup, Match, PlayerMatchStat, Status, TeamBase } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { sortByTeam } from '@app/shared/util/player-match-stat-util';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { matchEvents } from '@app/shared/util/match-events.util';
import { MatchEvent } from '@app/shared/model';
import { PRIMARY } from '@app/app.theme';
import { environment } from '../../../../environments/environment';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'app-match-page',
  imports: [
    NgClass,
    DatePipe,
    RouterLink,
    RatingPipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
  ],
  templateUrl: './match-page.component.html',
})
export class MatchPageComponent {
  matchId = input.required({ transform: numberAttribute });

  protected readonly Status = Status;
  protected readonly Lineup = Lineup;
  protected readonly imageHost = environment.imageHost;

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

    return {
      match,
      playerMatchStats,
      teams,
    };
  });
  protected isLoading = computed(
    () => this.rxMatch.isLoading() || this.rxPlayerMatchStats.isLoading(),
  );
  protected backgroundColor = computed(() => this.rxMatch.value()?.homeTeam.colour ?? PRIMARY);
  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));
  protected matchEventsList = computed<MatchEvent[]>(() => {
    const match = this.rxMatch.value();
    if (!match) return [];
    return matchEvents(match, this.rxPlayerMatchStats.value());
  });

  private matchApiService = inject(MatchApiService);
  private loadingService = inject(LoadingService);
  private location = inject(Location);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected goBack(): void {
    this.location.back();
  }

  protected getTeamStats(stats: PlayerMatchStat[], teamId: number): PlayerMatchStat[] {
    return stats.filter((pms) => pms.team.id === teamId);
  }

  protected getSubstituteIndex(stats: PlayerMatchStat[]): number {
    return stats.findIndex((pms) => pms.lineup === Lineup.SUBSTITUTE);
  }

  protected minutesPlayed(pms: PlayerMatchStat): number {
    const started = pms.lineup === Lineup.STARTING_LINEUP;
    const played = started || pms.substitutionOnTime > 0;
    if (!played) return 0;
    const startTime = started ? 0 : pms.substitutionOnTime;
    const endTime = pms.substitutionOffTime > 0 ? pms.substitutionOffTime : 90;
    return endTime - startTime;
  }
}
