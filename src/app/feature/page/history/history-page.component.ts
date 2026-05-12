import { Component, computed, DestroyRef, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeasonApiService, SeasonWinners, Status } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { SeasonHistoryComponent } from '@app/feature/component/season-history/season-history.component';

@Component({
  selector: 'app-history-page',
  imports: [SeasonHistoryComponent],
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

  private seasonApiService = inject(SeasonApiService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }
}
