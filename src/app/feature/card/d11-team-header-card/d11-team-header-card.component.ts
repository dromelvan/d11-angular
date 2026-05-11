import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { D11TeamSeasonStat, PlayerSeasonStat } from '@app/core/api';
import { D11TeamBase } from '@app/core/api/model/d11-team-base.model';
import { Position } from '@app/core/api/model/position.model';
import { D11TeamHeaderComponent } from '@app/feature/component/d11-team-header/d11-team-header.component';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-header-card',
  imports: [Card, NgClass, D11TeamHeaderComponent],
  templateUrl: './d11-team-header-card.component.html',
})
export class D11TeamHeaderCardComponent {
  d11Team = input.required<D11TeamBase | undefined>();
  d11TeamSeasonStat = input.required<D11TeamSeasonStat | undefined>();
  playerSeasonStats = input<PlayerSeasonStat[]>([]);
  positions = input<Position[]>([]);

  protected backgroundColor = computed(() => PRIMARY);

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));
}
