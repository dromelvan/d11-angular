import { Component, computed, effect, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  PlayerSeasonStat,
  PlayerSeasonStatPage,
  PlayerSeasonStatSort,
  POSITION_IDS,
} from '@app/core/api';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { RouterService } from '@app/core/router/router.service';
import { PlayerSeasonStatsSearchParams } from '@app/shared/model';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ProgressSpinner } from 'primeng/progressspinner';
import { D11TeamImgComponent, TeamImgComponent } from '@app/shared/img';
import { FeePipe } from '@app/shared/pipes/fee.pipe';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-player-season-stats-accordion',
  templateUrl: './player-season-stats-accordion.component.html',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    TeamImgComponent,
    D11TeamImgComponent,
    FeePipe,
    RatingPipe,
    FormMatchPointsComponent,
    SvgIconComponent,
    ProgressSpinner,
  ],
  host: { class: 'flex flex-col grow' },
})
export class PlayerSeasonStatsAccordionComponent {
  readonly searchParams = input.required<PlayerSeasonStatsSearchParams>();
  readonly page = input.required<number>();

  readonly totalElementsCount = output<number>();

  protected readonly PlayerSeasonStatSort = PlayerSeasonStatSort;

  protected readonly rxPlayerSeasonStats = rxResource<
    PlayerSeasonStatPage,
    {
      seasonId: number;
      positionIds: number[];
      dummy: boolean | undefined;
      sort: PlayerSeasonStatSort;
      page: number;
    }
  >({
    params: () => {
      const { seasonId, positionIds: basePositionIds, dummy, sort } = this.searchParams();
      const positionIds = basePositionIds.includes(POSITION_IDS.DEFENDER)
        ? [...basePositionIds, POSITION_IDS.FULL_BACK]
        : basePositionIds;
      return {
        seasonId,
        positionIds,
        dummy,
        sort: sort ?? PlayerSeasonStatSort.RANKING,
        page: this.page(),
      };
    },
    stream: ({ params }) =>
      this.playerSeasonStatApiService.getPlayerSeasonStatsBySeasonId(
        params.seasonId,
        params.page,
        params.positionIds,
        params.dummy,
        params.sort,
      ),
  });

  protected readonly playerSeasonStats = computed(
    () => this.rxPlayerSeasonStats.value()?.elements ?? [],
  );
  protected readonly isLoading = computed(() => this.rxPlayerSeasonStats.isLoading());

  private readonly routerService = inject(RouterService);
  private readonly playerSeasonStatApiService = inject(PlayerSeasonStatApiService);

  constructor() {
    effect(() => {
      const resultPage = this.rxPlayerSeasonStats.value();
      if (resultPage !== undefined) {
        this.totalElementsCount.emit(resultPage.totalElements);
      }
    });
  }

  protected navigateToPlayer(stat: PlayerSeasonStat): void {
    this.routerService.navigateToPlayer(stat.player.id, stat.season.id);
  }
}
