import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeasonApiService, SeasonWinners, Status } from '@app/core/api';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { SeasonWinnersSectionComponent } from '@app/feature/section/season-winners-section/season-winners-section.component';

@Component({
  selector: 'app-history-page',
  imports: [SeasonWinnersSectionComponent],
  templateUrl: './history-page.component.html',
})
export class HistoryPageComponent {
  protected readonly seasonWinners = computed(() =>
    (this.rxSeasonWinners.value() ?? []).filter(
      (winners) => winners.season.status !== Status.PENDING,
    ),
  );

  protected readonly isLoading = computed(() => this.rxSeasonWinners.isLoading());

  private rxSeasonWinners = rxResource<SeasonWinners[], void>({
    stream: () => this.seasonApiService.getSeasonWinners(),
  });

  private readonly seasonApiService = inject(SeasonApiService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.setContext({
      title: signal('Season History'),
      subtitle: computed(() => {
        const winners = this.seasonWinners();
        if (winners.length === 0) return undefined;
        const years = winners.map((winner) => winner.season.name.split('-').map(Number));
        const startYear = Math.min(...years.map(([start]) => start));
        const endYear = Math.max(...years.map(([, end]) => end));
        return `${startYear}-${endYear}`;
      }),
      backgroundColor: signal(''),
    });
  }
}
