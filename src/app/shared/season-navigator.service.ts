import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';

@Injectable()
export class SeasonNavigatorService {
  readonly rxAllSeasons = rxResource<Season[], void>({
    stream: () => this.seasonApiService.getAll(),
  });

  readonly sortedSeasons = computed(() =>
    [...(this.rxAllSeasons.value() ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
  );

  readonly currentSeason = computed(() => {
    const id = this._seasonId();
    const seasons = this.sortedSeasons();
    if (seasons.length === 0) return undefined;
    return id != null ? seasons.find((s) => s.id === id) : seasons[0];
  });

  readonly currentIndex = computed(() => {
    const season = this.currentSeason();
    if (!season) return -1;
    return this.sortedSeasons().findIndex((s) => s.id === season.id);
  });

  readonly hasPrevious = computed(
    () => this.currentIndex() >= 0 && this.currentIndex() < this.sortedSeasons().length - 1,
  );

  readonly hasNext = computed(() => this.currentIndex() > 0);

  private readonly _seasonId = signal<number | undefined>(undefined);
  private readonly seasonApiService = inject(SeasonApiService);

  setSeasonId(id: number | undefined): void {
    this._seasonId.set(id);
  }
}
