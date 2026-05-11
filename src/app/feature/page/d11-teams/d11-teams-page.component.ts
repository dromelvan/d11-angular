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
import { D11TeamSeasonStat, SeasonBase } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { Position } from '@app/core/api/model/position.model';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerComponent } from '@app/shared/season-picker/season-picker.component';
import { of } from 'rxjs';
import { D11TeamSquadCardComponent } from '@app/feature/card/d11-team-squad-card/d11-team-squad-card.component';

@Component({
  selector: 'app-d11-teams-page',
  imports: [SeasonPickerComponent, D11TeamSquadCardComponent],
  templateUrl: './d11-teams-page.component.html',
})
export class D11TeamsPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected season = signal<SeasonBase | undefined>(undefined);
  protected selectedSeasonId = computed(() => this.seasonId() ?? this.season()?.id);

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.selectedSeasonId(),
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

  private readonly routerService = inject(RouterService);
  private readonly loadingService = inject(LoadingService);
  private readonly d11TeamSeasonStatApiService = inject(D11TeamSeasonStatApiService);
  private readonly positionApiService = inject(PositionApiService);

  constructor() {
    this.loadingService.register(
      inject(DestroyRef),
      this.rxD11TeamSeasonStats.isLoading,
      this.rxPositions.isLoading,
    );
  }

  protected onSeasonSelected(season: SeasonBase): void {
    const shouldNavigate = this.seasonId() !== undefined || this.season() !== undefined;
    this.season.set(season);
    if (shouldNavigate) this.routerService.navigateToD11Teams(season.id);
  }
}
