import { Component, computed, inject, input } from '@angular/core';
import { Lineup, PlayerMatchStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { minutesPlayed } from '@app/shared/util/player-match-stat.util';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

export type PlayerMatchStatsContext = 'match' | 'd11-match';

@Component({
  selector: 'app-player-match-stats-accordion',
  templateUrl: './player-match-stats-accordion.component.html',
  imports: [
    D11TeamImgComponent,
    TeamImgComponent,
    RatingPipe,
    IconComponent,
    SvgIconComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
  ],
  host: { style: 'display: block' },
})
export class PlayerMatchStatsAccordionComponent {
  readonly context = input.required<PlayerMatchStatsContext>();
  readonly playerMatchStats = input.required<PlayerMatchStat[]>();

  protected readonly Lineup = Lineup;
  protected readonly substituteIndex = computed(() =>
    this.context() === 'match'
      ? this.playerMatchStats().findIndex((pms) => pms.lineup === Lineup.SUBSTITUTE)
      : -1,
  );

  protected readonly minutesPlayed = minutesPlayed;

  private readonly routerService = inject(RouterService);

  protected navigateToPlayer(pms: PlayerMatchStat): void {
    this.routerService.navigateToPlayer(pms.player.id, pms.match.matchWeek.season.id);
  }
}
