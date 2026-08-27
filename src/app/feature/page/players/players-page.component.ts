import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { Season } from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/drawer/season-picker-button/season-picker-button.component';
import { SeasonScrollPickerComponent } from '@app/feature/component/season-scroll-picker/season-scroll-picker.component';
import { PlayerSeasonStatsSectionComponent } from '@app/feature/section/player-season-stats-section/player-season-stats-section.component';

@Component({
  selector: 'app-players-page',
  imports: [
    SeasonScrollPickerComponent,
    SeasonPickerButtonComponent,
    PlayerSeasonStatsSectionComponent,
  ],
  templateUrl: './players-page.component.html',
})
export class PlayersPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected season = signal<Season | undefined>(undefined);
  protected selectedSeasonId = computed(() => this.seasonId() ?? this.season()?.id);

  private readonly currentService = inject(CurrentService);
  private readonly routerService = inject(RouterService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.pageContextService.register(destroyRef, {
      title: signal('Player Stats'),
      subtitle: computed(() => {
        const name = this.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }

  protected onLiveClick(): void {
    const currentSeasonId = this.currentService.season()?.id;
    if (currentSeasonId) this.routerService.navigateToPlayers(currentSeasonId);
  }

  protected onSeasonSelected(season: Season): void {
    const shouldNavigate = this.seasonId() !== undefined || this.season() !== undefined;
    this.season.set(season);
    if (shouldNavigate) this.routerService.navigateToPlayers(season.id);
  }
}
