import { Component, effect, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerSeasonStatSort, POSITION_IDS } from '@app/core/api';
import { PlayerSeasonStatsFilterDrawerParams } from '@app/shared/model';
import { Drawer } from 'primeng/drawer';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'app-player-season-stats-filter-drawer',
  templateUrl: './player-season-stats-filter-drawer.component.html',
  imports: [FormsModule, Drawer, SelectButton],
})
export class PlayerSeasonStatsFilterDrawerComponent {
  readonly filterParams = input.required<PlayerSeasonStatsFilterDrawerParams>();
  readonly visible = model.required<boolean>();

  readonly filterParamsChange = output<PlayerSeasonStatsFilterDrawerParams>();

  protected readonly availabilityOptions = [
    { label: 'All', value: undefined },
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false },
  ];

  protected readonly positionIdOptions = [
    { label: 'Keeper', value: POSITION_IDS.KEEPER },
    { label: 'Defender', value: POSITION_IDS.DEFENDER },
    { label: 'Midfielder', value: POSITION_IDS.MIDFIELDER },
    { label: 'Forward', value: POSITION_IDS.FORWARD },
  ];

  protected readonly sortOptions = [
    { label: 'Ranking', value: PlayerSeasonStatSort.RANKING },
    { label: 'Goals', value: PlayerSeasonStatSort.GOALS },
    { label: 'Rating', value: PlayerSeasonStatSort.RATING },
    { label: 'Form', value: PlayerSeasonStatSort.FORM },
  ];

  protected dirtyFilterParams = signal<PlayerSeasonStatsFilterDrawerParams>({
    dummy: undefined,
    positionIds: [],
    sort: null,
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.dirtyFilterParams.set(this.filterParams());
      }
    });
  }

  protected done(): void {
    this.filterParamsChange.emit(this.dirtyFilterParams());
    this.visible.set(false);
  }

  protected setDummy(value: boolean | undefined): void {
    this.dirtyFilterParams.update((params) => ({ ...params, dummy: value }));
  }

  protected setPositionIds(value: number[]): void {
    this.dirtyFilterParams.update((params) => ({ ...params, positionIds: value }));
  }

  protected setSort(value: PlayerSeasonStatSort | null): void {
    this.dirtyFilterParams.update((params) => ({ ...params, sort: value }));
  }
}
