import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { PlayerSeasonStat, PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { PlayerSeasonStatSort } from '@app/core/api/model/player-season-stat-sort.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { Card } from 'primeng/card';
import { Drawer } from 'primeng/drawer';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { TeamImgComponent } from '@app/shared/img';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

@Component({
  selector: 'app-player-season-stats-card',
  imports: [
    Card,
    Drawer,
    FormsModule,
    Paginator,
    SelectButton,
    TeamImgComponent,
    IconButtonComponent,
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

  protected readonly sortOptions = [
    { label: 'Ranking', value: PlayerSeasonStatSort.RANKING },
    { label: 'Goals', value: PlayerSeasonStatSort.GOALS },
    { label: 'Rating', value: PlayerSeasonStatSort.RATING },
    { label: 'Form', value: PlayerSeasonStatSort.FORM },
  ];

  protected readonly positionOptions = [
    { label: 'Keeper', value: 'GOALKEEPER', ids: [1] },
    { label: 'Defender', value: 'DEFENDER', ids: [2, 3] },
    { label: 'Midfielder', value: 'MIDFIELDER', ids: [4] },
    { label: 'Forward', value: 'FORWARD', ids: [5] },
  ];

  protected currentPage = signal(0);
  protected drawerVisible = signal(false);
  protected dummy = signal<boolean | undefined>(undefined);
  protected positions = signal<string[]>(this.positionOptions.map((option) => option.value));
  protected sort = signal<PlayerSeasonStatSort>(PlayerSeasonStatSort.RANKING);

  protected positionIds = computed(() => {
    const selected = new Set(this.positions());
    return this.positionOptions.filter((o) => selected.has(o.value)).flatMap((o) => o.ids);
  });

  protected rxPlayerSeasonStats = rxResource<
    PlayerSeasonStatPage,
    {
      seasonId: number;
      page: number;
      dummy: boolean | undefined;
      positionIds: number[];
      sort: PlayerSeasonStatSort;
    }
  >({
    params: () => ({
      seasonId: this.seasonId(),
      page: this.currentPage(),
      dummy: this.dummy(),
      positionIds: this.positionIds(),
      sort: this.sort(),
    }),
    stream: ({ params }) => {
      if (params.positionIds.length === 0) {
        return of({ page: 0, totalPages: 0, totalElements: 0, elements: [] });
      }
      return this.playerSeasonStatApiService.getPlayerSeasonStatsBySeasonId(
        params.seasonId,
        params.page,
        params.positionIds,
        params.dummy,
        params.sort,
      );
    },
  });

  protected rankingColWidth = signal('2rem');

  protected model = computed(() => {
    const result = this.rxPlayerSeasonStats.value();
    const isLoading = this.rxPlayerSeasonStats.isLoading();
    const page = result?.page ?? 0;
    const totalPages = result?.totalPages ?? 0;
    return {
      playerSeasonStats: result?.elements ?? ([] as PlayerSeasonStat[]),
      page,
      totalElements: result?.totalElements ?? 0,
      totalPages,
      isLastPage: !isLoading && totalPages > 0 && page >= totalPages - 1,
    };
  });

  private playerSeasonStatApiService = inject(PlayerSeasonStatApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxPlayerSeasonStats.isLoading);

    effect(() => {
      const stats = this.model().playerSeasonStats;
      if (stats.length > 0) {
        const digits = String(stats[stats.length - 1].ranking).length;
        // Make ranking column wider depending on how many digits will be shown
        const widths: Record<number, string> = { 1: '2rem', 2: '2rem', 3: '3rem', 4: '4rem' };
        this.rankingColWidth.set(widths[digits] ?? '4rem');
      }
    });

    effect(() => {
      this.seasonId();
      this.currentPage.set(0);
      this.dummy.set(undefined);
      this.positions.set(this.positionOptions.map((option) => option.value));
      this.sort.set(PlayerSeasonStatSort.RANKING);
    });
  }

  protected onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ?? 0);
  }
}
