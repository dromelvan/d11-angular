import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PlayerSeasonStat, PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { Card } from 'primeng/card';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { TeamImgComponent } from '@app/shared/img';

const POSITION_IDS = [1, 2, 3, 4, 5];

@Component({
  selector: 'app-player-season-stats-card',
  imports: [Card, Paginator, TeamImgComponent],
  templateUrl: './player-season-stats-card.component.html',
})
export class PlayerSeasonStatsCardComponent {
  seasonId = input.required<number>();

  protected currentPage = signal(0);

  protected rxPlayerSeasonStats = rxResource<
    PlayerSeasonStatPage,
    { seasonId: number; page: number }
  >({
    params: () => ({ seasonId: this.seasonId(), page: this.currentPage() }),
    stream: ({ params }) =>
      this.playerSeasonStatApiService.getPlayerSeasonStatsBySeasonId(
        params.seasonId,
        params.page,
        POSITION_IDS,
      ),
  });

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

  protected rankingColWidth = signal('2rem');

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
    });
  }

  protected onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ?? 0);
  }
}
