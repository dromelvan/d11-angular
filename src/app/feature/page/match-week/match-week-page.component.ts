import { Component, computed, DestroyRef, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchBase, MatchWeek } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { MatchWeekMatchesCardComponent } from './match-week-matches-card/match-week-matches-card.component';

@Component({
  selector: 'app-match-week',
  imports: [IconButtonComponent, MatchWeekMatchesCardComponent],
  templateUrl: './match-week-page.component.html',
})
export class MatchWeekPageComponent {
  readonly matchWeekId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v != null && v !== '' ? numberAttribute(v as string) : undefined),
  });

  protected rxMatchWeek = rxResource<MatchWeek, number | null>({
    params: () => this.matchWeekId() ?? null,
    stream: ({ params: id }) =>
      id !== null
        ? this.matchWeekApiService.getById(id)
        : this.matchWeekApiService.getCurrentMatchWeek(),
  });

  protected rxMatches = rxResource<MatchBase[], number | undefined>({
    params: () => this.rxMatchWeek.value()?.id,
    stream: ({ params }) => this.matchApiService.getMatchesByMatchWeekId(params!),
  });

  protected model = computed(() => ({
    matchWeek: this.rxMatchWeek.value(),
    matches: this.rxMatches.value() ?? [],
  }));

  protected isLoading = computed(() => this.rxMatchWeek.isLoading() || this.rxMatches.isLoading());

  protected hasPrevious = computed(() => (this.rxMatchWeek.value()?.matchWeekNumber ?? 1) > 1);
  protected hasNext = computed(() => (this.rxMatchWeek.value()?.matchWeekNumber ?? 38) < 38);

  private matchWeekApiService = inject(MatchWeekApiService);
  private matchApiService = inject(MatchApiService);
  private routerService = inject(RouterService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected navigateToPrevious(): void {
    const id = this.matchWeekId() ?? this.rxMatchWeek.value()?.id;
    if (id) this.routerService.navigateToMatchWeek(id - 1);
  }

  protected navigateToNext(): void {
    const id = this.matchWeekId() ?? this.rxMatchWeek.value()?.id;
    if (id) this.routerService.navigateToMatchWeek(id + 1);
  }
}
