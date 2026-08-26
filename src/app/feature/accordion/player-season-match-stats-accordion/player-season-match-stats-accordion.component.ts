import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Lineup, PlayerApiService, PlayerMatchStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { minutesPlayed } from '@app/shared/util/player-match-stat.util';
import { IconComponent } from '@app/shared/icon/icon.component';
import { D11TeamImgComponent, TeamImgComponent } from '@app/shared/img';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { MatchBaseComponent } from '@app/shared/resource/match-base/match-base.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-player-season-match-stats-accordion',
  templateUrl: './player-season-match-stats-accordion.component.html',
  imports: [
    DatePipe,
    RatingPipe,
    MatchBaseComponent,
    TeamImgComponent,
    D11TeamImgComponent,
    IconComponent,
    SvgIconComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    ProgressSpinner,
  ],
  host: { class: 'flex flex-col grow' },
})
export class PlayerSeasonMatchStatsAccordionComponent {
  readonly playerId = input.required<number>();
  readonly seasonId = input.required<number>();

  protected readonly Lineup = Lineup;

  protected readonly rxPlayerMatchStats = rxResource<
    PlayerMatchStat[],
    { playerId: number; seasonId: number }
  >({
    params: () => ({ playerId: this.playerId(), seasonId: this.seasonId() }),
    stream: ({ params }) =>
      this.playerApiService.getPlayerMatchStatsByPlayerIdAndSeasonId(
        params.playerId,
        params.seasonId,
      ),
  });

  protected readonly isLoading = computed(() => this.rxPlayerMatchStats.isLoading());
  protected readonly playerMatchStats = computed(() => this.rxPlayerMatchStats.value() ?? []);
  protected readonly minutesPlayed = minutesPlayed;

  private readonly playerApiService = inject(PlayerApiService);
  private readonly routerService = inject(RouterService);

  protected navigateToMatch(pms: PlayerMatchStat): void {
    this.routerService.navigateToMatch(pms.match.id);
  }
}
