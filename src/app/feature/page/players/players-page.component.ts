import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { PlayerSeasonStatsCardComponent } from './player-season-stats-card/player-season-stats-card.component';

@Component({
  selector: 'app-players-page',
  imports: [IconButtonComponent, PlayerSeasonStatsCardComponent],
  templateUrl: './players-page.component.html',
})
export class PlayersPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected rxAllSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  protected sortedSeasons = computed(() =>
    [...(this.rxAllSeasons.value() ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
  );

  protected currentSeason = computed(() => {
    const id = this.seasonId();
    const seasons = this.sortedSeasons();
    if (seasons.length === 0) return undefined;
    return id != null ? seasons.find((s) => s.id === id) : seasons[0];
  });

  protected currentIndex = computed(() => {
    const season = this.currentSeason();
    if (!season) return -1;
    return this.sortedSeasons().findIndex((s) => s.id === season.id);
  });

  protected hasPrevious = computed(
    () => this.currentIndex() >= 0 && this.currentIndex() < this.sortedSeasons().length - 1,
  );

  protected hasNext = computed(() => this.currentIndex() > 0);

  private seasonApiService = inject(SeasonApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxAllSeasons.isLoading);
  }

  protected navigateToPrevious(): void {
    const prev = this.sortedSeasons()[this.currentIndex() + 1];
    if (prev) this.routerService.navigateToPlayers(prev.id);
  }

  protected navigateToNext(): void {
    const next = this.sortedSeasons()[this.currentIndex() - 1];
    if (next) this.routerService.navigateToPlayers(next.id);
  }
}
