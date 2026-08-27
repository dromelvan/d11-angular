import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchWeek, SeasonBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { MatchWeekPickerDrawerComponent } from '@app/feature/drawer/match-week-picker-drawer/match-week-picker-drawer.component';

@Component({
  selector: 'app-match-week-picker-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, MatchWeekPickerDrawerComponent],
  templateUrl: './match-week-picker-button.component.html',
})
export class MatchWeekPickerButtonComponent {
  seasonId = input.required<number>();
  matchWeekId = input<number | undefined>(undefined);

  matchWeekSelected = output<MatchWeek>();

  protected seasons = computed<SeasonBase[]>(() => this.rxSeasons.value() ?? []);
  protected selectedSeasonId = computed(() => this.localSeasonId() ?? this.seasonId());

  protected matchWeeks = computed<MatchWeek[]>(() => {
    const matchWeeks = this.rxMatchWeeks.value() ?? [];
    if (matchWeeks.length === 0) return [];
    return matchWeeks[0].season.id === this.selectedSeasonId() ? matchWeeks : [];
  });

  protected currentMatchWeekId = computed(() => this.currentService.matchWeek()?.id);
  protected currentSeasonId = computed(() => this.currentService.season()?.id);

  private localSeasonId = signal<number | undefined>(undefined);
  private pendingSeasonNavigation = signal(false);

  private rxSeasons = rxResource({
    stream: () => this.seasonApiService.getAll(),
  });

  private rxMatchWeeks = rxResource<MatchWeek[], number>({
    params: () => this.selectedSeasonId(),
    stream: ({ params }) => this.matchWeekApiService.getMatchWeeksBySeasonId(params),
  });

  private drawer = viewChild.required(MatchWeekPickerDrawerComponent);

  private matchWeekApiService = inject(MatchWeekApiService);
  private seasonApiService = inject(SeasonApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxMatchWeeks.isLoading);

    effect(() => {
      if (!this.pendingSeasonNavigation()) return;
      const matchWeeks = this.matchWeeks();
      if (matchWeeks.length === 0) return;
      this.pendingSeasonNavigation.set(false);
      this.matchWeekSelected.emit(matchWeeks[matchWeeks.length - 1]);
    });
  }

  protected onMoreClick(): void {
    this.drawer().open();
  }

  protected onMatchWeekSelected(id: number): void {
    const matchWeek = this.matchWeeks().find((matchWeek) => matchWeek.id === id);
    if (matchWeek) this.matchWeekSelected.emit(matchWeek);
  }

  protected onSeasonSelected(id: number): void {
    this.localSeasonId.set(id);
    this.pendingSeasonNavigation.set(true);
  }
}
