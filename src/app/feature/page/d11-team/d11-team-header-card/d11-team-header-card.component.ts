import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { D11TeamSeasonStat, PlayerSeasonStat } from '@app/core/api';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { Position } from '@app/core/api/model/position.model';
import { FormMatchPointsComponent } from '@app/shared/form-match-points';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { FeePipe } from '@app/shared/pipes';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-header-card',
  imports: [Card, NgClass, D11TeamImgComponent, FeePipe, FormMatchPointsComponent],
  templateUrl: './d11-team-header-card.component.html',
})
export class D11TeamHeaderCardComponent {
  d11Team = input.required<D11TeamBase | undefined>();
  d11TeamSeasonStat = input.required<D11TeamSeasonStat | undefined>();
  playerSeasonStats = input<PlayerSeasonStat[]>([]);
  positions = input<Position[]>([]);

  protected backgroundColor = computed(() => PRIMARY);

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));

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
