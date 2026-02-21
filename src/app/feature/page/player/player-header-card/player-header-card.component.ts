import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { Player, PlayerSeasonStat } from '@app/core/api';
import { ImgWidth, PlayerImgComponent } from '@app/shared/img';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-header-card',
  imports: [Card, Button, NgClass, PlayerImgComponent, TeamBaseComponent, D11TeamBaseComponent],
  templateUrl: './player-header-card.component.html',
})
export class PlayerHeaderCardComponent {
  player = input.required<Player | undefined>();
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();

  protected readonly ImgWidth = ImgWidth;

  protected backgroundColor = computed(() =>
    this.playerSeasonStat() && !this.playerSeasonStat()?.team?.dummy
      ? this.playerSeasonStat()?.team?.colour
      : PRIMARY,
  );

  protected textClass = computed(() => contrastTextClass(this.backgroundColor()));
}
