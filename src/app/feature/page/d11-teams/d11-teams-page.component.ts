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
import { D11TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { Position } from '@app/core/api/model/position.model';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonNavigatorService } from '@app/shared/season-navigator.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { of } from 'rxjs';
import { D11TeamSquadCardComponent } from './d11-team-squad-card/d11-team-squad-card.component';

@Component({
  selector: 'app-d11-teams-page',
  imports: [IconButtonComponent, D11TeamSquadCardComponent],
  templateUrl: './d11-teams-page.component.html',
  providers: [SeasonNavigatorService],
})
export class D11TeamsPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected readonly nav = inject(SeasonNavigatorService);

  protected rxD11TeamSeasonStats = rxResource<D11TeamSeasonStat[], number | undefined>({
    params: () => this.nav.currentSeason()?.id,
    stream: ({ params: seasonId }) =>
      seasonId != null
        ? this.d11TeamSeasonStatApiService.getD11TeamSeasonStatsBySeasonId(seasonId)
        : of([]),
  });

  protected rxPositions = rxResource<Position[], void>({
    stream: () => this.positionApiService.getPositions(),
  });

  protected model = computed(() => ({
    season: this.nav.currentSeason(),
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
    effect(() => this.nav.setSeasonId(this.seasonId()));
    this.loadingService.register(
      inject(DestroyRef),
      this.nav.rxAllSeasons.isLoading,
      this.rxD11TeamSeasonStats.isLoading,
      this.rxPositions.isLoading,
    );
  }

  protected navigateToPrevious(): void {
    const previous = this.nav.sortedSeasons()[this.nav.currentIndex() + 1];
    if (previous) this.routerService.navigateToD11Teams(previous.id);
  }

  protected navigateToNext(): void {
    const next = this.nav.sortedSeasons()[this.nav.currentIndex() - 1];
    if (next) this.routerService.navigateToD11Teams(next.id);
  }
}
