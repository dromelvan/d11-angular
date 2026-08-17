import { Component, computed, effect, input, signal } from '@angular/core';
import {
  PlayerSeasonStatsFilterDrawerParams,
  PlayerSeasonStatsSearchParams,
} from '@app/shared/model';
import { SectionComponent } from '@app/shared/section/section.component';
import { PlayerSeasonStatsAccordionComponent } from '@app/feature/component/player-season-stats-accordion/player-season-stats-accordion.component';
import { PlayerSeasonStatsFilterDrawerComponent } from './player-season-stats-filter-drawer/player-season-stats-filter-drawer.component';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { PlayerSeasonStatSort, POSITION_IDS } from '@app/core/api';
import { Paginator, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-player-season-stats-section',
  templateUrl: './player-season-stats-section.component.html',
  imports: [
    SectionComponent,
    PlayerSeasonStatsAccordionComponent,
    PlayerSeasonStatsFilterDrawerComponent,
    IconButtonComponent,
    SvgIconComponent,
    Paginator,
  ],
  host: { '[style.min-height]': 'isGrow() ? "1450px" : null' },
})
export class PlayerSeasonStatsSectionComponent {
  readonly seasonId = input.required<number>();

  protected filterParams = signal<PlayerSeasonStatsFilterDrawerParams>(this.defaultFilterParams());
  protected page = signal(0);
  protected totalElements = signal(0);
  protected drawerVisible = signal(false);
  protected isLoading = signal(true);
  protected readonly searchParams = computed<PlayerSeasonStatsSearchParams>(() => ({
    ...this.filterParams(),
    seasonId: this.seasonId(),
  }));
  protected readonly isGrow = computed(
    () => this.isLoading() || (this.page() + 1) * 25 < this.totalElements(),
  );

  constructor() {
    effect(() => {
      this.seasonId();
      this.filterParams.set(this.defaultFilterParams());
    });

    effect(() => {
      this.searchParams();
      this.page.set(0);
    });

    effect(() => {
      this.searchParams();
      this.page();
      this.isLoading.set(true);
    });
  }

  protected openDrawer(): void {
    this.drawerVisible.set(true);
  }

  protected onPageChange(event: PaginatorState): void {
    this.page.set(event.page ?? 0);
  }

  protected onTotalElementsChange(value: number): void {
    this.totalElements.set(value);
    this.isLoading.set(false);
  }

  protected onFilterParamsChange(value: PlayerSeasonStatsFilterDrawerParams): void {
    this.filterParams.set(value);
  }

  private defaultFilterParams(): PlayerSeasonStatsFilterDrawerParams {
    return {
      dummy: undefined,
      positionIds: [
        POSITION_IDS.KEEPER,
        POSITION_IDS.DEFENDER,
        POSITION_IDS.MIDFIELDER,
        POSITION_IDS.FORWARD,
      ],
      sort: PlayerSeasonStatSort.RANKING,
    };
  }
}
