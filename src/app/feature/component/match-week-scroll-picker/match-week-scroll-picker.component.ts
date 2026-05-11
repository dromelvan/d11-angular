import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchWeek } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { ScrollPickerComponent } from '@app/shared/scroll-picker/scroll-picker.component';
import { ScrollPickerItem } from '@app/shared/scroll-picker/scroll-picker-item.model';

@Component({
  selector: 'app-match-week-scroll-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollPickerComponent],
  templateUrl: './match-week-scroll-picker.component.html',
})
export class MatchWeekScrollPickerComponent {
  seasonId = input.required<number>();
  matchWeekId = input<number | undefined>(undefined);

  matchWeekSelected = output<MatchWeek>();

  protected scrollItems = computed<ScrollPickerItem[]>(() =>
    this.matchWeeks().map((matchWeek) => ({
      id: matchWeek.id,
      label: `W ${matchWeek.matchWeekNumber}`,
      date: matchWeek.date,
      current: matchWeek.id === this.currentService.matchWeek()?.id,
    })),
  );

  protected selectedId = computed(() => this.matchWeek()?.id ?? 0);

  private rxMatchWeeks = rxResource<MatchWeek[], number>({
    params: () => this.seasonId(),
    stream: ({ params }) => this.matchWeekApiService.getMatchWeeksBySeasonId(params),
  });

  private matchWeeks = computed<MatchWeek[]>(() => {
    const matchWeeks = this.rxMatchWeeks.value() ?? [];
    if (matchWeeks.length === 0) return [];
    return matchWeeks[0].season.id === this.seasonId() ? matchWeeks : [];
  });

  private matchWeek = computed<MatchWeek | undefined>(() => {
    const matchWeeks = this.matchWeeks();
    const findById = (id: number | undefined) =>
      matchWeeks.find((matchWeek) => matchWeek.id === id);
    return (
      findById(this.matchWeekId()) ?? findById(this.currentService.matchWeek()?.id) ?? matchWeeks[0]
    );
  });

  private isLoading = computed(
    () => this.rxMatchWeeks.isLoading() || this.currentService.rxCurrent.isLoading(),
  );

  private matchWeekApiService = inject(MatchWeekApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      // This sets the default match week after switching season
      if (this.isLoading()) return;
      const matchWeek = this.matchWeek();
      if (matchWeek && matchWeek.id !== this.matchWeekId()) {
        this.matchWeekSelected.emit(matchWeek);
      }
    });
  }

  protected onMatchWeekSelected(id: number): void {
    const matchWeek = this.matchWeeks().find((matchWeek) => matchWeek.id === id);
    if (matchWeek) this.matchWeekSelected.emit(matchWeek);
  }
}
