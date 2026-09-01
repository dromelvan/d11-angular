import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamApiService, PlayerSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { D11TeamImgComponent, PlayerImgComponent, TeamImgComponent } from '@app/shared/img';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { FeePipe } from '@app/shared/pipes/fee.pipe';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';
import { of } from 'rxjs';

@Component({
  selector: 'app-d11-team-player-season-stats-accordion',
  templateUrl: './d11-team-player-season-stats-accordion.component.html',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    TeamImgComponent,
    D11TeamImgComponent,
    PlayerImgComponent,
    FeePipe,
    RatingPipe,
    FormMatchPointsComponent,
    SvgIconComponent,
    ProgressSpinner,
  ],
  host: { class: 'flex flex-col grow' },
})
export class D11TeamPlayerSeasonStatsAccordionComponent {
  readonly d11TeamId = input.required<number>();
  readonly seasonId = input<number>();

  protected readonly rxPlayerSeasonStats = rxResource<
    PlayerSeasonStat[],
    { d11TeamId: number; seasonId: number } | undefined
  >({
    params: () => {
      const seasonId = this.seasonId();
      const d11TeamId = this.d11TeamId();
      if (seasonId == null) return undefined;
      return { d11TeamId, seasonId };
    },
    stream: ({ params }) => {
      if (params == null) return of([]);
      return this.d11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId(
        params.d11TeamId,
        params.seasonId,
      );
    },
  });

  protected readonly playerSeasonStats = computed(() => this.rxPlayerSeasonStats.value() ?? []);
  protected readonly isLoading = computed(() => this.rxPlayerSeasonStats.isLoading());

  private readonly d11TeamApiService = inject(D11TeamApiService);
  private readonly routerService = inject(RouterService);

  protected navigateToPlayer(stat: PlayerSeasonStat): void {
    this.routerService.navigateToPlayer(stat.player.id, stat.season.id);
  }
}
