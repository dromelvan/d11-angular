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
import { D11TeamSeasonStat, Season, TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/component/season-picker-button/season-picker-button.component';
import { SeasonScrollPickerComponent } from '@app/feature/component/season-scroll-picker/season-scroll-picker.component';
import { TeamSeasonStatsSectionComponent } from '@app/feature/section/team-season-stats-section/team-season-stats-section.component';
import { D11TeamSeasonStatsSectionComponent } from '@app/feature/section/d11-team-season-stats-section/d11-team-season-stats-section.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-season-page',
  imports: [
    SeasonScrollPickerComponent,
    SeasonPickerButtonComponent,
    TeamSeasonStatsSectionComponent,
    D11TeamSeasonStatsSectionComponent,
  ],
  templateUrl: './season-page.component.html',
})
export class SeasonPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected selectedSeasonId = computed(() => this.seasonId() ?? this.localSeasonId());

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

  private localSeasonId = signal<number | undefined>(undefined);

  private rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  private selectedSeasonName = computed(() => {
    const id = this.selectedSeasonId();
    return (this.rxSeasons.value() ?? []).find((season) => season.id === id)?.name;
  });

  private readonly currentService = inject(CurrentService);
  private readonly routerService = inject(RouterService);
  private readonly loadingService = inject(LoadingService);
  private readonly pageContextService = inject(PageContextService);
  private readonly seasonApiService = inject(SeasonApiService);
  private readonly teamSeasonStatApiService = inject(TeamSeasonStatApiService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.loadingService.register(destroyRef, this.isLoading);
    this.pageContextService.register(destroyRef, {
      title: signal('League Tables'),
      subtitle: computed(() => {
        const name = this.selectedSeasonName();
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }

  protected onLiveClick(): void {
    const currentSeasonId = this.currentService.season()?.id;
    if (currentSeasonId) this.routerService.navigateToSeason(currentSeasonId);
  }

  protected onSeasonSelected(season: Season): void {
    this.localSeasonId.set(season.id);
    this.routerService.navigateToSeason(season.id);
  }
}
