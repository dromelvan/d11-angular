import { Component, computed, input } from '@angular/core';
import type { D11TeamSeasonStat, PlayerSeasonStat } from '@app/core/api';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { Position } from '@app/core/api/model/position.model';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { FeePipe } from '@app/shared/pipes';

@Component({
  selector: 'app-d11-team-header',
  imports: [D11TeamImgComponent, FeePipe, FormMatchPointsComponent],
  templateUrl: './d11-team-header.component.html',
})
export class D11TeamHeaderComponent {
  d11Team = input.required<D11TeamBase>();
  d11TeamSeasonStat = input.required<D11TeamSeasonStat | undefined>();
  playerSeasonStats = input<PlayerSeasonStat[]>([]);
  positions = input<Position[]>([]);

  protected positionSummary = computed(() =>
    [...this.positions()]
      .filter((position) => position.maxCount > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((position) => {
        const count = this.playerSeasonStats().filter((s) => s.position.id === position.id).length;
        return { position, count, hasError: count !== position.maxCount };
      }),
  );

  protected totalFee = computed(() => this.playerSeasonStats().reduce((sum, s) => sum + s.fee, 0));
}
