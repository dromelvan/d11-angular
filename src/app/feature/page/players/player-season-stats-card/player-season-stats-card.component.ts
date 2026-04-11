import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { PlayerSeasonStat, PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { PlayerSeasonStatSort } from '@app/core/api/model/player-season-stat-sort.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { Card } from 'primeng/card';
import { Drawer } from 'primeng/drawer';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { TeamImgComponent } from '@app/shared/img';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';

@Component({
  selector: 'app-player-season-stats-card',
  imports: [
    NgClass,
    Card,
    Drawer,
    FormsModule,
    Paginator,
    SelectButton,
    TeamImgComponent,
    IconButtonComponent,
    RatingPipe,
  ],
  templateUrl: './player-season-stats-card.component.html',
})
export class PlayerSeasonStatsCardComponent {
  seasonId = input.required<number>();

  protected readonly availabilityOptions = [
    { label: 'All', value: undefined },
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false },
  ];

  protected readonly positionIdOptions = [
    { label: 'Keeper', value: 1 },
    { label: 'Defender', value: 3 },
    { label: 'Midfielder', value: 4 },
    { label: 'Forward', value: 5 },
  ];

  protected readonly sortOptions = [
    { label: 'Ranking', value: PlayerSeasonStatSort.RANKING },
    { label: 'Goals', value: PlayerSeasonStatSort.GOALS },
    { label: 'Rating', value: PlayerSeasonStatSort.RATING },
    { label: 'Form', value: PlayerSeasonStatSort.FORM },
  ];

  protected page = signal(0);
  protected dummy = signal<boolean | undefined>(undefined);
  protected positionIds = signal<number[]>(this.positionIdOptions.map((option) => option.value));
  protected sort = signal<PlayerSeasonStatSort | null>(PlayerSeasonStatSort.RANKING);
  protected currentSeasonId = signal<number | undefined>(undefined);

  protected drawerVisible = signal(false);

  protected rxPlayerSeasonStats = rxResource<
    PlayerSeasonStatPage,
    {
      seasonId: number | undefined;
      page: number;
      dummy: boolean | undefined;
      positionIds: number[];
      sort: PlayerSeasonStatSort;
    }
  >({
    params: () => ({
      seasonId: this.currentSeasonId(),
      page: this.page(),
      dummy: this.dummy() ?? undefined,
      positionIds: this.positionIds(),
      sort: this.sort() ?? PlayerSeasonStatSort.RANKING,
    }),
    stream: ({ params }) => {
      if (params.seasonId === undefined || params.positionIds.length === 0) {
        return of({ page: 0, totalPages: 0, totalElements: 0, elements: [] });
      }
      // Full back position is deprecated so there won't be an option for it but include it
      // if defender option is selected
      const positionIds = params.positionIds.includes(3)
        ? [...params.positionIds, 2]
        : params.positionIds;
      return this.playerSeasonStatApiService.getPlayerSeasonStatsBySeasonId(
        params.seasonId,
        params.page,
        positionIds,
        params.dummy,
        params.sort,
      );
    },
  });

  protected model = computed(() => {
    const result = this.rxPlayerSeasonStats.value();
    const page = result?.page ?? 0;
    const totalPages = result?.totalPages ?? 0;
    return {
      playerSeasonStats: result?.elements ?? ([] as PlayerSeasonStat[]),
      page,
      totalElements: result?.totalElements ?? 0,
      totalPages,
      sort: this.sort() ?? PlayerSeasonStatSort.RANKING,
      maxRanking: result?.elements?.length ? Math.max(...result.elements.map((p) => p.ranking)) : 0,
    };
  });

  private playerSeasonStatApiService = inject(PlayerSeasonStatApiService);
  private loadingService = inject(LoadingService);
  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxPlayerSeasonStats.isLoading);

    effect(() => {
      this.currentSeasonId.set(this.seasonId());
      this.page.set(0);
      this.dummy.set(undefined);
      this.positionIds.set(this.positionIdOptions.map((option) => option.value));
      this.sort.set(PlayerSeasonStatSort.RANKING);
    });

    effect(() => {
      this.dummy();
      this.positionIds();
      this.sort();
      this.page.set(0);
    });

    effect(() => {
      this.dummy();
      this.sort();
      this.drawerVisible.set(false);
    });
  }

  protected openDialog(playerSeasonStat: PlayerSeasonStat): void {
    this.dynamicDialogService.openPlayerSeasonStat(
      playerSeasonStat,
      this.model().playerSeasonStats,
      {
        label: 'Player profile',
        icon: 'player',
        onClick: (current) =>
          this.routerService.navigateToPlayer((current as PlayerSeasonStat).player.id),
      },
    );
  }

  protected onPageChange(event: PaginatorState): void {
    this.page.set(event.page ?? 0);
  }
}
