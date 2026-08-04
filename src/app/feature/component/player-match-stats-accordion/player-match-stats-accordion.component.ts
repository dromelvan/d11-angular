import { Component, computed, inject, input } from '@angular/core';
import { Lineup, PlayerMatchStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'app-player-match-stats-accordion',
  templateUrl: './player-match-stats-accordion.component.html',
  imports: [
    D11TeamImgComponent,
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
  readonly playerMatchStats = input.required<PlayerMatchStat[]>();

  protected readonly Lineup = Lineup;
  protected readonly substituteIndex = computed(() =>
    this.playerMatchStats().findIndex((pms) => pms.lineup === Lineup.SUBSTITUTE),
  );

  private readonly routerService = inject(RouterService);

  protected navigateToPlayer(playerId: number): void {
    this.routerService.navigateToPlayer(playerId);
  }

  protected minutesPlayed(pms: PlayerMatchStat): number {
    const started = pms.lineup === Lineup.STARTING_LINEUP;
    const played = started || pms.substitutionOnTime > 0;
    if (!played) return 0;
    const startTime = started ? 0 : pms.substitutionOnTime;
    const stoppedTimes = [pms.substitutionOffTime, pms.redCardTime].filter((t) => t > 0);
    const endTime = stoppedTimes.length > 0 ? Math.min(...stoppedTimes) : 90;
    return endTime - startTime;
  }
}
