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
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { SeasonPickerDrawerComponent } from '@app/feature/component/season-picker-drawer/season-picker-drawer.component';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-season-picker-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, SeasonPickerDrawerComponent],
  templateUrl: './season-picker-button.component.html',
})
export class SeasonPickerButtonComponent {
  seasonId = input.required<number>();

  seasonSelected = output<Season>();

  protected seasons = computed<Season[]>(() => this.rxSeasons.value() ?? []);
  protected currentSeasonId = computed(() => this.currentService.season()?.id);

  private rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  private drawer = viewChild.required(SeasonPickerDrawerComponent);

  private seasonApiService = inject(SeasonApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxSeasons.isLoading);
  }

  protected onMoreClick(): void {
    this.drawer().open();
  }

  protected onSeasonSelected(id: number): void {
    const season = this.seasons().find((season) => season.id === id);
    if (season) this.seasonSelected.emit(season);
  }
}
