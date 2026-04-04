import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { FeePipe } from '@app/shared/pipes';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';

@Component({
  selector: 'app-player-season-stat',
  imports: [FeePipe, RatingPipe, DecimalPipe, AvatarComponent, TeamBaseComponent, D11TeamBaseComponent],
  templateUrl: './player-season-stat.component.html',
})
export class PlayerSeasonStatComponent {
  playerSeasonStat = input.required<PlayerSeasonStat>();
  showInfo = input(false);
}
