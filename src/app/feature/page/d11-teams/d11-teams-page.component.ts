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
import { D11TeamSeasonStat, Season } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { Position } from '@app/core/api/model/position.model';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/drawer/season-picker-button/season-picker-button.component';
import { SeasonScrollPickerComponent } from '@app/feature/scroll-picker/season-scroll-picker/season-scroll-picker.component';
import { D11TeamPlayerSeasonStatsSectionComponent } from '@app/feature/section/d11-team-player-season-stats-section/d11-team-player-season-stats-section.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-d11-teams-page',
  imports: [
    SeasonScrollPickerComponent,
    SeasonPickerButtonComponent,
    D11TeamPlayerSeasonStatsSectionComponent,
  ],
  templateUrl: './d11-teams-page.component.html',
})
export class D11TeamsPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.seasonId(),
    stream: ({ params: seasonId }) =>
      seasonId != null
        ? this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(seasonId)
        : of([]),
  });

  protected rxPositions = rxResource<Position[], void>({
    stream: () => this.positionApiService.getPositions(),
  });

  protected model = computed(() => ({
    d11TeamSeasonStats: [...(this.rxD11TeamSeasonStats.value() ?? [])].sort((a, b) =>
      a.d11Team.name.localeCompare(b.d11Team.name),
    ),
    positions: [...(this.rxPositions.value() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  private readonly rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  private readonly selectedSeason = computed(() => {
    const id = this.seasonId();
    return (this.rxSeasons.value() ?? []).find((season) => season.id === id);
  });

  private readonly currentService = inject(CurrentService);
  private readonly routerService = inject(RouterService);
  private readonly pageContextService = inject(PageContextService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private readonly positionApiService = inject(PositionApiService);
  private readonly seasonApiService = inject(SeasonApiService);

  constructor() {
    this.pageContextService.register(inject(DestroyRef), {
      title: signal('D11 Teams'),
      subtitle: computed(() => {
        const name = this.selectedSeason()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }

  protected onLiveClick(): void {
    const currentSeasonId = this.currentService.season()?.id;
    if (currentSeasonId) this.routerService.navigateToD11Teams(currentSeasonId);
  }

  protected onSeasonSelected(season: Season): void {
    this.routerService.navigateToD11Teams(season.id);
  }
}
