import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { Player, PlayerSeasonStat } from '@app/core/api';
import { PlayerHeaderComponent } from '@app/feature/component/player-header/player-header.component';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-header-card',
  imports: [Card, NgClass, PlayerHeaderComponent],
  templateUrl: './player-header-card.component.html',
})
export class PlayerHeaderCardComponent {
  player = input.required<Player | undefined>();
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();

  protected backgroundColor = computed(() =>
    this.playerSeasonStat() && !this.playerSeasonStat()?.team?.dummy
      ? this.playerSeasonStat()?.team?.colour
      : PRIMARY,
  );

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));
}
