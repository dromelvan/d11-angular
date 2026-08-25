import { Component, input } from '@angular/core';
import { Player, PlayerSeasonStat } from '@app/core/api';
import { CountryImgComponent, ImgWidth, PlayerImgComponent } from '@app/shared/img';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';
import { AgePipe, FeePipe, SafeDatePipe } from '@app/shared/pipes';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-player-hero',
  templateUrl: './player-hero.component.html',
  imports: [
    PlayerImgComponent,
    D11TeamBaseComponent,
    TeamBaseComponent,
    CountryImgComponent,
    AgePipe,
    SafeDatePipe,
    FeePipe,
    SvgIconComponent,
  ],
})
export class PlayerHeroComponent {
  readonly player = input.required<Player>();
  readonly playerSeasonStat = input<PlayerSeasonStat>();

  protected readonly ImgWidth = ImgWidth;

  protected onOpenDrawer(): void {}
}
