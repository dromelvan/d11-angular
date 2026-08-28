import { Component, inject, input } from '@angular/core';
import { Player, PlayerSeasonStat } from '@app/core/api';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { PlayerActionDrawerComponent } from '@app/feature/drawer/player-action-drawer/player-action-drawer.component';
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
    PlayerActionDrawerComponent,
  ],
})
export class PlayerHeroComponent {
  readonly player = input.required<Player>();
  readonly playerSeasonStat = input<PlayerSeasonStat>();

  protected readonly ImgWidth = ImgWidth;

  private playerActionService = inject(PlayerActionService);

  protected onOpenDrawer(): void {
    this.playerActionService.open(this.player());
  }
}
