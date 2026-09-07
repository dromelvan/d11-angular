import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/drawer/season-picker-button/season-picker-button.component';
import { SeasonScrollPickerComponent } from '@app/feature/scroll-picker/season-scroll-picker/season-scroll-picker.component';
import { D11TeamSeasonStatsSectionComponent } from '@app/feature/section/d11-team-season-stats-section/d11-team-season-stats-section.component';
import { TeamSeasonStatsSectionComponent } from '@app/feature/section/team-season-stats-section/team-season-stats-section.component';

@Component({
  selector: 'app-tables-page',
  imports: [
    SeasonScrollPickerComponent,
    SeasonPickerButtonComponent,
    TeamSeasonStatsSectionComponent,
    D11TeamSeasonStatsSectionComponent,
  ],
  templateUrl: './tables-page.component.html',
})
export class TablesPageComponent {
  readonly seasonId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  private rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  private selectedSeason = computed(() => {
    const id = this.seasonId();
    return (this.rxSeasons.value() ?? []).find((season) => season.id === id);
  });

  private readonly currentService = inject(CurrentService);
  private readonly routerService = inject(RouterService);
  private readonly pageContextService = inject(PageContextService);
  private readonly seasonApiService = inject(SeasonApiService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('League Tables'),
      subtitle: computed(() => {
        const name = this.selectedSeason()?.name;
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
    this.routerService.navigateToSeason(season.id);
  }
}
