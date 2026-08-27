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
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { ScrollPickerComponent } from '@app/feature/scroll-picker/scroll-picker/scroll-picker.component';
import { ScrollPickerItem } from '@app/feature/scroll-picker/scroll-picker/scroll-picker-item.model';

@Component({
  selector: 'app-season-scroll-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollPickerComponent],
  templateUrl: './season-scroll-picker.component.html',
})
export class SeasonScrollPickerComponent {
  seasonId = input<number | undefined>(undefined);

  seasonSelected = output<Season>();

  protected scrollItems = computed<ScrollPickerItem[]>(() =>
    this.seasons().map((season) => ({
      id: season.id,
      label: season.shortName,
      header: 'Season',
      current: season.id === this.currentService.season()?.id,
    })),
  );

  protected selectedId = computed(() => this.season()?.id ?? 0);

  private rxSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  private seasons = computed<Season[]>(() => (this.rxSeasons.value() ?? []).slice().reverse());

  private season = computed<Season | undefined>(() => {
    const seasons = this.seasons();
    const findById = (id: number | undefined) => seasons.find((season) => season.id === id);
    const bySeasonId = findById(this.seasonId());
    if (bySeasonId) return bySeasonId;
    if (this.seasonId() != null) return undefined;
    return findById(this.currentService.season()?.id) ?? seasons.at(-1);
  });

  private isLoading = computed(
    () => this.rxSeasons.isLoading() || this.currentService.rxCurrent.isLoading(),
  );

  private seasonApiService = inject(SeasonApiService);
  private currentService = inject(CurrentService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      if (this.isLoading()) return;
      const season = this.season();
      if (season && season.id !== this.seasonId()) {
        this.seasonSelected.emit(season);
      }
    });
  }

  protected onSeasonSelected(id: number): void {
    const season = this.seasons().find((season) => season.id === id);
    if (season) this.seasonSelected.emit(season);
  }
}
