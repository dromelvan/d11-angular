import { Component, computed, input, viewChild } from '@angular/core';
import { D11TeamBase } from '@app/core/api';
import { Position } from '@app/core/api/model/position.model';
import {
  D11TeamPlayerSeasonStatsAccordionComponent,
  D11TeamPlayerSeasonStatsContext,
} from '@app/feature/accordion/d11-team-player-season-stats-accordion/d11-team-player-season-stats-accordion.component';
import { D11TeamImgComponent } from '@app/shared/img';
import { FeePipe } from '@app/shared/pipes/fee.pipe';
import { SectionComponent } from '@app/shared/section/section.component';

@Component({
  selector: 'app-d11-team-player-season-stats-section',
  templateUrl: './d11-team-player-season-stats-section.component.html',
  imports: [
    SectionComponent,
    D11TeamPlayerSeasonStatsAccordionComponent,
    D11TeamImgComponent,
    FeePipe,
  ],
  host: { class: 'app-fill' },
})
export class D11TeamPlayerSeasonStatsSectionComponent {
  readonly d11TeamId = input.required<number>();
  readonly seasonId = input<number>();
  readonly context = input<D11TeamPlayerSeasonStatsContext>('d11-team');
  readonly d11Team = input<D11TeamBase>();
  readonly positions = input<Position[]>([]);

  protected readonly accordion = viewChild(D11TeamPlayerSeasonStatsAccordionComponent);

  protected readonly positionSummary = computed(() =>
    [...this.positions()]
      .filter((position) => position.maxCount > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((position) => {
        const count = (this.accordion()?.playerSeasonStats() ?? []).filter(
          (stat) => stat.position.id === position.id,
        ).length;
        return { position, count, hasError: count !== position.maxCount };
      }),
  );

  protected readonly totalFee = computed(() =>
    (this.accordion()?.playerSeasonStats() ?? []).reduce((sum, stat) => sum + stat.fee, 0),
  );
}
