import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { SeasonBase } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerComponent } from '@app/shared/season-picker/season-picker.component';
import { PlayersSeasonStatsCardComponent } from '@app/feature/card/players-season-stats-card/players-season-stats-card.component';

@Component({
  selector: 'app-players-page',
  imports: [SeasonPickerComponent, PlayersSeasonStatsCardComponent],
  templateUrl: './players-page.component.html',
})
export class PlayersPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected season = signal<SeasonBase | undefined>(undefined);
  protected selectedSeasonId = computed(() => this.seasonId() ?? this.season()?.id);

  private readonly routerService = inject(RouterService);

  protected onSeasonSelected(season: SeasonBase): void {
    const shouldNavigate = this.seasonId() !== undefined || this.season() !== undefined;
    this.season.set(season);
    if (shouldNavigate) this.routerService.navigateToPlayers(season.id);
  }
}
