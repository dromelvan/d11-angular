import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SeasonApiService, SeasonBase } from '@app/core/api';
import { LoadingService } from '@app/core/loading/loading.service';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

@Component({
  selector: 'app-season-picker',
  imports: [IconButtonComponent],
  templateUrl: './season-picker.component.html',
})
export class SeasonPickerComponent {
  seasonId = input<number | undefined>();

  season = output<SeasonBase>();

  protected selectedSeason = computed<SeasonBase | undefined>(
    () => this.seasons()[this.selectedIndex()],
  );

  protected hasPrevious = computed(() => this.selectedIndex() < this.seasons().length - 1);
  protected hasNext = computed(() => this.selectedIndex() > 0);

  private seasonApiService = inject(SeasonApiService);
  private loadingService = inject(LoadingService);

  private rxSeasons = rxResource({
    stream: () => this.seasonApiService.getAll(),
  });

  private isLoading = computed(() => this.rxSeasons.isLoading());
  private seasons = computed(() => this.rxSeasons.value() ?? []);
  private selectedSeasonId = signal<number | undefined>(undefined);

  private selectedIndex = computed(() => {
    const seasons = this.seasons();
    const id = this.selectedSeasonId() ?? this.seasonId();
    if (id == null) return 0;
    const index = seasons.findIndex((season) => season.id === id);
    return index >= 0 ? index : 0;
  });

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);

    effect(() => {
      const selectedSeason = this.selectedSeason();
      if (
        selectedSeason &&
        (this.selectedSeasonId() !== undefined || this.seasonId() === undefined)
      ) {
        this.season.emit(selectedSeason);
      }
    });
  }

  protected onPrevious(): void {
    if (!this.hasPrevious()) return;
    const previous = this.seasons()[this.selectedIndex() + 1];
    if (previous) this.selectedSeasonId.set(previous.id);
  }

  protected onNext(): void {
    if (!this.hasNext()) return;
    const next = this.seasons()[this.selectedIndex() - 1];
    if (next) this.selectedSeasonId.set(next.id);
  }
}
