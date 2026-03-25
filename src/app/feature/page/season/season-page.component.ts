import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Season, TeamSeasonStat } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { TeamSeasonStatsCardComponent } from '@app/feature/page/season/team-season-stats-card/team-season-stats-card.component';

@Component({
  selector: 'app-table',
  imports: [IconButtonComponent, TeamSeasonStatsCardComponent],
  templateUrl: './season-page.component.html',
})
export class SeasonPageComponent {
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

  protected rxTeamSeasonStats = rxResource<TeamSeasonStat[], number | undefined>({
    params: () => this.currentSeason()?.id,
    stream: ({ params }) => this.teamSeasonStatApiService.getTeamSeasonStatsBySeasonId(params!),
  });

  protected model = computed(() => ({
    season: this.currentSeason(),
    teamSeasonStats: this.rxTeamSeasonStats.value() ?? [],
  }));

  protected isLoading = computed(
    () => this.rxAllSeasons.isLoading() || this.rxTeamSeasonStats.isLoading(),
  );

  private seasonApiService = inject(SeasonApiService);
  private teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected navigateToPrevious(): void {
    const prev = this.sortedSeasons()[this.currentIndex() + 1];
    if (prev) this.routerService.navigateToSeason(prev.id);
  }

  protected navigateToNext(): void {
    const next = this.sortedSeasons()[this.currentIndex() - 1];
    if (next) this.routerService.navigateToSeason(next.id);
  }
}
