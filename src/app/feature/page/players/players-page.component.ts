import { Component, DestroyRef, effect, inject, input, numberAttribute } from '@angular/core';
import { RouterService } from '@app/core/router/router.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { SeasonNavigatorService } from '@app/shared/season-navigator.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { PlayerSeasonStatsCardComponent } from './player-season-stats-card/player-season-stats-card.component';

@Component({
  selector: 'app-players-page',
  imports: [IconButtonComponent, PlayerSeasonStatsCardComponent],
  templateUrl: './players-page.component.html',
  providers: [SeasonNavigatorService],
})
export class PlayersPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected readonly nav = inject(SeasonNavigatorService);

  private readonly routerService = inject(RouterService);
  private readonly loadingService = inject(LoadingService);

  constructor() {
    effect(() => this.nav.setSeasonId(this.seasonId()));
    this.loadingService.register(inject(DestroyRef), this.nav.rxAllSeasons.isLoading);
  }

  protected navigateToPrevious(): void {
    const prev = this.nav.sortedSeasons()[this.nav.currentIndex() + 1];
    if (prev) this.routerService.navigateToPlayers(prev.id);
  }

  protected navigateToNext(): void {
    const next = this.nav.sortedSeasons()[this.nav.currentIndex() - 1];
    if (next) this.routerService.navigateToPlayers(next.id);
  }
}
