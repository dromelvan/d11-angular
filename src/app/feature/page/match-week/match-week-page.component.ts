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
import { MatchWeek } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonNavigatorService } from '@app/shared/season-navigator.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { ScrollPickerComponent } from '@app/shared/scroll-picker/scroll-picker.component';
import { ScrollPickerItem } from '@app/shared/scroll-picker/scroll-picker-item.model';
import { IconComponent } from '@app/shared/icon/icon.component';
import { MatchWeekMatchesCardComponent } from './match-week-matches-card/match-week-matches-card.component';
import { MatchWeekPickerDrawerComponent } from './match-week-picker-drawer/match-week-picker-drawer.component';

@Component({
  selector: 'app-match-week',
  imports: [
    ScrollPickerComponent,
    MatchWeekMatchesCardComponent,
    NgClass,
    IconComponent,
    IconButtonComponent,
    MatchWeekPickerDrawerComponent,
  ],
  templateUrl: './match-week-page.component.html',
  providers: [SeasonNavigatorService],
})
export class MatchWeekPageComponent {
  readonly matchWeekId = input.required<number, unknown>({ transform: numberAttribute });

  protected active = signal(false);

  protected model = computed(() => ({
    hasPreviousSeason: this.seasonNavigatorService.hasPrevious,
    hasNextSeason: this.seasonNavigatorService.hasNext,
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
    params: () => this.seasonId() ?? this.matchWeek()?.season.id,
    stream: ({ params }) => this.matchWeekApiService.getMatchWeeksBySeasonId(params!),
  });

  private isLoading = computed(
    () =>
      this.rxMatchWeek.isLoading() ||
      this.rxCurrentMatchWeek.isLoading() ||
      this.rxMatchWeeks.isLoading(),
  );

  private readonly matchWeek = signal<MatchWeek | undefined>(undefined);
  private readonly seasonId = signal<number | undefined>(undefined);

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
  private seasonNavigatorService = inject(SeasonNavigatorService);
  private loadingService = inject(LoadingService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      const matchWeek = this.rxMatchWeek.value();
      if (matchWeek !== undefined) this.matchWeek.set(matchWeek);
    });

    effect(() => this.seasonNavigatorService.setSeasonId(this.matchWeek()?.season.id));

    effect(() => {
      const matchWeek = this.rxMatchWeeks
        .value()
        ?.find((matchWeek) => matchWeek.matchWeekNumber === 1);

      if (matchWeek && this.seasonId() !== undefined) {
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

  protected onPreviousSeason(): void {
    const previous =
      this.seasonNavigatorService.sortedSeasons()[this.seasonNavigatorService.currentIndex() + 1];
    if (previous) this.seasonId.set(previous.id);
  }

  protected onNextSeason(): void {
    const next =
      this.seasonNavigatorService.sortedSeasons()[this.seasonNavigatorService.currentIndex() - 1];
    if (next) this.seasonId.set(next.id);
  }
}
