import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat, Season } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { Position } from '@app/core/api/model/position.model';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { of } from 'rxjs';
import { D11TeamSquadCardComponent } from './d11-team-squad-card/d11-team-squad-card.component';

@Component({
  selector: 'app-d11-teams-page',
  imports: [IconButtonComponent, D11TeamSquadCardComponent],
  templateUrl: './d11-teams-page.component.html',
})
export class D11TeamsPageComponent {
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

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.currentSeason()?.id,
    stream: ({ params: seasonId }) =>
      seasonId != null
        ? this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(seasonId)
        : of([]),
  });

  protected rxPositions = rxResource<Position[], void>({
    stream: () => this.positionApiService.getPositions(),
  });

  protected model = computed(() => ({
    season: this.currentSeason(),
    d11TeamSeasonStats: [...(this.rxD11TeamSeasonStats.value() ?? [])].sort((a, b) =>
      a.d11Team.name.localeCompare(b.d11Team.name),
    ),
    positions: [...(this.rxPositions.value() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  private seasonApiService = inject(SeasonApiService);
  private d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private positionApiService = inject(PositionApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxAllSeasons.isLoading);
    this.loadingService.register(inject(DestroyRef), this.rxD11TeamSeasonStats.isLoading);
    this.loadingService.register(inject(DestroyRef), this.rxPositions.isLoading);
  }

  protected navigateToPrevious(): void {
    const previous = this.sortedSeasons()[this.currentIndex() + 1];
    if (previous) {
      this.routerService.navigateToD11Teams(previous.id);
    }
  }

  protected navigateToNext(): void {
    const next = this.sortedSeasons()[this.currentIndex() - 1];
    if (next) {
      this.routerService.navigateToD11Teams(next.id);
    }
  }
}
