import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PRIMARY } from '@app/app.theme';
import type { Player, PlayerSeasonStat } from '@app/core/api';
import {
  D11TeamImgComponent,
  ImgWidth,
  PlayerImgComponent,
  TeamImgComponent,
} from '@app/shared/img';
import { contrastTextClass } from '@app/shared/util/contrast-text.util';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-player-header-card',
  imports: [
    Card,
    Button,
    TeamImgComponent,
    D11TeamImgComponent,
    TeamImgComponent,
    PlayerImgComponent,
    NgClass,
  ],
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
