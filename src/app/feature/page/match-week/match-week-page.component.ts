import { NgClass } from '@angular/common';
import { SafeDatePipe } from '@app/shared/pipes/safe-date.pipe';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchWeek, SeasonBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerComponent } from '@app/shared/season-picker/season-picker.component';
import { ScrollPickerComponent } from '@app/shared/scroll-picker/scroll-picker.component';
import { ScrollPickerItem } from '@app/shared/scroll-picker/scroll-picker-item.model';
import { IconComponent } from '@app/shared/icon/icon.component';
import { MatchWeekMatchesCardComponent } from './match-week-matches-card/match-week-matches-card.component';
import { MatchWeekPickerDrawerComponent } from './match-week-picker-drawer/match-week-picker-drawer.component';

@Component({
  selector: 'app-match-week',
  imports: [
    SeasonPickerComponent,
    ScrollPickerComponent,
    MatchWeekMatchesCardComponent,
    NgClass,
    IconComponent,
    MatchWeekPickerDrawerComponent,
  ],
  templateUrl: './match-week-page.component.html',
})
export class MatchWeekPageComponent {
  readonly matchWeekId = input.required<number, unknown>({ transform: numberAttribute });

  protected active = signal(false);

  protected model = computed(() => ({
    matchWeek: this.matchWeek(),
    scrollItems: this.scrollItems(),
    matchWeeks: this.rxMatchWeeks.value() ?? [],
    currentMatchWeekId: this.rxCurrentMatchWeek.value()?.id,
    selectedId: this.matchWeekId(),
  }));

  private rxMatchWeek = rxResource<MatchWeek, number>({
    params: () => this.matchWeekId(),
    stream: ({ params: id }) => this.matchWeekApiService.getById(id),
  });

  private rxCurrentMatchWeek = rxResource<MatchWeek, void>({
    stream: () => this.matchWeekApiService.getCurrentMatchWeek(),
  });

  private rxMatchWeeks = rxResource<MatchWeek[], number | undefined>({
    params: () => this.selectedSeasonId() ?? this.matchWeek()?.season.id,
    stream: ({ params }) => this.matchWeekApiService.getMatchWeeksBySeasonId(params!),
  });

  private isLoading = computed(
    () =>
      this.rxMatchWeek.isLoading() ||
      this.rxCurrentMatchWeek.isLoading() ||
      this.rxMatchWeeks.isLoading(),
  );

  private readonly matchWeek = signal<MatchWeek | undefined>(undefined);
  private readonly selectedSeasonId = signal<number | undefined>(undefined);

  private readonly safeDatePipe = new SafeDatePipe();
  private scrollItems = computed<ScrollPickerItem[]>(() =>
    (this.rxMatchWeeks.value() ?? []).map((matchWeek) => ({
      id: matchWeek.id,
      label: `W ${matchWeek.matchWeekNumber}`,
      sublabel: this.safeDatePipe.transform(matchWeek.date, 'd MMM').toUpperCase(),
    })),
  );

  private matchWeekPickerDrawer = viewChild.required(MatchWeekPickerDrawerComponent);

  private matchWeekApiService = inject(MatchWeekApiService);
  private loadingService = inject(LoadingService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      const matchWeek = this.rxMatchWeek.value();
      if (matchWeek !== undefined) this.matchWeek.set(matchWeek);
    });

    effect(() => {
      const matchWeek = this.rxMatchWeeks
        .value()
        ?.find((matchWeek) => matchWeek.matchWeekNumber === 1);

      if (matchWeek && this.selectedSeasonId() !== undefined) {
        this.routerService.navigateToMatchWeek(matchWeek.id);
      }
    });
  }

  protected onMoreClick(): void {
    this.matchWeekPickerDrawer().open();
  }

  protected onMatchWeekSelected(id: number): void {
    this.routerService.navigateToMatchWeek(id);
    this.active.set(false);
  }

  protected onSeasonSelected(season: SeasonBase): void {
    this.selectedSeasonId.set(season.id);
  }
}
