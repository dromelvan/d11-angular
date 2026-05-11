import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat, SeasonBase, TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerComponent } from '@app/shared/season-picker/season-picker.component';
import { D11TeamSeasonStatsCardComponent } from '@app/feature/page/season/d11-team-season-stats-card/d11-team-season-stats-card.component';
import { TeamSeasonStatsCardComponent } from '@app/feature/page/season/team-season-stats-card/team-season-stats-card.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-season-page',
  imports: [SeasonPickerComponent, TeamSeasonStatsCardComponent, D11TeamSeasonStatsCardComponent],
  templateUrl: './season-page.component.html',
})
export class SeasonPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected season = signal<SeasonBase | undefined>(undefined);
  protected selectedSeasonId = computed(() => this.seasonId() ?? this.season()?.id);

  protected rxTeamSeasonStats = rxResource<TeamSeasonStat[], number | undefined>({
    params: () => this.selectedSeasonId(),
    stream: ({ params }) =>
      params != null ? this.teamSeasonStatApiService.getTeamSeasonStatsBySeasonId(params) : of([]),
  });

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.selectedSeasonId(),
    stream: ({ params }) =>
      params != null
        ? this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(params)
        : of([]),
  });

  protected model = computed(() => ({
    teamSeasonStats: this.rxTeamSeasonStats.value() ?? [],
    d11TeamSeasonStats: this.rxD11TeamSeasonStats.value() ?? [],
  }));

  protected isLoading = computed(
    () => this.rxTeamSeasonStats.isLoading() || this.rxD11TeamSeasonStats.isLoading(),
  );

  private readonly routerService = inject(RouterService);
  private readonly loadingService = inject(LoadingService);
  private readonly teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected onSeasonSelected(season: SeasonBase): void {
    const shouldNavigate = this.seasonId() !== undefined || this.season() !== undefined;
    this.season.set(season);
    if (shouldNavigate) this.routerService.navigateToSeason(season.id);
  }
}
