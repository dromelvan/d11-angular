import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatchWeek } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { MatchWeekPickerDrawerComponent } from '../../match-week/match-week-picker-drawer/match-week-picker-drawer.component';

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

  protected matchWeeks = computed<MatchWeek[]>(() => {
    const matchWeeks = this.rxMatchWeeks.value() ?? [];
    if (matchWeeks.length === 0) return [];
    return matchWeeks[0].season.id === this.seasonId() ? matchWeeks : [];
  });

  protected currentMatchWeekId = computed(() => this.currentService.matchWeek()?.id);

  private rxMatchWeeks = rxResource<MatchWeek[], number>({
    params: () => this.seasonId(),
    stream: ({ params }) => this.matchWeekApiService.getMatchWeeksBySeasonId(params),
  });

  private drawer = viewChild.required(MatchWeekPickerDrawerComponent);

  private matchWeekApiService = inject(MatchWeekApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxMatchWeeks.isLoading);
  }

  protected onMoreClick(): void {
    this.drawer().open();
  }

  protected onMatchWeekSelected(id: number): void {
    const matchWeek = this.matchWeeks().find((matchWeek) => matchWeek.id === id);
    if (matchWeek) this.matchWeekSelected.emit(matchWeek);
  }
}
