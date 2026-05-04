import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat, TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonNavigatorService } from '@app/shared/season-navigator.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { D11TeamSeasonStatsCardComponent } from '@app/feature/page/season/d11-team-season-stats-card/d11-team-season-stats-card.component';
import { TeamSeasonStatsCardComponent } from '@app/feature/page/season/team-season-stats-card/team-season-stats-card.component';

@Component({
  selector: 'app-season-page',
  imports: [IconButtonComponent, TeamSeasonStatsCardComponent, D11TeamSeasonStatsCardComponent],
  templateUrl: './season-page.component.html',
  providers: [SeasonNavigatorService],
})
export class SeasonPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected readonly nav = inject(SeasonNavigatorService);

  protected rxTeamSeasonStats = rxResource<TeamSeasonStat[], number | undefined>({
    params: () => this.nav.currentSeason()?.id,
    stream: ({ params }) => this.teamSeasonStatApiService.getTeamSeasonStatsBySeasonId(params!),
  });

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.nav.currentSeason()?.id,
    stream: ({ params }) =>
      this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(params!),
  });

  protected model = computed(() => ({
    season: this.nav.currentSeason(),
    teamSeasonStats: this.rxTeamSeasonStats.value() ?? [],
    d11TeamSeasonStats: this.rxD11TeamSeasonStats.value() ?? [],
  }));

  protected isLoading = computed(
    () =>
      this.nav.rxAllSeasons.isLoading() ||
      this.rxTeamSeasonStats.isLoading() ||
      this.rxD11TeamSeasonStats.isLoading(),
  );

  private readonly routerService = inject(RouterService);
  private readonly loadingService = inject(LoadingService);
  private readonly teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);

  constructor() {
    effect(() => this.nav.setSeasonId(this.seasonId()));
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected navigateToPrevious(): void {
    const prev = this.nav.sortedSeasons()[this.nav.currentIndex() + 1];
    if (prev) this.routerService.navigateToSeason(prev.id);
  }

  protected navigateToNext(): void {
    const next = this.nav.sortedSeasons()[this.nav.currentIndex() - 1];
    if (next) this.routerService.navigateToSeason(next.id);
  }
}
