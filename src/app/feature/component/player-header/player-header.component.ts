import { Component, input } from '@angular/core';
import type { Player, PlayerSeasonStat } from '@app/core/api';
import { ImgWidth, PlayerImgComponent } from '@app/shared/img';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

@Component({
  selector: 'app-player-header',
  imports: [PlayerImgComponent, TeamBaseComponent, D11TeamBaseComponent, IconButtonComponent],
  templateUrl: './player-header.component.html',
})
export class PlayerHeaderComponent {
  player = input.required<Player>();
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();

  protected readonly ImgWidth = ImgWidth;
}
